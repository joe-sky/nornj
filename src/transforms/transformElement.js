'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranData = require('./transformData'),
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
  var pattern = /[\s]+([^\s={}>]+)(=(('[^']+')|("[^"]+")|([^"'\s]+)))?/g,
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
function addTmpl(node, parent) {
  var paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = tools.lightObj();
  }

  var tmpls = paramsP.tmpls;
  if (!tmpls) {
    paramsP.tmpls = tranParam.compiledParam([node]);
  }
  else {
    tmpls.strs[0].push(node);  //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
  }
}

//Test whether as parameters expression
function isParamsExpr(obj) {
  return obj === 'params';
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

//获取标签组件名
function getTagComponentName(el) {
  var tagName = el.tagName.toLowerCase();
  tools.each(nj.tagNamespaces, function (tagNamespace) {
    if (tagName.indexOf(tagNamespace + ':') === 0) {
      tagName = tagName.split(':')[1];
      return false;
    }
    else if (tagName.indexOf(tagNamespace + '-') === 0) {
      tagName = tagName.split('-')[1];
      return false;
    }
  }, false, false, true);

  return tagName;
}

//获取标签组件所有属性
function getTagComponentAttrs(el) {
  var attrs = el.attributes,
    ret;

  tools.each(attrs, function (obj) {
    var attrName = obj.nodeName;
    if (attrName !== nj.tagId && obj.specified) {  //此处如不判断specified属性,则低版本IE中会列出所有可能的属性
      var val = obj.nodeValue;
      if (!ret) {
        ret = tools.lightObj();
      }

      //Deal with the attribute only has key.
      if (val === '') {
        val = attrName;
      }

      if (attrName === 'style') {  //style属性使用cssText
        val = el.style.cssText;
      }
      else if (attrName.indexOf('data-') !== 0  //Transform to camel-case
        && attrName.indexOf(nj.namespace + '-') !== 0) {
        //Can be marked with an exclamation mark to distinguish the attribute name beginning with "data-".
        if (attrName.indexOf('!') === 0) {
          attrName = attrName.substr(1);
        }

        attrName = tools.toCamelCase(attrName);
      }

      tranData.setObjParam(ret, attrName, val, true);
    }
  });

  return ret;
}

//判断标签表达式块
function isTagControl(obj) {
  return tmplRule.expr.test(obj);
}

//获取全部标签组件
function getTagComponents(selector) {
  if (!selector) {
    selector = '.' + nj.tagClassName;
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
  getTagComponentName: getTagComponentName,
  getTagComponentAttrs: getTagComponentAttrs,
  isTagControl: isTagControl,
  getTagComponents: getTagComponents,
  removeChildNode: removeChildNode
};