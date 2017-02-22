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
/* harmony export (immutable) */ __webpack_exports__["a"] = nj;
function nj() {
  return nj['tmplTag' + (nj.outputH ? 'H' : '')].apply(null, arguments);
}

nj.createElement = null;
nj.components = {};
nj.asts = {};
nj.templates = {};
nj.tmplStrs = {};
nj.errorTitle = '[NornJ]';
nj.tmplRule = {};
nj.outputH = false;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defineProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return defineProps; });
/* harmony export (immutable) */ __webpack_exports__["d"] = arrayPush;
/* harmony export (immutable) */ __webpack_exports__["e"] = arraySlice;
/* harmony export (immutable) */ __webpack_exports__["f"] = isArray;
/* harmony export (immutable) */ __webpack_exports__["g"] = isObject;
/* harmony export (immutable) */ __webpack_exports__["h"] = isString;
/* harmony export (immutable) */ __webpack_exports__["i"] = isArrayLike;
/* harmony export (immutable) */ __webpack_exports__["j"] = each;
/* harmony export (immutable) */ __webpack_exports__["q"] = trimRight;
/* harmony export (immutable) */ __webpack_exports__["k"] = noop;
/* harmony export (immutable) */ __webpack_exports__["o"] = throwIf;
/* harmony export (immutable) */ __webpack_exports__["p"] = warn;
/* harmony export (immutable) */ __webpack_exports__["l"] = obj;
/* harmony export (immutable) */ __webpack_exports__["n"] = clearQuot;
/* harmony export (immutable) */ __webpack_exports__["m"] = toCamelCase;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return assign; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var nativeArrayPush = Array.prototype.push,
    nativeArraySlice = Array.prototype.slice,
    hasOwnProperty = Object.prototype.hasOwnProperty;
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

var REGEX_TRIM_RIGHT = /[\s\xA0]+$/;
function trimRight(str) {
  return str.replace(REGEX_TRIM_RIGHT, '');
}

//Noop function
function noop() {}

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return exprs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return exprConfig; });
/* harmony export (immutable) */ __webpack_exports__["c"] = registerExpr;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





//Global expression list
var exprs = {
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
              __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](props.elseifs, function (elseif, i) {
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
    return options.exprProps['else'] = options.result;
  },

  'elseif': function elseif(value, options) {
    var exprProps = options.exprProps;
    if (!exprProps.elseifs) {
      exprProps.elseifs = [];
    }
    exprProps.elseifs.push({
      value: value,
      fn: options.result
    });
  },

  'switch': function _switch(value, options) {
    var ret = void 0,
        props = options.props,
        l = props.elseifs.length;

    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](props.elseifs, function (elseif, i) {
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
    return exprs['if'](value, options);
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
        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](list, function (item, index, len) {
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

    options.exprProps[options.outputH ? __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__["b" /* fixPropName */](name) : name] = value;
  },

  //Spread parameters
  spread: function spread(props, options) {
    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](props, function (v, k) {
      options.exprProps[k] = v;
    }, false, false);
  },

  'for': function _for(start, end, options) {
    if (end._njOpts) {
      options = end;
      end = start;
      start = 0;
    }

    var ret = void 0,
        useString = options.useString;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; start <= end; start++) {
      var retI = options.result({
        index: start
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
      var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["e" /* arraySlice */](args, 0, last);
      if (options.useString) {
        ret = ret.join('');
      }

      return ret;
    } else {
      return [options.result()];
    }
  },

  block: function block(options) {
    return options.result();
  },

  pre: function pre(options) {
    return options.result();
  },

  'with': function _with(name, options) {
    var props = options.props,
        originalData = this.getData(name);

    return options.result({
      data: props && props.as ? _defineProperty({}, props.as, originalData) : originalData
    });
  }
};

function _commonConfig(params) {
  var ret = {
    useString: true,
    exprProps: false,
    isProp: false,
    newContext: true
  };

  if (params) {
    ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](ret, params);
  }
  return ret;
}

//Expression default config
var exprConfig = {
  'if': _commonConfig({ newContext: false }),
  'else': _commonConfig({ newContext: false, useString: false, exprProps: true }),
  'switch': _commonConfig({ newContext: false }),
  unless: _commonConfig({ newContext: false }),
  each: _commonConfig(),
  prop: _commonConfig({ newContext: false, exprProps: true, isProp: true }),
  spread: _commonConfig({ newContext: false, useString: false, exprProps: true, isProp: true }),
  'for': _commonConfig(),
  obj: _commonConfig({ newContext: false, useString: false }),
  'with': _commonConfig({ useString: false })
};
exprConfig.elseif = _commonConfig(exprConfig['else']);
exprConfig.list = _commonConfig(exprConfig.if);
exprConfig.block = _commonConfig(exprConfig.obj);
exprConfig.pre = _commonConfig(exprConfig.obj);

//Expression alias
exprs['case'] = exprs.elseif;
exprConfig['case'] = exprConfig.elseif;
exprs['default'] = exprs['else'];
exprConfig['default'] = exprConfig['else'];

//Register expression and also can batch add
function registerExpr(name, expr, options) {
  var params = name;
  if (!__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](name)) {
    params = {};
    params[name] = {
      expr: expr,
      options: options
    };
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](params, function (v, name) {
    if (v) {
      var _expr = v.expr,
          _options = v.options;


      if (_expr || _options) {
        if (_expr) {
          exprs[name] = _expr;
        }
        if (_options) {
          exprConfig[name] = _commonConfig(_options);
        }
      } else {
        exprs[name] = v;
      }
    }
  }, false, false);
}

__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  exprs: exprs,
  exprConfig: exprConfig,
  registerExpr: registerExpr
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* unused harmony export styleProps */
/* unused harmony export getData */
/* unused harmony export getComputedData */
/* unused harmony export newContext */
/* harmony export (immutable) */ __webpack_exports__["b"] = fixPropName;
/* unused harmony export assignStringProp */
/* unused harmony export exprRet */
/* unused harmony export tmplWrap */
/* harmony export (immutable) */ __webpack_exports__["a"] = template;


var errorTitle = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].errorTitle;

//提取style内参数

