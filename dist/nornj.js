(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NornJ"] = factory();
	else
		root["NornJ"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = nj;
function nj() {
  return nj['taggedTmpl' + (nj.outputH ? 'H' : '')].apply(null, arguments);
}

nj.createElement = null;
nj.components = {};
nj.preAsts = {};
nj.asts = {};
nj.templates = {};
nj.errorTitle = '[NornJ]';
nj.tmplRule = {};
nj.outputH = false;
nj.global = typeof self !== 'undefined' ? self : global;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(16)))

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return defineProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return defineProps; });
/* harmony export (immutable) */ __webpack_exports__["h"] = arrayPush;
/* harmony export (immutable) */ __webpack_exports__["j"] = arraySlice;
/* harmony export (immutable) */ __webpack_exports__["q"] = isArray;
/* harmony export (immutable) */ __webpack_exports__["k"] = isObject;
/* harmony export (immutable) */ __webpack_exports__["l"] = isNumber;
/* harmony export (immutable) */ __webpack_exports__["b"] = isString;
/* harmony export (immutable) */ __webpack_exports__["i"] = isArrayLike;
/* harmony export (immutable) */ __webpack_exports__["c"] = each;
/* harmony export (immutable) */ __webpack_exports__["r"] = trimRight;
/* harmony export (immutable) */ __webpack_exports__["n"] = noop;
/* harmony export (immutable) */ __webpack_exports__["o"] = throwIf;
/* harmony export (immutable) */ __webpack_exports__["p"] = warn;
/* harmony export (immutable) */ __webpack_exports__["g"] = obj;
/* harmony export (immutable) */ __webpack_exports__["f"] = clearQuot;
/* harmony export (immutable) */ __webpack_exports__["m"] = toCamelCase;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return assign; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var nativeArrayPush = Array.prototype.push,
    nativeArraySlice = Array.prototype.slice,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString;
var errorTitle = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].errorTitle;


var defineProp = Object.defineProperty;
var defineProps = Object.defineProperties;

//Push one by one to array
function arrayPush(arr1, arr2) {
  nativeArrayPush.apply(arr1, arr2);
  return arr1;
}

function arraySlice(arrLike, start, end) {
  return nativeArraySlice.call(arrLike, start, end);
}

//判断是否为数组
function isArray(obj) {
  return Array.isArray(obj);
}

//判断是否为对象
function isObject(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  return !isArray(obj) && (type === 'function' || type === 'object' && !!obj);
}

//判断是否为数字
function isNumber(obj) {
  return toString.call(obj) === '[object Number]';
}

//判断是否为字符串
function isString(obj) {
  return toString.call(obj) === '[object String]';
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
      var ret = func.call(context, obj[i], i, l);

      if (ret === false) {
        break;
      }
    }
  } else {
    var keys = Object.keys(obj),
        _l = keys.length;
    for (var _i = 0; _i < _l; _i++) {
      var k = keys[_i],
          _ret = func.call(context, obj[k], k, _i, _l);

      if (_ret === false) {
        break;
      }
    }
  }
}

var REGEX_TRIM_RIGHT = /(\n|\r)?[\s\xA0]+$/;
function trimRight(str) {
  return str.replace(REGEX_TRIM_RIGHT, function (all, s1) {
    return s1 ? '\n' : '';
  });
}

//Noop function
function noop() {}

//抛出异常
function throwIf(val, msg, type) {
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
function warn(msg, type) {
  var ret = errorTitle;
  switch (type) {
    case 'filter':
      ret += 'A filter called "' + msg + '" is undefined.';
      break;
    default:
      ret += msg;
  }

  console.warn(ret);
}

//create light weight object
function obj() {
  return Object.create(null);
}

//Clear quotation marks
var REGEX_QUOT_D = /["]+/g,
    REGEX_QUOT_S = /[']+/g;

function clearQuot(value, clearDouble) {
  if (value == null) {
    return;
  }

  var regex = void 0;
  if (clearDouble == null) {
    var charF = value[0];
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
function toCamelCase(str) {
  if (str.indexOf('-') > -1) {
    str = str.replace(/-\w/g, function (letter) {
      return letter.substr(1).toUpperCase();
    });
  }

  return str;
}

//Reference by babel-external-helpers
var assign = Object.assign || function (target) {
  for (var i = 1, args = arguments; i < args.length; i++) {
    var source = args[i];

    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

assign(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  defineProp: defineProp,
  defineProps: defineProps,
  arrayPush: arrayPush,
  arraySlice: arraySlice,
  isArray: isArray,
  isObject: isObject,
  isNumber: isNumber,
  isString: isString,
  isArrayLike: isArrayLike,
  each: each,
  noop: noop,
  throwIf: throwIf,
  warn: warn,
  obj: obj,
  toCamelCase: toCamelCase,
  assign: assign
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tools__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = createTmplRule;



function _createRegExp(reg, mode) {
  return new RegExp(reg, mode);
}

//Clear the repeated characters
function _clearRepeat(str) {
  var ret = '',
      i = 0,
      l = str.length,
      char = void 0;

  for (; i < l; i++) {
    char = str[i];
    if (ret.indexOf(char) < 0) {
      ret += char;
    }
  }

  return ret;
}

function _replace$(str) {
  return str.replace(/\$/g, '\\$');
}

function createTmplRule() {
  var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isGlobal = arguments[1];
  var _nj$tmplRule = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule,
      _nj$tmplRule$startRul = _nj$tmplRule.startRule,
      startRule = _nj$tmplRule$startRul === undefined ? '{{' : _nj$tmplRule$startRul,
      _nj$tmplRule$endRule = _nj$tmplRule.endRule,
      endRule = _nj$tmplRule$endRule === undefined ? '}}' : _nj$tmplRule$endRule,
      _nj$tmplRule$extensio = _nj$tmplRule.extensionRule,
      extensionRule = _nj$tmplRule$extensio === undefined ? '#' : _nj$tmplRule$extensio,
      _nj$tmplRule$propRule = _nj$tmplRule.propRule,
      propRule = _nj$tmplRule$propRule === undefined ? '@' : _nj$tmplRule$propRule,
      _nj$tmplRule$strPropR = _nj$tmplRule.strPropRule,
      strPropRule = _nj$tmplRule$strPropR === undefined ? '@' : _nj$tmplRule$strPropR,
      _nj$tmplRule$template = _nj$tmplRule.templateRule,
      templateRule = _nj$tmplRule$template === undefined ? 'template' : _nj$tmplRule$template,
      _nj$tmplRule$tagSpRul = _nj$tmplRule.tagSpRule,
      tagSpRule = _nj$tmplRule$tagSpRul === undefined ? '#$@' : _nj$tmplRule$tagSpRul,
      _nj$tmplRule$commentR = _nj$tmplRule.commentRule,
      commentRule = _nj$tmplRule$commentR === undefined ? '#' : _nj$tmplRule$commentR;
  var start = rules.start,
      end = rules.end,
      extension = rules.extension,
      prop = rules.prop,
      strProp = rules.strProp,
      template = rules.template,
      tagSp = rules.tagSp,
      comment = rules.comment;


  if (start) {
    startRule = start;
  }
  if (end) {
    endRule = end;
  }
  if (extension) {
    extensionRule = extension;
  }
  if (prop) {
    propRule = prop;
  }
  if (strProp) {
    strPropRule = strProp;
  }
  if (template) {
    templateRule = template;
  }
  if (tagSp) {
    tagSpRule = tagSp;
  }
  if (comment != null) {
    commentRule = comment;
  }

  var allRules = _clearRepeat(startRule + endRule),
      firstChar = startRule[0],
      lastChar = endRule[endRule.length - 1],
      extensionRules = _clearRepeat(extensionRule + propRule + strPropRule + tagSpRule),
      escapeExtensionRule = _replace$(extensionRule),
      escapePropRule = _replace$(propRule),
      escapeStrPropRule = _replace$(strPropRule);

  var tmplRules = {
    startRule: startRule,
    endRule: endRule,
    extensionRule: extensionRule,
    propRule: propRule,
    strPropRule: strPropRule,
    templateRule: templateRule,
    tagSpRule: tagSpRule,
    commentRule: commentRule,
    firstChar: firstChar,
    lastChar: lastChar,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + extensionRules + '][^\\s>]*)[^>]*>$', 'i'),
    openTagParams: _createRegExp('[\\s]+((([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
    insideBraceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'i'),
    spreadProp: _createRegExp('[\\s]+([' + firstChar + ']?' + startRule + ')[\\s]*(\\.\\.\\.[^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'g'),
    replaceSplit: _createRegExp('(?:[' + firstChar + ']?' + startRule + ')[^' + allRules + ']+(?:' + endRule + '[' + lastChar + ']?)'),
    replaceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)' + endRule + '[' + lastChar + ']?', 'g'),
    checkElem: _createRegExp('([^<>]+)|(<([a-z/!' + firstChar + extensionRules + '][^\\s<>]*)([^<>]*)>|<)([^<]*)', 'ig'),
    extension: _createRegExp('^' + escapeExtensionRule + '([^\\s]+)', 'i'),
    exAll: _createRegExp('^([/]?)(' + escapeExtensionRule + '|' + escapeStrPropRule + escapePropRule + '|' + escapePropRule + ')([^\\s]+)', 'i'),
    include: _createRegExp('<' + escapeExtensionRule + 'include([^>]*)>', 'ig'),
    newlineSplit: _createRegExp('\\n(?![^' + firstChar + lastChar + ']*' + lastChar + ')', 'g'),
    incompleteStart: _createRegExp('[' + firstChar + ']?' + startRule + '[^' + allRules + ']*$'),
    incompleteEnd: _createRegExp('^[^' + allRules + ']*' + endRule + '[' + lastChar + ']?')
  };

  if (isGlobal) {
    //Reset the regexs to global list
    __WEBPACK_IMPORTED_MODULE_1__tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule, tmplRules);
  } else {
    return tmplRules;
  }
};

//Set global template rules
createTmplRule({}, true);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__ = __webpack_require__(4);
/* unused harmony export extensions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return extensionConfig; });
/* harmony export (immutable) */ __webpack_exports__["a"] = registerExtension;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





//Global extension list
var extensions = {
  'if': function _if(value, options) {
    if (value === 'false') {
      value = false;
    }

    var valueR = void 0,
        ret = void 0;
    if (!options.useUnless) {
      valueR = !!value;
    } else {
      valueR = !!!value;
    }
    if (valueR) {
      ret = options.result();
    } else {
      var props = options.props;
      if (props) {
        (function () {
          var elseFn = props['else'];

          if (props.elseifs) {
            (function () {
              var l = props.elseifs.length;
              __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](props.elseifs, function (elseif, i) {
                if (!!elseif.value) {
                  ret = elseif.fn();
                  return false;
                } else if (i === l - 1) {
                  if (elseFn) {
                    ret = elseFn();
                  }
                }
              }, false, true);
            })();
          } else {
            if (elseFn) {
              ret = elseFn();
            }
          }
        })();
      }
    }

    if (options.useString && ret == null) {
      return '';
    }

    return ret;
  },

  'else': function _else(options) {
    return options.subExProps['else'] = options.result;
  },

  'elseif': function elseif(value, options) {
    var exProps = options.subExProps;
    if (!exProps.elseifs) {
      exProps.elseifs = [];
    }
    exProps.elseifs.push({
      value: value,
      fn: options.result
    });
  },

  'switch': function _switch(value, options) {
    var ret = void 0,
        props = options.props,
        l = props.elseifs.length;

    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](props.elseifs, function (elseif, i) {
      if (value === elseif.value) {
        ret = elseif.fn();
        return false;
      } else if (i === l - 1) {
        if (props['else']) {
          ret = props['else']();
        }
      }
    }, false, true);

    return ret;
  },

  unless: function unless(value, options) {
    options.useUnless = true;
    return extensions['if'](value, options);
  },

  each: function each(list, options) {
    var useString = options.useString,
        ret = void 0;

    if (list) {
      (function () {
        if (useString) {
          ret = '';
        } else {
          ret = [];
        }

        var props = options.props;
        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](list, function (item, index, len) {
          var param = {
            data: item,
            index: index,
            fallback: true
          };

          if (props && props.moreValues) {
            param.extra = {
              '@first': index === 0,
              '@last': index === len - 1,
              '@length': len
            };
          }

          var retI = options.result(param);
          if (useString) {
            ret += retI;
          } else {
            ret.push(retI);
          }
        }, false, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["i" /* isArrayLike */](list));

        //Return null when not use string and result is empty.
        if (!useString && !ret.length) {
          ret = null;
        }
      })();
    } else {
      var props = options.props;
      if (props && props['else']) {
        ret = props['else']();
      }
      if (useString && ret == null) {
        ret = '';
      }
    }

    return ret;
  },

  //Parameter
  prop: function prop(name, options) {
    var ret = options.result(),
        //Get parameter value
    value = void 0;

    if (ret !== undefined) {
      value = ret;
    } else {
      //Match to Similar to "checked" or "disabled" attribute.
      value = !options.useString ? true : name;
    }

    options.exProps[options.outputH ? __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__["a" /* fixPropName */](name) : name] = value;
  },

  //Spread parameters
  spread: function spread(props, options) {
    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](props, function (v, k) {
      options.exProps[k] = v;
    }, false, false);
  },

  'for': function _for(start, end, options) {
    if (end._njOpts) {
      options = end;
      end = start;
      start = 0;
    }

    var ret = void 0,
        useString = options.useString,
        props = options.props,
        loopLast = props && props.loopLast;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; start <= end; start++) {
      if (!loopLast && start === end) {
        break;
      }

      var retI = options.result({
        index: start,
        fallback: true
      });

      if (useString) {
        ret += retI;
      } else {
        ret.push(retI);
      }
    }

    return ret;
  },

  obj: function obj(options) {
    return options.props;
  },

  list: function list() {
    var args = arguments,
        last = args.length - 1,
        options = args[last];

    if (last > 0) {
      var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* arraySlice */](args, 0, last);
      if (options.useString) {
        ret = ret.join('');
      }

      return ret;
    } else {
      return [options.result()];
    }
  },

  fn: function fn(options) {
    var props = options.props;


    return function () {
      var _arguments = arguments;

      var params = void 0;
      if (props) {
        (function () {
          params = {};

          var paramNames = Object.keys(props);
          paramNames.forEach(function (v, i) {
            return params[paramNames[i]] = _arguments[i];
          });
        })();
      }

      return options.result({ data: params });
    };
  },

  block: function block(options) {
    return options.result();
  },

  pre: function pre(options) {
    return extensions.block(options);
  },

  'with': function _with(originalData, options) {
    var props = options.props;


    return options.result({
      data: props && props.as ? _defineProperty({}, props.as, originalData) : originalData
    });
  },

  arg: function arg(options) {
    var exProps = options.exProps;

    if (!exProps.args) {
      exProps.args = [];
    }

    exProps.args.push(options.result());
  },

  once: function once(options) {
    var props = options.props;

    var cacheObj = void 0;
    if (props && props.cacheTo != null) {
      cacheObj = props.cacheTo;
    } else {
      cacheObj = options.global;
    }

    var cacheKey = '_njOnceCache_' + options._njFnsNo,
        cache = cacheObj[cacheKey],
        useCache = void 0;

    if (props && (props.reset !== undefined || props.resetList !== undefined)) {
      (function () {
        var reset = props.reset,
            resetList = props.resetList;

        var cacheValKey = cacheKey + 'V';
        useCache = true;

        if (reset !== undefined) {
          resetList = [reset];
        }
        resetList.forEach(function (r, i) {
          var key = cacheValKey + i,
              cacheVal = cacheObj[key];

          if (cacheVal !== r) {
            useCache = false;
            cacheObj[key] = r;
          }
        });
      })();
    } else {
      useCache = cache !== undefined;
    }

    if (!useCache) {
      cache = cacheObj[cacheKey] = options.result();
    }
    return cache;
  }
};

