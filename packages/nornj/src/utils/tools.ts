import nj from '../core';
const nativeArrayPush = Array.prototype.push,
  nativeArraySlice = Array.prototype.slice,
  hasOwnProperty = Object.prototype.hasOwnProperty,
  toString = Object.prototype.toString;
const { errorTitle } = nj;

export const defineProp = Object.defineProperty;
export const defineProps = Object.defineProperties;

// Internal function for creating a toString-based type tester.
function _tagTester(name) {
  return function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
}

//Reference by underscore
export const isNumber = _tagTester('Number');
export const isString = _tagTester('String');
export const isMap = _tagTester('Map');
export const isWeakMap = _tagTester('WeakMap');
export const isSet = _tagTester('Set');
export const isWeakSet = _tagTester('WeakSet');

//Push one by one to array
export function arrayPush(arr1, arr2): number {
  nativeArrayPush.apply(arr1, arr2);
  return arr1;
}

export function arraySlice(arrLike?, start?: number, end?: number): any[] {
  return nativeArraySlice.call(arrLike, start, end);
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function isObject(obj) {
  const type = typeof obj;
  return !isArray(obj) && (type === 'function' || (type === 'object' && !!obj));
}

function _getProperty(key: string) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
}

const _getLength = _getProperty('length');

export function isArrayLike(obj) {
  const length = _getLength(obj);
  return typeof length == 'number' && length >= 0;
}

function _iteratorLoop(obj, func: Function, isMap?: boolean) {
  const size = obj.size;
  let i = 0;

  for (const item of obj) {
    let ret;
    if (isMap) {
      const [k, v] = item;
      ret = func.call(obj, v, k, i, size);
    } else {
      ret = func.call(obj, item, i, size);
    }

    if (ret === false) {
      break;
    }
    i++;
  }
}

export function each(obj, func: Function, isArr?: boolean) {
  if (!obj) {
    return;
  }

  if (isArr == null) {
    isArr = isArrayLike(obj);
  }

  if (isArr) {
    for (let i = 0, l = obj.length; i < l; i++) {
      const ret = func.call(obj, obj[i], i, l);

      if (ret === false) {
        break;
      }
    }
  } else if (isSet(obj) || isWeakSet(obj)) {
    _iteratorLoop(obj, func);
  } else if (isMap(obj) || isWeakMap(obj)) {
    _iteratorLoop(obj, func, true);
  } else {
    const keys = Object.keys(obj),
      l = keys.length;
    for (let i = 0; i < l; i++) {
      const k = keys[i],
        ret = func.call(obj, obj[k], k, i, l);

      if (ret === false) {
        break;
      }
    }
  }
}

const REGEX_TRIM_RIGHT = /(\n|\r)?[\s\xA0]+$/;
export function trimRight(str: string) {
  return str.replace(REGEX_TRIM_RIGHT, (all, s1) => (s1 ? '\n' : ''));
}

export function noop() {}

export function throwIf(val, msg: string, type: string) {
  if (!val) {
    switch (type) {
      case 'ex':
        throw Error(errorTitle + 'Extension tag "' + msg + '" is undefined, please check it has been registered.');
      default:
        throw Error(errorTitle + (msg || val));
    }
  }
}

export function warn(msg: string, type: string) {
  switch (type) {
    case 'f':
      msg = 'A filter called "' + msg + '" is undefined.';
      break;
  }
  console.warn(errorTitle + msg);
}

export function error(msg: string) {
  console.error(errorTitle + msg);
}

//create light weight object
export function obj() {
  return Object.create(null);
}

const REGEX_QUOT_D = /["]+/g,
  REGEX_QUOT_S = /[']+/g;

export function clearQuot(value: string, clearDouble?: boolean) {
  if (value == null) {
    return;
  }

  let regex;
  if (clearDouble == null) {
    const charF = value[0];
    if (charF === `'`) {
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

export function camelCase(str: string) {
  if (str.indexOf('-') > -1) {
    str = str.replace(/-\w/g, function(letter) {
      return letter.substr(1).toUpperCase();
    });
  }

  return str;
}

//Reference by babel-external-helpers
export const assign =
  Object.assign ||
  function(target) {
    for (let i = 1, args = arguments; i < args.length; i++) {
      const source = args[i];

      for (const key in source) {
        if (hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

export function upperFirst(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

export function lowerFirst(str: string) {
  return str[0].toLowerCase() + str.substr(1);
}

export function capitalize(str: string) {
  return upperFirst(str);
}

export function as<R, T = any>(value: T): R {
  return (value as T | R) as R;
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
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  each,
  noop,
  throwIf,
  warn,
  obj,
  camelCase,
  assign,
  upperFirst,
  lowerFirst,
  capitalize,
  as
});
