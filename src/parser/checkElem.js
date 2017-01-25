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
  var parentContent = 'content';

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
      isTmpl,
      isParamsExpr,
      isProp,
      isExprProp,
      needAddToProps;

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
        let exprProp = tranElem.isExprProp(exprName);
        isProp = exprProp.isProp;
        isExprProp = exprProp.isExprProp;
        needAddToProps = isProp ? !hasExprProps : isExprProp;
      }

      node.type = 'nj_expr';
      node.expr = exprName;
      if (exprParams != null && !isTmpl && !isParamsExpr) {
        if (!node.args) {
          node.args = [];
        }

        tools.each(exprParams, function(param) {
          let paramV = tranParam.compiledParam(param.value);
          if (param.onlyBrace) { //提取匿名参数
            node.args.push(paramV);
          } else {
            if (!node.params) {
              node.params = tools.lightObj();
            }
            node.params[param.key] = paramV;
          }
        }, false, true);
      }

      isElemNode = true;
    }

    if (isElemNode) { //判断是否为元素节点
      var pushContent = true;

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
      } else {
        if (isTmpl) { //模板元素
          pushContent = false;

          //将模板添加到父节点的params中
          tranElem.addTmpl(node, parent, exprParams ? exprParams[0].value : null);
        } else if (isParamsExpr) {
          pushContent = false;
        } else if (needAddToProps) {
          pushContent = false;
        }
      }

      //放入父节点content内
      if (pushContent) {
        parent[parentContent].push(node);
      }

      //取出子节点集合
      var end = len - (hasCloseTag ? 1 : 0),
        content = obj.slice(1, end);
      if (content && content.length) {
        checkContentElem(content, node, isParamsExpr || (hasExprProps && !isProp));
      }

      //If this is params block, set on the "paramsExpr" property of the parent node.
      if (isParamsExpr || needAddToProps) {
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

  tools.each(obj, function(item) {
    checkElem(item, parent, hasExprProps);
  }, false, true);
}

module.exports = {
  checkElem
};