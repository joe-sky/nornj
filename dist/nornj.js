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

	'use strict';

	var nj = __webpack_require__(1),
	  utils = __webpack_require__(2),
	  compiler = __webpack_require__(14),
	  compileStringTmpl = __webpack_require__(17),
	  tmplByKey = __webpack_require__(19),
	  config = __webpack_require__(20);

	nj.compileStringTmpl = compileStringTmpl;
	nj.tmplByKey = tmplByKey;
	nj.config = config;
	utils.assign(nj, compiler, utils);

	var global = typeof self !== 'undefined' ? self : this;

	module.exports = global.NornJ = global.nj = nj;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function nj() {
	  return nj.compileStringTmpl.apply(null, arguments);
	}

	nj.createElement = null;
	nj.components = {};
	nj.asts = {};
	nj.templates = {};
	nj.errorTitle = '[NornJ error]';
	nj.tmplRule = {};

	module.exports = nj;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(3),
	  transformElement = __webpack_require__(5),
	  transformParam = __webpack_require__(6),
	  transformData = __webpack_require__(7),
	  escape = __webpack_require__(8),
	  checkElem = __webpack_require__(9),
	  registerComponent = __webpack_require__(10),
	  filter = __webpack_require__(11),
	  expression = __webpack_require__(12),
	  setTmplRule = __webpack_require__(13);

	//Set default param rule
	setTmplRule();

	module.exports = tools.assign(
	  {
	    escape: escape,
	    setTmplRule: setTmplRule
	  },
	  checkElem,
	  registerComponent,
	  filter,
	  expression,
	  tools,
	  transformElement,
	  transformParam,
	  transformData
	);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  assign = __webpack_require__(4),
	  nativeArrayPush = Array.prototype.push,
	  nativeArraySlice = Array.prototype.slice,
	  errorTitle = nj.errorTitle;

	//Push one by one to array
	function arrayPush(arr1, arr2) {
	  nativeArrayPush.apply(arr1, arr2);
	  return arr1;
	}

	function arraySlice(arrLike) {
	  return nativeArraySlice.call(arrLike);
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
	      break;
	    default:
	      ret += msg;
	  }

	  console.warn(ret);
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
	    }
	    else if (charF === '"') {
	      regex = REGEX_QUOT_D;
	    }
	  }
	  else if (clearDouble) {
	    regex = REGEX_QUOT_D;
	  }
	  else {
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
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  tools = __webpack_require__(3),
	  tranParam = __webpack_require__(6),
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
	    matchArr, ret;

	  while ((matchArr = pattern.exec(tag))) {
	    var key = matchArr[1];
	    if (key === '/') {  //If match to the last of "/", then continue the loop.
	      continue;
	    }

	    if (!ret) {
	      ret = [];
	    }

	    var value = matchArr[7],
	      onlyBrace = matchArr[4];
	    if (value != null) {
	      value = tools.clearQuot(value);  //Remove quotation marks
	    }
	    else {
	      value = key;  //Match to Similar to "checked" or "disabled" attribute.
	    }

	    //Removed at the end of "/>", ">" or "/".
	    if (/\/>$/.test(value)) {
	      value = value.substr(0, value.length - 2);
	    }
	    else if (/>$/.test(value) || /\/$/.test(value)) {
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
	  var ret, ret1 = tmplRule.expr.exec(obj);
	  if (ret1) {
	    ret = [ret1[1]];

	    var params = getOpenTagParams(obj);  //提取各参数
	    if (params) {
	      ret.push(params);
	    }
	  }

	  return ret;
	}

	//判断块表达式close tag
	function isExprCloseTag(obj, tagName) {
	  return tools.isString(obj) && obj === '/' + tmplRule.exprRule + tagName;
	}

	//判断是否模板元素
	function isTmpl(obj) {
	  return obj === 'tmpl';
	}

	//加入到模板集合中
	function addTmpl(node, parent, name) {
	  var paramsP = parent.params;
	  if (!paramsP) {
	    paramsP = parent.params = tools.lightObj();
	  }

	  var tmpls = paramsP.tmpls;
	  if (!tmpls) {
	    var objT = { length: 0 };
	    if (name != null) {
	      objT[name] = node;
	    }
	    else {
	      objT['0'] = node;
	      objT.length = 1;
	    }

	    paramsP.tmpls = tranParam.compiledParam(objT);
	  }
	  else {  //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
	    var objT = tmpls.strs[0],
	      len = objT.length;

	    if (name != null) {
	      objT[name] = node;
	    }
	    else {
	      objT[len] = node;
	      objT.length = ++len;
	    }
	  }
	}

	//Test whether as parameters expression
	function isParamsExpr(obj) {
	  return obj === 'params' || obj === 'props';
	}

	//Add to the "paramsExpr" property of the parent node
	function addParamsExpr(node, parent) {
	  if (!parent.paramsExpr) {
	    parent.paramsExpr = node;
	  }
	  else {
	    tools.arrayPush(parent.paramsExpr.content, node.content);
	  }
	}

	module.exports = {
	  getXmlOpenTag: getXmlOpenTag,
	  isXmlSelfCloseTag: isXmlSelfCloseTag,
	  verifySelfCloseTag: verifySelfCloseTag,
	  getOpenTagParams: getOpenTagParams,
	  isXmlCloseTag: isXmlCloseTag,
	  getInsideBraceParam: getInsideBraceParam,
	  isExpr: isExpr,
	  isExprCloseTag: isExprCloseTag,
	  isTmpl: isTmpl,
	  addTmpl: addTmpl,
	  isParamsExpr: isParamsExpr,
	  addParamsExpr: addParamsExpr
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  tools = __webpack_require__(3),
	  tmplRule = nj.tmplRule;

	//Get compiled parameters from a object
	function compiledParams(obj) {
	  var ret = tools.lightObj();
	  tools.each(obj, function (v, k) {
	    ret[k] = compiledParam(v);
	  }, false, false);

	  return ret;
	}

	//Get compiled property
	function compiledProp(prop, isString) {
	  var ret = tools.lightObj();

	  //Extract the dot data path to the 'prop' filter.
	  if (!isString && prop.indexOf('.') > -1) {
	    prop = prop.replace(/\.([^\s.|\/]+)/g, '|prop($1)');
	  }

	  //If there are colons in the property,then use filter
	  if (prop.indexOf('|') >= 0) {
	    var filters = [],
	      filtersTmp;
	    filtersTmp = prop.split('|');
	    prop = filtersTmp[0].trim();  //Extract property

	    filtersTmp = filtersTmp.slice(1);
	    tools.each(filtersTmp, function (filter) {
	      var retF = _getFilterParam(filter.trim()),
	        filterObj = tools.lightObj(),
	        filterName = retF[1];  //Get filter name

	      if (filterName) {
	        var paramsF = retF[3];  //Get filter param

	        //Multiple params are separated by commas.
	        if (paramsF) {
	          var params = [];
	          tools.each(paramsF.split(','), function (p) {
	            params[params.length] = tools.clearQuot(p).trim();
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
	  if (!isString && prop.indexOf('../') > -1) {
	    var n = 0;
	    prop = prop.replace(/\.\.\//g, function () {
	      n++;
	      return '';
	    });

	    ret.parentNum = n;
	  }

	  ret.name = prop;
	  if (isString) {  //Sign the parameter is a pure string.
	    ret.isStr = true;
	  }

	  return ret;
	}

	//Get filter param
	var REGEX_FILTER_PARAM = /([\w$]+)(\(([^()]+)\))*/;
	function _getFilterParam(obj) {
	  return REGEX_FILTER_PARAM.exec(obj);
	}

	//Extract replace parameters
	var _quots = ['\'', '"'];
	function _getReplaceParam(obj, strs) {
	  var pattern = tmplRule.replaceParam(),
	    matchArr, ret, i = 0;

	  while ((matchArr = pattern.exec(obj))) {
	    if (!ret) {
	      ret = [];
	    }

	    var prop = matchArr[3],
	      item = [matchArr[0], matchArr[1], null, false, true];

	    if (i > 0) {
	      item[4] = false;  //Sign not contain all of placehorder
	    }

	    //Clear parameter at both ends of the space.
	    prop = prop.trim();

	    //If parameter has quotation marks, this's a pure string parameter.
	    if (_quots.indexOf(prop[0]) > -1) {
	      prop = tools.clearQuot(prop);  //TODO 此处也会去除过滤器参数的引号
	      item[3] = true;
	    }

	    item[2] = prop;
	    ret.push(item);
	    i++;
	  }

	  return ret;
	}

	//Get compiled parameter
	function compiledParam(value) {
	  var ret = tools.lightObj(),
	    strs = tools.isString(value) ? value.split(tmplRule.replaceSplit) : [value],
	    props = null,
	    isAll = false;  //此处指替换符是否占满整个属性值;若无替换符时为false

	  //If have placehorder
	  if (strs.length > 1) {
	    var params = _getReplaceParam(value, strs);
	    props = [];

	    tools.each(params, function (param) {
	      var retP = tools.lightObj();
	      isAll = param[4] ? param[0] === value : false;  //If there are several curly braces, "isAll" must be false.
	      retP.prop = compiledProp(param[2], param[3]);

	      //If parameter's open rules are several,then it need escape.
	      retP.escape = param[1].split(tmplRule.startRule).length < 3;
	      props.push(retP);
	    }, false, true);
	  }

	  ret.props = props;
	  ret.strs = strs;
	  ret.isAll = isAll;

	  //标记为模板函数替换变量
	  if (isAll) {
	    var prop = props[0].prop;
	    if (prop.name.indexOf('!#') === 0) {
	      prop.name = prop.name.substr(2);
	      ret.isTmplPlace = true;
	    }
	  }

	  return ret;
	}

	module.exports = {
	  compiledParam: compiledParam,
	  compiledParams: compiledParams,
	  compiledProp: compiledProp
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
	  var pattern = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g,
	    matchArr, ret;

	  while ((matchArr = pattern.exec(obj))) {
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
	function getDataValue(data, prop) {
	  var ret, obj;
	  for (var i = 0, l = data.length; i < l; i++) {
	    obj = data[i];
	    if (obj) {
	      ret = obj[prop];
	      if (ret != null) {
	        return ret;
	      }
	    }
	  }
	}

	//Rebuild local variables in the new context
	function newContext(p2, p3) {
	  var newData = [];
	  if ('data' in p3) {
	    newData.push(p3.data);
	  }
	  if ('extra' in p3) {
	    newData.push(p3.extra);
	  }

	  return {
	    data: newData.length ? tools.arrayPush(newData, p2.data) : p2.data,
	    parent: p3.fallback ? p2 : p2.parent,
	    index: 'index' in p3 ? p3.index : p2.index
	  }
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
	  return function(param) {
	    return fn(p1, p2, param, p4);
	  };
	}

	//构建可运行的模板函数
	function tmplWrap(configs, main) {
	  return function() {
	    var args = arguments,
	      initParams = this;

	    return main(configs, {
	      data: !tools.isArray(args[0]) ? tools.arraySlice(args) : args[0],
	      parent: initParams && initParams._njParent ? initParams._njParent : null,
	      index: initParams && initParams._njIndex ? initParams._njIndex : null
	    });
	  };
	}

	//创建模板函数
	function template(fns) {
	  var configs = {
	    useString: fns.useString,
	    exprs: nj.exprs,
	    filters: nj.filters,
	    getDataValue: getDataValue,
	    noop: tools.noop,
	    lightObj: tools.lightObj,
	    throwIf: tools.throwIf,
	    warn: tools.warn,
	    newContext: newContext,
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

	  tools.each(fns, function(v, k) {
	    if (k.indexOf('main') === 0) { //将每个主函数构建为可运行的模板函数
	      configs[k] = tmplWrap(configs, v);
	      configs['_' + k] = v;
	    } else if (k.indexOf('fn') === 0) { //块表达式函数
	      configs[k] = v;
	    }
	  }, false, false);

	  return configs;
	}

	module.exports = {
	  newContext: newContext,
	  getDataValue: getDataValue,
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
	  }
	  else if(!text.replace) {
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
	  tranParam = __webpack_require__(6),
	  tranElem = __webpack_require__(5),
	  tmplRule = nj.tmplRule;

	//检测元素节点
	function checkElem(obj, parent) {
	  var node = {},
	    parentContent = !parent.hasElse ? 'content' : 'contentElse';

	  if (!tools.isArray(obj)) {  //判断是否为文本节点
	    if (tools.isObject(obj) && '_njShim' in obj && !tools.isArray(obj._njShim)) {  //Get the shim value
	      obj = obj._njShim;
	    }

	    node.type = 'nj_plaintext';
	    node.content = [tranParam.compiledParam(obj)];
	    parent[parentContent].push(node);
	    return;
	  }

	  var first = obj[0];
	  if (tools.isString(first)) {  //第一个子节点为字符串
	    var first = first,
	      len = obj.length,
	      last = obj[len - 1],
	      isElemNode = false,
	      expr,
	      exprParams;

	    //判断是否为xml标签
	    var openTagName,
	      hasCloseTag = false,
	      isTmpl, isParamsExpr;

	    expr = tranElem.isExpr(first);
	    if (!expr) {
	      var xmlOpenTag = tranElem.getXmlOpenTag(first);
	      if (xmlOpenTag) {  //tagname为xml标签时,则认为是元素节点
	        openTagName = xmlOpenTag[1];

	        if (!tranElem.isXmlSelfCloseTag(first)) {  //非自闭合标签才验证是否存在关闭标签
	          hasCloseTag = tranElem.isXmlCloseTag(last, openTagName);
	        }
	        else {  //自闭合标签
	          node.selfCloseTag = true;
	        }
	        isElemNode = true;
	      }
	    }
	    else {  //为块表达式,也可视为一个元素节点
	      var exprName = expr[0];
	      exprParams = expr[1];
	      isTmpl = tranElem.isTmpl(exprName);
	      isParamsExpr = tranElem.isParamsExpr(exprName);

	      node.type = 'nj_expr';
	      node.expr = exprName;
	      if (exprParams != null && !isTmpl) {
	        node.refer = tranParam.compiledParam(exprParams.reduce(function (p, c) {
	          return p + (c.onlyBrace ? ' ' + c.key : '');
	        }, ''));
	      }

	      if (tranElem.isExprCloseTag(last, exprName)) {  //判断是否有块表达式闭合标签
	        hasCloseTag = true;
	      }
	      isElemNode = true;
	    }

	    if (isElemNode) {  //判断是否为元素节点
	      var elseIndex = -1,
	        pushContent = true;

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
	            node.params = tools.lightObj();
	          }

	          tools.each(tagParams, function (param) {  //The parameter like "{prop}" needs to be replaced.
	            node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = tranParam.compiledParam(param.value);
	          }, false, true);
	        }

	        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
	        if (!node.selfCloseTag) {
	          node.selfCloseTag = tranElem.verifySelfCloseTag(openTagName);
	        }
	      }
	      else {  //为块表达式时判断是否有#else
	        if (isTmpl) {  //模板元素
	          pushContent = false;

	          //将模板添加到父节点的params中
	          tranElem.addTmpl(node, parent, exprParams ? exprParams[0].value : null);
	        }
	        else if (isParamsExpr) {
	          pushContent = false;
	        }
	        else {
	          elseIndex = obj.indexOf(tmplRule.exprRule + 'else');
	        }
	      }

	      //放入父节点content内
	      if (pushContent) {
	        parent[parentContent].push(node);
	      }

	      //取出子节点集合
	      var end = len - (hasCloseTag ? 1 : 0),
	        content = obj.slice(1, (elseIndex < 0 ? end : elseIndex));
	      if (content && content.length) {
	        checkContentElem(content, node);
	      }

	      //如果有$else,则将$else后面的部分存入content_else集合中
	      if (elseIndex >= 0) {
	        var contentElse = obj.slice(elseIndex + 1, end);
	        node.hasElse = true;

	        if (contentElse && contentElse.length) {
	          checkContentElem(contentElse, node);
	        }
	      }

	      //If this is params block, set on the "paramsExpr" property of the parent node.
	      if (isParamsExpr) {
	        tranElem.addParamsExpr(node, parent);
	      }
	    }
	    else {  //如果不是元素节点,则为节点集合
	      checkContentElem(obj, parent);
	    }
	  }
	  else if (tools.isArray(first)) {  //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
	    checkContentElem(obj, parent);
	  }
	}

	//检测子元素节点
	function checkContentElem(obj, parent) {
	  if (!parent.content) {
	    parent.content = [];
	  }
	  if (parent.hasElse && !parent.contentElse) {
	    parent.contentElse = [];
	  }

	  tools.each(obj, function (item) {
	    checkElem(item, parent);
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
	  prop: function(obj, props) {
	    var ret = obj;
	    ret && tools.each(props.split('.'), function(p) {
	      ret = ret[p];
	    }, false, true);

	    return ret;
	  },

	  //Get list count
	  count: function(obj) {
	    return obj ? obj.length : 0;
	  },

	  //Get list item
	  item: function(obj, no) {
	    return obj ? obj[no] : null;
	  },

	  //Judge equal
	  equal: function(obj, val) {
	    return obj == val;
	  },

	  //Less than
	  lt: function(val1, val2, noEqual) {
	    var ret;
	    val1 = parseFloat(val1);
	    val2 = parseFloat(val2);

	    if (noEqual) {
	      ret = val1 < val2;
	    } else {
	      ret = val1 <= val2;
	    }

	    return ret;
	  },

	  //Greater than
	  gt: function(val1, val2, noEqual) {
	    var ret;
	    val1 = parseFloat(val1);
	    val2 = parseFloat(val2);

	    if (noEqual) {
	      ret = val1 > val2;
	    } else {
	      ret = val1 >= val2;
	    }

	    return ret;
	  },

	  //Addition
	  add: function(val1, val2, isFloat) {
	    return val1 + (isFloat ? parseFloat(val2) : parseInt(val2, 10));
	  },

	  //Convert to int 
	  int: function(val) {
	    return parseInt(val, 10);
	  },

	  //Convert to float 
	  float: function(val) {
	    return parseFloat(val);
	  },

	  //Convert to boolean 
	  bool: function(val) {
	    if (val === 'false') {
	      return false;
	    }

	    return Boolean(val);
	  }
	};

	function _commonConfig(params) {
	  var ret = {
	    useString: true
	  };

	  if (params) {
	    ret = tools.assign(ret, params);
	  }
	  return ret;
	}

	//Filter default config
	var filterConfig = {
	  prop: _commonConfig(),
	  count: _commonConfig(),
	  item: _commonConfig(),
	  equal: _commonConfig(),
	  lt: _commonConfig(),
	  gt: _commonConfig(),
	  add: _commonConfig(),
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

	  tools.each(params, function(v, name) {
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

	var tools = __webpack_require__(3);

	//Global expression list
	var exprs = {
	  'if': function(refer, options) {
	    if (refer === 'false') {
	      refer = false;
	    }

	    var referR, ret;
	    if (!options.useUnless) {
	      referR = !!refer;
	    } else {
	      referR = !!!refer;
	    }
	    if (referR) {
	      ret = options.result();
	    } else {
	      ret = options.inverse();
	    }

	    if (options.useString && ret == null) {
	      return '';
	    }

	    return ret;
	  },

	  unless: function(refer, options) {
	    options.useUnless = true;
	    return exprs['if'].call(this, refer, options);
	  },

	  each: function(refer, options) {
	    var useString = options.useString,
	      ret;

	    if (refer) {
	      if (useString) {
	        ret = '';
	      } else {
	        ret = [];
	      }

	      tools.each(refer, function(item, index) {
	        var retI = options.result({
	          data: item,
	          index: index,
	          fallback: true
	        });

	        if (useString) {
	          ret += retI;
	        } else {
	          ret.push(retI);
	        }
	      }, false, tools.isArrayLike(refer));

	      //Return null when not use string and result is empty.
	      if (!useString && !ret.length) {
	        ret = null;
	      }
	    } else {
	      ret = options.inverse();
	      if (useString && ret == null) {
	        ret = '';
	      }
	    }

	    return ret;
	  },

	  //Parameter
	  param: function(name, options) {
	    var ret = options.result(), //Get parameter value
	      value;

	    //If the value length greater than 1, it need to be connected to a whole string.
	    if (ret != null) {
	      if (!tools.isArray(ret)) {
	        value = ret;
	      } else {
	        value = '';
	        tools.each(tools.flatten(ret), function(item) {
	          value += item != null ? item : '';
	        }, false, true);
	      }
	    } else { //Match to Similar to "checked" or "disabled" attribute.
	      value = !options.useString ? true : name;
	    }

	    options.exprProps[name] = value;
	  },

	  //Spread parameters
	  spread: function(refer, options) {
	    if (!refer) {
	      return;
	    }

	    tools.each(refer, function(v, k) {
	      options.exprProps[k] = v;
	    }, false, false);
	  },

	  equal: function(value1, value2, options) {
	    var ret;
	    if (value1 == value2) {
	      ret = options.result();
	    } else {
	      ret = options.inverse();
	    }

	    return ret;
	  },

	  'for': function(start, end, options) {
	    var ret, useString = options.useString;
	    if (useString) {
	      ret = '';
	    } else {
	      ret = [];
	    }

	    if (end == null) {
	      end = start;
	      start = 0;
	    }
	    start = parseInt(start, 10);
	    end = parseInt(end, 10);

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

	  blank: function(options) {
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
	  unless: _commonConfig({ newContext: false }),
	  each: _commonConfig(),
	  param: _commonConfig({ newContext: false, exprProps: true }),
	  spread: _commonConfig({ newContext: false, useString: false, exprProps: true }),
	  equal: _commonConfig({ newContext: false, useString: false }),
	  'for': _commonConfig(),
	  blank: _commonConfig({ newContext: false, useString: false })
	};

	//Expression alias
	exprs.prop = exprs.p = exprs.param;
	exprConfig.prop = exprConfig.p = exprConfig.param;

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

	  tools.each(params, function(v, name) {
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
/* 13 */
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

	module.exports = function (startRule, endRule, exprRule, externalRule, propRule, templateRule) {
	  if(tools.isObject(startRule)){
	    var params = startRule;
	    startRule = params.start;
	    endRule = params.end;
	    exprRule = params.expr;
	    externalRule = params.external;
	    propRule = params.prop;
	    templateRule = params.template;
	  }
	  if (!startRule) {
	    startRule = '{';
	  }
	  if (!endRule) {
	    endRule = '}';
	  }
	  if (!exprRule) {
	    exprRule = '#';
	  }
	  if (!externalRule) {
	    externalRule = '@';
	  }
	  if (!propRule) {
	    propRule = '@';
	  }
	  if (!templateRule) {
	    templateRule = 'template';
	  }

	  var allRules = _clearRepeat(startRule + endRule),
	    firstChar = startRule[0],
	    otherChars = allRules.substr(1),
	    spChars = '#$@',
	    exprRules = _clearRepeat(exprRule + spChars),
	    escapeExprRule = exprRule.replace(/\$/g, '\\$'),
	    escapeExternalRule = externalRule.replace(/\$/g, '\\$');

	  //Reset the regexs to global list
	  tools.assign(nj.tmplRule, {
	    startRule: startRule,
	    endRule: endRule,
	    exprRule: exprRule,
	    externalRule: externalRule,
	    propRule: propRule,
	    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + exprRules + '][-a-z0-9_|./' + otherChars + ']*)[^>]*>$', 'i'),
	    openTagParams: _createRegExp('[\\s]+(((' + startRule + '){1,2}([^' + allRules + ']+)(' + endRule + '){1,2})|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
	    insideBraceParam: _createRegExp('(' + startRule + '){1,2}([^' + allRules + ']+)(' + endRule + '){1,2}', 'i'),
	    spreadProp: _createRegExp('[\\s]+(' + startRule + '){1,2}[\\s]*(\\.\\.\\.[^' + allRules + ']+)(' + endRule + '){1,2}', 'g'),
	    replaceSplit: _createRegExp('(?:' + startRule + '){1,2}[^' + allRules + ']+(?:' + endRule + '){1,2}'),
	    replaceParam: function() {
	      return _createRegExp('((' + startRule + '){1,2})([^' + allRules + ']+)(' + endRule + '){1,2}', 'g');
	    },
	    checkElem: function() {
	      return _createRegExp('([^>]*)(<([a-z' + firstChar + '/' + exprRules + '!][-a-z0-9_|.' + allRules + exprRules + ']*)([^>]*)>)([^<]*)', 'ig');
	    },
	    externalSplit: _createRegExp(escapeExternalRule + '\\{[^{}]*(?:\\{[^' + externalRule + ']*\\})*[^{}]*\\}'),
	    external: function() {
	      return _createRegExp(escapeExternalRule + '\\{([^{}]*(\\{[^' + externalRule + ']*\\})*[^{}]*)\\}', 'g');
	    },
	    expr: _createRegExp('^' + escapeExprRule + '([^\\s]+)', 'i'),
	    include: function() {
	      return _createRegExp('<' + escapeExprRule + 'include([^>]*)>', 'ig');
	    },
	    template: templateRule
	  });
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  utils = __webpack_require__(2),
	  buildRuntime = __webpack_require__(15),
	  compileStringTmpl = __webpack_require__(17);

	//编译模板并返回转换函数
	function compile(tmpl, tmplName, outputH, fileName) {
	  if (!tmpl) {
	    return;
	  }
	  if (utils.isObject(tmplName)) {
	    var params = tmplName;
	    tmplName = params.tmplName;
	    outputH = params.outputH;
	    fileName = params.fileName;
	  }

	  //编译模板函数
	  var tmplFns;
	  if (tmplName) {
	    tmplFns = nj.templates[tmplName];
	  }
	  if (!tmplFns) {
	    var isObj = utils.isObject(tmpl), fns;
	    if (isObj && tmpl.main) {  //直接传入预编译模板
	      fns = tmpl;
	    }
	    else {  //编译AST
	      var root;
	      if (tmplName) {
	        root = nj.asts[tmplName];
	      }
	      if (!root) {
	        //Can be directly introduced into the AST
	        if (isObj && tmpl.type === 'nj_root') {
	          root = tmpl;
	        }
	        else {
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
	          utils.checkElem(tmpl, root);
	        }

	        //保存模板AST编译结果到全局集合中
	        if (tmplName) {
	          nj.asts[tmplName] = root;
	        }
	      }

	      fns = buildRuntime(root.content, !outputH);
	    }

	    tmplFns = utils.template(fns);

	    //保存模板函数编译结果到全局集合中
	    if (tmplName) {
	      nj.templates[tmplName] = tmplFns;
	    }
	  }

	  return tmplFns.main;
	}

	//Create template root object
	function _createAstRoot() {
	  var root = utils.lightObj();
	  root.type = 'nj_root';
	  root.content = [];

	  return root;
	}

	//编译字面量并返回组件转换函数
	function compileH(tmpl, tmplName) {
	  return compile(tmpl, tmplName, true);
	}

	//Precompile template
	function precompile(tmpl, outputH) {
	  var root = _createAstRoot();

	  if (utils.isString(tmpl)) {
	    tmpl = compileStringTmpl(tmpl);
	  }
	  utils.checkElem(tmpl, root);

	  return buildRuntime(root.content, !outputH);
	}

	module.exports = {
	  compile: compile,
	  compileH: compileH,
	  precompile: precompile
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  utils = __webpack_require__(2),
	  errorTitle = nj.errorTitle,
	  exprConfig = utils.exprConfig,
	  filterConfig = utils.filterConfig,
	  replaceSpecialSymbol = __webpack_require__(16);

	function _buildFn(content, fns, no, newContext, level) {
	  var fnStr = '',
	    useString = fns.useString,
	    isTmplExpr = utils.isString(no), //如果no为字符串, 则本次将构建tmpl块模板函数
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

	  fnStr += _buildContent(content, fns, counter, retType, level);

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

	function _buildOptions(config, node, fns, exprPropsStr, level) {
	  var hashStr = '',
	    noConfig = !config;

	  if (noConfig || config.useString) {
	    hashStr += ', useString: p1.useString';
	  }
	  if (node) {
	    var newContext = config ? config.newContext : true;
	    if (noConfig || config.exprProps) {
	      hashStr += ', exprProps: ' + exprPropsStr;
	    }

	    hashStr += ', result: ' + (node.content ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext, level) + ', ' + exprPropsStr + ')' : 'p1.noop');
	    hashStr += ', inverse: ' + (node.contentElse ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.contentElse, fns, ++fns._no, newContext, level) + ', ' + exprPropsStr + ')' : 'p1.noop');
	  }

	  return hashStr.length ? '{ _njOpts: true' + hashStr + ' }' : '';
	}

	function _buildPropData(obj, counter, fns, noEscape) {
	  var dataValueStr,
	    useString = fns.useString,
	    escape = !noEscape ? obj.escape : false;

	  //先生成数据值
	  if (!obj.prop.isStr) {
	    var name = obj.prop.name,
	      parentNum = obj.prop.parentNum,
	      data = '',
	      special = false,
	      specialP = false;

	    if (name === '#') {
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
	      dataValueStr = 'p1.getDataValue(p2.data, \'' + name + '\')';
	    } else {
	      var dataStr = 'p2.' + data;
	      dataValueStr = special ? dataStr : 'p1.getDataValue(' + dataStr + ', \'' + name + '\')';
	    }
	  } else {
	    dataValueStr = '\'' + obj.prop.name + '\'';
	  }

	  //有过滤器时需要生成"_value"值
	  var filters = obj.prop.filters;
	  if (filters) {
	    var valueStr = '_value' + counter._value++,
	      filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

	    utils.each(filters, function(o) {
	      var _filterC = counter._filter++,
	        configF = filterConfig[o.name],
	        filterVarStr = '_filter' + _filterC,
	        globalFilterStr = 'p1.filters[\'' + o.name + '\']';

	      if (configF) {
	        filterStr += '\nvar ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
	      } else { //如果全局配置不存在,先从p2.data中获取
	        filterStr += '\nvar ' + filterVarStr + ' = p1.getDataValue(p2.data, \'' + o.name + '\');\n';
	        filterStr += 'if(!' + filterVarStr + ') ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
	      }
	      filterStr += 'if (!' + filterVarStr + ') {\n';
	      filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
	      filterStr += '}\n';
	      filterStr += 'else {\n';
	      filterStr += '  ' + valueStr + ' = ' + filterVarStr + '.apply(p2, [' + valueStr +
	        (o.params ? o.params.reduce(function(p, c) {
	          return p + ', \'' + c + '\'';
	        }, '') : '') +
	        ', ' + _buildOptions(configF) +
	        ']);\n';
	      filterStr += '}\n';
	    }, false, true);

	    return {
	      valueStr: _buildEscape(valueStr, useString, escape),
	      filterStr: filterStr
	    };
	  } else {
	    return _buildEscape(dataValueStr, useString, escape);
	  }
	}

	function _buildEscape(valueStr, useString, escape) {
	  if (useString && escape) {
	    return 'p1.escape(' + valueStr + ')';
	  } else {
	    return valueStr;
	  }
	}

	function _buildProps(obj, counter, fns) {
	  var str0 = obj.strs[0],
	    valueStr = '',
	    filterStr = '';

	  if (utils.isString(str0)) { //常规属性
	    valueStr = !obj.isAll && str0 !== '' ? ('\'' + str0 + '\'') : '';
	    filterStr = '';

	    utils.each(obj.props, function(o, i) {
	      var propData = _buildPropData(o, counter, fns),
	        dataValueStr;
	      if (utils.isString(propData)) {
	        dataValueStr = propData;
	      } else {
	        dataValueStr = propData.valueStr;
	        filterStr += propData.filterStr;
	      }

	      if (!obj.isAll) {
	        var strI = obj.strs[i + 1];
	        dataValueStr = (str0 === '' && i == 0 ? '' : ' + ') +
	          '(' + dataValueStr + ')' +
	          (strI !== '' ? ' + \'' + strI + '\'' : '');
	      } else if (obj.isTmplPlace) { //执行tmpl块模板函数
	        dataValueStr += '.call({ _njParent: p2, _njIndex: p2.index }, p2.data)';
	      }

	      valueStr += dataValueStr;
	      if (obj.isAll) {
	        return false;
	      }
	    }, false, true);
	  } else if (utils.isObject(str0) && str0.length != null) { //tmpl块表达式
	    valueStr += '{\n';
	    utils.each(str0, function(v, k, i, l) {
	      if (k !== 'length') {
	        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, fns, 'T' + ++fns._noT);
	      } else {
	        valueStr += '  length: ' + v;
	      }
	      if (i < l - 1) {
	        valueStr += ',';
	      }
	      valueStr += '\n';
	    }, false, false);
	    valueStr += '}';
	  } else if (utils.isObject(str0) && str0._njEx) {
	    valueStr = str0._njEx;
	  } else { //非字符串值
	    //The "_njShim" property is used to distinguish whether the incoming is an normal array.
	    valueStr = JSON.stringify(str0._njShim ? str0._njShim : str0);
	  }

	  if (filterStr === '') {
	    return valueStr;
	  } else { //包含过滤器
	    return {
	      valueStr: valueStr,
	      filterStr: filterStr
	    };
	  }
	}

	function _buildNode(node, fns, counter, retType, level) {
	  var fnStr = '',
	    useString = fns.useString;

	  if (node.type === 'nj_plaintext') { //文本节点
	    var valueStr = _buildProps(node.content[0], counter, fns),
	      filterStr;
	    if (utils.isObject(valueStr)) {
	      filterStr = valueStr.filterStr;
	      valueStr = valueStr.valueStr;
	    }

	    var textStr = _buildRender(1, retType, { text: valueStr }, fns, level);
	    if (filterStr) {
	      textStr = filterStr + textStr;
	    }

	    if (useString) {
	      fnStr += textStr;
	    } else { //文本中的特殊字符需转义
	      fnStr += replaceSpecialSymbol(textStr);
	    }
	  } else if (node.type === 'nj_expr') { //块表达式节点
	    var _exprC = counter._expr++,
	      _dataReferC = counter._dataRefer++,
	      dataReferStr = '',
	      filterStr = '',
	      configE = exprConfig[node.expr],
	      exprVarStr = '_expr' + _exprC,
	      globalExprStr = 'p1.exprs[\'' + node.expr + '\']';

	    if (configE) {
	      fnStr += '\nvar ' + exprVarStr + ' = ' + globalExprStr + ';\n';
	    } else { //如果全局配置不存在,先从p2.data中获取
	      fnStr += '\nvar ' + exprVarStr + ' = p1.getDataValue(p2.data, \'' + node.expr + '\');\n';
	      fnStr += 'if(!' + exprVarStr + ') ' + exprVarStr + ' = ' + globalExprStr + ';\n';
	    }

	    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

	    if (node.refer) {
	      var props = node.refer.props;
	      utils.each(props, function(o, i) {
	        var valueStr = _buildPropData(o, counter, fns, true);
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

	    dataReferStr += _buildOptions(configE, node, fns, exprPropsStr, level);
	    dataReferStr += '\n];\n';

	    if (filterStr !== '') {
	      dataReferStr = filterStr + dataReferStr;
	    }

	    fnStr += dataReferStr;

	    //如果块表达式不存在则打印警告信息
	    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

	    //渲染
	    fnStr += _buildRender(2, retType, {
	      _expr: _exprC,
	      _dataRefer: _dataReferC
	    }, fns, level);
	  } else { //元素节点
	    //节点类型和typeRefer
	    var _typeC = counter._type++,
	      _type;
	    if (node.typeRefer) {
	      _type = node.typeRefer.props[0].prop.name;
	    } else {
	      _type = node.type.toLowerCase();
	    }

	    var typeStr;
	    if (!useString) {
	      typeStr = 'p1.components[\'' + _type + '\'] ? p1.components[\'' + _type + '\'] : \'' + _type + '\'';
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
	    var params = node.params,
	      paramsExpr = node.paramsExpr,
	      paramsStr = '';
	    if (params || paramsExpr) {
	      var _paramsC = counter._params++;
	      paramsStr = 'var _params' + _paramsC + ' = ';

	      //params块
	      if (paramsExpr) {
	        var _paramsEC = counter._paramsE++;
	        paramsStr += (useString ? '\'\'' : 'null') + ';\n';
	        paramsStr += 'var _paramsE' + _paramsEC + ' = {};\n';

	        //params块的子节点
	        paramsStr += _buildContent(paramsExpr.content, fns, counter, { _paramsE: '_paramsE' + _paramsEC });

	        //合并params块的值
	        if (!useString) {
	          paramsStr += '\n_params' + _paramsC + ' = _paramsE' + _paramsEC + ';\n';
	          //paramsStr += '\np1.assign(_params' + _paramsC + ', _paramsE' + _paramsEC + ');\n';
	        } else {
	          var keys = '';
	          utils.each(params, function(v, k, i, l) {
	            if (i == 0) {
	              keys += '{ ';
	            }
	            keys += k + ': 1';

	            if (i < l - 1) {
	              keys += ', '
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

	        utils.each(paramKeys, function(k, i) {
	          var valueStr = _buildProps(params[k], counter, fns);
	          if (utils.isObject(valueStr)) {
	            filterStr += valueStr.filterStr;
	            valueStr = valueStr.valueStr;
	          }

	          if (!useString && k === 'style') { //将style字符串转换为对象
	            valueStr = 'p1.styleProps(' + valueStr + ')';
	          }

	          var key = k,
	            onlyKey = ('\'' + key + '\'') === valueStr;
	          if (!useString) {
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

	      fnStr += paramsStr;
	    }

	    var _compParamC, _childrenC;
	    if (!useString) { //组件引擎参数
	      _compParamC = counter._compParam++;
	      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';
	    } else { //子节点字符串
	      _childrenC = counter._children++;
	      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
	    }

	    //子节点
	    fnStr += _buildContent(node.content, fns, counter, !useString ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, level != null ? level + 1 : level);

	    //渲染
	    fnStr += _buildRender(3, retType, !useString ? { _compParam: _compParamC } : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level);
	  }

	  return fnStr;
	}

	function _buildContent(content, fns, counter, retType, level) {
	  var fnStr = '';
	  if (!content) {
	    return fnStr;
	  }

	  utils.each(content, function(node) {
	    fnStr += _buildNode(node, fns, counter, retType, level);
	  }, false, true);

	  return fnStr;
	}

	function _buildRender(nodeType, retType, params, fns, level) {
	  var retStr,
	    useString = fns.useString;

	  switch (nodeType) {
	    case 1: //文本节点
	      retStr = _buildLevelSpace(level, useString) + params.text + (!useString || level == null ? '' : ' + \'\\n\'');
	      break;
	    case 2: //块表达式
	      retStr = '_expr' + params._expr + '.apply(p2, _dataRefer' + params._dataRefer + ')';
	      break;
	    case 3: //元素节点
	      if (!useString) {
	        retStr = 'p1.h.apply(null, _compParam' + params._compParam + ')';
	      } else {
	        var levelSpace = _buildLevelSpace(level, useString);
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
	    if (!useString) {
	      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
	    } else {
	      return '\n' + retType._children + ' += ' + retStr + ';\n';
	    }
	  }
	}

	function _buildLevelSpace(level, useString) {
	  var ret = '';
	  if (useString && level != null && level > 0) {
	    ret += '\'';
	    for (var i = 0; i < level; i++) {
	      ret += '  ';
	    }
	    ret += '\' + ';
	  }
	  return ret;
	}

	module.exports = function(ast, useString) {
	  var fns = {
	    useString: useString,
	    _no: 0, //块表达式函数计数
	    _noT: 0 //tmpl块模板函数计数
	  };

	  _buildFn(ast, fns, fns._no, null, 0);
	  return fns;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	var SPACIAL_SYMBOLS = {
	  nbsp: '\u00A0',
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  tools = __webpack_require__(3),
	  tranElem = __webpack_require__(5),
	  tmplRule = nj.tmplRule,
	  shim = __webpack_require__(18);

	//Cache the string template by unique key
	nj.strTmpls = {};

	//Compile string template
	function compileStringTmpl(tmpl) {
	  var tmplKey, ret;
	  if (this) { //The "tmplKey" parameter can be passed by the "this" object.
	    tmplKey = this.tmplKey;
	  }

	  if (tmplKey) { //If the cache already has template data, direct return the template.
	    ret = nj.strTmpls[tmplKey];
	    if (ret) {
	      return ret;
	    }
	  }

	  var isStr = tools.isString(tmpl),
	    xmls = tmpl,
	    args = arguments,
	    splitNo = 0,
	    params = [],
	    fullXml = '',
	    exArgs;

	  if (isStr) {
	    xmls = tmpl.split(tmplRule.externalSplit);

	    var pattern = tmplRule.external(),
	      matchArr;
	    exArgs = [];
	    while (matchArr = pattern.exec(tmpl)) {
	      exArgs.push(matchArr[1]);
	    }
	  }

	  //Connection xml string
	  var l = xmls.length;
	  tools.each(xmls, function(xml, i) {
	    var split = '';
	    if (i < l - 1) {
	      var last = xml.length - 1,
	        useShim = xml[last] === '@',
	        arg, isEx;

	      if (isStr) {
	        var exArg = exArgs[i],
	          match = exArg.match(/#(\d+)/);

	        if (match && match[1] != null) { //分隔符格式为"${#x}", 则按其编号顺序从nj函数参数列表中获取
	          arg = args[parseInt(match[1], 10) + 1];
	        } else {
	          arg = exArg;
	          useShim = isEx = true;
	        }
	      } else {
	        arg = args[i + 1];
	      }

	      if (!tools.isString(arg) || useShim) {
	        split = '_nj-split' + splitNo + '_';

	        //Use the shim function to convert the parameter when the front of it with a "@" mark.
	        if (useShim) {
	          if (isEx) {
	            arg = shim({ _njEx: arg });
	          } else {
	            xml = xml.substr(0, last);
	            arg = shim(arg);
	          }
	        }

	        params.push(arg);
	        splitNo++;
	      } else {
	        split = arg;
	      }
	    }

	    fullXml += xml + split;
	  }, false, true);

	  fullXml = _clearNotesAndBlank(fullXml);

	  if (tmplKey == null) {
	    //Get unique key
	    tmplKey = tools.uniqueKey(fullXml + _paramsStr(params));

	    ret = nj.strTmpls[tmplKey];
	    if (ret) {
	      return ret;
	    }
	  }

	  //Resolve string to element
	  ret = _checkStringElem(fullXml, params);

	  //Set the properties for the template object
	  _setTmplProps(ret, tmplKey);

	  //Save to the cache
	  nj.strTmpls[tmplKey] = ret;

	  return ret;
	}

	//Resolve string to element
	function _checkStringElem(xml, params) {
	  var root = [],
	    current = {
	      elem: root,
	      elemName: 'root',
	      parent: null
	    },
	    parent = null,
	    pattern = tmplRule.checkElem(),
	    matchArr;

	  while (matchArr = pattern.exec(xml)) {
	    var textBefore = matchArr[1],
	      elem = matchArr[2],
	      elemName = matchArr[3],
	      elemParams = matchArr[4],
	      textAfter = matchArr[5];

	    //Text before tag
	    if (textBefore && textBefore !== '\n') {
	      textBefore = _formatText(textBefore);
	      _setText(textBefore, current.elem, params);
	    }

	    //Element tag
	    if (elem) {
	      if (elemName[0] === '/') { //Close tag
	        if (elemName === '/' + current.elemName) {
	          current = current.parent;
	        }
	      } else if (elem[elem.length - 2] === '/') { //Self close tag
	        _setSelfCloseElem(elem, elemName, elemParams, current.elem, params);
	      } else { //Open tag
	        parent = current;
	        current = {
	          elem: [],
	          elemName: elemName,
	          parent: parent
	        };

	        parent.elem.push(current.elem);
	        _setElem(elem, elemName, elemParams, current.elem, params);
	      }
	    }

	    //Text after tag
	    if (textAfter && textAfter !== '\n') {
	      textAfter = _formatText(textAfter);
	      _setText(textAfter, current.elem, params);
	    }
	  }

	  return root;
	}

	function _clearNotesAndBlank(str) {
	  return str.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+([^\s<]*)\s+</g, '>$1<').trim();
	}

	function _formatText(str) {
	  return str.replace(/\n/g, '\\n').replace(/\r/g, '').trim();
	}

	//Merge parameters to string
	function _paramsStr(params) {
	  var str = '';
	  tools.each(params, function(p) {
	    if (tools.isArray(p)) {
	      str += '|' + _cascadeArr(p, true);
	    } else {
	      str += '|' + JSON.stringify(p);
	    }
	  }, false, true);

	  return str;
	}

	function _cascadeArr(p, isArr) {
	  var str;
	  if (isArr || tools.isArray(p)) {
	    if (p.njKey != null) {
	      str = '+' + p.njKey;
	    } else {
	      str = '';
	      for (var i = 0, l = p.length; i < l; i++) {
	        str += _cascadeArr(p[i]);
	      }
	    }
	  } else {
	    str = '+' + p;
	  }

	  return str;
	}

	//Set element node
	function _setElem(elem, elemName, elemParams, elemArr, params, bySelfClose) {
	  var ret, paramsExpr;
	  if (elemName[0] === tmplRule.exprRule) {
	    ret = elem.substring(1, elem.length - 1);
	  } else if (elemName.indexOf(tmplRule.propRule) === 0) {
	    ret = tmplRule.exprRule + 'prop {\'' + elemName.substr(tmplRule.propRule.length) + '\'}' + elemParams;
	  } else {
	    var retS = _getSplitParams(elem, params);
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
	function _getSplitParams(elem, params) {
	  var exprRule = tmplRule.exprRule,
	    startRule = tmplRule.startRule,
	    endRule = tmplRule.endRule,
	    paramsExpr;

	  //Replace the parameter like "prop=_nj-split0_".
	  elem = elem.replace(/([^\s={}>]+)=['"]?_nj-split(\d+)_['"]?/g, function(all, key, no) {
	    if (!paramsExpr) {
	      paramsExpr = [exprRule + 'params'];
	    }

	    paramsExpr.push([exprRule + "param " + startRule + "'" + key + "'" + endRule, params[no]]);
	    return '';
	  });

	  //Replace the parameter like "{...props}".
	  elem = elem.replace(tmplRule.spreadProp, function(all, begin, prop) {
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
	function _setSelfCloseElem(elem, elemName, elemParams, elemArr, params) {
	  if (elemName === tmplRule.exprRule + 'else') {
	    elemArr.push(elem.substr(1, 5));
	  } else {
	    _setElem(elem, elemName, elemParams, elemArr, params, true);
	  }
	}

	//Set text node
	function _setText(text, elemArr, params) {
	  var pattern = /_nj-split(\d+)_/g,
	    matchArr,
	    splitNos = [];

	  while ((matchArr = pattern.exec(text))) {
	    splitNos.push(matchArr[1]);
	  }

	  if (splitNos.length) {
	    tools.each(text.split(/_nj-split(?:\d+)_/), function(t) {
	      if (t !== '') {
	        elemArr.push(t);
	      }

	      var no = splitNos.shift();
	      if (no != null) {
	        elemArr.push(params[no]);
	      }
	    }, false, true);
	  } else {
	    elemArr.push(text);
	  }
	}

	//Set template props
	function _setTmplProps(tmpl, key) {
	  tmpl.njKey = key;

	  tmpl.render = function() {
	    return nj.compile(this, this.njKey).apply(null, arguments);
	  };

	  tmpl.renderH = function() {
	    return nj.compileH(this, this.njKey).apply(null, arguments);
	  };
	}

	module.exports = compileStringTmpl;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	//Converts any value to the parameter of NornJ template can be parsed.
	module.exports = function (obj) {
	  return {
	    _njShim: obj
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var checkStringElem = __webpack_require__(17);

	module.exports = function (key) {
	  return function() {
	    return checkStringElem.apply({ tmplKey: key }, arguments);
	  };
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  setTmplRule = __webpack_require__(13);

	module.exports = function (configs) {
	  var delimiters = configs.delimiters,
	    includeParser = configs.includeParser,
	    createElement = configs.createElement;

	  if(delimiters) {
	    setTmplRule(delimiters);
	  }

	  if(includeParser) {
	    nj.includeParser = includeParser;
	  }

	  if(createElement) {
	    nj.createElement = createElement;
	  }
	};

/***/ }
/******/ ])
});
;