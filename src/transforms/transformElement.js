'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranData = require('./transformData'),
  paramRule = nj.paramRule;

//提取xml open tag
function getXmlOpenTag(obj) {
  return paramRule.xmlOpenTag.exec(obj);
}

//验证xml self close tag
var REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;
function isXmlSelfCloseTag(obj) {
  return REGEX_XML_SELF_CLOSE_TAG.test(obj);
}

//提取xml open tag内参数
var REGEX_OPEN_TAG_PARAMS = /[\s]+([^\s=]+)(=((['"][^"']+['"])|(['"]?[^"'\s]+['"]?)))?/g;
function getOpenTagParams(obj, noXml) {
  var matchArr,
      ret;

  while ((matchArr = REGEX_OPEN_TAG_PARAMS.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    var key = matchArr[1],
      value = matchArr[3],
      len;

    if (value != null) {
      value = value.replace(/['"]+/g, '');  //去除引号
    }
    else {
      value = key;
    }
    console.log(value);
    len = value.length;

    //去除末尾的"/>"或">"
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
  return paramRule.openTag.exec(obj);
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
  return paramRule.insideBraceParam.exec(obj);
}

//判断流程控制块并返回refer值
var REGEX_CONTROL = /^\$(if|each|tmpl)/i;
function isControl(obj) {
  var ret, ret1 = REGEX_CONTROL.exec(obj);
  if (ret1) {
    ret = [ret1[1]];

    var ret2 = getInsideBraceParam(obj);  //提取refer值
    if (ret2) {
      ret.push(ret2[1]);
    }
  }

  return ret;
}

//判断流程控制块close tag
function isControlCloseTag(obj, tagName) {
  return tools.isString(obj) && obj === '/$' + tagName;
}

//判断是否模板元素
function isTmpl(obj) {
  return obj === 'tmpl';
}

//加入到模板集合中
function addTmpl(node, parent) {
  var paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = {};
  }

  var tmpls = paramsP.tmpls;
  if (!paramsP.tmpls) {
    tmpls = paramsP.tmpls = [];
  }

  tmpls.push(node);
}

//获取标签组件名
function getTagComponentName(el) {
  var namespace = nj.tagNamespace,
    tagName = el.tagName.toLowerCase();

  if (tagName.indexOf(namespace + ':') === 0) {
    tagName = tagName.split(':')[1];
  }
  else if (tagName.indexOf(namespace + '-') === 0) {
    tagName = tagName.split('-')[1];
  }

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

      if (attrName === 'style') {  //style属性使用cssText
        val = el.style.cssText;
      }
      else if (attrName.indexOf('on') === 0) {  //以on开头的属性统一转换为驼峰命名
        attrName = attrName.replace(/on\w/, function (letter) {
          return 'on' + letter.substr(2).toUpperCase();
        });
      }

      tranData.setObjParam(ret, attrName, val, true);
    }
  });

  return ret;
}

//判断标签流程控制块
var REGEX_TAG_CONTROL = /^(if|each|else|tmpl)$/i;
function isTagControl(obj) {
  return REGEX_TAG_CONTROL.test(obj);
}

//获取全部标签组件
function getTagComponents(el, selector) {
  if (!el) {
    el = document;
  }
  if (!selector) {
    selector = '.' + nj.tagClassName;
  }

  return el.querySelectorAll(selector);
}

module.exports = {
  getXmlOpenTag: getXmlOpenTag,
  isXmlSelfCloseTag: isXmlSelfCloseTag,
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
  getTagComponentName: getTagComponentName,
  getTagComponentAttrs: getTagComponentAttrs,
  isTagControl: isTagControl,
  getTagComponents: getTagComponents
};