'use strict';

var nj = require('../core'),
  escape = require('./escape'),
  assign = require('object-assign'),
  arrayProto = Array.prototype,
  arrayEvery = arrayProto.every,
  arrayPush = arrayProto.push;

//Array push
function listPush(arr1, arr2) {
  arrayPush.apply(arr1, arr2);
  return arr1;
}

//判断是否为数组
function isArray(obj) {
  return Array.isArray(obj);
}

//判断是否为对象
function isObject(obj) {
  var type = typeof obj;
  return !isArray(obj) && (type === 'function' || type === 'object' && !!obj);
}

//判断是否为字符串
function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

//获取属性值
function _getProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

//是否为类数组
var _getLength = _getProperty('length');
function isArrayLike(obj) {
  var length = _getLength(obj);
  return typeof length == 'number' && length >= 0;
}

//遍历数组或对象
function each(obj, func, context, isArray) {
  if (!obj) {
    return;
  }
  if (isArray == null) {
    isArray = isArrayLike(obj);
  }

  //设置回调函数上下文
  context = context ? context : obj;

  if (isArray) {
    arrayEvery.call(obj, function (o, i, arr) {
      var ret = func.call(context, o, i, arr);

      if (ret === false) {
        return ret;
      }
      return true;
    });
  }
  else {
    var keys = Object.keys(obj);
    arrayEvery.call(keys, function (o, i) {
      var key = keys[i],
        ret = func.call(context, obj[key], key, obj);

      if (ret === false) {
        return ret;
      }
      return true;
    });
  }
}

//判断是否在数组内
function inArray(obj, value) {
  return obj.indexOf(value);
}

//去除字符串空格
function trim(str) {
  if (!!!str) {
    return '';
  }

  return str.trim();
}

//抛出异常
function throwIf(val, msg) {
  if (!val) {
    throw Error(msg || val);
  }
}

//转换节点参数为字符串
function transformParams(obj, data, parent) {
  var ret = '';
  each(obj, function (v, k) {
    ret += ' ' + k + '="' + replaceParams(v, data, false, false, parent) + '"';
  }, false, false);

  return ret;
}

//转换节点参数为对象
function transformParamsToObj(obj, data, parent) {
  var ret = obj ? {} : null;
  each(obj, function (v, k) {
    replaceParams(v, data, ret, k, parent);
  }, false, false);

  return ret;
}

//设置对象参数
function setObjParam(obj, key, value, notTran) {
  var style;
  if (!notTran && nj.componentLib === 'react') {
    switch (key) {
      case 'class':
        key = 'className';
        break;
      case 'for':
        key = 'htmlFor';
        break;
      case 'style':
      case nj.tagStyle:
        key = 'style';
        style = getStyleParams(value);
        break;
    }
  }

  obj[key] = style != null ? style : value;
}

//Use filters
function _useFilters(filters, ret, data, parent, index) {
  if (filters) {
    var filtersObj = nj.filters;
    each(filters, function (filterObj) {
      var filter = filtersObj[filterObj.name];  //Get filter function
      if(!filter) {
        console.warn(nj.errorTitle + 'A filter called ' + filterObj.name + ' is undefined.');
        return;
      }

      var params,
        paramsF = filterObj.params,
        thisObj = lightObj(); 

      if (paramsF) {
        params = listPush([ret], paramsF);
      }
      else {
        params = [ret];
      }

      thisObj.data = data;
      thisObj.parent = parent;
      thisObj.index = index;
      ret = filter.apply(thisObj, params);
    }, false, true);
  }

  return ret;
}

//获取data值
function getDataValue(data, propObj, parent, defaultEmpty) {
  if (data == null) {
    return;
  }

  var isArr = isArray(data),
    prop = propObj.name,
    filters = propObj.filters,
    parentNum = propObj.parentNum,
    datas, ret, dataP, index;

  //if inside each block,get the parent data and current index
  if (parent && parent.parent) {
    dataP = parent.parent.data;
    index = parent.index;
  }

  //According to the param path to get data
  if (parent && parentNum) {
    for (var i = 0; i < parentNum; i++) {
      var _parent = parent.parent;
      throwIf(_parent, 'Parent data is undefined, please check the param path declare.');
      parent = _parent;
      datas = [parent.data];
    }
  }
  else if (isArr) {  //The data param is array
    datas = data;
  }
  else {
    datas = [data];
  }

  if (prop === '.') {  //prop为点号时直接使用data作为返回值
    return _useFilters(filters, isArr ? data[0] : data, datas, dataP, index);
  }
  else if (prop === '#') {  //Get current item index
    return _useFilters(filters, index, datas, dataP, index);
  }

  each(datas, function (obj) {
    if (obj) {
      ret = obj[prop];

      //Use filters
      ret = _useFilters(filters, ret, datas, dataP, index);

      if (ret != null) {
        return false;
      }
    }
  }, false, true);

  //Default set empty
  if (defaultEmpty && ret == null) {
    ret = '';
  }

  return ret;
}