function _config(params) {
  var ret = {
    onlyGlobal: false,
    useString: false,
    newContext: true,
    exProps: false,
    isProp: false,
    subExProps: false,
    isSub: false
  };

  if (params) {
    ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](ret, params);
  }
  return ret;
}

var _defaultCfg = { onlyGlobal: true, newContext: false };

//Extension default config
var extensionConfig = {
  'if': _config(_defaultCfg),
  'else': _config({ onlyGlobal: true, newContext: false, subExProps: true, isSub: true }),
  'switch': _config(_defaultCfg),
  unless: _config(_defaultCfg),
  each: _config({ onlyGlobal: true }),
  prop: _config({ onlyGlobal: true, newContext: false, exProps: true, subExProps: true, isProp: true }),
  spread: _config({ onlyGlobal: true, newContext: false, exProps: true, subExProps: true, isProp: true }),
  obj: _config({ onlyGlobal: true, newContext: false }),
  list: _config(_defaultCfg),
  fn: _config({ onlyGlobal: true }),
  'with': _config({ onlyGlobal: true })
};
extensionConfig.elseif = _config(extensionConfig['else']);
extensionConfig['for'] = _config(extensionConfig.each);
extensionConfig.block = _config(extensionConfig.obj);
extensionConfig.pre = _config(extensionConfig.obj);
extensionConfig.arg = _config(extensionConfig.prop);
extensionConfig.once = _config(extensionConfig.obj);

//Extension alias
extensions['case'] = extensions.elseif;
extensionConfig['case'] = extensionConfig.elseif;
extensions['default'] = extensions['else'];
extensionConfig['default'] = extensionConfig['else'];
extensions.strProp = extensions.prop;
extensionConfig.strProp = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](_config(extensionConfig.prop), { useString: true });
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);

//Register extension and also can batch add
function registerExtension(name, extension, options) {
  var params = name;
  if (!__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](name)) {
    params = {};
    params[name] = {
      extension: extension,
      options: options
    };
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](params, function (v, name) {
    if (v) {
      var _extension = v.extension,
          _options = v.options;


      if (_extension) {
        extensions[name] = _extension;
      } else {
        extensions[name] = v;
      }
      extensionConfig[name] = _config(_options);
    }
  }, false, false);
}

__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  extensions: extensions,
  extensionConfig: extensionConfig,
  registerExtension: registerExtension
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* unused harmony export styleProps */
/* unused harmony export getData */
/* unused harmony export getComputedData */
/* unused harmony export getElement */
/* unused harmony export getElementRefer */
/* unused harmony export getElementName */
/* unused harmony export addArgs */
/* unused harmony export newContext */
/* harmony export (immutable) */ __webpack_exports__["a"] = fixPropName;
/* unused harmony export assignStrProps */
/* unused harmony export exRet */
/* unused harmony export tmplWrap */
/* harmony export (immutable) */ __webpack_exports__["b"] = template;


var errorTitle = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].errorTitle;

//提取style内参数

function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](obj) || __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* isNumber */](obj)) {
    return obj;
  }

  //参数为字符串
  var pattern = /([^\s:]+)[\s]?:[\s]?([^;]+)[;]?/g,
      matchArr = void 0,
      ret = void 0;

  while (matchArr = pattern.exec(obj)) {
    var key = matchArr[1],
        value = matchArr[2];

    if (!ret) {
      ret = {};
    }

    //Convert to lowercase when style name is all capital.
    if (/^[A-Z-]+$/.test(key)) {
      key = key.toLowerCase();
    }

    //将连字符转为驼峰命名
    key = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["m" /* toCamelCase */](key);

    ret[key] = value;
  }

  return ret;
}

//Get value from multiple datas
function getData(prop, data) {
  var ret = void 0,
      obj = void 0;
  if (data === undefined) {
    data = this.data;
  }

  for (var i = 0, l = data.length; i < l; i++) {
    obj = data[i];
    if (obj) {
      ret = obj[prop];
      if (ret !== undefined) {
        return ret;
      }
    }
  }
}

function getComputedData(fn, p2, level) {
  if (fn == null) {
    return fn;
  }

  if (fn._njTmpl) {
    //模板函数
    if (level != null && p2.level != null) {
      level += p2.level;
    }

    return fn.call({
      _njData: p2.data,
      _njParent: p2.parent,
      _njIndex: p2.index,
      _njLevel: level
    });
  } else {
    //普通函数
    return fn(p2);
  }
}

function getElement(name, p1) {
  var element = p1.components[name];
  return element ? element : name;
}

function getElementRefer(refer, name, p1) {
  return refer != null ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](refer) ? getElement(refer.toLowerCase(), p1) : refer : getElement(name, p1);
}

function getElementName(refer, name) {
  return refer != null && refer !== '' ? refer : name;
}

function addArgs(props, dataRefer) {
  var args = props.args;

  if (args) {
    for (var i = args.length; i--;) {
      dataRefer.unshift(args[i]);
    }
  }
}

//Rebuild local variables in the new context
function newContext(p2, p3) {
  if (!p3) {
    return p2;
  }

  var newData = [];
  if ('data' in p3) {
    newData.push(p3.data);
  }
  if ('extra' in p3) {
    newData.push(p3.extra);
  }

  return {
    data: newData.length ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* arrayPush */](newData, p2.data) : p2.data,
    parent: p3.fallback ? p2 : p2.parent,
    index: 'index' in p3 ? p3.index : p2.index,
    level: p2.level,
    getData: getData
  };
}

//修正属性名
function fixPropName(name) {
  switch (name) {
    case 'class':
      name = 'className';
      break;
    case 'for':
      name = 'htmlFor';
      break;
  }

  return name;
}