function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](obj)) {
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

//Rebuild local variables in the new context
function newContext(p2, p3) {
  var newData = [];
  if (p3 && 'data' in p3) {
    newData.push(p3.data);
  }
  if (p3 && 'extra' in p3) {
    newData.push(p3.extra);
  }

  return {
    data: newData.length ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* arrayPush */](newData, p2.data) : p2.data,
    parent: p3 && p3.fallback ? p2 : p2.parent,
    index: p3 && 'index' in p3 ? p3.index : p2.index,
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
function assignStringProp(paramsE, keys) {
  var ret = '';
  for (var k in paramsE) {
    if (!keys || !keys[k]) {
      var v = paramsE[k];
      ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
    }
  }
  return ret;
}

//创建块表达式子节点函数
function exprRet(p1, p2, fn, p4) {
  return function (param) {
    return fn(p1, p2, param, p4);
  };
}

//构建可运行的模板函数
function tmplWrap(configs, main) {
  return function () {
    var initCtx = this,
        data = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["e" /* arraySlice */](arguments);

    return main(configs, {
      data: initCtx && initCtx._njData ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* arrayPush */](data, initCtx._njData) : data,
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
    exprs: __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].exprs,
    filters: __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].filters,
    noop: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["k" /* noop */],
    obj: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */],
    throwIf: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["o" /* throwIf */],
    warn: __WEBPACK_IMPORTED_MODULE_1__utils_tools__["p" /* warn */],
    newContext: newContext,
    getComputedData: getComputedData,
    styleProps: styleProps,
    exprRet: exprRet
  };

  if (!configs.useString) {
    configs.h = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].createElement;
    configs.components = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].components;
  } else {
    configs.assignStringProp = assignStringProp;
    configs.escape = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].escape;
    configs.levelSpace = levelSpace;
    configs.firstNewline = firstNewline;
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](fns, function (v, k) {
    if (k.indexOf('main') === 0) {
      //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
      configs[k]._njTmpl = true;
      configs['_' + k] = v;
    } else if (k.indexOf('fn') === 0) {
      //块表达式函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return filters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return filterConfig; });
/* harmony export (immutable) */ __webpack_exports__["c"] = registerFilter;



//Global filter list
var filters = {
  //Get param properties
  prop: function prop(val, _prop) {
    if (val != null) {
      return val[_prop];
    }

    return val;
  },

  '==': function _(val1, val2) {
    return val1 == val2;
  },

  '===': function _(val1, val2) {
    return val1 === val2;
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

  //Execute method
  '#': function _(val, method) {
    if (val != null) {
      var args = arguments;
      return val[method].apply(val, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["e" /* arraySlice */](args, 2, args.length - 1));
    }

    return val;
  }
};


function _commonConfig(params) {
  var ret = {
    useString: false
  };

  if (params) {
    ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](ret, params);
  }
  return ret;
}

//Filter default config
var filterConfig = {
  prop: _commonConfig(),
  '==': _commonConfig(),
  '===': _commonConfig(),
  lt: _commonConfig(),
  lte: _commonConfig(),
  gt: _commonConfig(),
  gte: _commonConfig(),
  '+': _commonConfig(),
  '-': _commonConfig(),
  '?': _commonConfig(),
  '!': _commonConfig(),
  '&&': _commonConfig(),
  or: _commonConfig(),
  int: _commonConfig(),
  float: _commonConfig(),
  bool: _commonConfig(),
  '#': _commonConfig()
};

//Register filter and also can batch add
function registerFilter(name, filter, options) {
  var params = name;
  if (!__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](name)) {
    params = {};
    params[name] = {
      filter: filter,
      options: options
    };
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](params, function (v, name) {
    if (v) {
      var _filter = v.filter,
          _options = v.options;


      if (_filter || _options) {
        if (_filter) {
          filters[name] = _filter;
        }
        if (_options) {
          filterConfig[name] = _commonConfig(_options);
        }
      } else {
        filters[name] = v;
      }
    }
  }, false, false);
}

__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  filters: filters,
  filterConfig: filterConfig,
  registerFilter: registerFilter
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tools__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = escape;
/* harmony export (immutable) */ __webpack_exports__["b"] = unescape;



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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tools__ = __webpack_require__(1);



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

/* harmony default export */ __webpack_exports__["a"] = function () {
  var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _nj$tmplRule = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule,
      _nj$tmplRule$startRul = _nj$tmplRule.startRule,
      startRule = _nj$tmplRule$startRul === undefined ? '{{' : _nj$tmplRule$startRul,
      _nj$tmplRule$endRule = _nj$tmplRule.endRule,
      endRule = _nj$tmplRule$endRule === undefined ? '}}' : _nj$tmplRule$endRule,
      _nj$tmplRule$exprRule = _nj$tmplRule.exprRule,
      exprRule = _nj$tmplRule$exprRule === undefined ? '#' : _nj$tmplRule$exprRule,
      _nj$tmplRule$propRule = _nj$tmplRule.propRule,
      propRule = _nj$tmplRule$propRule === undefined ? '@' : _nj$tmplRule$propRule,
      _nj$tmplRule$template = _nj$tmplRule.templateRule,
      templateRule = _nj$tmplRule$template === undefined ? 'template' : _nj$tmplRule$template,
      _nj$tmplRule$tagSpRul = _nj$tmplRule.tagSpRule,
      tagSpRule = _nj$tmplRule$tagSpRul === undefined ? '#$@' : _nj$tmplRule$tagSpRul,
      _nj$tmplRule$commentR = _nj$tmplRule.commentRule,
      commentRule = _nj$tmplRule$commentR === undefined ? '#' : _nj$tmplRule$commentR;
  var start = rules.start,
      end = rules.end,
      expr = rules.expr,
      prop = rules.prop,
      template = rules.template,
      tagSp = rules.tagSp,
      comment = rules.comment;


  if (start) {
    startRule = start;
  }
  if (end) {
    endRule = end;
  }
  if (expr) {
    exprRule = expr;
  }
  if (prop) {
    propRule = prop;
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
      exprRules = _clearRepeat(exprRule + propRule + tagSpRule),
      escapeExprRule = exprRule.replace(/\$/g, '\\$');

  //Reset the regexs to global list
  __WEBPACK_IMPORTED_MODULE_1__tools__["a" /* assign */](__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule, {
    startRule: startRule,
    endRule: endRule,
    exprRule: exprRule,
    propRule: propRule,
    templateRule: templateRule,
    tagSpRule: tagSpRule,
    commentRule: commentRule,
    firstChar: firstChar,
    lastChar: lastChar,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + exprRules + '][^\\s>]*)[^>]*>$', 'i'),
    openTagParams: _createRegExp('[\\s]+((([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
    insideBraceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'i'),
    spreadProp: _createRegExp('[\\s]+([' + firstChar + ']?' + startRule + ')[\\s]*(\\.\\.\\.[^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'g'),
    replaceSplit: _createRegExp('(?:[' + firstChar + ']?' + startRule + ')[^' + allRules + ']+(?:' + endRule + '[' + lastChar + ']?)'),
    replaceParam: _createRegExp('(([' + firstChar + ']?' + startRule + '))([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'g'),
    checkElem: _createRegExp('([^>]*)(<([a-z/!' + firstChar + exprRules + '][^\\s>]*)([^>]*)>)([^<]*)', 'ig'),
    expr: _createRegExp('^' + escapeExprRule + '([^\\s]+)', 'i'),
    include: _createRegExp('<' + escapeExprRule + 'include([^>]*)>', 'ig'),
    newlineSplit: _createRegExp('\\\\n(?![^' + firstChar + lastChar + ']*' + lastChar + ')', 'g')
  });
};

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformElement__ = __webpack_require__(8);
/* harmony export (immutable) */ __webpack_exports__["a"] = compileStringTmpl;



var tmplRule = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule,
    tmplStrs = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplStrs;

var SPLIT_FLAG = '_nj_split';

//Compile string template
function compileStringTmpl(tmpl) {
  var tmplKey = tmpl.toString(),
      //Get unique key
  ret = tmplStrs[tmplKey],
      outputH = this ? this.outputH : false;

  if (!ret) {
    (function () {
      //If the cache already has template data, direct return the template.
      var isStr = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](tmpl),
          xmls = isStr ? [tmpl] : tmpl,
          l = xmls.length,
          fullXml = '';

      //Connection xml string
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](xmls, function (xml, i) {
        var split = '';
        if (i < l - 1) {
          var last = xml.length - 1,
              lastChar = xml[last],
              isComputed = lastChar === '#';

          if (isComputed) {
            xml = xml.substr(0, last);
          }

          split = tmplRule.startRule + (isComputed ? '#' : '') + SPLIT_FLAG + i + tmplRule.endRule;
        }

        fullXml += xml + split;
      }, false, true);

      fullXml = _formatAll(fullXml);

      //Resolve string to element
      ret = _checkStringElem(fullXml);
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* defineProp */](ret, '_njParamCount', {
        value: l - 1
      });

      //Save to the cache
      tmplStrs[tmplKey] = ret;
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
    return __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */]['compile' + (outputH ? 'H' : '')](tmplFn, tmplKey).apply(this, params ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* arrayPush */]([params], arguments) : arguments);
  };
  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c" /* defineProps */](tmplFn, {
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

//Resolve string to element
function _checkStringElem(xml) {
  var root = [],
      current = {
    elem: root,
    elemName: 'root',
    parent: null
  },
      parent = null,
      pattern = tmplRule.checkElem,
      matchArr = void 0;

  while (matchArr = pattern.exec(xml)) {
    var textBefore = matchArr[1],
        elem = matchArr[2],
        elemName = matchArr[3],
        elemParams = matchArr[4],
        textAfter = matchArr[5];

    //Text before tag
    if (textBefore && textBefore !== '\n') {
      textBefore = _formatNewline(textBefore);
      _setText(textBefore, current.elem);
    }

    //Element tag
    if (elem) {
      if (elem.indexOf('<!') === 0) {
        //doctype等标签当做文本处理
        _setText(_formatNewline(elem), current.elem);
      } else {
        if (elemName[0] === '/') {
          //Close tag
          if (elemName === '/' + current.elemName) {
            current = current.parent;
          }
        } else if (elem[elem.length - 2] === '/') {
          //Self close tag
          _setSelfCloseElem(elem, elemName, elemParams, current.elem);
        } else {
          //Open tag
          parent = current;
          current = {
            elem: [],
            elemName: elemName,
            parent: parent
          };

          parent.elem.push(current.elem);
          _setElem(elem, elemName, elemParams, current.elem);
        }
      }
    }

    //Text after tag
    if (textAfter && textAfter !== '\n') {
      textAfter = _formatNewline(textAfter);
      _setText(textAfter, current.elem);
    }
  }

  return root;
}

var SP_FILTER_LOOKUP = {
  '>(': 'gt(',
  '<(': 'lt(',
  '>=(': 'gte(',
  '<=(': 'lte(',
  '||(': 'or('
};

function _formatAll(str) {
  var commentRule = tmplRule.commentRule;
  return str.replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '').replace(/\|[\s]*((>|<|>=|<=|\|\|)\()/g, function (all, match) {
    return '| ' + SP_FILTER_LOOKUP[match];
  });
}

function _formatNewline(str) {
  return str.replace(/\n/g, '\\n').replace(/\r/g, '');
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose) {
  var ret = void 0,
      paramsExpr = void 0;
  if (elemName[0] === tmplRule.exprRule) {
    ret = elem.substring(1, elem.length - 1);
  } else if (elemName.indexOf(tmplRule.propRule) === 0) {
    ret = tmplRule.exprRule + 'prop ' + tmplRule.startRule + '\'' + elemName.substr(tmplRule.propRule.length) + '\'' + tmplRule.endRule + elemParams;
  } else {
    var retS = _getSplitParams(elem);
    ret = retS.elem;
    paramsExpr = retS.params;
  }

  if (bySelfClose) {
    var retC = [ret];
    if (paramsExpr) {
      retC.push(paramsExpr);
    }

    elemArr.push(retC);
  } else {
    elemArr.push(ret);
    if (paramsExpr) {
      elemArr.push(paramsExpr);
    }
  }
}

//Extract split parameters
function _getSplitParams(elem) {
  var exprRule = tmplRule.exprRule,
      startRule = tmplRule.startRule,
      endRule = tmplRule.endRule;

  var paramsExpr = void 0;

  //Replace the parameter like "{...props}".
  elem = elem.replace(tmplRule.spreadProp, function (all, begin, prop) {
    prop = prop.trim();

    if (!paramsExpr) {
      paramsExpr = [exprRule + 'props'];
    }

    paramsExpr.push([exprRule + 'spread ' + startRule + prop.replace(/\.\.\./g, '') + endRule + '/']);
    return ' ';
  });

  return {
    elem: elem,
    params: paramsExpr
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr) {
  _setElem(elem, elemName, elemParams, elemArr, true);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_expression__ = __webpack_require__(2);
/* harmony export (immutable) */ __webpack_exports__["b"] = getXmlOpenTag;
/* harmony export (immutable) */ __webpack_exports__["c"] = isXmlSelfCloseTag;
/* harmony export (immutable) */ __webpack_exports__["j"] = verifySelfCloseTag;
/* harmony export (immutable) */ __webpack_exports__["i"] = getOpenTagParams;
/* harmony export (immutable) */ __webpack_exports__["d"] = isXmlCloseTag;
/* harmony export (immutable) */ __webpack_exports__["h"] = getInsideBraceParam;
/* harmony export (immutable) */ __webpack_exports__["a"] = isExpr;
/* harmony export (immutable) */ __webpack_exports__["e"] = isTmpl;
/* harmony export (immutable) */ __webpack_exports__["k"] = addTmpl;
/* harmony export (immutable) */ __webpack_exports__["f"] = isParamsExpr;
/* harmony export (immutable) */ __webpack_exports__["l"] = addParamsExpr;
/* harmony export (immutable) */ __webpack_exports__["g"] = isExprProp;




var tmplRule = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule;

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
      value = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["n" /* clearQuot */](value); //Remove quotation marks
    } else {
      value = key; //Match to Similar to "checked" or "disabled" attribute.
    }

    //Removed at the end of "/>", ">" or "/".
    if (/\/>$/.test(value)) {
      value = value.substr(0, value.length - 2);
    } else if (/>$/.test(value) || /\/$/.test(value)) {
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
  return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](obj) && obj.toLowerCase() === '</' + tagName + '>';
}

//get inside brace param
function getInsideBraceParam(obj) {
  return tmplRule.insideBraceParam.exec(obj);
}

//判断块表达式并返回参数
function isExpr(obj) {
  var ret = void 0,
      ret1 = tmplRule.expr.exec(obj);
  if (ret1) {
    ret = [ret1[1]];

    var params = getOpenTagParams(obj); //提取各参数
    if (params) {
      ret.push(params);
    }
  }

  return ret;
}

//判断是否模板元素
function isTmpl(obj) {
  return obj === 'tmpl';
}

//加入到模板集合中
function addTmpl(node, parent, name) {
  var paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();
  }

  var tmpls = paramsP.tmpls;
  if (!tmpls) {
    var objT = { length: 0 };
    if (name != null) {
      objT[name] = node;
    } else {
      objT['0'] = node;
      objT.length = 1;
    }

    paramsP.tmpls = __WEBPACK_IMPORTED_MODULE_2__transformParam__["a" /* compiledParam */](objT);
  } else {
    //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
    var _objT = tmpls.strs[0],
        len = _objT.length;

    if (name != null) {
      _objT[name] = node;
    } else {
      _objT[len] = node;
      _objT.length = ++len;
    }
  }
}

//Test whether as parameters expression
function isParamsExpr(name) {
  return name === 'params' || name === 'props';
}

//Add to the "paramsExpr" property of the parent node
function addParamsExpr(node, parent, isExprProp) {
  if (!parent.paramsExpr) {
    var exprPropsNode = void 0;
    if (isExprProp) {
      exprPropsNode = {
        type: 'nj_expr',
        expr: 'props',
        content: [node]
      };
    } else {
      exprPropsNode = node;
    }

    parent.paramsExpr = exprPropsNode;
  } else {
    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* arrayPush */](parent.paramsExpr.content, isExprProp ? [node] : node.content);
  }
}

