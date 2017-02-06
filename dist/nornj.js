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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var nj = __webpack_require__(1),
	    utils = __webpack_require__(2),
	    compiler = __webpack_require__(13),
	    compileStringTmpl = __webpack_require__(16),
	    tmplTag = __webpack_require__(17),
	    config = __webpack_require__(18);

	nj.compileStringTmpl = compileStringTmpl;
	nj.config = config;
	utils.assign(nj, compiler, tmplTag, utils);

	var _global = typeof self !== 'undefined' ? self : global;

	module.exports = _global.NornJ = _global.nj = nj;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

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

	module.exports = nj;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(3),
	    transformElement = __webpack_require__(4),
	    transformParam = __webpack_require__(5),
	    transformData = __webpack_require__(7),
	    escape = __webpack_require__(8),
	    checkElem = __webpack_require__(9),
	    registerComponent = __webpack_require__(10),
	    filter = __webpack_require__(11),
	    expression = __webpack_require__(6),
	    setTmplRule = __webpack_require__(12);

	//Set default param rule
	setTmplRule();

	module.exports = tools.assign({
	  escape: escape,
	  setTmplRule: setTmplRule
	}, checkElem, registerComponent, filter, expression, tools, transformElement, transformParam, transformData);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var nj = __webpack_require__(1),
	    nativeArrayPush = Array.prototype.push,
	    nativeArraySlice = Array.prototype.slice,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    errorTitle = nj.errorTitle;

	//Push one by one to array
	function arrayPush(arr1, arr2) {
	  nativeArrayPush.apply(arr1, arr2);
	  return arr1;
	}

	function arraySlice(arrLike, start) {
	  return nativeArraySlice.call(arrLike, start);
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

	  var regex;
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

	var tools = {
	  isArray: isArray,
	  isArrayLike: isArrayLike,
	  isObject: isObject,
	  isString: isString,
	  each: each,
	  throwIf: throwIf,
	  assign: assign,
	  obj: obj,
	  arrayPush: arrayPush,
	  arraySlice: arraySlice,
	  clearQuot: clearQuot,
	  toCamelCase: toCamelCase,
	  warn: warn,
	  noop: noop
	};

	module.exports = tools;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3),
	    tranParam = __webpack_require__(5),
	    exprConfig = __webpack_require__(6).exprConfig,
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
	      matchArr,
	      ret;

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
	      value = tools.clearQuot(value); //Remove quotation marks
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
	  return tools.isString(obj) && obj.toLowerCase() === '</' + tagName + '>';
	}

	//get inside brace param
	function getInsideBraceParam(obj) {
	  return tmplRule.insideBraceParam.exec(obj);
	}

	//判断块表达式并返回参数
	function isExpr(obj) {
	  var ret,
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
	    paramsP = parent.params = tools.obj();
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

	    paramsP.tmpls = tranParam.compiledParam(objT);
	  } else {
	    //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
	    var objT = tmpls.strs[0],
	        len = objT.length;

	    if (name != null) {
	      objT[name] = node;
	    } else {
	      objT[len] = node;
	      objT.length = ++len;
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
	    tools.arrayPush(parent.paramsExpr.content, isExprProp ? [node] : node.content);
	  }
	}

	var PROP_EXPRS = ['prop', 'spread'];
	function isExprProp(name) {
	  var config = exprConfig[name];
	  return {
	    isExprProp: config ? config.exprProps : false,
	    isProp: PROP_EXPRS.indexOf(name) > -1
	  };
	}

	module.exports = {
	  getXmlOpenTag: getXmlOpenTag,
	  isXmlSelfCloseTag: isXmlSelfCloseTag,
	  verifySelfCloseTag: verifySelfCloseTag,
	  getOpenTagParams: getOpenTagParams,
	  isXmlCloseTag: isXmlCloseTag,
	  getInsideBraceParam: getInsideBraceParam,
	  isExpr: isExpr,
	  isTmpl: isTmpl,
	  addTmpl: addTmpl,
	  isParamsExpr: isParamsExpr,
	  addParamsExpr: addParamsExpr,
	  isExprProp: isExprProp
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3),
	    tmplRule = nj.tmplRule;

	//Get compiled parameters from a object
	function compiledParams(obj) {
	  var ret = tools.obj();
	  tools.each(obj, function (v, k) {
	    ret[k] = compiledParam(v);
	  }, false, false);

	  return ret;
	}

	//Get compiled property
	var REGEX_JS_PROP = /(('[^']*')|("[^"]*")|(-?([0-9][0-9]*)(\.\d+)?)|true|false|null|undefined|([#]*)([^.[\]()]+))([^\s()]*)/;

	function compiledProp(prop) {
	  var ret = tools.obj();

	  //If there are colons in the property,then use filter
	  if (prop.indexOf('|') >= 0) {
	    var filters = [],
	        filtersTmp;
	    filtersTmp = prop.split('|');
	    prop = filtersTmp[0].trim(); //Extract property

	    filtersTmp = filtersTmp.slice(1);
	    tools.each(filtersTmp, function (filter) {
	      var retF = _getFilterParam(filter.trim()),
	          filterObj = tools.obj(),
	          filterName = retF[1]; //Get filter name

	      if (filterName) {
	        var paramsF = retF[3]; //Get filter param

	        //Multiple params are separated by commas.
	        if (paramsF) {
	          var params = [];
	          tools.each(paramsF.split(','), function (p) {
	            params[params.length] = compiledProp(p.trim());
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
	  if (prop.indexOf('../') === 0) {
	    var n = 0;
	    prop = prop.replace(/\.\.\//g, function () {
	      n++;
	      return '';
	    });

	    ret.parentNum = n;
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
	var REGEX_FILTER_PARAM = /([\w$@=+-\\*/&%?]+)(\(([^()]+)\))*/;

	function _getFilterParam(obj) {
	  return REGEX_FILTER_PARAM.exec(obj);
	}

	//Extract replace parameters
	var _quots = ['\'', '"'];

	function _getReplaceParam(obj, strs) {
	  var pattern = tmplRule.replaceParam,
	      matchArr,
	      ret,
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
	  var ret = tools.obj(),
	      strs = tools.isString(value) ? value.split(tmplRule.replaceSplit) : [value],
	      props = null,
	      isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

	  //If have placehorder
	  if (strs.length > 1) {
	    var params = _getReplaceParam(value, strs);
	    props = [];

	    tools.each(params, function (param) {
	      var retP = tools.obj();
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

	module.exports = {
	  compiledParam: compiledParam,
	  compiledParams: compiledParams,
	  compiledProp: compiledProp
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var tools = __webpack_require__(3);

	//Global expression list
	var exprs = {
	  'if': function _if(value, options) {
	    if (value === 'false') {
	      value = false;
	    }

	    var valueR, ret;
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
	              tools.each(props.elseifs, function (elseif, i) {
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
	    var ret,
	        props = options.props,
	        l = props.elseifs.length;

	    tools.each(props.elseifs, function (elseif, i) {
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
	    return exprs['if'].call(this, value, options);
	  },

	  each: function each(list, options) {
	    var useString = options.useString,
	        ret;

	    if (list) {
	      (function () {
	        if (useString) {
	          ret = '';
	        } else {
	          ret = [];
	        }

	        var props = options.props;
	        tools.each(list, function (item, index, len) {
	          var param = {
	            data: item,
	            index: index,
	            fallback: true
	          };

	          if (props && props.moreValues) {
	            var _param$extra;

	            param.extra = (_param$extra = {}, _defineProperty(_param$extra, '@first', index === 0), _defineProperty(_param$extra, '@last', index === len - 1), _defineProperty(_param$extra, '@length', len), _param$extra);
	          }

	          var retI = options.result(param);
	          if (useString) {
	            ret += retI;
	          } else {
	            ret.push(retI);
	          }
	        }, false, tools.isArrayLike(list));

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
	    value;

	    if (ret !== undefined) {
	      value = ret;
	    } else {
	      //Match to Similar to "checked" or "disabled" attribute.
	      value = !options.useString ? true : name;
	    }

	    options.exprProps[name] = value;
	  },

	  //Spread parameters
	  spread: function spread(props, options) {
	    tools.each(props, function (v, k) {
	      options.exprProps[k] = v;
	    }, false, false);
	  },

	  'for': function _for(start, end, options) {
	    if (end._njOpts) {
	      options = end;
	      end = start;
	      start = 0;
	    }

	    var ret,
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

	  block: function block(options) {
	    return options.result();
	  }
	};

	function _commonConfig(params) {
	  var ret = {
	    useString: true,
	    exprProps: false,
	    newContext: true
	  };

	  if (params) {
	    ret = tools.assign(ret, params);
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
	  prop: _commonConfig({ newContext: false, exprProps: true }),
	  spread: _commonConfig({ newContext: false, useString: false, exprProps: true }),
	  'for': _commonConfig(),
	  obj: _commonConfig({ newContext: false, useString: false })
	};
	exprConfig.elseif = _commonConfig(exprConfig['else']);
	exprConfig.blank = _commonConfig(exprConfig.obj);

	//Expression alias
	exprs['case'] = exprs.elseif;
	exprConfig['case'] = exprConfig.elseif;
	exprs['default'] = exprs['else'];
	exprConfig['default'] = exprConfig['else'];

	//Register expression and also can batch add
	function registerExpr(name, expr, options) {
	  var params = name;
	  if (!tools.isObject(name)) {
	    params = {};
	    params[name] = {
	      expr: expr,
	      options: options
	    };
	  }

	  tools.each(params, function (v, name) {
	    if (v) {
	      var expr = v.expr,
	          options = v.options;

	      if (expr || options) {
	        if (expr) {
	          exprs[name] = expr;
	        }
	        if (options) {
	          exprConfig[name] = _commonConfig(options);
	        }
	      } else {
	        exprs[name] = v;
	      }
	    }
	  }, false, false);
	}

	module.exports = {
	  exprs: exprs,
	  exprConfig: exprConfig,
	  registerExpr: registerExpr
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3),
	    errorTitle = nj.errorTitle;

	//提取style内参数
	function styleProps(obj) {
	  //If the parameter is a style object,then direct return.
	  if (tools.isObject(obj)) {
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
	    key = tools.toCamelCase(key);

	    ret[key] = value;
	  }

	  return ret;
	}

	//Get value from multiple datas
	function getData(prop, data) {
	  var ret, obj;
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

	function getComputedData(fn, p2) {
	  if (fn == null) {
	    return fn;
	  }

	  if (fn._njTmpl) {
	    //模板函数
	    return fn.call({
	      _njData: p2.data,
	      _njParent: p2.parent,
	      _njIndex: p2.index
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
	    data: newData.length ? tools.arrayPush(newData, p2.data) : p2.data,
	    parent: p3 && p3.fallback ? p2 : p2.parent,
	    index: p3 && 'index' in p3 ? p3.index : p2.index,
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
	        data = tools.arraySlice(arguments);

	    return main(configs, {
	      data: initCtx && initCtx._njData ? tools.arrayPush(data, initCtx._njData) : data,
	      parent: initCtx && initCtx._njParent ? initCtx._njParent : null,
	      index: initCtx && initCtx._njIndex ? initCtx._njIndex : null,
	      getData: getData
	    });
	  };
	}

	//创建模板函数
	function template(fns) {
	  var configs = {
	    useString: fns.useString,
	    exprs: nj.exprs,
	    filters: nj.filters,
	    noop: tools.noop,
	    obj: tools.obj,
	    throwIf: tools.throwIf,
	    warn: tools.warn,
	    newContext: newContext,
	    getComputedData: getComputedData,
	    styleProps: styleProps,
	    exprRet: exprRet
	  };

	  if (!configs.useString) {
	    configs.h = nj.createElement;
	    configs.components = nj.components;
	    //configs.assign = tools.assign;
	  } else {
	    configs.assignStringProp = assignStringProp;
	    configs.escape = nj.escape;
	  }

	  tools.each(fns, function (v, k) {
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

	module.exports = {
	  newContext: newContext,
	  getData: getData,
	  getComputedData: getComputedData,
	  fixPropName: fixPropName,
	  styleProps: styleProps,
	  assignStringProp: assignStringProp,
	  exprRet: exprRet,
	  tmplWrap: tmplWrap,
	  template: template
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var ESCAPE_LOOKUP = {
	  '&': '&amp;',
	  '>': '&gt;',
	  '<': '&lt;',
	  '"': '&quot;',
	  '\'': '&#x27;'
	};

	function escape(text) {
	  if (text == null) {
	    return '';
	  } else if (!text.replace) {
	    return text;
	  }

	  return text.replace(/[&><"']/g, function (match) {
	    return ESCAPE_LOOKUP[match];
	  });
	}

	module.exports = escape;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3),
	    tranParam = __webpack_require__(5),
	    tranElem = __webpack_require__(4),
	    tmplRule = nj.tmplRule,
	    NO_SPLIT_NEWLINE = ['style', 'script', 'textarea', 'pre', 'xmp', 'template'];

	function _plainTextNode(obj, parent, parentContent) {
	  var node = {};
	  node.type = 'nj_plaintext';
	  node.content = [tranParam.compiledParam(obj)];
	  parent[parentContent].push(node);
	}

	//检测元素节点
	function checkElem(obj, parent, hasExprProps) {
	  var parentContent = 'content';

	  if (!tools.isArray(obj)) {
	    //判断是否为文本节点
	    if (tools.isString(obj) && (parent.expr || NO_SPLIT_NEWLINE.indexOf(parent.type.toLowerCase()) < 0)) {
	      var strs = obj.split(tmplRule.newlineSplit);
	      strs.forEach(function (str, i) {
	        str = str.trim();
	        str !== '' && _plainTextNode(str, parent, parentContent);
	      });
	    } else {
	      _plainTextNode(obj, parent, parentContent);
	    }

	    return;
	  }

	  var node = {},
	      first = obj[0];
	  if (tools.isString(first)) {
	    //第一个子节点为字符串
	    var first = first,
	        len = obj.length,
	        last = obj[len - 1],
	        isElemNode = false,
	        expr,
	        exprParams;

	    //判断是否为xml标签
	    var openTagName,
	        hasCloseTag = false,
	        isTmpl,
	        isParamsExpr,
	        isProp,
	        isExprProp,
	        needAddToProps;

	    expr = tranElem.isExpr(first);
	    if (!expr) {
	      var xmlOpenTag = tranElem.getXmlOpenTag(first);
	      if (xmlOpenTag) {
	        //tagname为xml标签时,则认为是元素节点
	        openTagName = xmlOpenTag[1];

	        if (!tranElem.isXmlSelfCloseTag(first)) {
	          //非自闭合标签才验证是否存在关闭标签
	          hasCloseTag = tranElem.isXmlCloseTag(last, openTagName);
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
	      isTmpl = tranElem.isTmpl(exprName);
	      isParamsExpr = tranElem.isParamsExpr(exprName);
	      if (!isParamsExpr) {
	        var exprProp = tranElem.isExprProp(exprName);
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

	        tools.each(exprParams, function (param) {
	          if (param.value === 'useString') {
	            node.useString = true;
	            return;
	          }

	          var paramV = tranParam.compiledParam(param.value);
	          if (param.onlyBrace) {
	            //提取匿名参数
	            node.args.push(paramV);
	          } else {
	            if (!node.params) {
	              node.params = tools.obj();
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

	      if (!expr) {
	        node.type = openTagName;

	        //If open tag has a brace,add the typeRefer param.
	        var typeRefer = tranElem.getInsideBraceParam(openTagName);
	        if (typeRefer) {
	          node.typeRefer = tranParam.compiledParam(typeRefer[0]);
	        }

	        //获取openTag内参数
	        var tagParams = tranElem.getOpenTagParams(first);
	        if (tagParams) {
	          if (!node.params) {
	            node.params = tools.obj();
	          }

	          tools.each(tagParams, function (param) {
	            //The parameter like "{prop}" needs to be replaced.
	            node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = tranParam.compiledParam(param.value);
	          }, false, true);
	        }

	        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
	        if (!node.selfCloseTag) {
	          node.selfCloseTag = tranElem.verifySelfCloseTag(openTagName);
	        }
	      } else {
	        if (isTmpl) {
	          //模板元素
	          pushContent = false;

	          //将模板添加到父节点的params中
	          tranElem.addTmpl(node, parent, exprParams ? exprParams[0].value : null);
	        } else if (isParamsExpr) {
	          pushContent = false;
	        } else if (needAddToProps) {
	          pushContent = false;
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
	        checkContentElem(content, node, isParamsExpr || hasExprProps && !isProp);
	      }

	      //If this is params block, set on the "paramsExpr" property of the parent node.
	      if (isParamsExpr || needAddToProps) {
	        tranElem.addParamsExpr(node, parent, isExprProp);
	      }
	    } else {
	      //如果不是元素节点,则为节点集合
	      checkContentElem(obj, parent, hasExprProps);
	    }
	  } else if (tools.isArray(first)) {
	    //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
	    checkContentElem(obj, parent, hasExprProps);
	  }
	}

	//检测子元素节点
	function checkContentElem(obj, parent, hasExprProps) {
	  if (!parent.content) {
	    parent.content = [];
	  }

	  tools.each(obj, function (item) {
	    checkElem(item, parent, hasExprProps);
	  }, false, true);
	}

	module.exports = {
	  checkElem: checkElem
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3);

	//注册组件
	function registerComponent(name, component) {
	  var params = name;
	  if (!tools.isObject(name)) {
	    params = {};
	    params[name] = component;
	  }

	  tools.each(params, function (v, k) {
	    nj.components[k.toLowerCase()] = v;
	  }, false, false);

	  return component;
	}

	module.exports = {
	  registerComponent: registerComponent
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(3);

	//Global filter list
	var filters = {
	  //Get param properties
	  prop: function prop(value, props) {
	    var ret = value;
	    ret && props.split('.').forEach(function (p) {
	      ret = ret[p];
	    });

	    return ret;
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
	  }
	};

	function _commonConfig(params) {
	  var ret = {
	    useString: false
	  };

	  if (params) {
	    ret = tools.assign(ret, params);
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
	  int: _commonConfig(),
	  float: _commonConfig(),
	  bool: _commonConfig()
	};

	//Register filter and also can batch add
	function registerFilter(name, filter, options) {
	  var params = name;
	  if (!tools.isObject(name)) {
	    params = {};
	    params[name] = {
	      filter: filter,
	      options: options
	    };
	  }

	  tools.each(params, function (v, name) {
	    if (v) {
	      var filter = v.filter,
	          options = v.options;

	      if (filter || options) {
	        if (filter) {
	          filters[name] = filter;
	        }
	        if (options) {
	          filterConfig[name] = _commonConfig(options);
	        }
	      } else {
	        filters[name] = v;
	      }
	    }
	  }, false, false);
	}

	module.exports = {
	  filters: filters,
	  filterConfig: filterConfig,
	  registerFilter: registerFilter
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3);

	function _createRegExp(reg, mode) {
	  return new RegExp(reg, mode);
	}

	//Clear the repeated characters
	function _clearRepeat(str) {
	  var ret = '',
	      i = 0,
	      l = str.length,
	      char;

	  for (; i < l; i++) {
	    char = str[i];
	    if (ret.indexOf(char) < 0) {
	      ret += char;
	    }
	  }

	  return ret;
	}

	module.exports = function () {
	  var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var _nj$tmplRule = nj.tmplRule,
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
	      otherChars = allRules.substr(1),
	      exprRules = _clearRepeat(exprRule + propRule + tagSpRule),
	      escapeExprRule = exprRule.replace(/\$/g, '\\$');

	  //Reset the regexs to global list
	  tools.assign(nj.tmplRule, {
	    startRule: startRule,
	    endRule: endRule,
	    exprRule: exprRule,
	    propRule: propRule,
	    templateRule: templateRule,
	    tagSpRule: tagSpRule,
	    commentRule: commentRule,
	    firstChar: firstChar,
	    lastChar: lastChar,
	    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + exprRules + '][-a-z0-9_|./' + firstChar + otherChars + ']*)[^>]*>$', 'i'),
	    openTagParams: _createRegExp('[\\s]+((([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
	    insideBraceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'i'),
	    spreadProp: _createRegExp('[\\s]+([' + firstChar + ']?' + startRule + ')[\\s]*(\\.\\.\\.[^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'g'),
	    replaceSplit: _createRegExp('(?:[' + firstChar + ']?' + startRule + ')[^' + allRules + ']+(?:' + endRule + '[' + lastChar + ']?)'),
	    replaceParam: _createRegExp('(([' + firstChar + ']?' + startRule + '))([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'g'),
	    checkElem: _createRegExp('([^>]*)(<([a-z' + firstChar + '/' + exprRules + '!][-a-z0-9_|.' + allRules + exprRules + ']*)([^>]*)>)([^<]*)', 'ig'),
	    expr: _createRegExp('^' + escapeExprRule + '([^\\s]+)', 'i'),
	    include: _createRegExp('<' + escapeExprRule + 'include([^>]*)>', 'ig'),
	    newlineSplit: _createRegExp('\\\\n(?![^' + firstChar + lastChar + ']*' + lastChar + ')', 'g')
	  });
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    utils = __webpack_require__(2),
	    buildRuntime = __webpack_require__(14),
	    compileStringTmpl = __webpack_require__(16);

	//编译模板并返回转换函数
	function _createCompile(outputH) {
	  return function (tmpl, tmplKey, fileName) {
	    if (!tmpl) {
	      return;
	    }
	    if (utils.isObject(tmplKey)) {
	      var options = tmplKey;
	      tmplKey = options.tmplKey;
	      fileName = options.fileName;
	    }

	    //编译模板函数
	    var tmplFns;
	    if (tmplKey) {
	      tmplFns = nj.templates[tmplKey];
	    }
	    if (!tmplFns) {
	      var isObj = utils.isObject(tmpl),
	          fns;
	      if (isObj && tmpl.main) {
	        //直接传入预编译模板
	        fns = tmpl;
	      } else {
	        //编译AST
	        var root;
	        if (tmplKey) {
	          root = nj.asts[tmplKey];
	        }
	        if (!root) {
	          //Can be directly introduced into the AST
	          if (isObj && tmpl.type === 'nj_root') {
	            root = tmpl;
	          } else {
	            root = _createAstRoot();

	            //Auto transform string template to array
	            if (utils.isString(tmpl)) {
	              //Merge all include blocks
	              var includeParser = nj.includeParser;
	              if (includeParser) {
	                tmpl = includeParser(tmpl, fileName);
	              }

	              tmpl = compileStringTmpl(tmpl);
	            }

	            //分析传入参数并转换为节点树对象
	            utils.checkElem(tmpl._njTmpl, root);
	          }

	          //保存模板AST编译结果到全局集合中
	          if (tmplKey) {
	            nj.asts[tmplKey] = root;
	          }
	        }

	        fns = buildRuntime(root.content, !outputH);
	      }

	      tmplFns = utils.template(fns);

	      //保存模板函数编译结果到全局集合中
	      if (tmplKey) {
	        nj.templates[tmplKey] = tmplFns;
	      }
	    }

	    if (tmpl._njParams) {
	      var tmplFn = function tmplFn() {
	        return tmplFns.main.apply(this, utils.arrayPush([tmpl._njParams], arguments));
	      };
	      tmplFn._njTmpl = true;
	      return tmplFn;
	    } else {
	      return tmplFns.main;
	    }
	  };
	}

	var compile = _createCompile(),
	    compileH = _createCompile(true);

	//Create template root object
	function _createAstRoot() {
	  var root = utils.obj();
	  root.type = 'nj_root';
	  root.content = [];

	  return root;
	}

	//Precompile template
	function precompile(tmpl, outputH) {
	  var root = _createAstRoot();

	  if (utils.isString(tmpl)) {
	    tmpl = compileStringTmpl(tmpl);
	  }
	  utils.checkElem(tmpl._njTmpl, root);

	  return buildRuntime(root.content, !outputH);
	}

	function _createRender(outputH) {
	  return function (tmpl, options) {
	    return (outputH ? compileH : compile)(tmpl, options ? {
	      tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
	      fileName: options.fileName
	    } : tmpl._njTmplKey).apply(null, utils.arraySlice(arguments, 1));
	  };
	}

	module.exports = {
	  compile: compile,
	  compileH: compileH,
	  precompile: precompile,
	  render: _createRender(),
	  renderH: _createRender(true)
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    utils = __webpack_require__(2),
	    errorTitle = nj.errorTitle,
	    exprConfig = utils.exprConfig,
	    filterConfig = utils.filterConfig,
	    replaceSpecialSymbol = __webpack_require__(15);

	function _buildFn(content, fns, no, newContext, level, useStringLocal) {
	  var fnStr = '',
	      useString = useStringLocal != null ? useStringLocal : fns.useString,
	      isTmplExpr = utils.isString(no),
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

	  fnStr += _buildContent(content, fns, counter, retType, level, useStringLocal);

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

	    hashStr += ', result: ' + (node.content ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext, level, useStringLocal) + ', ' + exprPropsStr + ')' : 'p1.noop');

	    if (hashProps != null) {
	      hashStr += ', props: ' + hashProps;
	    }
	  }

	  return '{ _njOpts: true, ctx: p2' + hashStr + ' }';
	}

	function _buildPropData(obj, counter, fns, useStringLocal) {
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
	      dataValueStr = (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\')' + (isComputed ? ', p2)' : '') + jsProp;
	    } else {
	      var dataStr = 'p2.' + data;
	      dataValueStr = (special ? dataStr : (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\', ' + dataStr + ')' + (isComputed ? ', p2)' : '')) + jsProp;
	    }
	  } else {
	    dataValueStr = obj.prop.name + jsProp;
	  }

	  //有过滤器时需要生成"_value"值
	  var filters = obj.prop.filters;
	  if (filters) {
	    var valueStr = '_value' + counter._value++,
	        filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

	    utils.each(filters, function (o) {
	      var _filterC = counter._filter++,
	          configF = filterConfig[o.name],
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
	        }, counter, fns, useStringLocal);
	      }, '') : '') + ', ' + _buildOptions(configF, useStringLocal) + ']);\n';
	      filterStr += '}\n';
	    }, false, true);

	    return {
	      valueStr: _buildEscape(valueStr, fns, isComputed ? false : escape),
	      filterStr: filterStr
	    };
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
	    return replaceSpecialSymbol(valueStr);
	  }
	}

	function _replaceQuot(str) {
	  return str.replace(/'/g, "\\'");
	}

	function _buildProps(obj, counter, fns, useStringLocal) {
	  var str0 = obj.strs[0],
	      valueStr = '',
	      filterStr = '';

	  if (utils.isString(str0)) {
	    //常规属性
	    valueStr = !obj.isAll && str0 !== '' ? '\'' + _replaceQuot(str0) + '\'' : '';
	    filterStr = '';

	    utils.each(obj.props, function (o, i) {
	      var propData = _buildPropData(o, counter, fns, useStringLocal),
	          dataValueStr;
	      if (utils.isString(propData)) {
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
	  } else if (utils.isObject(str0) && str0.length != null) {
	    //tmpl块表达式
	    valueStr += '{\n';
	    utils.each(str0, function (v, k, i, l) {
	      if (k !== 'length') {
	        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, fns, 'T' + ++fns._noT);
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

	function _buildParams(node, fns, counter, useString) {
	  //节点参数
	  var params = node.params,
	      paramsExpr = node.paramsExpr,
	      paramsStr = '',
	      _paramsC,
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
	      paramsStr += _buildContent(paramsExpr.content, fns, counter, { _paramsE: '_paramsE' + _paramsEC }, null, useString);

	      //合并params块的值
	      if (!useString) {
	        paramsStr += '\n_params' + _paramsC + ' = _paramsE' + _paramsEC + ';\n';
	        //paramsStr += '\np1.assign(_params' + _paramsC + ', _paramsE' + _paramsEC + ');\n';
	      } else {
	        var keys = '';
	        utils.each(params, function (v, k, i, l) {
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
	      var paramKeys = Object.keys(params),
	          len = paramKeys.length,
	          filterStr = '';

	      if (!useString && !paramsExpr) {
	        paramsStr += '{\n';
	      }

	      utils.each(paramKeys, function (k, i) {
	        var valueStr = _buildProps(params[k], counter, fns, useString);
	        if (utils.isObject(valueStr)) {
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
	          key = utils.fixPropName(k);
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
	    }
	  }

	  return [paramsStr, _paramsC];
	}

	function _buildNode(node, fns, counter, retType, level, useStringLocal) {
	  var fnStr = '',
	      useStringF = fns.useString;

	  if (node.type === 'nj_plaintext') {
	    //文本节点
	    var valueStr = _buildProps(node.content[0], counter, fns, useStringLocal),
	        filterStr;
	    if (utils.isObject(valueStr)) {
	      filterStr = valueStr.filterStr;
	      valueStr = valueStr.valueStr;
	    }

	    var textStr = _buildRender(1, retType, { text: valueStr }, fns, level, useStringLocal);
	    if (filterStr) {
	      textStr = filterStr + textStr;
	    }

	    if (useStringF) {
	      fnStr += textStr;
	    } else {
	      //文本中的特殊字符需转义
	      fnStr += replaceSpecialSymbol(textStr);
	    }
	  } else if (node.type === 'nj_expr') {
	    //块表达式节点
	    var _exprC = counter._expr++,
	        _dataReferC = counter._dataRefer++,
	        dataReferStr = '',
	        filterStr = '',
	        configE = exprConfig[node.expr],
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
	      utils.each(node.args, function (arg, i) {
	        var valueStr = _buildProps(arg, counter, fns, useStringLocal);
	        if (utils.isObject(valueStr)) {
	          filterStr += valueStr.filterStr;
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
	    var retP = _buildParams(node, fns, counter, false),
	        paramsStr = retP[0],
	        _paramsC = retP[1];

	    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exprPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null);
	    dataReferStr += '\n];\n';

	    if (filterStr !== '') {
	      dataReferStr = filterStr + dataReferStr;
	    }

	    fnStr += paramsStr + dataReferStr;

	    //如果块表达式不存在则打印警告信息
	    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

	    //渲染
	    fnStr += _buildRender(2, retType, {
	      _expr: _exprC,
	      _dataRefer: _dataReferC
	    }, fns, level, useStringLocal);
	  } else {
	    //元素节点
	    //节点类型和typeRefer
	    var _typeC = counter._type++,
	        _type;
	    if (node.typeRefer) {
	      _type = node.typeRefer.props[0].prop.name;
	    } else {
	      _type = node.type;
	    }

	    var typeStr;
	    if (!useStringF) {
	      typeStr = 'p1.components[\'' + _type.toLowerCase() + '\'] ? p1.components[\'' + _type.toLowerCase() + '\'] : \'' + _type + '\'';
	    } else {
	      typeStr = '\'' + _type + '\'';
	    }

	    if (node.typeRefer) {
	      var _typeReferC = counter._typeRefer++,
	          valueStrT = _buildProps(node.typeRefer, counter, fns);
	      if (utils.isObject(valueStrT)) {
	        fnStr += valueStrT.filterStr;
	        valueStrT = valueStrT.valueStr;
	      }

	      fnStr += '\nvar _typeRefer' + _typeReferC + ' = ' + valueStrT + ';\n';
	      fnStr += 'var _type' + _typeC + ' = _typeRefer' + _typeReferC + ' ? _typeRefer' + _typeReferC + ' : (' + typeStr + ');\n';
	    } else {
	      fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';
	    }

	    //节点参数
	    var retP = _buildParams(node, fns, counter, useStringF),
	        paramsStr = retP[0],
	        _paramsC = retP[1];
	    fnStr += paramsStr;

	    var _compParamC, _childrenC;
	    if (!useStringF) {
	      //组件参数
	      _compParamC = counter._compParam++;
	      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';
	    } else {
	      //子节点字符串
	      _childrenC = counter._children++;
	      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
	    }

	    //子节点
	    fnStr += _buildContent(node.content, fns, counter, !useStringF ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, level != null ? level + 1 : level, useStringLocal);

	    //渲染
	    fnStr += _buildRender(3, retType, !useStringF ? { _compParam: _compParamC } : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level, useStringLocal);
	  }

	  return fnStr;
	}

	function _buildContent(content, fns, counter, retType, level, useStringLocal) {
	  var fnStr = '';
	  if (!content) {
	    return fnStr;
	  }

	  utils.each(content, function (node) {
	    fnStr += _buildNode(node, fns, counter, retType, level, node.useString ? true : useStringLocal);
	  }, false, true);

	  return fnStr;
	}

	function _buildRender(nodeType, retType, params, fns, level, useStringLocal) {
	  var retStr,
	      useStringF = fns.useString,
	      useString = useStringLocal != null ? useStringLocal : useStringF;

	  switch (nodeType) {
	    case 1:
	      //文本节点
	      retStr = _buildLevelSpace(level, fns) + params.text + (!useStringF || level == null ? '' : ' + \'\\n\'');
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
	        var levelSpace = _buildLevelSpace(level, fns);
	        retStr = levelSpace + '\'<\' + _type' + params._type + ' + ' + (params._params != null ? '_params' + params._params + ' + ' : '');
	        if (!params._selfClose) {
	          retStr += '\'>\\n\'';
	          retStr += ' + _children' + params._children + ' + ';
	          retStr += levelSpace + '\'</\' + _type' + params._type + ' + \'>\\n\'';
	        } else {
	          retStr += '\' />\\n\'';
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

	function _buildLevelSpace(level, fns) {
	  var ret = '';
	  if (fns.useString && level != null && level > 0) {
	    ret += '\'';
	    for (var i = 0; i < level; i++) {
	      ret += '  ';
	    }
	    ret += '\' + ';
	  }
	  return ret;
	}

	module.exports = function (ast, useString) {
	  var fns = {
	    useString: useString,
	    _no: 0, //块表达式函数计数
	    _noT: 0 //tmpl块模板函数计数
	  };

	  _buildFn(ast, fns, fns._no, null, 0);
	  return fns;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	var SPACIAL_SYMBOLS = {
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

	var REGEX_SYMBOLS = new RegExp('&(' + Object.keys(SPACIAL_SYMBOLS).join('|') + ');', 'g');
	function replace(str) {
	  return str.replace(REGEX_SYMBOLS, function (all, match) {
	    return SPACIAL_SYMBOLS[match];
	  });
	}

	module.exports = replace;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    tools = __webpack_require__(3),
	    tranElem = __webpack_require__(4),
	    tmplRule = nj.tmplRule,
	    tmplStrs = nj.tmplStrs,
	    SPLIT_FLAG = '_nj_split';

	//Compile string template
	function compileStringTmpl(tmpl) {
	  var tmplKey = tmpl.toString(),
	      //Get unique key
	  ret = tmplStrs[tmplKey],
	      outputH = this ? this.outputH : false;

	  if (!ret) {
	    //If the cache already has template data, direct return the template.
	    var isStr = tools.isString(tmpl),
	        xmls = isStr ? [tmpl] : tmpl,
	        l = xmls.length,
	        computedNos = [],
	        fullXml = '';

	    //Connection xml string
	    tools.each(xmls, function (xml, i) {
	      var split = '';
	      if (i < l - 1) {
	        var last = xml.length - 1,
	            lastChar = xml[last],
	            isComputed = lastChar === '#',
	            isNoEscape = lastChar === '@';

	        if (isComputed || isNoEscape) {
	          isComputed && computedNos.push(i);
	          xml = xml.substr(0, last);
	        }

	        split = (isNoEscape ? tmplRule.firstChar : '') + tmplRule.startRule + (isComputed ? '#' : '') + SPLIT_FLAG + i + tmplRule.endRule + (isNoEscape ? tmplRule.lastChar : '');
	      }

	      fullXml += xml + split;
	    }, false, true);

	    fullXml = _clearNotesAndBlank(fullXml);

	    //Resolve string to element
	    ret = _checkStringElem(fullXml);
	    ret._njParamCount = l - 1;
	    ret._njComputedNos = computedNos;

	    //Save to the cache
	    tmplStrs[tmplKey] = ret;
	  }

	  var params,
	      args = arguments,
	      paramCount = ret._njParamCount;
	  if (paramCount > 0) {
	    params = {};

	    for (var i = 0; i < paramCount; i++) {
	      params[SPLIT_FLAG + i] = args[i + 1];
	    }
	  }

	  var tmplFn = function tmplFn() {
	    return nj['compile' + (outputH ? 'H' : '')](tmplFn, tmplKey).apply(this, params ? tools.arrayPush([params], arguments) : arguments);
	  };
	  tmplFn._njTmpl = ret;
	  tmplFn._njTmplKey = tmplKey;
	  tmplFn._njParams = params;

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
	      matchArr;

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

	var SPECIAL_LOOKUP = {
	  '>(': 'gt(',
	  '<(': 'lt(',
	  '>=(': 'gte(',
	  '<=(': 'lte('
	};

	function _clearNotesAndBlank(str) {
	  var commentRule = tmplRule.commentRule;
	  return str.replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '').replace(/>\s+([^\s<]*)\s+</g, '>$1<').trim().replace(/(>|<|>=|<=)\(/g, function (match) {
	    return SPECIAL_LOOKUP[match];
	  });
	}

	function _formatNewline(str) {
	  return str.trim().replace(/\n/g, '\\n').replace(/\r/g, '');
	}

	//Set element node
	function _setElem(elem, elemName, elemParams, elemArr, bySelfClose) {
	  var ret, paramsExpr;
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
	      endRule = tmplRule.endRule,
	      paramsExpr;

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

	module.exports = compileStringTmpl;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var compileStringTmpl = __webpack_require__(16);

	module.exports = {
	  tmplTag: function tmplTag() {
	    return compileStringTmpl.apply({ outputH: false }, arguments);
	  },
	  tmplTagH: function tmplTagH() {
	    return compileStringTmpl.apply({ outputH: true }, arguments);
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	    setTmplRule = __webpack_require__(12);

	module.exports = function (configs) {
	  var delimiters = configs.delimiters,
	      includeParser = configs.includeParser,
	      createElement = configs.createElement,
	      outputH = configs.outputH;

	  if (delimiters) {
	    setTmplRule(delimiters);
	  }

	  if (includeParser) {
	    nj.includeParser = includeParser;
	  }

	  if (createElement) {
	    nj.createElement = createElement;
	  }

	  if (outputH != null) {
	    nj.outputH = outputH;
	  }
	};

/***/ }
/******/ ])
});
;