//合并字符串属性
function assignStrProps(paramsE, keys) {
  var ret = '';
  for (var k in paramsE) {
    if (!keys || !keys[k]) {
      var v = paramsE[k];
      ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
    }
  }
  return ret;
}

//创建扩展标签子节点函数
function exRet(p1, p2, fn, p4, p5) {
  return function (param) {
    return fn(p1, p2, param, p4, p5);
  };
}

//构建可运行的模板函数
function tmplWrap(configs, main) {
  return function () {
    var initCtx = this,
        data = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* arraySlice */](arguments);

    return main(configs, {
      data: initCtx && initCtx._njData ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* arrayPush */](data, initCtx._njData) : data,
      parent: initCtx ? initCtx._njParent : null,
      index: initCtx ? initCtx._njIndex : null,
      level: initCtx ? initCtx._njLevel : null,
      getData: getData
    });
  };
}

function levelSpace(p2) {
  if (p2.level == null) {
    return '';
  }

  var ret = '';
  for (var i = 0; i < p2.level; i++) {
    ret += '  ';
  }
  return ret;
}

function firstNewline(p2) {
  return p2.index == null ? '' : p2.index == 0 ? '' : '\n';
}

//创建模板函数
function template(fns) {
  var configs = {
    useString: fns.useString,
    extensions: __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].extensions,
    filters: __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].filters,
    noop: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["n" /* noop */],
    obj: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */],
    throwIf: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["o" /* throwIf */],
    warn: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["p" /* warn */],
    newContext: newContext,
    getComputedData: getComputedData,
    styleProps: styleProps,
    exRet: exRet,
    getElement: getElement,
    getElementRefer: getElementRefer,
    getElementName: getElementName,
    addArgs: addArgs,
    assign: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */],
    global: __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].global
  };

  if (!configs.useString) {
    configs.h = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].createElement;
    configs.components = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].components;
  } else {
    configs.assignStrProps = assignStrProps;
    configs.escape = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].escape;
    configs.levelSpace = levelSpace;
    configs.firstNewline = firstNewline;
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](fns, function (v, k) {
    if (k.indexOf('main') === 0) {
      //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
      configs[k]._njTmpl = true;
      if (v._njName != null) {
        //设置函数名
        configs[k].tmplName = v._njName;
      }
      configs['_' + k] = v;
    } else if (k.indexOf('fn') === 0) {
      //扩展标签函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* unused harmony export filters */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return filterConfig; });
/* harmony export (immutable) */ __webpack_exports__["a"] = registerFilter;



//Global filter list
var filters = {
  //Get object properties
  '.': function _(obj, prop) {
    if (obj != null) {
      return obj[prop];
    }

    return obj;
  },

  //Call object method
  '#': function _(obj, method) {
    if (obj != null) {
      var args = arguments;
      return obj[method].apply(obj, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* arraySlice */](args, 2, args.length - 1));
    }

    return obj;
  },

  '==': function _(val1, val2) {
    return val1 == val2;
  },

  '===': function _(val1, val2) {
    return val1 === val2;
  },

  '!=': function _(val1, val2) {
    return val1 != val2;
  },

  '!==': function _(val1, val2) {
    return val1 !== val2;
  },

  //Less than
  lt: function lt(val1, val2) {
    return val1 < val2;
  },

  lte: function lte(val1, val2) {
    return val1 <= val2;
  },

  //Greater than
  gt: function gt(val1, val2) {
    return val1 > val2;
  },

  gte: function gte(val1, val2) {
    return val1 >= val2;
  },

  '+': function _(val1, val2) {
    return val1 + val2;
  },

  '-': function _(val1, val2) {
    return val1 - val2;
  },

  '*': function _(val1, val2) {
    return val1 * val2;
  },

  '/': function _(val1, val2) {
    return val1 / val2;
  },

  '%': function _(val1, val2) {
    return val1 % val2;
  },

  //Ternary operator
  '?': function _(val, val1, val2) {
    return val ? val1 : val2;
  },

  '!': function _(val) {
    return !val;
  },

  '&&': function _(val1, val2) {
    return val1 && val2;
  },

  or: function or(val1, val2) {
    return val1 || val2;
  },

  //Convert to int 
  int: function int(val) {
    return parseInt(val, 10);
  },

  //Convert to float 
  float: function float(val) {
    return parseFloat(val);
  },

  //Convert to boolean 
  bool: function bool(val) {
    if (val === 'false') {
      return false;
    }

    return Boolean(val);
  },

  obj: function obj() {
    var args = arguments,
        ret = {};

    if (args.length > 1) {
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](args, function (v, i, l) {
        if (i < l - 1) {
          ret[v.key] = v.val;
        }
      }, false, true);
    }
    return ret;
  },

  ':': function _(key, val) {
    return { key: key, val: val };
  },

  list: function list() {
    var args = arguments;
    if (args.length === 1) {
      return [];
    } else {
      return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* arraySlice */](args, 0, args.length - 1);
    }
  }
};

function _config(params) {
  var ret = {
    onlyGlobal: false
  };

  if (params) {
    ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](ret, params);
  }
  return ret;
}

var _defaultCfg = { onlyGlobal: true };

//Filter default config
var filterConfig = {
  '.': _config(_defaultCfg),
  '#': _config(_defaultCfg),
  '==': _config(_defaultCfg),
  '===': _config(_defaultCfg),
  '!=': _config(_defaultCfg),
  '!==': _config(_defaultCfg),
  lt: _config(_defaultCfg),
  lte: _config(_defaultCfg),
  gt: _config(_defaultCfg),
  gte: _config(_defaultCfg),
  '+': _config(_defaultCfg),
  '-': _config(_defaultCfg),
  '*': _config(_defaultCfg),
  '/': _config(_defaultCfg),
  '%': _config(_defaultCfg),
  '?': _config(_defaultCfg),
  '!': _config(_defaultCfg),
  '&&': _config(_defaultCfg),
  or: _config(_defaultCfg),
  int: _config(_defaultCfg),
  float: _config(_defaultCfg),
  bool: _config(_defaultCfg),
  obj: _config(_defaultCfg),
  ':': _config(_defaultCfg),
  list: _config(_defaultCfg)
};

//Filter alias
filters.prop = filters['.'];
filterConfig.prop = filterConfig['.'];

//Register filter and also can batch add
function registerFilter(name, filter, options) {
  var params = name;
  if (!__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](name)) {
    params = {};
    params[name] = {
      filter: filter,
      options: options
    };
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](params, function (v, name) {
    if (v) {
      var _filter = v.filter,
          _options = v.options;


      if (_filter) {
        filters[name] = _filter;
      } else {
        filters[name] = v;
      }
      filterConfig[name] = _config(_options);
    }
  }, false, false);
}

__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  filters: filters,
  filterConfig: filterConfig,
  registerFilter: registerFilter
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tools__ = __webpack_require__(1);
/* unused harmony export escape */
/* harmony export (immutable) */ __webpack_exports__["a"] = unescape;



var ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
};

var REGEX_ESCAPE = /[&><"']/g;
function escape(str) {
  if (str == null) {
    return '';
  } else if (!str.replace) {
    return str;
  }

  return str.replace(REGEX_ESCAPE, function (match) {
    return ESCAPE_LOOKUP[match];
  });
}

var UNESCAPE_LOOKUP = {
  nbsp: '\xA0',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwnj: '\u200C',
  zwj: '\u200D',
  lt: '<',
  gt: '>',
  amp: '&'
};

var REGEX_UNESCAPE = new RegExp('&(' + Object.keys(UNESCAPE_LOOKUP).join('|') + ');', 'g');
function unescape(str) {
  return str.replace(REGEX_UNESCAPE, function (all, match) {
    return UNESCAPE_LOOKUP[match];
  });
}

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__tools__["a" /* assign */])(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  escape: escape,
  unescape: unescape
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__ = __webpack_require__(8);
/* harmony export (immutable) */ __webpack_exports__["a"] = compileStringTmpl;
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();




var preAsts = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].preAsts;

var SPLIT_FLAG = '_nj_split';
var TEXT_CONTENT = ['style', 'script', 'textarea', 'xmp'];
var OMITTED_CLOSE_TAGS = __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["a" /* OMITTED_CLOSE_TAGS */];

//Compile string template

function compileStringTmpl(tmpl) {
  var tmplKey = tmpl.toString(),
      //Get unique key
  ret = preAsts[tmplKey];
  var outputH = this.outputH,
      tmplRule = this.tmplRule;


  if (!ret) {
    (function () {
      //If the cache already has template data, direct return the template.
      var isStr = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](tmpl),
          xmls = isStr ? [tmpl] : tmpl,
          l = xmls.length,
          fullXml = '',
          isInBrace = false;

      //Connection xml string
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](xmls, function (xml, i) {
        var split = '';
        if (i < l - 1) {
          var last = xml.length - 1,
              lastChar = xml[last],
              lastChar3 = xml.substr(last - 2),
              isComputed = lastChar === '#',
              isSpread = lastChar3 === '...';

          if (isInBrace) {
            isInBrace = !tmplRule.incompleteEnd.test(xml);
          }
          if (!isInBrace && tmplRule.incompleteStart.test(xml)) {
            isInBrace = true;
          }
          if (isComputed) {
            xml = xml.substr(0, last);
          } else if (isSpread) {
            xml = xml.substr(0, last - 2);
          }

          split = (isComputed ? '#' : isSpread ? '...' : '') + SPLIT_FLAG + i;
          if (!isInBrace) {
            split = tmplRule.startRule + split + tmplRule.endRule;
          }
        }

        fullXml += xml + split;
      }, false, true);

      fullXml = _formatAll(fullXml, tmplRule);

      //Resolve string to element
      ret = _checkStringElem(fullXml, tmplRule);
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* defineProp */](ret, '_njParamCount', {
        value: l - 1
      });

      //Save to the cache
      preAsts[tmplKey] = ret;
    })();
  }

  var params = void 0,
      args = arguments,
      paramCount = ret._njParamCount;
  if (paramCount > 0) {
    params = {};

    for (var i = 0; i < paramCount; i++) {
      params[SPLIT_FLAG + i] = args[i + 1];
    }
  }

  var tmplFn = function tmplFn() {
    return __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */]['compile' + (outputH ? 'H' : '')](tmplFn, { tmplKey: tmplKey, tmplRule: tmplRule }).apply(this, arguments);
  };
  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["e" /* defineProps */](tmplFn, {
    _njTmpl: {
      value: ret
    },
    _njTmplKey: {
      value: tmplKey
    },
    _njParams: {
      value: params
    }
  });

  return tmplFn;
}

function _createCurrent(elemName, parent) {
  var current = {
    elem: [],
    elemName: elemName,
    parent: parent
  };

  parent.elem.push(current.elem);
  return current;
}

function _setTextAfter(textAfter, current) {
  textAfter && textAfter !== '' && _setText(textAfter, current.elem);
}