function isExprProp(name) {
  var config = __WEBPACK_IMPORTED_MODULE_3__helpers_expression__["b" /* exprConfig */][name];
  return {
    isExprProp: config ? config.exprProps : false,
    isProp: config ? config.isProp : false
  };
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* unused harmony export compiledParams */
/* unused harmony export compiledProp */
/* harmony export (immutable) */ __webpack_exports__["a"] = compiledParam;


var tmplRule = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule;

//Get compiled parameters from a object

function compiledParams(obj) {
  var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();
  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](obj, function (v, k) {
    ret[k] = compiledParam(v);
  }, false, false);

  return ret;
}

//Get compiled property
var REGEX_JS_PROP = /(('[^']*')|("[^"]*")|(-?([0-9][0-9]*)(\.\d+)?)|true|false|null|undefined|([#]*)([^.[\]()]+))([^\s()]*)/;

function compiledProp(prop) {
  var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();

  //If there are colons in the property,then use filter
  if (prop.indexOf('|') >= 0) {
    (function () {
      var filters = [],
          filtersTmp = void 0;
      filtersTmp = prop.split('|');
      prop = filtersTmp[0].trim(); //Extract property

      filtersTmp = filtersTmp.slice(1);
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](filtersTmp, function (filter) {
        var retF = _getFilterParam(filter.trim()),
            filterObj = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */](),
            filterName = retF[1]; //Get filter name

        if (filterName) {
          var paramsF = retF[3]; //Get filter param

          //Multiple params are separated by commas.
          if (paramsF) {
            (function () {
              var params = [];
              __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](paramsF.split(','), function (p) {
                params[params.length] = compiledProp(p.trim());
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

  return ret;
}

//Get filter param
var REGEX_FILTER_PARAM = /([^\s()]+)(\(([^()]+)\))*/;

function _getFilterParam(obj) {
  return REGEX_FILTER_PARAM.exec(obj);
}

//Extract replace parameters
var _quots = ['\'', '"'];

function _getReplaceParam(obj, strs) {
  var pattern = tmplRule.replaceParam,
      matchArr = void 0,
      ret = void 0,
      i = 0;

  while (matchArr = pattern.exec(obj)) {
    if (!ret) {
      ret = [];
    }

    var prop = matchArr[3],
        item = [matchArr[0], matchArr[1], null, true];

    if (i > 0) {
      item[3] = false; //Sign not contain all of placehorder
    }

    //Clear parameter at both ends of the space.
    prop = prop.trim();

    item[2] = prop;
    ret.push(item);
    i++;
  }

  return ret;
}

//Get compiled parameter
function compiledParam(value) {
  var ret = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */](),
      strs = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](value) ? value.split(tmplRule.replaceSplit) : [value],
      props = null,
      isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

  //If have placehorder
  if (strs.length > 1) {
    var params = _getReplaceParam(value, strs);
    props = [];

    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](params, function (param) {
      var retP = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();
      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      retP.prop = compiledProp(param[2]);

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__parser_checkElem__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__transforms_transformData__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__buildRuntime__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__parser_checkStringElem__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return compile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return compileH; });
/* harmony export (immutable) */ __webpack_exports__["c"] = precompile;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return renderH; });







//编译模板并返回转换函数
function _createCompile(outputH) {
  return function (tmpl, tmplKey, fileName) {
    if (!tmpl) {
      return;
    }
    if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](tmplKey)) {
      var options = tmplKey;
      tmplKey = options.tmplKey;
      fileName = options.fileName;
    }

    //编译模板函数
    var tmplFns = void 0;
    if (tmplKey) {
      tmplFns = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].templates[tmplKey];
    }
    if (!tmplFns) {
      var isObj = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](tmpl),
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
            root = _createAstRoot();

            //Auto transform string template to array
            if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](tmpl)) {
              //Merge all include blocks
              var includeParser = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].includeParser;
              if (includeParser) {
                tmpl = includeParser(tmpl, fileName);
              }

              tmpl = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__parser_checkStringElem__["a" /* default */])(tmpl);
            }

            //分析传入参数并转换为节点树对象
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__parser_checkElem__["a" /* default */])(tmpl._njTmpl, root);
          }

          //保存模板AST编译结果到全局集合中
          if (tmplKey) {
            __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].asts[tmplKey] = root;
          }
        }

        fns = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__buildRuntime__["a" /* default */])(root.content, root, !outputH);
      }

      tmplFns = __WEBPACK_IMPORTED_MODULE_3__transforms_transformData__["a" /* template */](fns);

      //保存模板函数编译结果到全局集合中
      if (tmplKey) {
        __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].templates[tmplKey] = tmplFns;
      }
    }

    if (tmpl._njParams) {
      var tmplFn = function tmplFn() {
        return tmplFns.main.apply(this, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d" /* arrayPush */]([tmpl._njParams], arguments));
      };
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b" /* defineProp */](tmplFn, '_njTmpl', {
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
  var root = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//Precompile template
function precompile(tmpl, outputH) {
  var root = _createAstRoot();

  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](tmpl)) {
    tmpl = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__parser_checkStringElem__["a" /* default */])(tmpl);
  }
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__parser_checkElem__["a" /* default */])(tmpl._njTmpl, root);

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__buildRuntime__["a" /* default */])(root.content, root, !outputH);
}