//获取each块中的item参数
function getItemParam(item, data) {
  var ret = item;
  if (isArray(data)) {
    ret = listPush([item], data.slice(1));
  }

  return ret;
}

//替换参数字符串
function replaceParams(valueObj, data, newObj, newKey, parent) {
  var props = valueObj.props,
    strs = valueObj.strs,
    isAll = valueObj.isAll,
    useObj = isObject(newObj),  //newObj的值可能为对象或布尔值,此处判断是否为对象
    value = strs[0];

  if (props) {
    each(props, function (propObj, i) {
      var dataProp = getDataValue(data, propObj.prop, parent, !newObj);

      //参数为字符串时,须做特殊字符转义
      if (dataProp
        && !newObj            //Only in transform to string need escape
        && propObj.escape) {  //Only in the opening brace's length less than 2 need escape
        dataProp = escape.escape(dataProp);
      }

      //如果参数只存在占位符,则可传引用参数
      if (isAll) {
        if (useObj) {  //在新对象上创建属性
          setObjParam(newObj, newKey, dataProp);
        }

        value = dataProp;
      }
      else {  //Splicing value by one by one
        value += dataProp + strs[i + 1];
      }
    }, false, true);
  }

  //存在多个占位符的情况
  if (useObj && !isAll) {
    setObjParam(newObj, newKey, value);
  }

  return value;
}