//Resolve string to element
function _checkStringElem(xml, tmplRule) {
  var root = [],
      current = {
    elem: root,
    elemName: 'root',
    parent: null
  },
      parent = null,
      pattern = tmplRule.checkElem,
      matchArr = void 0,
      inTextContent = false,
      omittedCloseElem = null;

  while (matchArr = pattern.exec(xml)) {
    var textBefore = matchArr[1],
        elem = matchArr[2],
        elemName = matchArr[3],
        elemParams = matchArr[4],
        textAfter = matchArr[5];

    //处理上一次循环中的可省略闭合标签
    if (omittedCloseElem) {
      var _omittedCloseElem = omittedCloseElem,
          _omittedCloseElem2 = _slicedToArray(_omittedCloseElem, 4),
          _elem = _omittedCloseElem2[0],
          _elemName = _omittedCloseElem2[1],
          _elemParams = _omittedCloseElem2[2],
          _textAfter = _omittedCloseElem2[3];

      var isEx = elem ? __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["b" /* isExAll */](elemName, tmplRule) : false;

      if (isEx && !isEx[1] && (__WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["c" /* isPropS */](elemName, tmplRule) || __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["d" /* isStrPropS */](elemName, tmplRule) || __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["e" /* isParamsEx */](isEx[3]) || __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["f" /* exCompileConfig */](isEx[3]).isProp)) {
        parent = current;
        current = _createCurrent(_elemName, parent);
        _setElem(_elem, _elemName, _elemParams, current.elem, null, tmplRule);
      } else {
        _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule);
      }

      _setTextAfter(_textAfter, current);
      omittedCloseElem = null;
    }

    //Text before tag
    if (textBefore && textBefore !== '') {
      _setText(textBefore, current.elem);
    }

    //Element tag
    if (elem) {
      if (elem !== '<') {
        if (elem.indexOf('<!') === 0) {
          //一些特殊标签当做文本处理
          _setText(elem, current.elem);
        } else {
          var _isEx = __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["b" /* isExAll */](elemName, tmplRule);
          if (elemName[0] === '/') {
            //Close tag
            if (TEXT_CONTENT.indexOf(elemName.substr(1).toLowerCase()) > -1) {
              //取消纯文本子节点标记
              inTextContent = false;
            }

            if (_isEx || !inTextContent) {
              if (elemName === '/' + current.elemName) {
                current = current.parent;
              }
            } else {
              _setText(elem, current.elem);
            }
          } else if (elem[elem.length - 2] === '/') {
            //Self close tag
            if (_isEx || !inTextContent) {
              _setSelfCloseElem(elem, elemName, elemParams, current.elem, tmplRule);
            } else {
              _setText(elem, current.elem);
            }
          } else {
            //Open tag
            if (_isEx || !inTextContent) {
              if (!inTextContent && OMITTED_CLOSE_TAGS[elemName.toLowerCase()]) {
                //img等可不闭合标签
                omittedCloseElem = [elem, elemName, elemParams, textAfter];
              } else {
                if (TEXT_CONTENT.indexOf(elemName.toLowerCase()) > -1) {
                  //标记该标签为纯文本子节点
                  inTextContent = true;
                }

                parent = current;
                current = _createCurrent(elemName, parent);
                _setElem(elem, elemName, elemParams, current.elem, null, tmplRule);
              }
            } else {
              _setText(elem, current.elem);
            }
          }
        }
      } else {
        //单独的"<"和后面的文本拼合在一起
        if (textAfter == null) {
          textAfter = '';
        }
        textAfter = elem + textAfter;
      }
    }

    //Text after tag
    !omittedCloseElem && _setTextAfter(textAfter, current);
  }

  //处理最后一次循环中遗留的可省略闭合标签
  if (omittedCloseElem) {
    var _omittedCloseElem3 = omittedCloseElem,
        _omittedCloseElem4 = _slicedToArray(_omittedCloseElem3, 4),
        _elem2 = _omittedCloseElem4[0],
        _elemName2 = _omittedCloseElem4[1],
        _elemParams2 = _omittedCloseElem4[2],
        _textAfter2 = _omittedCloseElem4[3];

    _setSelfCloseElem(_elem2, _elemName2, _elemParams2, current.elem, tmplRule);
    _setTextAfter(_textAfter2, current);
  }

  return root;
}

var SP_FILTER_LOOKUP = {
  '>(': 'gt(',
  '<(': 'lt(',
  '>=(': 'gte(',
  '<=(': 'lte('
};
var REGEX_SP_FILTER = /(\|)?[\s]+((>|<|>=|<=)\()/g;

function _formatAll(str, tmplRule) {
  var commentRule = tmplRule.commentRule;
  return str.replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '').replace(REGEX_SP_FILTER, function (all, s1, match) {
    return ' | ' + SP_FILTER_LOOKUP[match];
  });
}

function _transformToEx(isStr, elemName, elemParams, tmplRule) {
  return tmplRule.extensionRule + (isStr ? 'strProp' : 'prop') + ' ' + tmplRule.startRule + '\'' + elemName.substr((isStr ? tmplRule.strPropRule.length : 0) + tmplRule.propRule.length) + '\'' + tmplRule.endRule + elemParams;
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose, tmplRule) {
  var ret = void 0,
      paramsEx = void 0;
  if (elemName[0] === tmplRule.extensionRule) {
    ret = elem.substring(1, elem.length - 1);
  } else if (__WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["d" /* isStrPropS */](elemName, tmplRule)) {
    ret = _transformToEx(true, elemName, elemParams, tmplRule);
  } else if (__WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__["c" /* isPropS */](elemName, tmplRule)) {
    ret = _transformToEx(false, elemName, elemParams, tmplRule);
  } else {
    var retS = _getSplitParams(elem, tmplRule);
    ret = retS.elem;
    paramsEx = retS.params;
  }

  if (bySelfClose) {
    var retC = [ret];
    if (paramsEx) {
      retC.push(paramsEx);
    }

    elemArr.push(retC);
  } else {
    elemArr.push(ret);
    if (paramsEx) {
      elemArr.push(paramsEx);
    }
  }
}

//Extract split parameters
function _getSplitParams(elem, tmplRule) {
  var extensionRule = tmplRule.extensionRule,
      startRule = tmplRule.startRule,
      endRule = tmplRule.endRule;

  var paramsEx = void 0;

  //Replace the parameter like "{...props}".
  elem = elem.replace(tmplRule.spreadProp, function (all, begin, prop) {
    prop = prop.trim();

    if (!paramsEx) {
      paramsEx = [extensionRule + 'props'];
    }

    paramsEx.push([extensionRule + 'spread ' + startRule + prop.replace(/\.\.\./g, '') + endRule + '/']);
    return ' ';
  });

  return {
    elem: elem,
    params: paramsEx
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr, tmplRule) {
  if (/\/$/.test(elemName)) {
    elemName = elemName.substr(0, elemName.length - 1);
  }
  _setElem(elem, elemName, elemParams, elemArr, true, tmplRule);
}

//Set text node
function _setText(text, elemArr) {
  elemArr.push(text);
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transformParam__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_extension__ = __webpack_require__(3);
/* harmony export (immutable) */ __webpack_exports__["h"] = getXmlOpenTag;
/* harmony export (immutable) */ __webpack_exports__["i"] = isXmlSelfCloseTag;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OMITTED_CLOSE_TAGS; });
/* harmony export (immutable) */ __webpack_exports__["n"] = verifySelfCloseTag;
/* harmony export (immutable) */ __webpack_exports__["m"] = getOpenTagParams;
/* harmony export (immutable) */ __webpack_exports__["j"] = isXmlCloseTag;
/* harmony export (immutable) */ __webpack_exports__["l"] = getInsideBraceParam;
/* harmony export (immutable) */ __webpack_exports__["g"] = isEx;
/* harmony export (immutable) */ __webpack_exports__["b"] = isExAll;
/* harmony export (immutable) */ __webpack_exports__["k"] = isTmpl;
/* harmony export (immutable) */ __webpack_exports__["o"] = addTmpl;
/* harmony export (immutable) */ __webpack_exports__["e"] = isParamsEx;
/* harmony export (immutable) */ __webpack_exports__["p"] = addParamsEx;
/* harmony export (immutable) */ __webpack_exports__["f"] = exCompileConfig;
/* harmony export (immutable) */ __webpack_exports__["c"] = isPropS;
/* harmony export (immutable) */ __webpack_exports__["d"] = isStrPropS;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






//提取xml open tag
function getXmlOpenTag(obj, tmplRule) {
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
function getOpenTagParams(tag, tmplRule) {
  var pattern = tmplRule.openTagParams,
      matchArr = void 0,
      ret = void 0;

  while (matchArr = pattern.exec(tag)) {
    var key = matchArr[1];
    if (key === '/') {
      //If match to the last of "/", then continue the loop.
      continue;
    }

    if (!ret) {
      ret = [];
    }

    var value = matchArr[7],
        onlyBrace = matchArr[4];
    if (value != null) {
      value = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["f" /* clearQuot */](value); //Remove quotation marks
    } else {
      value = key; //Match to Similar to "checked" or "disabled" attribute.
    }

    //Removed at the end of "/>", ">" or "/".
    if (!matchArr[8] && !matchArr[9]) {
      if (/\/>$/.test(value)) {
        value = value.substr(0, value.length - 2);
      } else if (/>$/.test(value) || /\/$/.test(value)) {
        value = value.substr(0, value.length - 1);
      }
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
  return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](obj) && obj.toLowerCase() === '</' + tagName + '>';
}

//get inside brace param
function getInsideBraceParam(obj, tmplRule) {
  return tmplRule.insideBraceParam.exec(obj);
}

//判断扩展标签并返回参数
function isEx(obj, tmplRule, isAll) {
  var ret = void 0,
      ret1 = tmplRule.extension.exec(obj);
  if (ret1) {
    ret = [ret1[1]];

    var params = getOpenTagParams(obj, tmplRule); //提取各参数
    if (params) {
      ret.push(params);
    }
  }

  return ret;
}

function isExAll(obj, tmplRule) {
  return obj.match(tmplRule.exAll);
}

//判断是否模板元素
function isTmpl(obj) {
  return obj === 'tmpl';
}

//加入到模板集合中
function addTmpl(node, parent, name) {
  var paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */]();
  }

  var tmpls = paramsP.tmpls;
  if (!tmpls) {
    var _objT;

    var objT = (_objT = {}, _defineProperty(_objT, name != null ? name : '_njT0', { node: node, no: 0 }), _defineProperty(_objT, '_njLen', 1), _objT);

    paramsP.tmpls = __WEBPACK_IMPORTED_MODULE_2__transformParam__["a" /* compiledParam */](objT);
  } else {
    //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
    var _objT2 = tmpls.strs[0],
        len = _objT2._njLen;

    _objT2[name != null ? name : '_njT' + len] = { node: node, no: len };
    _objT2._njLen = ++len;
  }
}