function _createRender(outputH) {
  return function (tmpl, options) {
    return (outputH ? compileH : compile)(tmpl, options ? {
      tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
      fileName: options.fileName
    } : tmpl._njTmplKey).apply(null, __WEBPACK_IMPORTED_MODULE_1__utils_tools__["e" /* arraySlice */](arguments, 1));
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_setTmplRule__ = __webpack_require__(6);



/* harmony default export */ __webpack_exports__["a"] = function (configs) {
  var delimiters = configs.delimiters,
      includeParser = configs.includeParser,
      createElement = configs.createElement,
      outputH = configs.outputH;

  if (delimiters) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_setTmplRule__["a" /* default */])(delimiters);
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
  if (!__WEBPACK_IMPORTED_MODULE_1__tools__["g" /* isObject */](name)) {
    params = {};
    params[name] = component;
  }

  __WEBPACK_IMPORTED_MODULE_1__tools__["j" /* each */](params, function (v, k) {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = tmplTag;
/* harmony export (immutable) */ __webpack_exports__["b"] = tmplTagH;




function tmplTag() {
  return __WEBPACK_IMPORTED_MODULE_2__parser_checkStringElem__["a" /* default */].apply({ outputH: false }, arguments);
}

function tmplTagH() {
  return __WEBPACK_IMPORTED_MODULE_2__parser_checkStringElem__["a" /* default */].apply({ outputH: true }, arguments);
}

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */])(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  tmplTag: tmplTag,
  tmplTagH: tmplTagH
});

/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_escape__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_expression__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_filter__ = __webpack_require__(4);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };







