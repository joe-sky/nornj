'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranParam = require('./transformParam'),
  tmplRule = nj.tmplRule;

//提取xml open tag
function getXmlOpenTag(obj) {
  return tmplRule.xmlOpenTag.exec(obj);
}

//验证xml self close tag
var REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;
function isXmlSelfCloseTag(obj) {
  return REGEX_XML_SELF_CLOSE_TAG.test(obj);
}

//Verify self close tag name
var OMITTED_CLOSE_TAGS = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};
function verifySelfCloseTag(tagName) {
  return OMITTED_CLOSE_TAGS[tagName.toLowerCase()];
}

//Extract parameters inside the xml open tag
function getOpenTagParams(obj, noXml) {
  var pattern = /[\s]+([^\s=>]+)(=(('[^']+')|("[^"]+")|([^"'\s]+)))?/g,
    matchArr, ret;

  while ((matchArr = pattern.exec(obj))) {
    var key = matchArr[1];
    if (key === '/' || key === '/>') {  //If match to the last "/" or "/>", then continue the loop.
      continue;
    }

    if (!ret) {
      ret = [];
    }

    var value = matchArr[3],
      charF, len, regex;
    if (value != null) {
      value = tools.clearQuot(value);  //Remove quotation marks
    }
    else {
      value = key;  //Match to Similar to "checked" or "disabled" attribute.
    }
    len = value.length;

    //Removed at the end of "/>" or ">".
    if (!noXml) {
      if (value.lastIndexOf('/>') === len - 2) {
        value = value.replace(/\/>/, '');
      }
      else if (value.lastIndexOf('>') === len - 1) {
        value = value.replace(/>/, '');
      }
    }

    ret.push({ key: key, value: value });
  }

  return ret;
}

//判断xml close tag
function isXmlCloseTag(obj, tagName) {
  return tools.isString(obj) && obj.toLowerCase() === '</' + tagName + '>';
}

//提取open tag
function getOpenTag(obj) {
  return tmplRule.openTag.exec(obj);
}

//验证self close tag
var REGEX_SELF_CLOSE_TAG = /\/$/i;
function isSelfCloseTag(obj) {
  return REGEX_SELF_CLOSE_TAG.test(obj);
}

//判断close tag
function isCloseTag(obj, tagName) {
  return tools.isString(obj) && obj.toLowerCase() === '/' + tagName.toLowerCase();
}

//get inside brace param
function getInsideBraceParam(obj) {
  return tmplRule.insideBraceParam.exec(obj);
}

//判断流程控制块并返回refer值
function isControl(obj) {
  var ret, ret1 = tmplRule.expr.exec(obj);
  if (ret1) {
    ret = [ret1[1]];

    var ret2 = getInsideBraceParam(obj);  //提取refer值
    if (ret2) {
      ret.push(ret2[0]);
    }
  }

  return ret;
}

//判断流程控制块close tag
function isControlCloseTag(obj, tagName) {
  return tools.isString(obj) && obj === '/' + tmplRule.exprRule + tagName;
}

//判断是否模板元素
function isTmpl(obj) {
  return obj === 'tmpl';
}

//加入到模板集合中
function addTmpl(node, parent, name) {
  var paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = tools.lightObj();
  }

  var tmpls = paramsP.tmpls;
  if (!tmpls) {
    var objT = { length: 0 };
    if(name != null) {
      objT[name] = node;
    }
    else {
      objT['0'] = node;
      objT.length = 1;
    }

    paramsP.tmpls = tranParam.compiledParam(objT);
  }
  else {  //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
    var objT = tmpls.strs[0],
      len = objT.length;

    if(name != null) {
      objT[name] = node;
    }
    else {
      objT[len] = node;
      objT.length = ++len;
    }
  }
}

//Test whether as parameters expression
function isParamsExpr(obj) {
  return obj === 'params' || obj === 'props';
}

//Add to the "paramsExpr" property of the parent node
function addParamsExpr(node, parent) {
  if (!parent.paramsExpr) {
    parent.paramsExpr = node;
  }
  else {
    tools.listPush(parent.paramsExpr.content, node.content);
  }
}

//获取全部内联组件
function getTagComponents(selector, isAuto) {
  if (!selector) {
    selector = 'script[type="text/nornj"]' + (isAuto ? '[autorender]' : '');
  }

  return document.querySelectorAll(selector);
}

//Remove all dom child node
function removeChildNode(node) {
  var children = node.childNodes,
    len = children.length,
    i = 0;

  for (; i < len; i++) {
    node.removeChild(node.firstChild);
  }
}

module.exports = {
  getXmlOpenTag: getXmlOpenTag,
  isXmlSelfCloseTag: isXmlSelfCloseTag,
  verifySelfCloseTag: verifySelfCloseTag,
  getOpenTagParams: getOpenTagParams,
  isXmlCloseTag: isXmlCloseTag,
  getOpenTag: getOpenTag,
  isSelfCloseTag: isSelfCloseTag,
  isCloseTag: isCloseTag,
  getInsideBraceParam: getInsideBraceParam,
  isControl: isControl,
  isControlCloseTag: isControlCloseTag,
  isTmpl: isTmpl,
  addTmpl: addTmpl,
  isParamsExpr: isParamsExpr,
  addParamsExpr: addParamsExpr,
  getTagComponents: getTagComponents,
  removeChildNode: removeChildNode
};