//Test whether as parameters extension
function isParamsEx(name) {
  return name === 'params' || name === 'props';
}

//Add to the "paramsEx" property of the parent node
function addParamsEx(node, parent, isProp, isSub) {
  var exPropsName = isSub ? 'propsExS' : 'paramsEx';
  if (!parent[exPropsName]) {
    var exPropsNode = void 0;
    if (isProp || isSub) {
      exPropsNode = {
        type: 'nj_ex',
        ex: 'props',
        content: [node]
      };
    } else {
      exPropsNode = node;
    }

    parent[exPropsName] = exPropsNode;
  } else {
    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* arrayPush */](parent[exPropsName].content, isProp || isSub ? [node] : node.content);
  }
}

function exCompileConfig(name) {
  var config = __WEBPACK_IMPORTED_MODULE_3__helpers_extension__["b" /* extensionConfig */][name];
  return {
    isSub: config ? config.isSub : false,
    isProp: config ? config.isProp : false,
    useString: config ? config.useString : false
  };
}

function isPropS(elemName, tmplRule) {
  return elemName.indexOf(tmplRule.propRule) === 0;
}

function isStrPropS(elemName, tmplRule) {
  return elemName.indexOf(tmplRule.strPropRule + tmplRule.propRule) === 0;
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = compiledParam;



//Get compiled property
var REGEX_JS_PROP = /(('[^']*')|("[^"]*")|(-?([0-9][0-9]*)(\.\d+)?)|true|false|null|undefined|Object|Array|Math|Date|JSON|([#]*)([^.[\]()]+))([^\s()]*)/;

function _compiledProp(prop, innerBrackets) {
  var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */]();

  //If there are vertical lines in the property,then use filter
  if (prop.indexOf('|') >= 0) {
    (function () {
      var filters = [],
          filtersTmp = void 0;
      filtersTmp = prop.split('|');
      prop = filtersTmp[0].trim(); //Extract property

      filtersTmp = filtersTmp.slice(1);
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](filtersTmp, function (filter) {
        filter = filter.trim();
        if (filter === '') {
          return;
        }

        var retF = _getFilterParam(filter),
            filterObj = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */](),
            filterName = retF[0]; //Get filter name

        if (filterName) {
          var paramsF = retF[1]; //Get filter param

          //Multiple params are separated by commas.
          if (paramsF != null) {
            (function () {
              var params = [];
              __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](innerBrackets[paramsF].split(','), function (p) {
                if (p !== '') {
                  params[params.length] = _compiledProp(p.trim(), innerBrackets);
                }
              }, false, true);

              filterObj.params = params;
            })();
          }

          filterObj.name = filterName;
          filters.push(filterObj);
        }
      }, false, true);

      ret.filters = filters;
    })();
  }

  //Extract the parent data path
  if (prop.indexOf('../') === 0) {
    (function () {
      var n = 0;
      prop = prop.replace(/\.\.\//g, function () {
        n++;
        return '';
      });

      ret.parentNum = n;
    })();
  }

  //Extract the js property
  if (prop !== '') {
    prop = REGEX_JS_PROP.exec(prop);
    var hasComputed = prop[7];
    ret.name = hasComputed ? prop[8] : prop[1];
    ret.jsProp = prop[9];

    if (!prop[8]) {
      //Sign the parameter is a basic type value.
      ret.isBasicType = true;
    }
    if (hasComputed) {
      ret.isComputed = true;
    }
  } else {
    ret.isEmpty = true;
  }

  return ret;
}

//Get filter param
function _getFilterParam(obj) {
  return obj.split('_njBracket_');
}

//Extract replace parameters
var _quots = ['\'', '"'];
var SP_FILTER_LOOKUP = {
  '||(': 'or('
};
var REGEX_SP_FILTER = /[\s]+((\|\|)\()/g;
var REGEX_FIX_FILTER = /(\|)?[\s]+([^\s]+\()/g;

function _getReplaceParam(obj, tmplRule) {
  var pattern = tmplRule.replaceParam,
      matchArr = void 0,
      ret = void 0,
      i = 0;

  while (matchArr = pattern.exec(obj)) {
    if (!ret) {
      ret = [];
    }

    var prop = matchArr[2],
        item = [matchArr[0], matchArr[1], null, true];

    if (i > 0) {
      item[3] = false; //Sign not contain all of placehorder
    }

    //替换特殊过滤器名称并且为简化过滤器补全"|"符
    prop = prop.replace(REGEX_SP_FILTER, function (all, match) {
      return ' ' + SP_FILTER_LOOKUP[match];
    }).replace(REGEX_FIX_FILTER, function (all, s1, s2) {
      return s1 ? all : ' | ' + s2;
    });

    item[2] = prop.trim();
    ret.push(item);
    i++;
  }

  return ret;
}

var REGEX_INNER_BRACKET = /\(([^()]*)\)/g;

function _replaceInnerBrackets(prop, counter, innerBrackets) {
  var propR = prop.replace(REGEX_INNER_BRACKET, function (all, s1) {
    innerBrackets.push(s1);
    return '_njBracket_' + counter++;
  });

  if (propR !== prop) {
    return _replaceInnerBrackets(propR, counter, innerBrackets);
  } else {
    return propR;
  }
}

//Get compiled parameter
function compiledParam(value, tmplRule) {
  var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */](),
      isStr = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](value),
      strs = isStr ? value.split(tmplRule.replaceSplit) : [value],
      props = null,
      isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

  if (isStr) {
    //替换插值变量以外的文本中的换行符
    strs = strs.map(function (str) {
      return str.replace(/\n/g, '_njNl_').replace(/\r/g, '');
    });
  }

  //If have placehorder
  if (strs.length > 1) {
    var params = _getReplaceParam(value, tmplRule);
    props = [];

    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](params, function (param) {
      var retP = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */](),
          innerBrackets = [];

      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      var prop = _replaceInnerBrackets(param[2], 0, innerBrackets);
      retP.prop = _compiledProp(prop, innerBrackets);

      //To determine whether it is necessary to escape
      retP.escape = param[1] !== tmplRule.firstChar + tmplRule.startRule;
      props.push(retP);
    }, false, true);
  }

  ret.props = props;
  ret.strs = strs;
  ret.isAll = isAll;

  return ret;
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__parser_checkElem__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__transforms_transformData__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__buildRuntime__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__parser_checkStringElem__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_createTmplRule__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return compile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return compileH; });
/* unused harmony export precompile */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return renderH; });








//编译模板并返回转换函数
function _createCompile(outputH) {
  return function (tmpl, tmplKey, fileName, delimiters, tmplRule) {
    if (!tmpl) {
      return;
    }
    if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](tmplKey)) {
      var options = tmplKey;
      tmplKey = options.tmplKey;
      fileName = options.fileName;
      delimiters = options.delimiters;
      tmplRule = options.tmplRule;
    }

    //编译模板函数
    var tmplFns = void 0;
    if (tmplKey) {
      tmplFns = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].templates[tmplKey];
    }
    if (!tmplFns) {
      var isObj = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](tmpl),
          fns = void 0;
      if (isObj && tmpl.main) {
        //直接传入预编译模板
        fns = tmpl;
      } else {
        //编译AST
        var root = void 0;
        if (tmplKey) {
          root = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].asts[tmplKey];
        }
        if (!root) {
          //Can be directly introduced into the AST
          if (isObj && tmpl.type === 'nj_root') {
            root = tmpl;
          } else {
            if (!tmplRule) {
              tmplRule = delimiters ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__utils_createTmplRule__["a" /* default */])(delimiters) : __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule;
            }
            root = _createAstRoot();

            //Transform string template to preAst
            if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](tmpl)) {
              //Merge all include tags
              var includeParser = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].includeParser;
              if (includeParser) {
                tmpl = includeParser(tmpl, fileName, tmplRule);
              }

              tmpl = __WEBPACK_IMPORTED_MODULE_5__parser_checkStringElem__["a" /* default */].call({ tmplRule: tmplRule, outputH: outputH }, tmpl);
            }

            //分析传入参数并转换为节点树对象
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__parser_checkElem__["a" /* default */])(tmpl._njTmpl, root, tmplRule);
          }

          //保存模板AST编译结果到全局集合中
          if (tmplKey) {
            __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].asts[tmplKey] = root;
          }
        }

        fns = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__buildRuntime__["a" /* default */])(root.content, root, !outputH);
      }

      tmplFns = __WEBPACK_IMPORTED_MODULE_3__transforms_transformData__["b" /* template */](fns);

      //保存模板函数编译结果到全局集合中
      if (tmplKey) {
        __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].templates[tmplKey] = tmplFns;
      }
    }

    if (tmpl._njParams) {
      var tmplFn = function tmplFn() {
        return tmplFns.main.apply(this, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* arrayPush */]([tmpl._njParams], arguments));
      };
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* defineProp */](tmplFn, '_njTmpl', {
        value: true
      });

      return tmplFn;
    } else {
      return tmplFns.main;
    }
  };
}

var compile = _createCompile();
var compileH = _createCompile(true);

//Create template root object
function _createAstRoot() {
  var root = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */]();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//Precompile template
function precompile(tmpl, outputH, tmplRule) {
  var root = _createAstRoot();

  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](tmpl)) {
    tmpl = __WEBPACK_IMPORTED_MODULE_5__parser_checkStringElem__["a" /* default */].call({ tmplRule: tmplRule, outputH: outputH }, tmpl);
  }
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__parser_checkElem__["a" /* default */])(tmpl._njTmpl, root, tmplRule);

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__buildRuntime__["a" /* default */])(root.content, root, !outputH);
}

function _createRender(outputH) {
  return function (tmpl, options) {
    return (outputH ? compileH : compile)(tmpl, options ? {
      tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
      fileName: options.fileName,
      delimiters: options.delimiters
    } : tmpl._njTmplKey).apply(null, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* arraySlice */](arguments, 1));
  };
}

var render = _createRender();
var renderH = _createRender(true);

__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  compile: compile,
  compileH: compileH,
  precompile: precompile,
  render: render,
  renderH: renderH
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_createTmplRule__ = __webpack_require__(2);



/* harmony default export */ __webpack_exports__["a"] = function (configs) {
  var delimiters = configs.delimiters,
      includeParser = configs.includeParser,
      createElement = configs.createElement,
      outputH = configs.outputH;

  if (delimiters) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_createTmplRule__["a" /* default */])(delimiters, true);
  }

  if (includeParser) {
    __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].includeParser = includeParser;
  }

  if (createElement) {
    __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].createElement = createElement;
  }

  if (outputH != null) {
    __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].outputH = outputH;
  }
};;

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tools__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = registerComponent;



