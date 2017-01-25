'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranParam = require('../transforms/transformParam'),
  tranElem = require('../transforms/transformElement'),
  tmplRule = nj.tmplRule;

function _plainTextNode(obj, parent, parentContent) {
  var node = {};
  node.type = 'nj_plaintext';
  node.content = [tranParam.compiledParam(obj)];
  parent[parentContent].push(node);
}

//检测元素节点
function checkElem(obj, parent, hasExprProps) {
  var parentContent = !parent.hasElse ? 'content' : 'contentElse';

  if (!tools.isArray(obj)) { //判断是否为文本节点
    if (tools.isString(obj)) {
      var strs = obj.split(tmplRule.newlineSplit),
        lastIndex = strs.length - 1;

      strs.forEach((str, i) => {
        str = str.trim();
        str !== '' && _plainTextNode(str + (i < lastIndex ? '\\n' : ''), parent, parentContent);
      });
    } else {
      _plainTextNode(obj, parent, parentContent);
    }

    return;
  }

  var node = {},
    first = obj[0];
  if (tools.isString(first)) { //第一个子节点为字符串
    var first = first,
      len = obj.length,
      last = obj[len - 1],
      isElemNode = false,
      expr,
      exprParams;

    //判断是否为xml标签
    var openTagName,
      hasCloseTag = false,
      isTmpl, isParamsExpr, isExprProp;

    expr = tranElem.isExpr(first);
    if (!expr) {
      var xmlOpenTag = tranElem.getXmlOpenTag(first);
      if (xmlOpenTag) { //tagname为xml标签时,则认为是元素节点
        openTagName = xmlOpenTag[1];

        if (!tranElem.isXmlSelfCloseTag(first)) { //非自闭合标签才验证是否存在关闭标签
          hasCloseTag = tranElem.isXmlCloseTag(last, openTagName);
        } else { //自闭合标签
          node.selfCloseTag = true;
        }
        isElemNode = true;
      }
    } else { //为块表达式,也可视为一个元素节点
      var exprName = expr[0];
      exprParams = expr[1];
      isTmpl = tranElem.isTmpl(exprName);
      isParamsExpr = tranElem.isParamsExpr(exprName);
      if (!isParamsExpr) {
        isExprProp = tranElem.isExprProp(exprName);
      }

      node.type = 'nj_expr';
      node.expr = exprName;
      if (exprParams != null && !isTmpl) {
        node.refer = tranParam.compiledParam(exprParams.reduce(function(p, c) {
          return p + (c.onlyBrace ? ' ' + c.key : '');
        }, ''));
      }

      isElemNode = true;
    }

    if (isElemNode) { //判断是否为元素节点
      var elseIndex = -1,
        pushContent = true;

      if (!expr) {
        node.type = openTagName;

        //If open tag has a brace,add the typeRefer param.
        var typeRefer = tranElem.getInsideBraceParam(openTagName);
        if (typeRefer) {
          node.typeRefer = tranParam.compiledParam(typeRefer[0]);
        }

        //获取openTag内参数
        var tagParams = tranElem.getOpenTagParams(first);
        if (tagParams) {
          if (!node.params) {
            node.params = tools.lightObj();
          }

          tools.each(tagParams, function(param) { //The parameter like "{prop}" needs to be replaced.
            node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = tranParam.compiledParam(param.value);
          }, false, true);
        }

        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
        if (!node.selfCloseTag) {
          node.selfCloseTag = tranElem.verifySelfCloseTag(openTagName);
        }
      } else { //为块表达式时判断是否有#else
        if (isTmpl) { //模板元素
          pushContent = false;

          //将模板添加到父节点的params中
          tranElem.addTmpl(node, parent, exprParams ? exprParams[0].value : null);
        } else if (isParamsExpr) {
          pushContent = false;
        } else if (isExprProp && !hasExprProps) {
          pushContent = false;
        } else {
          elseIndex = obj.indexOf(tmplRule.exprRule + 'else');
        }
      }

      //放入父节点content内
      if (pushContent) {
        parent[parentContent].push(node);
      }

      //取出子节点集合
      var end = len - (hasCloseTag ? 1 : 0),
        content = obj.slice(1, (elseIndex < 0 ? end : elseIndex));
      if (content && content.length) {
        checkContentElem(content, node, isParamsExpr || (hasExprProps && !isExprProp));
      }

      //如果有#else,则将#else后面的部分存入content_else集合中
      if (elseIndex >= 0) {
        var contentElse = obj.slice(elseIndex + 1, end);
        node.hasElse = true;

        if (contentElse && contentElse.length) {
          checkContentElem(contentElse, node, isParamsExpr || (hasExprProps && !isExprProp));
        }
      }

      //If this is params block, set on the "paramsExpr" property of the parent node.
      if (isParamsExpr || (isExprProp && !hasExprProps)) {
        tranElem.addParamsExpr(node, parent, isExprProp);
      }
    } else { //如果不是元素节点,则为节点集合
      checkContentElem(obj, parent);
    }
  } else if (tools.isArray(first)) { //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
    checkContentElem(obj, parent);
  }
}

//检测子元素节点
function checkContentElem(obj, parent, hasExprProps) {
  if (!parent.content) {
    parent.content = [];
  }
  if (parent.hasElse && !parent.contentElse) {
    parent.contentElse = [];
  }

  tools.each(obj, function(item) {
    checkElem(item, parent, hasExprProps);
  }, false, true);
}

module.exports = {
  checkElem
};