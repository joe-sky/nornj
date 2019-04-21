import nj from '../core';
const nativeArrayPush = Array.prototype.push,
  nativeArraySlice = Array.prototype.slice,
  hasOwnProperty = Object.prototype.hasOwnProperty,
  toString = Object.prototype.toString;
const { errorTitle } = nj;

export const defineProp = Object.defineProperty;
export const defineProps = Object.defineProperties;

//Push one by one to array
export function arrayPush(arr1, arr2) {
  nativeArrayPush.apply(arr1, arr2);
  return arr1;
}

export function arraySlice(arrLike, start, end) {
  return nativeArraySlice.call(arrLike, start, end);
}

//判断是否为数组
export function isArray(obj) {
  return Array.isArray(obj);
}

//判断是否为对象
export function isObject(obj) {
  const type = typeof obj;
  return !isArray(obj) && (type === 'function' || type === 'object' && !!obj);
}

//判断是否为数字
export function isNumber(obj) {
  return toString.call(obj) === '[object Number]';
}

//判断是否为字符串
export function isString(obj) {
  return toString.call(obj) === '[object String]';
}

//获取属性值
function _getProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

//是否为类数组
const _getLength = _getProperty('length');

export function isArrayLike(obj) {
  const length = _getLength(obj);
  return typeof length == 'number' && length >= 0;
}

//遍历数组或对象
export function each(obj, func, isArr) {
  if (!obj) {
    return;
  }

  if (isArr == null) {
    isArr = isArrayLike(obj);
  }

  if (isArr) {
    for (let i = 0, l = obj.length; i < l; i++) {
      let ret = func.call(obj, obj[i], i, l);

      if (ret === false) {
        break;
      }
    }
  } else {
    let keys = Object.keys(obj),
      l = keys.length;
    for (let i = 0; i < l; i++) {
      let k = keys[i],
        ret = func.call(obj, obj[k], k, i, l);

      if (ret === false) {
        break;
      }
    }
  }
}

const REGEX_TRIM_RIGHT = /(\n|\r)?[\s\xA0]+$/;
export function trimRight(str) {
  return str.replace(REGEX_TRIM_RIGHT, (all, s1) => s1 ? '\n' : '');
}

//Noop function
export function noop() { }

//抛出异常
export function throwIf(val, msg, type) {
  if (!val) {
    switch (type) {
      case 'ex':
        throw Error(errorTitle + 'Extension tag "' + msg + '" is undefined, please check it has been registered.');
      default:
        throw Error(errorTitle + (msg || val));
    }
  }
}

//Print warn
export function warn(msg, type) {
  switch (type) {
    case 'f':
      msg = 'A filter called "' + msg + '" is undefined.';
      break;
  }
  console.warn(errorTitle + msg);
}

//Print error
export function error(msg) {
  console.error(errorTitle + msg);
}

//create light weight object
export function obj() {
  return Object.create(null);
}

//Clear quotation marks
const REGEX_QUOT_D = /["]+/g,
  REGEX_QUOT_S = /[']+/g;

export function clearQuot(value, clearDouble) {
  if (value == null) {
    return;
  }

  let regex;
  if (clearDouble == null) {
    const charF = value[0];
    if (charF === '\'') {
      regex = REGEX_QUOT_S;
    } else if (charF === '"') {
      regex = REGEX_QUOT_D;
    }
  } else if (clearDouble) {
    regex = REGEX_QUOT_D;
  } else {
    regex = REGEX_QUOT_S;
  }

  if (regex) {
    value = value.replace(regex, '');
  }
  return value;
}

//Transform to camel-case
export function camelCase(str) {
  if (str.indexOf('-') > -1) {
    str = str.replace(/-\w/g, function (letter) {
      return letter.substr(1).toUpperCase();
    });
  }

  return str;
}

//Reference by babel-external-helpers
export const assign = Object.assign || function (target) {
  for (let i = 1, args = arguments; i < args.length; i++) {
    let source = args[i];

    for (let key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

export function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

export function lowerFirst(str) {
  return str[0].toLowerCase() + str.substr(1);
}

assign(nj, {
  defineProp,
  defineProps,
  arrayPush,
  arraySlice,
  isArray,
  isObject,
  isNumber,
  isString,
  isArrayLike,
  each,
  noop,
  throwIf,
  warn,
  obj,
  camelCase,
  assign,
  capitalize,
  lowerFirst
});