//注册组件
function registerComponent(name, component) {
  var params = name;
  if (!__WEBPACK_IMPORTED_MODULE_1__tools__["k" /* isObject */](name)) {
    params = {};
    params[name] = component;
  }

  __WEBPACK_IMPORTED_MODULE_1__tools__["c" /* each */](params, function (v, k) {
    __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].components[k.toLowerCase()] = v;
  }, false, false);

  return component;
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__parser_checkStringElem__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_createTmplRule__ = __webpack_require__(2);
/* unused harmony export createTaggedTmpl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return taggedTmpl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return taggedTmplH; });





function createTaggedTmpl() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var outputH = opts.outputH,
      delimiters = opts.delimiters;

  var tmplRule = delimiters ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_createTmplRule__["a" /* default */])(delimiters) : __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule;

  return function () {
    return __WEBPACK_IMPORTED_MODULE_2__parser_checkStringElem__["a" /* default */].apply({ tmplRule: tmplRule, outputH: outputH }, arguments);
  };
}

var taggedTmpl = createTaggedTmpl({ outputH: false });
var taggedTmplH = createTaggedTmpl({ outputH: true });

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */])(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  createTaggedTmpl: createTaggedTmpl,
  taggedTmpl: taggedTmpl,
  taggedTmplH: taggedTmplH
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_escape__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_extension__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_filter__ = __webpack_require__(5);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };







var errorTitle = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].errorTitle;


function _buildFn(content, node, fns, no, newContext, level, useStringLocal, name) {
  var fnStr = '',
      useString = useStringLocal != null ? useStringLocal : fns.useString,
      isTmplEx = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](no),
      //如果no为字符串, 则本次将构建tmpl块模板函数
  main = isTmplEx || no === 0,

  /* retType
   1: 只有单个子节点
   2: 有多个子节点
   object: 非构建函数时
  */
  retType = content.length === 1 ? '1' : '2',
      counter = {
    _type: 0,
    _params: 0,
    _paramsE: 0,
    _compParam: 0,
    _dataRefer: 0,
    _ex: 0,
    _value: 0,
    _filter: 0,
    newContext: newContext
  };

  if (!useString) {
    counter._compParam = 0;
  } else {
    counter._children = 0;
  }

  if (!main && newContext) {
    fnStr += 'p2 = p1.newContext(p2, p3);\n';
  }

  if (retType === '2') {
    if (!useString) {
      fnStr += 'var ret = [];\n';
    } else {
      fnStr += 'var ret = \'\';\n';
    }
  }

  fnStr += _buildContent(content, node, fns, counter, retType, level, useStringLocal);

  if (retType === '2') {
    fnStr += 'return ret;';
  }

  /* 构建扩展标签函数
   p1: 模板全局数据
   p2: 节点上下文数据
   p3: 扩展标签内调用result方法传递的参数
   p4: #props变量
   p5：子扩展标签#props变量
  */
  var fn = fns[main ? 'main' + (isTmplEx ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', 'p5', fnStr);
  if (isTmplEx && name != null) {
    //设置函数名
    fn._njName = name;
  }
  return no;
}

function _buildOptions(config, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, hashProps) {
  var hashStr = ', useString: ' + (useStringLocal == null ? 'p1.useString' : useStringLocal ? 'true' : 'false'),
      noConfig = !config;

  if (node) {
    //扩展标签
    var newContext = config ? config.newContext : true;
    if (noConfig || config.exProps) {
      hashStr += ', exProps: ' + exPropsStr;
    }
    if (noConfig || config.subExProps) {
      hashStr += ', subExProps: ' + subExPropsStr;
    }

    hashStr += ', result: ' + (node.content ? 'p1.exRet(p1, p2, p1.fn' + _buildFn(node.content, node, fns, ++fns._no, newContext, level, useStringLocal) + ', ' + exPropsStr + ', ' + subExPropsStr + ')' : 'p1.noop');

    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
  }

  return '{ _njOpts: true, _njFnsNo: ' + fns._no + ', global: p1, context: p2, outputH: ' + !fns.useString + hashStr + ' }';
}

var CUSTOM_VAR = 'nj_custom';

function _buildPropData(obj, counter, fns, useStringLocal, level) {
  var dataValueStr = void 0,
      escape = obj.escape,
      isEmpty = false,
      special = false;
  var _obj$prop = obj.prop,
      jsProp = _obj$prop.jsProp,
      isComputed = _obj$prop.isComputed;

  //先生成数据值

  if (obj.prop.isBasicType) {
    dataValueStr = obj.prop.name + jsProp;
  } else if (obj.prop.isEmpty) {
    isEmpty = true;
  } else {
    var _obj$prop2 = obj.prop,
        name = _obj$prop2.name,
        parentNum = _obj$prop2.parentNum;

    var data = '',
        specialP = false;

    switch (name) {
      case '@index':
        data = 'index';
        special = true;
        break;
      case 'this':
        data = 'data[0]';
        special = true;
        break;
      case '@data':
        data = 'data';
        special = true;
        break;
      case '@global':
        data = 'p1.global';
        special = CUSTOM_VAR;
        break;
      case '@lt':
        data = '\'<\'';
        special = CUSTOM_VAR;
        break;
      case '@gt':
        data = '\'>\'';
        special = CUSTOM_VAR;
        break;
      case '@lb':
        data = '\'{\'';
        special = CUSTOM_VAR;
        break;
      case '@rb':
        data = '\'}\'';
        special = CUSTOM_VAR;
        break;
    }

    if (parentNum) {
      if (!data) {
        data = 'data';
      }
      for (var i = 0; i < parentNum; i++) {
        data = 'parent.' + data;
      }

      if (!special) {
        specialP = true;
      }
    }

    if (!special && !specialP) {
      dataValueStr = (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\')' + (isComputed ? ', p2, ' + level + ')' : '') + jsProp;
    } else {
      var dataStr = special === CUSTOM_VAR ? data : 'p2.' + data;
      dataValueStr = (special ? dataStr : (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\', ' + dataStr + ')' + (isComputed ? ', p2, ' + level + ')' : '')) + jsProp;
    }
  }
  if (dataValueStr) {
    dataValueStr = _replaceBackslash(dataValueStr);
  }

  //有过滤器时需要生成"_value"值
  var filters = obj.prop.filters;
  if (filters) {
    var _ret = function () {
      var valueStr = '_value' + counter._value++,
          filterStr = 'var ' + valueStr + ' = ' + (!isEmpty ? dataValueStr : 'null') + ';\n';

      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](filters, function (o) {
        var _filterC = counter._filter++,
            configF = __WEBPACK_IMPORTED_MODULE_5__helpers_filter__["b" /* filterConfig */][o.name],
            filterVarStr = '_filter' + _filterC,
            globalFilterStr = 'p1.filters[\'' + o.name + '\']',
            filterStrI = '';

        if (configF && configF.onlyGlobal) {
          //只能从全局获取
          filterStr += '\nvar ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
        } else {
          //优先从p2.data中获取
          filterStr += '\nvar ' + filterVarStr + ' = p2.getData(\'' + o.name + '\');\n';
          filterStr += 'if(!' + filterVarStr + ') ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
        }
        filterStr += 'if (!' + filterVarStr + ') {\n';
        filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
        filterStr += '}\n';
        filterStr += 'else {\n';

        var _filterStr = '  ' + valueStr + ' = ' + filterVarStr + '.apply(p2, [' + (!isEmpty ? valueStr + ', ' : '') + (o.params && o.params.length ? o.params.reduce(function (p, c) {
          var propStr = _buildPropData({
            prop: c,
            escape: escape
          }, counter, fns, useStringLocal, level);

          if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](propStr)) {
            return p + propStr + ', ';
          } else {
            filterStrI += propStr.filterStr;
            return p + propStr.valueStr + ', ';
          }
        }, '') : '') + _buildOptions(configF, useStringLocal, null, fns) + ']);\n';

        if (filterStrI !== '') {
          filterStr += filterStrI;
        }
        filterStr += _filterStr;
        filterStr += '}\n';
      }, false, true);

      return {
        v: {
          valueStr: _buildEscape(valueStr, fns, isComputed ? false : escape, special),
          filterStr: filterStr
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return _buildEscape(dataValueStr, fns, isComputed ? false : escape, special);
  }
}

function _buildEscape(valueStr, fns, escape, special) {
  if (fns.useString) {
    if (escape && special !== CUSTOM_VAR) {
      return 'p1.escape(' + valueStr + ')';
    } else {
      return valueStr;
    }
  } else {
    //文本中的特殊字符需转义
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_escape__["a" /* unescape */])(valueStr);
  }
}

function _replaceStrs(str) {
  return _replaceBackslash(str).replace(/_njNl_/g, '\\n').replace(/'/g, "\\'");
}

function _replaceBackslash(str) {
  return str = str.replace(/\\/g, '\\\\');
}

function _buildProps(obj, counter, fns, useStringLocal, level) {
  var str0 = obj.strs[0],
      valueStr = '',
      filterStr = '';

  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](str0)) {
    //常规属性
    valueStr = !obj.isAll && str0 !== '' ? '\'' + _replaceStrs(str0) + '\'' : '';
    filterStr = '';

    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](obj.props, function (o, i) {
      var propData = _buildPropData(o, counter, fns, useStringLocal, level),
          dataValueStr = void 0;
      if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](propData)) {
        dataValueStr = propData;
      } else {
        dataValueStr = propData.valueStr;
        filterStr += propData.filterStr;
      }

      if (!obj.isAll) {
        var strI = obj.strs[i + 1],
            prefixStr = str0 === '' && i == 0 ? '' : ' + ';

        // if (strI.trim() === '\\n') { //如果只包含换行符号则忽略
        //   valueStr += prefixStr + dataValueStr;
        //   return;
        // }

        dataValueStr = prefixStr + '(' + dataValueStr + ')' + (strI !== '' ? ' + \'' + _replaceStrs(strI) + '\'' : '');
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true);
  } else if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](str0) && str0._njLen != null) {
    //tmpl标签
    valueStr += '{\n';
    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](str0, function (v, k, i, l) {
      if (k !== '_njLen') {
        var hasName = k.indexOf('_njT') !== 0,
            fnStr = 'p1.main' + _buildFn(v.node.content, v.node, fns, 'T' + ++fns._noT, null, null, null, hasName ? k : null);

        valueStr += '  "' + v.no + '": ' + fnStr;
        if (hasName) {
          valueStr += ',\n  "' + k + '": ' + fnStr;
        }
      } else {
        valueStr += '  length: ' + v;
      }

      valueStr += ',\n';
      if (i === l - 1) {
        //传递上下文参数
        valueStr += '  _njData: p2.data,\n  _njParent: p2.parent,\n  _njIndex: p2.index\n';
      }
    }, false, false);
    valueStr += '}';
  }

  if (filterStr === '') {
    return valueStr;
  } else {
    //包含过滤器
    return {
      valueStr: valueStr,
      filterStr: filterStr
    };
  }
}