var errorTitle = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].errorTitle;


function _buildFn(content, node, fns, no, newContext, level, useStringLocal) {
  var fnStr = '',
      useString = useStringLocal != null ? useStringLocal : fns.useString,
      isTmplExpr = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](no),
      //如果no为字符串, 则本次将构建tmpl块模板函数
  main = isTmplExpr || no === 0,

  /* retType
   1: 只有单个子节点
   2: 有多个子节点
   object: 非构建函数时
  */
  retType = content.length === 1 ? '1' : '2',
      counter = {
    _type: 0,
    _typeRefer: 0,
    _params: 0,
    _paramsE: 0,
    _compParam: 0,
    _dataRefer: 0,
    _expr: 0,
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

  /* 构建块表达式函数
   p1: 模板全局数据
   p2: 节点上下文数据
   p3: 块表达式内调用result及inverse方法传递的参数
   p4: #props块变量
  */
  fns[main ? 'main' + (isTmplExpr ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', fnStr);
  return no;
}

function _buildOptions(config, useStringLocal, node, fns, exprPropsStr, level, hashProps) {
  var hashStr = '',
      noConfig = !config;

  if (noConfig || config.useString) {
    hashStr += ', useString: ' + (useStringLocal == null ? 'p1.useString' : useStringLocal ? 'true' : 'false');
  }
  if (node) {
    //块表达式
    var newContext = config ? config.newContext : true;
    if (noConfig || config.exprProps) {
      hashStr += ', exprProps: ' + exprPropsStr;
    }

    hashStr += ', result: ' + (node.content ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.content, node, fns, ++fns._no, newContext, level, useStringLocal) + ', ' + exprPropsStr + ')' : 'p1.noop');

    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
  }

  return '{ _njOpts: true, ctx: p2, outputH: ' + !fns.useString + hashStr + ' }';
}

function _buildPropData(obj, counter, fns, useStringLocal, level) {
  var dataValueStr = void 0,
      escape = obj.escape;
  var _obj$prop = obj.prop,
      jsProp = _obj$prop.jsProp,
      isComputed = _obj$prop.isComputed;

  //先生成数据值

  if (!obj.prop.isBasicType) {
    var _obj$prop2 = obj.prop,
        name = _obj$prop2.name,
        parentNum = _obj$prop2.parentNum;

    var data = '',
        special = false,
        specialP = false;

    if (name === '@index') {
      data = 'index';
      special = true;
    } else if (name === 'this') {
      data = 'data[0]';
      special = true;
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
      var dataStr = 'p2.' + data;
      dataValueStr = (special ? dataStr : (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\', ' + dataStr + ')' + (isComputed ? ', p2, ' + level + ')' : '')) + jsProp;
    }
  } else {
    dataValueStr = obj.prop.name + jsProp;
  }

  //有过滤器时需要生成"_value"值
  var filters = obj.prop.filters;
  if (filters) {
    var _ret = function () {
      var valueStr = '_value' + counter._value++,
          filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](filters, function (o) {
        var _filterC = counter._filter++,
            configF = __WEBPACK_IMPORTED_MODULE_5__helpers_filter__["b" /* filterConfig */][o.name],
            filterVarStr = '_filter' + _filterC,
            globalFilterStr = 'p1.filters[\'' + o.name + '\']';

        if (configF) {
          filterStr += '\nvar ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
        } else {
          //如果全局配置不存在,先从p2.data中获取
          filterStr += '\nvar ' + filterVarStr + ' = p2.getData(\'' + o.name + '\');\n';
          filterStr += 'if(!' + filterVarStr + ') ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
        }
        filterStr += 'if (!' + filterVarStr + ') {\n';
        filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
        filterStr += '}\n';
        filterStr += 'else {\n';
        filterStr += '  ' + valueStr + ' = ' + filterVarStr + '.apply(p2, [' + valueStr + (o.params ? o.params.reduce(function (p, c) {
          return p + ', ' + _buildPropData({
            prop: c,
            escape: escape
          }, counter, fns, useStringLocal, level);
        }, '') : '') + ', ' + _buildOptions(configF, useStringLocal, null, fns) + ']);\n';
        filterStr += '}\n';
      }, false, true);

      return {
        v: {
          valueStr: _buildEscape(valueStr, fns, isComputed ? false : escape),
          filterStr: filterStr
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return _buildEscape(dataValueStr, fns, isComputed ? false : escape);
  }
}

function _buildEscape(valueStr, fns, escape) {
  if (fns.useString) {
    if (escape) {
      return 'p1.escape(' + valueStr + ')';
    } else {
      return valueStr;
    }
  } else {
    //文本中的特殊字符需转义
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_escape__["b" /* unescape */])(valueStr);
  }
}

function _replaceQuot(str) {
  return str.replace(/'/g, "\\'");
}

function _buildProps(obj, counter, fns, useStringLocal, level) {
  var str0 = obj.strs[0],
      valueStr = '',
      filterStr = '';

  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](str0)) {
    //常规属性
    valueStr = !obj.isAll && str0 !== '' ? '\'' + _replaceQuot(str0) + '\'' : '';
    filterStr = '';

    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](obj.props, function (o, i) {
      var propData = _buildPropData(o, counter, fns, useStringLocal, level),
          dataValueStr = void 0;
      if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](propData)) {
        dataValueStr = propData;
      } else {
        dataValueStr = propData.valueStr;
        filterStr += propData.filterStr;
      }

      if (!obj.isAll) {
        var strI = obj.strs[i + 1],
            prefixStr = str0 === '' && i == 0 ? '' : ' + ';

        if (strI.trim() === '\\n') {
          //如果只包含换行符号则忽略
          valueStr += prefixStr + dataValueStr;
          return;
        }

        dataValueStr = prefixStr + '(' + dataValueStr + ')' + (strI !== '' ? ' + \'' + _replaceQuot(strI) + '\'' : '');
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true);
  } else if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](str0) && str0.length != null) {
    //tmpl块表达式
    valueStr += '{\n';
    __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](str0, function (v, k, i, l) {
      if (k !== 'length') {
        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, v, fns, 'T' + ++fns._noT);
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

function _buildParams(node, fns, counter, useString, level) {
  //节点参数
  var params = node.params,
      paramsExpr = node.paramsExpr;

  var paramsStr = '',
      _paramsC = void 0,
      useStringF = fns.useString;

  if (params || paramsExpr) {
    _paramsC = counter._params++;
    paramsStr = 'var _params' + _paramsC + ' = ';

    //params块
    if (paramsExpr) {
      var _paramsEC = counter._paramsE++;
      paramsStr += (useString ? '\'\'' : 'null') + ';\n';
      paramsStr += 'var _paramsE' + _paramsEC + ' = {};\n';

      //params块的子节点
      paramsStr += _buildContent(paramsExpr.content, paramsExpr, fns, counter, { _paramsE: '_paramsE' + _paramsEC }, null, useString);

      //合并params块的值
      if (!useString) {
        paramsStr += '\n_params' + _paramsC + ' = _paramsE' + _paramsEC + ';\n';
        //paramsStr += '\np1.assign(_params' + _paramsC + ', _paramsE' + _paramsEC + ');\n';
      } else {
        var keys = '';
        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](params, function (v, k, i, l) {
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
        paramsStr += '_params' + _paramsC + ' += p1.assignStringProp(_paramsE' + _paramsEC + ', ' + (keys === '' ? 'null' : keys) + ');\n';
      }
    }

    if (params) {
      (function () {
        var paramKeys = Object.keys(params),
            len = paramKeys.length,
            filterStr = '';

        if (!useString && !paramsExpr) {
          paramsStr += '{\n';
        }

        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](paramKeys, function (k, i) {
          var valueStr = _buildProps(params[k], counter, fns, useString, level);
          if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](valueStr)) {
            filterStr += valueStr.filterStr;
            valueStr = valueStr.valueStr;
          }

          if (!useStringF && k === 'style') {
            //将style字符串转换为对象
            valueStr = 'p1.styleProps(' + valueStr + ')';
          }

          var key = k,
              onlyKey = '\'' + key + '\'' === valueStr;
          if (!useStringF) {
            key = __WEBPACK_IMPORTED_MODULE_2__transforms_transformData__["b" /* fixPropName */](k);
          }
          if (!paramsExpr) {
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

        if (!useString && !paramsExpr) {
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
    if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }

    var textStr = _buildRender(node, parent, 1, retType, { text: valueStr }, fns, level, useStringLocal, node.allowNewline, isFirst);
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    if (useStringF) {
      fnStr += textStr;
    } else {
      //文本中的特殊字符需转义
      fnStr += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_escape__["b" /* unescape */])(textStr);
    }
  } else if (node.type === 'nj_expr') {
    //块表达式节点
    var _exprC = counter._expr++,
        _dataReferC = counter._dataRefer++,
        dataReferStr = '',
        _filterStr = '',
        configE = __WEBPACK_IMPORTED_MODULE_4__helpers_expression__["b" /* exprConfig */][node.expr],
        exprVarStr = '_expr' + _exprC,
        globalExprStr = 'p1.exprs[\'' + node.expr + '\']';

    if (configE) {
      fnStr += '\nvar ' + exprVarStr + ' = ' + globalExprStr + ';\n';
    } else {
      //如果全局配置不存在,先从p2.data中获取
      fnStr += '\nvar ' + exprVarStr + ' = p2.getData(\'' + node.expr + '\');\n';
      fnStr += 'if(!' + exprVarStr + ') ' + exprVarStr + ' = ' + globalExprStr + ';\n';
    }

    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

    if (node.args) {
      //构建匿名参数
      __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](node.args, function (arg, i) {
        var valueStr = _buildProps(arg, counter, fns, useStringLocal, level);
        if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](valueStr)) {
          _filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + ',';
      }, false, true);
    }

    //props块
    var exprPropsStr = 'p4';
    if (retType && retType._paramsE) {
      exprPropsStr = retType._paramsE;
    }

    //hash参数
    var retP = _buildParams(node, fns, counter, false, level),
        paramsStr = retP[0],
        _paramsC = retP[1];

    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exprPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null);
    dataReferStr += '\n];\n';

    if (_filterStr !== '') {
      dataReferStr = _filterStr + dataReferStr;
    }

    fnStr += paramsStr + dataReferStr;

    //如果块表达式不存在则打印警告信息
    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

    //渲染
    fnStr += _buildRender(node, parent, 2, retType, {
      _expr: _exprC,
      _dataRefer: _dataReferC
    }, fns, level, useStringLocal, node.allowNewline, isFirst);
  } else {
    //元素节点
    //节点类型和typeRefer
    var _typeC = counter._type++,
        _type = void 0;
    if (node.typeRefer) {
      _type = node.typeRefer.props[0].prop.name;
    } else {
      _type = node.type;
    }

    var typeStr = void 0;
    if (!useStringF) {
      typeStr = 'p1.components[\'' + _type.toLowerCase() + '\'] ? p1.components[\'' + _type.toLowerCase() + '\'] : \'' + _type + '\'';
    } else {
      typeStr = '\'' + _type + '\'';
    }

    if (node.typeRefer) {
      var _typeReferC = counter._typeRefer++,
          valueStrT = _buildProps(node.typeRefer, counter, fns, level);
      if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["g" /* isObject */](valueStrT)) {
        fnStr += valueStrT.filterStr;
        valueStrT = valueStrT.valueStr;
      }

      fnStr += '\nvar _typeRefer' + _typeReferC + ' = ' + valueStrT + ';\n';
      fnStr += 'var _type' + _typeC + ' = _typeRefer' + _typeReferC + ' ? _typeRefer' + _typeReferC + ' : (' + typeStr + ');\n';
    } else {
      fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';
    }

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

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](content, function (node) {
    fnStr += _buildNode(node, parent, fns, counter, retType, level, node.useString ? true : useStringLocal, fns._firstNode && level == 0);

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
      //块表达式
      retStr = '_expr' + params._expr + '.apply(p2, _dataRefer' + params._dataRefer + ')';
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
  } else if (retType._paramsE) {
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
    _no: 0, //块表达式函数计数
    _noT: 0, //tmpl块模板函数计数
    _firstNode: true
  };

  _buildFn(astContent, ast, fns, fns._no, null, 0);
  return fns;
};

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__ = __webpack_require__(8);
/* harmony export (immutable) */ __webpack_exports__["a"] = checkElem;




var tmplRule = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */].tmplRule;

var NO_SPLIT_NEWLINE = ['style', 'script', 'textarea', 'pre', 'xmp', 'template'];

function _plainTextNode(obj, parent, parentContent, noSplitNewline) {
  var node = {};
  node.type = 'nj_plaintext';
  node.content = [__WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](obj)];
  node.allowNewline = noSplitNewline;
  parent[parentContent].push(node);
}

