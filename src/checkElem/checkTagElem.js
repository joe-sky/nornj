'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranParam = require('../transforms/transformParam'),
  tranElem = require('../transforms/transformElement');

//检测标签元素节点
function checkTagElem(obj, parent) {
  var node = {},
    nodeType = obj.nodeType,
    nodeValue = tools.trim(obj.nodeValue),
    parentContent = !parent.hasElse ? 'content' : 'contentElse';

  //处理文本节点
  if (nodeType === 3) {
    if (nodeValue === '') {
      return;
    }

    node.type = 'nj_plaintext';
    node.content = [tranParam.compiledParam(nodeValue)];
    parent[parentContent].push(node);

    return;
  }

  //处理元素节点
  if (nodeType === 1) {
    var tagName = tranElem.getTagComponentName(obj),
      params = tranElem.getTagComponentAttrs(obj),
      isControl = tranElem.isTagControl(tagName),
      pushContent = true;

    if (isControl) {  //特殊节点
      if (tagName !== '$else') {
        tagName = tagName.substr(1);
        node.type = 'nj_expr';
        node.expr = tagName;

        if (tranElem.isTmpl(tagName)) {  //模板元素
          pushContent = false;

          //将模板添加到父节点的params中
          tranElem.addTmpl(node, parent);
        }
        else if (tranElem.isParamsExpr(tagName)) {
          pushContent = false;

          //If this is params block, directly set on the "paramsExpr" property of the parent node.
          tranElem.addParamsExpr(node, parent);
        }
        else {  //Expression block
          if (params && params.refer) {
            var retR = tranElem.getInsideBraceParam(params.refer);
            node.refer = tranParam.compiledParam(retR ? retR[0] : params.refer);
          }
        }
      }
      else {  //else节点
        pushContent = false;

        //将else标签内的子节点放入当前父节点的contentElse中
        node = parent;
        node.hasElse = true;
      }
    }
    else {  //元素节点
      node.type = tagName;

      //If open tag has a brace,add the typeRefer param.
      var typeRefer = tranElem.getInsideBraceParam(tagName);
      if (typeRefer) {
        node.typeRefer = tranParam.compiledParam(typeRefer[0]);
      }

      if (params) {
        node.params = tranParam.compiledParams(params);
      }
    }

    //放入父节点content内
    if (pushContent) {
      parent[parentContent].push(node);
    }

    //处理子元素
    var childNodes = obj.childNodes;
    if (childNodes && childNodes.length) {
      checkTagContentElem(childNodes, node);
    }
  }
}

//检测标签子元素节点
function checkTagContentElem(obj, parent) {
  if (!parent.content) {
    parent.content = [];
  }
  if (parent.hasElse && !parent.contentElse) {
    parent.contentElse = [];
  }

  tools.each(obj, function (item) {
    checkTagElem(item, parent);
  }, false, true);
}

//Set init data for tag component
nj.setInitTagData = function (data) {
  nj.initTagData = data;
};

module.exports = checkTagElem;