function _buildPropsEx(isSub, paramsEC, propsEx, fns, counter, useString, exPropsStr, subExPropsStr) {
  var paramsStr = 'var _paramsE' + paramsEC + ' = {};\n';

  var ret = {};
  if (isSub) {
    ret._paramsE = exPropsStr;
    ret._paramsSE = '_paramsE' + paramsEC;
  } else {
    ret._paramsE = '_paramsE' + paramsEC;
    ret._paramsSE = subExPropsStr;
  }

  //props标签的子节点
  paramsStr += _buildContent(propsEx.content, propsEx, fns, counter, ret, null, useString);
  return paramsStr;
}

function _buildParams(node, fns, counter, useString, level, exPropsStr, subExPropsStr) {
  //节点参数
  var params = node.params,
      paramsEx = node.paramsEx,
      propsExS = node.propsExS;

  var useStringF = fns.useString,
      hasPropsEx = paramsEx || propsExS;
  var paramsStr = '',
      _paramsC = void 0;

  if (params || hasPropsEx) {
    _paramsC = counter._params++;
    paramsStr = 'var _params' + _paramsC + ' = ';

    //props tag
    if (hasPropsEx) {
      var bothPropsEx = paramsEx && propsExS,
          _paramsEC = void 0,
          _paramsSEC = void 0;
      paramsStr += (useString ? '\'\'' : bothPropsEx ? '{}' : 'null') + ';\n';

      if (paramsEx) {
        _paramsEC = counter._paramsE++;
        paramsStr += _buildPropsEx(false, _paramsEC, paramsEx, fns, counter, useString, exPropsStr, subExPropsStr);
      }
      if (propsExS) {
        _paramsSEC = counter._paramsE++;
        paramsStr += _buildPropsEx(true, _paramsSEC, propsExS, fns, counter, useString, exPropsStr, subExPropsStr);
      }

      //合并params块的值
      if (!useString) {
        if (bothPropsEx) {
          paramsStr += '\np1.assign(_params' + _paramsC + ', _paramsE' + _paramsEC + ', _paramsE' + _paramsSEC + ');\n';
        } else {
          paramsStr += '\n_params' + _paramsC + ' = _paramsE' + (_paramsEC != null ? _paramsEC : _paramsSEC) + ';\n';
        }
      } else {
        var keys = '';
        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](params, function (v, k, i, l) {
          if (i == 0) {
            keys += '{ ';
          }
          keys += k + ': 1';

          if (i < l - 1) {
            keys += ', ';
          } else {
            keys += ' }';
          }
        }, false, false);

        paramsStr += '\n_params' + _paramsC + ' += p1.assignStrProps(_paramsE' + _paramsEC + ', ' + (keys === '' ? 'null' : keys) + ');\n';
      }
    }

    if (params) {
      (function () {
        var paramKeys = Object.keys(params),
            len = paramKeys.length,
            filterStr = '';

        if (!useString && !hasPropsEx) {
          paramsStr += '{\n';
        }

        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](paramKeys, function (k, i) {
          var valueStr = _buildProps(params[k], counter, fns, useString, level);
          if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](valueStr)) {
            filterStr += valueStr.filterStr;
            valueStr = valueStr.valueStr;
          }

          if (!useStringF && k === 'style') {
            //将style字符串转换为对象
            valueStr = 'p1.styleProps(' + valueStr + ')';
          }

          var key = _replaceStrs(k),
              onlyKey = '\'' + key + '\'' === valueStr;
          if (!useStringF) {
            key = __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__["a" /* fixPropName */](key);
          }
          if (!hasPropsEx) {
            if (!useString) {
              paramsStr += '  \'' + key + '\': ' + (!onlyKey ? valueStr : 'true') + (i < len - 1 ? ',\n' : '');
            } else {
              paramsStr += (i > 0 ? '  + ' : '') + '\' ' + key + (!onlyKey ? '="\' + ' + valueStr + ' + \'"\'' : ' \'') + (i == len - 1 ? ';' : '') + '\n';
            }
          } else {
            if (!useString) {
              paramsStr += '_params' + _paramsC + '[\'' + key + '\'] = ' + (!onlyKey ? valueStr : 'true') + ';\n';
            } else {
              paramsStr += '_params' + _paramsC + ' += \' ' + key + (!onlyKey ? '="\' + ' + valueStr + ' + \'"\'' : ' \'') + ';\n';
            }
          }
        }, false, false);

        if (!useString && !hasPropsEx) {
          paramsStr += '\n};\n';
        }

        if (filterStr !== '') {
          paramsStr = filterStr + paramsStr;
        }
      })();
    }
  }

  return [paramsStr, _paramsC];
}

function _buildNode(node, parent, fns, counter, retType, level, useStringLocal, isFirst) {
  var fnStr = '',
      useStringF = fns.useString;

  if (node.type === 'nj_plaintext') {
    //文本节点
    var valueStr = _buildProps(node.content[0], counter, fns, useStringLocal, level),
        filterStr = void 0;
    if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }
    if (valueStr === '') {
      return fnStr;
    }

    var textStr = _buildRender(node, parent, 1, retType, { text: valueStr }, fns, level, useStringLocal, node.allowNewline, isFirst);
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    if (useStringF) {
      fnStr += textStr;
    } else {
      //文本中的特殊字符需转义
      fnStr += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_escape__["a" /* unescape */])(textStr);
    }
  } else if (node.type === 'nj_ex') {
    //扩展标签节点
    var _exC = counter._ex++,
        _dataReferC = counter._dataRefer++,
        dataReferStr = '',
        _filterStr2 = '',
        configE = __WEBPACK_IMPORTED_MODULE_4__helpers_extension__["b" /* extensionConfig */][node.ex],
        exVarStr = '_ex' + _exC,
        globalExStr = 'p1.extensions[\'' + node.ex + '\']';

    if (configE && configE.onlyGlobal) {
      //只能从全局获取
      fnStr += '\nvar ' + exVarStr + ' = ' + globalExStr + ';\n';
    } else {
      //优先从p2.data中获取
      fnStr += '\nvar ' + exVarStr + ' = p2.getData(\'' + node.ex + '\');\n';
      fnStr += 'if(!' + exVarStr + ') ' + exVarStr + ' = ' + globalExStr + ';\n';
    }

    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

    if (node.args) {
      //构建匿名参数
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](node.args, function (arg, i) {
        var valueStr = _buildProps(arg, counter, fns, useStringLocal, level);
        if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](valueStr)) {
          _filterStr2 += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + ',';
      }, false, true);
    }

    //props块
    var exPropsStr = 'p4',
        subExPropsStr = 'p5';
    if (retType) {
      var _paramsE = retType._paramsE,
          _paramsSE = retType._paramsSE;

      if (_paramsE) {
        exPropsStr = _paramsE;
      }
      if (_paramsSE) {
        subExPropsStr = _paramsSE;
      }
    }

    //hash参数
    var retP = _buildParams(node, fns, counter, false, level, exPropsStr, subExPropsStr),
        paramsStr = retP[0],
        _paramsC = retP[1];

    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null);
    dataReferStr += '\n];\n';

    //添加匿名参数
    if (paramsStr !== '') {
      dataReferStr += 'p1.addArgs(_params' + _paramsC + ', _dataRefer' + _dataReferC + ');\n';
    }

    if (_filterStr2 !== '') {
      dataReferStr = _filterStr2 + dataReferStr;
    }

    fnStr += paramsStr + dataReferStr;

    //如果扩展标签不存在则打印警告信息
    fnStr += 'p1.throwIf(_ex' + _exC + ', \'' + node.ex + '\', \'ex\');\n';

    //渲染
    fnStr += _buildRender(node, parent, 2, retType, {
      _ex: _exC,
      _dataRefer: _dataReferC
    }, fns, level, useStringLocal, node.allowNewline, isFirst);
  } else {
    //元素节点
    //节点类型和typeRefer
    var _typeC = counter._type++,
        _type = void 0,
        _typeRefer = void 0;

    if (node.typeRefer) {
      var valueStrT = _buildProps(node.typeRefer, counter, fns, level);
      if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* isObject */](valueStrT)) {
        fnStr += valueStrT.filterStr;
        valueStrT = valueStrT.valueStr;
      }

      _typeRefer = valueStrT;
      _type = node.typeRefer.props[0].prop.name;
    } else {
      _type = node.type;
    }

    var typeStr = void 0;
    if (!useStringF) {
      var _typeL = _type.toLowerCase();
      typeStr = _typeRefer ? 'p1.getElementRefer(' + _typeRefer + ', \'' + _typeL + '\', p1)' : 'p1.getElement(\'' + _typeL + '\', p1)';
    } else {
      typeStr = _typeRefer ? 'p1.getElementName(' + _typeRefer + ', \'' + _type + '\')' : '\'' + _type + '\'';
    }
    fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';

    //节点参数
    var _retP = _buildParams(node, fns, counter, useStringF, level),
        _paramsStr = _retP[0],
        _paramsC2 = _retP[1];
    fnStr += _paramsStr;

    var _compParamC = void 0,
        _childrenC = void 0;
    if (!useStringF) {
      //组件参数
      _compParamC = counter._compParam++;
      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (_paramsStr !== '' ? '_params' + _paramsC2 : 'null') + '];\n';
    } else {
      //子节点字符串
      _childrenC = counter._children++;
      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
    }

    //子节点
    fnStr += _buildContent(node.content, node, fns, counter, !useStringF ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, level != null ? level + 1 : level, useStringLocal);

    //渲染
    fnStr += _buildRender(node, parent, 3, retType, !useStringF ? { _compParam: _compParamC } : { _type: _typeC, _params: _paramsStr !== '' ? _paramsC2 : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level, useStringLocal, node.allowNewline, isFirst);
  }

  return fnStr;
}

function _buildContent(content, parent, fns, counter, retType, level, useStringLocal) {
  var fnStr = '';
  if (!content) {
    return fnStr;
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](content, function (node) {
    var useString = node.useString;

    fnStr += _buildNode(node, parent, fns, counter, retType, level, useString != null ? useString : useStringLocal, fns._firstNode && level == 0);

    if (fns._firstNode) {
      //输出字符串时模板第一个节点前面不加换行符
      fns._firstNode = false;
    }
  }, false, true);

  return fnStr;
}

