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
function getOpenTagParams(tag) {
  var pattern = tmplRule.openTagParams,
    matchArr, ret;

  while ((matchArr = pattern.exec(tag))) {
    var key = matchArr[1];
    if (key === '/') {  //If match to the last of "/", then continue the loop.
      continue;
    }

    if (!ret) {
      ret = [];
    }

    var value = matchArr[7],
      onlyBrace = matchArr[4];
    if (value != null) {
      value = tools.clearQuot(value);  //Remove quotation marks
    }
    else {
      value = key;  //Match to Similar to "checked" or "disabled" attribute.
    }

    //Removed at the end of "/>", ">" or "/".
    if (/\/>$/.test(value)) {
      value = value.substr(0, value.length - 2);
    }
    else if (/>$/.test(value) || /\/$/.test(value)) {
      value = value.substr(0, value.length - 1);
    }

    ret.push({
      key: key,
      value: value,
      onlyBrace: onlyBrace
    });
  }

  return ret;
}

//判断xml close tag
function isXmlCloseTag(obj, tagName) {
  return tools.isString(obj) && obj.toLowerCase() === '</' + tagName + '>';
}

//get inside brace param
function getInsideBraceParam(obj) {
  return tmplRule.insideBraceParam.exec(obj);
}

//判断块表达式并返回参数
function isExpr(obj) {
  var ret, ret1 = tmplRule.expr.exec(obj);
  if (ret1) {
    ret = [ret1[1]];

    var params = getOpenTagParams(obj);  //提取各参数
    if (params) {
      ret.push(params);
    }
  }

  return ret;
}

//判断块表达式close tag
function isExprCloseTag(obj, tagName) {
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
    if (name != null) {
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

    if (name != null) {
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
    tools.arrayPush(parent.paramsExpr.content, node.content);
  }
}

module.exports = {
  getXmlOpenTag: getXmlOpenTag,
  isXmlSelfCloseTag: isXmlSelfCloseTag,
  verifySelfCloseTag: verifySelfCloseTag,
  getOpenTagParams: getOpenTagParams,
  isXmlCloseTag: isXmlCloseTag,
  getInsideBraceParam: getInsideBraceParam,
  isExpr: isExpr,
  isExprCloseTag: isExprCloseTag,
  isTmpl: isTmpl,
  addTmpl: addTmpl,
  isParamsExpr: isParamsExpr,
  addParamsExpr: addParamsExpr
};