//检测元素节点
function checkElem(obj, parent, hasExprProps, noSplitNewline, isLast) {
  var parentContent = 'content';

  if (!__WEBPACK_IMPORTED_MODULE_1__utils_tools__["f" /* isArray */](obj)) {
    //判断是否为文本节点
    if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](obj)) {
      if (!noSplitNewline) {
        var strs = obj.split(tmplRule.newlineSplit);
        strs.forEach(function (str, i) {
          str = str.trim();
          str !== '' && _plainTextNode(str, parent, parentContent, noSplitNewline);
        });
      } else {
        _plainTextNode(isLast && parent.allowNewline === 'nlElem' ? __WEBPACK_IMPORTED_MODULE_1__utils_tools__["q" /* trimRight */](obj) : obj, parent, parentContent, noSplitNewline);
      }
    } else {
      _plainTextNode(obj, parent, parentContent, noSplitNewline);
    }

    return;
  }

  var node = {},
      first = obj[0];
  if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["h" /* isString */](first)) {
    //第一个子节点为字符串
    var len = obj.length,
        last = obj[len - 1],
        isElemNode = false,
        expr = void 0,
        exprParams = void 0;

    //判断是否为xml标签
    var openTagName = void 0,
        hasCloseTag = false,
        isTmpl = void 0,
        isParamsExpr = void 0,
        isProp = void 0,
        isExprProp = void 0,
        needAddToProps = void 0;

    expr = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["a" /* isExpr */](first);
    if (!expr) {
      var xmlOpenTag = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["b" /* getXmlOpenTag */](first);
      if (xmlOpenTag) {
        //tagname为xml标签时,则认为是元素节点
        openTagName = xmlOpenTag[1];

        if (!__WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["c" /* isXmlSelfCloseTag */](first)) {
          //非自闭合标签才验证是否存在关闭标签
          hasCloseTag = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["d" /* isXmlCloseTag */](last, openTagName);
        } else {
          //自闭合标签
          node.selfCloseTag = true;
        }
        isElemNode = true;
      }
    } else {
      //为块表达式,也可视为一个元素节点
      var exprName = expr[0];
      exprParams = expr[1];
      isTmpl = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["e" /* isTmpl */](exprName);
      isParamsExpr = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["f" /* isParamsExpr */](exprName);
      if (!isParamsExpr) {
        var exprProp = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["g" /* isExprProp */](exprName);
        isProp = exprProp.isProp;
        isExprProp = exprProp.isExprProp;
        needAddToProps = isProp ? !hasExprProps : isExprProp;
      }

      node.type = 'nj_expr';
      node.expr = exprName;
      if (exprParams != null && !isTmpl && !isParamsExpr) {
        if (!node.args) {
          node.args = [];
        }

        __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](exprParams, function (param) {
          if (param.value === 'useString') {
            node.useString = true;
            return;
          }

          var paramV = __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](param.value);
          if (param.onlyBrace) {
            //提取匿名参数
            node.args.push(paramV);
          } else {
            if (!node.params) {
              node.params = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();
            }
            node.params[param.key] = paramV;
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

      if (!expr) {
        node.type = openTagName;

        //If open tag has a brace,add the typeRefer param.
        var typeRefer = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["h" /* getInsideBraceParam */](openTagName);
        if (typeRefer) {
          node.typeRefer = __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](typeRefer[0]);
        }

        //获取openTag内参数
        var tagParams = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["i" /* getOpenTagParams */](first);
        if (tagParams) {
          if (!node.params) {
            node.params = __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l" /* obj */]();
          }

          __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](tagParams, function (param) {
            //The parameter like "{prop}" needs to be replaced.
            node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = __WEBPACK_IMPORTED_MODULE_2__transforms_transformParam__["a" /* compiledParam */](param.value);
          }, false, true);
        }

        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
        if (!node.selfCloseTag) {
          node.selfCloseTag = __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["j" /* verifySelfCloseTag */](openTagName);
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
          __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["k" /* addTmpl */](node, parent, exprParams ? exprParams[0].value : null);
        } else if (isParamsExpr) {
          pushContent = false;
        } else if (needAddToProps) {
          pushContent = false;
        }

        if (noSplitNewline == null && node.expr === 'pre') {
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
        checkContentElem(content, node, isParamsExpr || hasExprProps && !isProp, noSplitNewline);
      }

      //If this is params block, set on the "paramsExpr" property of the parent node.
      if (isParamsExpr || needAddToProps) {
        __WEBPACK_IMPORTED_MODULE_3__transforms_transformElement__["l" /* addParamsExpr */](node, parent, isExprProp);
      }
    } else {
      //如果不是元素节点,则为节点集合
      checkContentElem(obj, parent, hasExprProps, noSplitNewline);
    }
  } else if (__WEBPACK_IMPORTED_MODULE_1__utils_tools__["f" /* isArray */](first)) {
    //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
    checkContentElem(obj, parent, hasExprProps, noSplitNewline);
  }
}