function _buildRender(node, parent, nodeType, retType, params, fns, level, useStringLocal, allowNewline, isFirst) {
  var retStr = void 0,
      useStringF = fns.useString,
      useString = useStringLocal != null ? useStringLocal : useStringF,
      noLevel = level == null;

  switch (nodeType) {
    case 1:
      //文本节点
      retStr = (!useStringF || allowNewline || noLevel ? '' : isFirst ? parent.type !== 'nj_root' ? 'p1.firstNewline(p2) + ' : '' : '\'\\n\' + ') + _buildLevelSpace(level, fns, allowNewline) + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + params.text;
      break;
    case 2:
      //扩展标签
      retStr = '_ex' + params._ex + '.apply(p2, _dataRefer' + params._dataRefer + ')';
      break;
    case 3:
      //元素节点
      if (!useStringF) {
        retStr = 'p1.h.apply(null, _compParam' + params._compParam + ')';
      } else {
        var levelSpace = _buildLevelSpace(level, fns, allowNewline);
        var content = node.content;

        if (allowNewline && allowNewline !== 'nlElem' || noLevel) {
          retStr = '';
        } else if (isFirst) {
          retStr = parent.type !== 'nj_root' ? 'p1.firstNewline(p2) + ' : '';
        } else {
          retStr = '\'\\n\' + ';
        }

        retStr += levelSpace + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + '\'<\' + _type' + params._type + ' + ' + (params._params != null ? '_params' + params._params + ' + ' : '');
        if (!params._selfClose) {
          retStr += '\'>\'';
          retStr += ' + _children' + params._children + ' + ';
          retStr += (!content || allowNewline || noLevel ? '' : '\'\\n\' + ') + (content ? levelSpace : '') + //如果子节点为空则不输出缩进空格和换行符
          _buildLevelSpaceRt(useStringF, noLevel) + '\'</\' + _type' + params._type + ' + \'>\'';
        } else {
          retStr += '\' />\'';
        }
      }
      break;
  }

  //保存方式
  if (retType === '1') {
    return '\nreturn ' + retStr + ';';
  } else if (retType === '2') {
    if (!useString) {
      return '\nret.push(' + retStr + ');\n';
    } else {
      return '\nret += ' + retStr + ';\n';
    }
  } else if (retType._paramsE || retType._paramsSE) {
    return '\n' + retStr + ';\n';
  } else {
    if (!useStringF) {
      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
    } else {
      return '\n' + retType._children + ' += ' + retStr + ';\n';
    }
  }
}

function _buildLevelSpace(level, fns, allowNewline) {
  var ret = '';
  if (allowNewline && allowNewline !== 'nlElem') {
    return ret;
  }

  if (fns.useString && level != null && level > 0) {
    ret += '\'';
    for (var i = 0; i < level; i++) {
      ret += '  ';
    }
    ret += '\' + ';
  }
  return ret;
}

function _buildLevelSpaceRt(useString, noSpace) {
  if (useString && !noSpace) {
    return 'p1.levelSpace(p2) + ';
  }
  return '';
}

/* harmony default export */ __webpack_exports__["a"] = function (astContent, ast, useString) {
  var fns = {
    useString: useString,
    _no: 0, //扩展标签函数计数
    _noT: 0, //tmpl块模板函数计数
    _firstNode: true
  };

  _buildFn(astContent, ast, fns, fns._no, null, 0);
  return fns;
};

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__ = __webpack_require__(8);
/* harmony export (immutable) */ __webpack_exports__["a"] = checkElem;




var NO_SPLIT_NEWLINE = ['style', 'script', 'textarea', 'pre', 'xmp', 'template', 'noscript'];

function _plainTextNode(obj, parent, parentContent, noSplitNewline, tmplRule) {
  var node = {};
  node.type = 'nj_plaintext';
  node.content = [__WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](obj, tmplRule)];
  node.allowNewline = noSplitNewline;
  parent[parentContent].push(node);
}

//检测元素节点
function checkElem(obj, parent, tmplRule, hasExProps, noSplitNewline, isLast) {
  var parentContent = 'content';

  if (!__WEBPACK_IMPORTED_MODULE_1__utils_tools__["q" /* isArray */](obj)) {
    //判断是否为文本节点
    if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](obj)) {
      if (!noSplitNewline) {
        var strs = obj.split(tmplRule.newlineSplit);
        strs.forEach(function (str, i) {
          str = str.trim();
          str !== '' && _plainTextNode(str, parent, parentContent, noSplitNewline, tmplRule);
        });
      } else {
        _plainTextNode(isLast && parent.allowNewline === 'nlElem' ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["r" /* trimRight */](obj) : obj, parent, parentContent, noSplitNewline, tmplRule);
      }
    } else {
      _plainTextNode(obj, parent, parentContent, noSplitNewline, tmplRule);
    }

    return;
  }

  var node = {},
      first = obj[0];
  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* isString */](first)) {
    //第一个子节点为字符串
    var len = obj.length,
        last = obj[len - 1],
        isElemNode = false,
        ex = void 0,
        exParams = void 0;

    //判断是否为xml标签
    var openTagName = void 0,
        hasCloseTag = false,
        isTmpl = void 0,
        isParamsEx = void 0,
        isProp = void 0,
        isSub = void 0,
        needAddToProps = void 0;

    ex = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["g" /* isEx */](first, tmplRule);
    if (!ex) {
      var xmlOpenTag = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["h" /* getXmlOpenTag */](first, tmplRule);
      if (xmlOpenTag) {
        //tagname为xml标签时,则认为是元素节点
        openTagName = xmlOpenTag[1];
        if (/\/$/.test(openTagName)) {
          openTagName = openTagName.substr(0, openTagName.length - 1);
        }

        if (!__WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["i" /* isXmlSelfCloseTag */](first)) {
          //非自闭合标签才验证是否存在关闭标签
          hasCloseTag = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["j" /* isXmlCloseTag */](last, openTagName);
        } else {
          //自闭合标签
          node.selfCloseTag = true;
        }
        isElemNode = true;
      }
    } else {
      //为扩展标签,也可视为一个元素节点
      var exName = ex[0];
      exParams = ex[1];
      isTmpl = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["k" /* isTmpl */](exName);
      isParamsEx = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["e" /* isParamsEx */](exName);
      if (!isParamsEx) {
        var exConfig = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["f" /* exCompileConfig */](exName);
        isProp = exConfig.isProp;
        isSub = exConfig.isSub;
        needAddToProps = isProp ? !hasExProps : isSub;

        if (exConfig.useString) {
          node.useString = exConfig.useString;
        }
      }

      node.type = 'nj_ex';
      node.ex = exName;
      if (exParams != null && !isTmpl && !isParamsEx) {
        if (!node.args) {
          node.args = [];
        }

        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](exParams, function (param) {
          var key = param.key,
              value = param.value;

          if (key === 'useString') {
            node.useString = !(value === 'false');
            return;
          }

          var paramV = __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](value, tmplRule);
          if (param.onlyBrace) {
            //提取匿名参数
            node.args.push(paramV);
          } else {
            if (!node.params) {
              node.params = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */]();
            }
            node.params[key] = paramV;
          }
        }, false, true);
      }

      isElemNode = true;
    }

    if (isElemNode) {
      //判断是否为元素节点
      var pushContent = true;
      if (noSplitNewline) {
        node.allowNewline = true;
      }

      if (!ex) {
        node.type = openTagName;

        //If open tag has a brace,add the typeRefer param.
        var typeRefer = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["l" /* getInsideBraceParam */](openTagName, tmplRule);
        if (typeRefer) {
          node.typeRefer = __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](typeRefer[0], tmplRule);
        }

        //获取openTag内参数
        var tagParams = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["m" /* getOpenTagParams */](first, tmplRule);
        if (tagParams) {
          if (!node.params) {
            node.params = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* obj */]();
          }

          __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](tagParams, function (param) {
            //The parameter like "{prop}" needs to be replaced.
            node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](param.value, tmplRule);
          }, false, true);
        }

        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
        if (!node.selfCloseTag) {
          node.selfCloseTag = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["n" /* verifySelfCloseTag */](openTagName);
        }

        if (noSplitNewline == null && NO_SPLIT_NEWLINE.indexOf(openTagName.toLowerCase()) > -1) {
          noSplitNewline = true;
          node.allowNewline = 'nlElem';
        }
      } else {
        if (isTmpl) {
          //模板元素
          pushContent = false;

          //将模板添加到父节点的params中
          __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["o" /* addTmpl */](node, parent, exParams ? exParams[0].value : null);
        } else if (isParamsEx || needAddToProps) {
          pushContent = false;
        }

        if (noSplitNewline == null && node.ex === 'pre') {
          noSplitNewline = true;
          node.allowNewline = 'nlElem';
        }
      }

      //放入父节点content内
      if (pushContent) {
        parent[parentContent].push(node);
      }

      //取出子节点集合
      var end = len - (hasCloseTag ? 1 : 0),
          content = obj.slice(1, end);
      if (content && content.length) {
        _checkContentElem(content, node, tmplRule, isParamsEx || hasExProps && !isProp, noSplitNewline, tmplRule);
      }

      //If this is params block, set on the "paramsEx" property of the parent node.
      if (isParamsEx || needAddToProps) {
        __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["p" /* addParamsEx */](node, parent, isProp, isSub);
      }
    } else {
      //如果不是元素节点,则为节点集合
      _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline);
    }
  } else if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["q" /* isArray */](first)) {
    //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
    _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline);
  }
}

//检测子元素节点
function _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline) {
  if (!parent.content) {
    parent.content = [];
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* each */](obj, function (item, i, l) {
    checkElem(item, parent, tmplRule, hasExProps, noSplitNewline, i == l - 1);
  }, false, true);
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_registerComponent__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_createTmplRule__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_escape__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_extension__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "registerExtension", function() { return __WEBPACK_IMPORTED_MODULE_6__helpers_extension__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_filter__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "registerFilter", function() { return __WEBPACK_IMPORTED_MODULE_7__helpers_filter__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__compiler_compile__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compile", function() { return __WEBPACK_IMPORTED_MODULE_8__compiler_compile__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compileH", function() { return __WEBPACK_IMPORTED_MODULE_8__compiler_compile__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return __WEBPACK_IMPORTED_MODULE_8__compiler_compile__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "renderH", function() { return __WEBPACK_IMPORTED_MODULE_8__compiler_compile__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_taggedTmpl__ = __webpack_require__(13);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "taggedTmpl", function() { return __WEBPACK_IMPORTED_MODULE_9__utils_taggedTmpl__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "taggedTmplH", function() { return __WEBPACK_IMPORTED_MODULE_9__utils_taggedTmpl__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "registerComponent", function() { return __WEBPACK_IMPORTED_MODULE_2__utils_registerComponent__["a"]; });







__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */])(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  registerComponent: __WEBPACK_IMPORTED_MODULE_2__utils_registerComponent__["a" /* default */],
  createTmplRule: __WEBPACK_IMPORTED_MODULE_3__utils_createTmplRule__["a" /* default */],
  config: __WEBPACK_IMPORTED_MODULE_4__config__["a" /* default */]
});

var _global = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].global;

_global.NornJ = _global.nj = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */];






/* harmony default export */ __webpack_exports__["default"] = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */];

/***/ })
/******/ ]);
});