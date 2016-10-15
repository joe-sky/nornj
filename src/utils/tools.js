'use strict';

var nj = require('../core'),
  assign = require('object-assign'),
  arrayProto = Array.prototype,
  arrayEvery = arrayProto.every,
  arrayForEach = arrayProto.forEach,
  arrayPush = arrayProto.push,
  errorTitle = nj.errorTitle;

//Push one by one to array
function listPush(arr1, arr2, checkIsArr, checkNotNull) {
  if (checkIsArr && !isArray(arr2)) {
    //Put the value at the end of the first array only when the second parameter is not null.
    if (!checkNotNull || arr2 != null) {
      arr1[arr1.length] = arr2;
    }
    return arr1;
  }

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
function each(obj, func, context, isArr, useEvery) {
  if (!obj) {
    return;
  }

  var arrayEach;
  if (useEvery) {
    arrayEach = arrayEvery;
  }
  else {
    arrayEach = arrayForEach;
  }
  if (isArr == null) {
    isArr = isArrayLike(obj);
  }

  //设置回调函数上下文
  context = context ? context : obj;

  if (isArr) {
    arrayEach.call(obj, function (o, i) {
      var ret = func.call(context, o, i);

      if (useEvery) {
        if (ret === false) {
          return ret;
        }
        return true;
      }
    });
  }
  else {
    var keys = Object.keys(obj),
      l = keys.length;
    arrayEach.call(keys, function (k, i) {
      var ret = func.call(context, obj[k], k, i, l);

      if (useEvery) {
        if (ret === false) {
          return ret;
        }
        return true;
      }
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
  inArray: inArray,
  trim: trim,
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