//检测子元素节点
function checkContentElem(obj, parent, hasExprProps, noSplitNewline) {
  if (!parent.content) {
    parent.content = [];
  }

  __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j" /* each */](obj, function (item, i, l) {
    checkElem(item, parent, hasExprProps, noSplitNewline, i == l - 1);
  }, false, true);
}

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_tools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_registerComponent__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_setTmplRule__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "defineProp", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "defineProps", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "arrayPush", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "arraySlice", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["e"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["f"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["g"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["h"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isArrayLike", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["i"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "each", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["j"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["k"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "obj", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["l"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "toCamelCase", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["m"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return __WEBPACK_IMPORTED_MODULE_1__utils_tools__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_expression__ = __webpack_require__(2);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "exprs", function() { return __WEBPACK_IMPORTED_MODULE_5__helpers_expression__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "exprConfig", function() { return __WEBPACK_IMPORTED_MODULE_5__helpers_expression__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "registerExpr", function() { return __WEBPACK_IMPORTED_MODULE_5__helpers_expression__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_filter__ = __webpack_require__(4);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "filters", function() { return __WEBPACK_IMPORTED_MODULE_6__helpers_filter__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "filterConfig", function() { return __WEBPACK_IMPORTED_MODULE_6__helpers_filter__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "registerFilter", function() { return __WEBPACK_IMPORTED_MODULE_6__helpers_filter__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__compiler_compile__ = __webpack_require__(10);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "compile", function() { return __WEBPACK_IMPORTED_MODULE_7__compiler_compile__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "compileH", function() { return __WEBPACK_IMPORTED_MODULE_7__compiler_compile__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "precompile", function() { return __WEBPACK_IMPORTED_MODULE_7__compiler_compile__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "render", function() { return __WEBPACK_IMPORTED_MODULE_7__compiler_compile__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "renderH", function() { return __WEBPACK_IMPORTED_MODULE_7__compiler_compile__["e"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_escape__ = __webpack_require__(5);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "escape", function() { return __WEBPACK_IMPORTED_MODULE_8__utils_escape__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "unescape", function() { return __WEBPACK_IMPORTED_MODULE_8__utils_escape__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_tmplTag__ = __webpack_require__(13);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "tmplTag", function() { return __WEBPACK_IMPORTED_MODULE_9__utils_tmplTag__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "tmplTagH", function() { return __WEBPACK_IMPORTED_MODULE_9__utils_tmplTag__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "registerComponent", function() { return __WEBPACK_IMPORTED_MODULE_2__utils_registerComponent__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "setTmplRule", function() { return __WEBPACK_IMPORTED_MODULE_3__utils_setTmplRule__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return __WEBPACK_IMPORTED_MODULE_4__config__["a"]; });






__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_tools__["a" /* assign */])(__WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */], {
  registerComponent: __WEBPACK_IMPORTED_MODULE_2__utils_registerComponent__["a" /* default */],
  setTmplRule: __WEBPACK_IMPORTED_MODULE_3__utils_setTmplRule__["a" /* default */],
  config: __WEBPACK_IMPORTED_MODULE_4__config__["a" /* default */]
});

//Set default template rules
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_setTmplRule__["a" /* default */])();

var _global = typeof self !== 'undefined' ? self : global;
_global.NornJ = _global.nj = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */];








/* harmony default export */ __webpack_exports__["default"] = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* default */];
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(14)))

/***/ })
/******/ ]);
});