//提取替换参数
var REGEX_REPLACE_PARAM = /({{1,2})([^"'\s{}]+)}{1,2}/g;
function getReplaceParam(obj) {
  var matchArr,
    ret;

  while ((matchArr = REGEX_REPLACE_PARAM.exec(obj))) {
    if (!ret) {
      ret = [];
    }
    ret.push(matchArr);
  }

  return ret;
}

//Get compiled parameter
var REGEX_REPLACE_SPLIT = /{{1,2}[^"'\s{}]+}{1,2}/g;
function compiledParam(value) {
  var ret = lightObj(),
    strs = isString(value) ? value.split(REGEX_REPLACE_SPLIT) : [value],
    props = null,
    isAll = false;

  //If have placehorder
  if (strs.length > 1) {
    var params = getReplaceParam(value);
    props = [];

    each(params, function (param) {
      var retP = lightObj();
      isAll = param[0] === value;

      retP.prop = compiledProp(param[2]);
      retP.escape = param[1].length < 2;
      props.push(retP);
    }, false, true);
  }

  ret.props = props;
  ret.strs = strs;
  ret.isAll = isAll;
  return ret;
}

//Get compiled parameters from a object
function compiledParams(obj) {
  var ret = lightObj();
  each(obj, function (v, k) {
    ret[k] = compiledParam(v);
  }, false, false);

  return ret;
}

//Get compiled property
function compiledProp(prop) {
  var ret = lightObj();

  //If there are colons in the property,then use filter
  if (prop.indexOf(':') >= 0) {
    var filters = [],
      filtersTmp;
    filtersTmp = prop.split(':');
    prop = filtersTmp[0];  //Extract property

    filtersTmp = filtersTmp.slice(1);
    each(filtersTmp, function (filter) {
      var retF = _getFilterParam(filter),
        filterObj = lightObj(),
        filterName = retF[1].toLowerCase();  //Get filter name

      if (filterName) {
        var paramsF = retF[3];  //Get filter param

        //Multiple params are separated by commas.
        if (paramsF) {
          var params = [];
          each(paramsF.split(','), function (p) {
            params[params.length] = p;
          }, false, true);

          filterObj.params = params;
        }

        filterObj.name = filterName;
        filters.push(filterObj);
      }
    }, false, true);

    ret.filters = filters;
  }

  //Extract the parent data path
  if (prop.indexOf('../') > -1) {
    var n = 0;
    prop = prop.replace(/\.\.\//g, function () {
      n++;
      return '';
    });

    ret.parentNum = n;
  }

  ret.name = prop;
  return ret;
}

//Get filter param
var REGEX_FILTER_PARAM = /([\w$]+)(\(([^()]+)\))*/;
function _getFilterParam(obj) {
  return REGEX_FILTER_PARAM.exec(obj);
}

//提取xml open tag
var REGEX_XML_OPEN_TAG = /^<([a-z{][-a-z0-9_:.}]*)[^>]*>$/i;
function getXmlOpenTag(obj) {
  return REGEX_XML_OPEN_TAG.exec(obj);
}

//验证xml self close tag
var REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;
function isXmlSelfCloseTag(obj) {
  return REGEX_XML_SELF_CLOSE_TAG.test(obj);
}

//提取xml open tag内参数
var REGEX_OPEN_TAG_PARAMS = /([^\s=]+)=((['"][^"']+['"])|(['"]?[^"'\s]+['"]?))/g;
function getOpenTagParams(obj, noXml) {
  var matchArr,
      ret;

  while ((matchArr = REGEX_OPEN_TAG_PARAMS.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    var key = matchArr[1],
      value = matchArr[2].replace(/['"]+/g, ''),  //去除引号
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
  return isString(obj) && obj.toLowerCase() === '</' + tagName + '>';
}

//提取open tag
var REGEX_OPEN_TAG = /^[a-z{][-a-z0-9_:.}]*/i;
function getOpenTag(obj) {
  return REGEX_OPEN_TAG.exec(obj);
}

//验证self close tag
var REGEX_SELF_CLOSE_TAG = /\/$/i;
function isSelfCloseTag(obj) {
  return REGEX_SELF_CLOSE_TAG.test(obj);
}

//判断close tag
function isCloseTag(obj, tagName) {
  return isString(obj) && obj.toLowerCase() === '/' + tagName.toLowerCase();
}

//get inside brace param
var REGEX_INSIDE_BRACE_PARAM = /{([^"'\s{}]+)}/i;
function getInsideBraceParam(obj) {
  return REGEX_INSIDE_BRACE_PARAM.exec(obj);
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
  return isString(obj) && obj === '/$' + tagName;
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

//提取style内参数
var REGEX_STYLE_PARAMS = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g;
function getStyleParams(obj) {
  //参数为字符串
  var matchArr,
    ret;

  while ((matchArr = REGEX_STYLE_PARAMS.exec(obj))) {
    var key = matchArr[1].toLowerCase(),
      value = matchArr[2];

    if (!ret) {
      ret = {};
    }

    //将连字符转为驼峰命名
    if (key.indexOf('-') > -1) {
      key = key.replace(/-\w/g, function (letter) {
        return letter.substr(1).toUpperCase();
      });
    }

    ret[key] = value;
  }

  return ret;
}

//获取标签组件所有属性
function getTagComponentAttrs(el) {
  var attrs = el.attributes,
    ret;

  each(attrs, function (obj) {
    var attrName = obj.nodeName;
    if (attrName !== nj.tagId && obj.specified) {  //此处如不判断specified属性,则低版本IE中会列出所有可能的属性
      var val = obj.nodeValue;
      if (!ret) {
        ret = lightObj();
      }

      if (attrName === 'style') {  //style属性使用cssText
        val = el.style.cssText;
      }
      else if (attrName.indexOf('on') === 0) {  //以on开头的属性统一转换为驼峰命名
        attrName = attrName.replace(/on\w/, function (letter) {
          return 'on' + letter.substr(2).toUpperCase();
        });
      }

      setObjParam(ret, attrName, val, true);
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
function getTagComponents(el) {
  if (!el) {
    el = document;
  }

  return el.querySelectorAll('.' + nj.tagClassName);
}

//create a unique key
function uniqueKey(str) {
  var len = str.length;
  if (len == 0) {
    return str;
  }

  var hash = 0, i, chr;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  return hash;
}

//create light weight object
function lightObj() {
  return Object.create(null);
}

var tools = {
  isArray: isArray,
  isArrayLike: isArrayLike,
  isObject: isObject,
  isString: isString,
  each: each,
  inArray: inArray,
  trim: trim,
  throwIf: throwIf,
  replaceParams: replaceParams,
  transformParams: transformParams,
  transformParamsToObj: transformParamsToObj,
  getXmlOpenTag: getXmlOpenTag,
  isXmlCloseTag: isXmlCloseTag,
  getOpenTag: getOpenTag,
  isCloseTag: isCloseTag,
  getOpenTagParams: getOpenTagParams,
  isXmlSelfCloseTag: isXmlSelfCloseTag,
  isSelfCloseTag: isSelfCloseTag,
  getInsideBraceParam: getInsideBraceParam,
  isControl: isControl,
  isControlCloseTag: isControlCloseTag,
  getTagComponentName: getTagComponentName,
  getTagComponentAttrs: getTagComponentAttrs,
  isTagControl: isTagControl,
  getTagComponents: getTagComponents,
  getDataValue: getDataValue,
  getItemParam: getItemParam,
  isTmpl: isTmpl,
  addTmpl: addTmpl,
  assign: assign,
  uniqueKey: uniqueKey,
  lightObj: lightObj,
  listPush: listPush,
  compiledParam: compiledParam,
  compiledParams: compiledParams,
  compiledProp: compiledProp
};
assign(tools, escape);

//部分函数绑定到nj对象
nj.isArray = isArray;
nj.isArrayLike = isArrayLike;
nj.isObject = isObject;
nj.isString = isString;
nj.each = each;
nj.inArray = inArray;
nj.trim = trim;
nj.assign = assign;

module.exports = tools;