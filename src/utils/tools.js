'use strict';

var nj = require('../core'),
  assign = require('object-assign'),
  arrayPush = Array.prototype.push,
  errorTitle = nj.errorTitle;

//Push one by one to array
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
function each(obj, func, context, isArr) {
  if (!obj) {
    return;
  }

  if (isArr == null) {
    isArr = isArrayLike(obj);
  }

  //设置回调函数上下文
  context = context ? context : obj;

  if (isArr) {
    for (var i = 0, l = obj.length; i < l; i++) {
      var ret = func.call(context, obj[i], i);

      if (ret === false) {
        break;
      }
    }
  }
  else {
    var keys = Object.keys(obj),
      l = keys.length;
    for (var i = 0; i < l; i++) {
      var k = keys[i],
        ret = func.call(context, obj[k], k, i, l);

      if (ret === false) {
        break;
      }
    }
  }
}

//Transform multidimensional array to one-dimensional array
function flatten(obj) {
  var output = [],
    idx = 0;

  if (isArray(obj)) {
    for (var i = 0, l = _getLength(obj); i < l; i++) {
      var value = obj[i];
      //flatten current level of array or arguments object
      value = flatten(value);

      var j = 0, len = value.length;
      output.length += len;
      while (j < len) {
        output[idx++] = value[j++];
      }
    }
  }
  else {
    output[idx++] = obj;
  }

  return output;
}

//Noop function
function noop() { }

//抛出异常
function throwIf(val, msg, type) {
  if (!val) {
    switch (type) {
      case 'expr':
        throw Error(errorTitle + 'Expression "' + msg + '" is undefined, please check it has been registered.');
      default:
        throw Error(errorTitle + (msg || val));
    }
  }
}

//Print warn
function warn(msg, type) {
  var ret = errorTitle;
  switch (type) {
    case 'filter':
      ret += 'A filter called "' + msg + '" is undefined.';
    default:
      ret += msg;
  }

  return ret;
}

//create a unique key
function uniqueKey(str, hash) {
  var len = str.length;
  if (len == 0) {
    return str;
  }
  if (hash == null) {
    hash = 0;
  }

  var i, chr;
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

//Clear quotation marks
function clearQuot(value) {
  var charF = value[0],
    regex;

  if (charF === '\'') {
    regex = /[']+/g;
  }
  else if (charF === '"') {
    regex = /["]+/g;
  }
  if (regex) {
    value = value.replace(regex, '');
  }

  return value;
}

//Transform to camel-case
function toCamelCase(str) {
  if (str.indexOf('-') > -1) {
    str = str.replace(/-\w/g, function (letter) {
      return letter.substr(1).toUpperCase();
    });
  }

  return str;
}

var tools = {
  isArray: isArray,
  isArrayLike: isArrayLike,
  isObject: isObject,
  isString: isString,
  each: each,
  flatten: flatten,
  throwIf: throwIf,
  assign: assign,
  uniqueKey: uniqueKey,
  lightObj: lightObj,
  listPush: listPush,
  clearQuot: clearQuot,
  toCamelCase: toCamelCase,
  warn: warn,
  noop: noop
};

module.exports = tools;