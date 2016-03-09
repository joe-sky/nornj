'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  checkTagElem = require('./checkTagElem');

//检测元素节点
function checkElem(obj, parent) {
  var node = {},
    parentContent = !parent.hasElse ? 'content' : 'contentElse';

  if (!tools.isArray(obj)) {
    if (tools.isString(obj)) {  //判断是否为文本节点
      node.type = 'nj_plaintext';
      node.content = [tools.compiledParam(obj)];
      parent[parentContent].push(node);
    }

    return;
  }

  var first = obj[0];
  if (tools.isString(first)) {  //第一个子节点为字符串
    var first = first,
      len = obj.length,
      last = obj[len - 1],
      isElemNode = false,
      control;

    //判断是否为xml标签
    var xmlOpenTag = tools.getXmlOpenTag(first),
      openTagName,
      hasCloseTag = false,
      isTmpl;

    if (xmlOpenTag) {  //tagname为xml标签时,则认为是元素节点
      openTagName = xmlOpenTag[1];

      if (!tools.isXmlSelfCloseTag(first)) {  //非自闭合标签才验证是否存在关闭标签
        hasCloseTag = tools.isXmlCloseTag(last, openTagName);
      }
      else {  //自闭合标签
        node.selfCloseTag = true;
      }
      isElemNode = true;
    }
    else {
      control = tools.isControl(first);
      if (!control) {  //tagname不为xml标签时,必须有结束标签才认为是元素节点
        var openTag = tools.getOpenTag(first);
        if (openTag) {
          openTagName = openTag[0];

          if (!tools.isSelfCloseTag(first)) {  //非自闭合标签
            hasCloseTag = tools.isCloseTag(last, openTagName);
            if (hasCloseTag) {
              isElemNode = true;
            }
          }
          else {  //如果是自闭合标签则直接认为是元素节点
            node.selfCloseTag = true;
            isElemNode = true;
          }
        }
      }
      else {  //为特殊节点,也可视为一个元素节点
        var ctrl = control[0].toLowerCase(),
          refer = control[1];
        isTmpl = tools.isTmpl(ctrl);

        node.type = 'nj_' + ctrl;
        if (refer != null) {
          node.refer = tools.compiledProp(refer);
        }

        if (tools.isControlCloseTag(last, ctrl)) {  //判断是否有流程控制块闭合标签
          hasCloseTag = true;
        }
        isElemNode = true;
      }
    }

    if (isElemNode) {  //判断是否为元素节点
      var hasParams = false,
        elseIndex = -1,
        pushContent = true;

      //取出节点参数
      var params = obj[1];
      if (tools.isObject(params)) {  //如果第二个参数为对象,则为节点参数
        if (!control) {  //为元素节点时取各参数
          node.params = tools.compiledParams(params);
        }
        else {  //为特殊节点时取refer
          var retR = tools.getInsideBraceParam(params.refer);
          node.refer = tools.compiledProp(retR ? retR[1] : params.refer);
        }

        hasParams = true;
      }

      if (!control) {
        node.type = openTagName;

        //If open tag has a brace,add the typeRefer param.
        var typeRefer = tools.getInsideBraceParam(openTagName);
        if (typeRefer) {
          node.typeRefer = tools.compiledProp(typeRefer[1]);
        }

        //获取openTag内参数
        var tagParams = tools.getOpenTagParams(first, !xmlOpenTag);
        if (tagParams) {
          if (!node.params) {
            node.params = tools.lightObj();
          }

          tools.each(tagParams, function (param) {
            node.params[param.key] = tools.compiledParam(param.value);
          }, false, true);
        }
      }
      else {  //为流程控制块时判断是否有$else
        if (isTmpl) {  //模板元素
          pushContent = false;

          //将模板添加到父节点的params中
          tools.addTmpl(node, parent);
        }
        else {
          elseIndex = tools.inArray(obj, '$else');
        }
      }

      //放入父节点content内
      if (pushContent) {
        parent[parentContent].push(node);
      }

      //取出子节点集合
      // TODO 此处需要判断参数外是否包裹有流程控制块
      var end = len - (hasCloseTag ? 1 : 0),
        content = obj.slice(hasParams ? 2 : 1, (elseIndex < 0 ? end : elseIndex));
      if (content && content.length) {
        checkContentElem(content, node);
      }

      //如果有$else,则将$else后面的部分存入content_else集合中
      if (elseIndex >= 0) {
        var contentElse = obj.slice(elseIndex + 1, end);
        node.hasElse = true;

        if (contentElse && contentElse.length) {
          checkContentElem(contentElse, node);
        }
      }
    }
    else {  //如果不是元素节点,则为节点集合
      checkContentElem(obj, parent);
    }
  }
  else if (tools.isArray(first)) {  //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
    checkContentElem(obj, parent);
  }
}

//检测子元素节点
function checkContentElem(obj, parent) {
  if (!parent.content) {
    parent.content = [];
  }
  if (parent.hasElse && !parent.contentElse) {
    parent.contentElse = [];
  }

  tools.each(obj, function (item) {
    checkElem(item, parent);
  }, false, true);
}

module.exports = {
  checkElem: checkElem,
  checkTagElem: checkTagElem
};