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
	  compiler = __webpack_require__(16),
	  compileStringTmpl = __webpack_require__(19),
	  tmplByKey = __webpack_require__(21),
	  docReady = __webpack_require__(22),
	  config = __webpack_require__(23);

	nj.compileStringTmpl = compileStringTmpl;
	nj.tmplByKey = tmplByKey;
	nj.docReady = docReady;
	nj.config = config;
	utils.assign(nj, compiler, utils);

	//Default use React as component engine
	if (typeof React !== 'undefined') {
	  nj.setComponentEngine('react', React, typeof ReactDOM !== 'undefined' ? ReactDOM : null);
	}

	var global;
	if (typeof self !== 'undefined') {
	  global = self;

	  //Init tag template
	  docReady(function () {
	    if (nj.componentLib) {
	      nj.renderTagComponent(nj.initTagData, null, true);
	    }
	  });
	}
	else {
	  global = this;
	}

	module.exports = global.NornJ = global.nj = nj;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function nj() {
	  return nj.compileStringTmpl.apply(null, arguments);
	}

	nj.componentLib = null;
	nj.componentLibObj = null;
	nj.componentLibDom = null;
	nj.componentPort = null;
	nj.componentRender = null;
	nj.componentClasses = {};
	nj.asts = {};
	nj.templates = {};
	nj.errorTitle = 'NornJ:';
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
	  setComponentEngine = __webpack_require__(10),
	  registerComponent = __webpack_require__(11),
	  filter = __webpack_require__(12),
	  expression = __webpack_require__(13),
	  setTmplRule = __webpack_require__(14),
	  registerTmpl = __webpack_require__(15);

	//Set default param rule
	setTmplRule();

	module.exports = tools.assign(
	  {
	    escape: escape,
	    setTmplRule: setTmplRule,
	    registerTmpl: registerTmpl
	  },
	  checkElem,
	  setComponentEngine,
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

	//Transform multidimensional array to one-dimensional array
	function flatten(obj) {
	  var output = [],
	    idx = 0;

	  if (isArray(obj)) {
	    for (var i = 0, l = _getLength(obj) ; i < l; i++) {
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
	  inArray: inArray,
	  trim: trim,
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
	function getOpenTagParams(obj, noXml) {
	  var pattern = /[\s]+([^\s=>]+)(=(('[^']+')|("[^"]+")|([^"'\s]+)))?/g,
	    matchArr, ret;

	  while ((matchArr = pattern.exec(obj))) {
	    var key = matchArr[1];
	    if (key === '/' || key === '/>') {  //If match to the last "/" or "/>", then continue the loop.
	      continue;
	    }

	    if (!ret) {
	      ret = [];
	    }

	    var value = matchArr[3],
	      charF, len, regex;
	    if (value != null) {
	      value = tools.clearQuot(value);  //Remove quotation marks
	    }
	    else {
	      value = key;  //Match to Similar to "checked" or "disabled" attribute.
	    }
	    len = value.length;

	    //Removed at the end of "/>" or ">".
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
	  return tmplRule.openTag.exec(obj);
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
	  return tmplRule.insideBraceParam.exec(obj);
	}

	//判断流程控制块并返回refer值
	function isControl(obj) {
	  var ret, ret1 = tmplRule.expr.exec(obj);
	  if (ret1) {
	    ret = [ret1[1]];

	    var ret2 = getInsideBraceParam(obj);  //提取refer值
	    if (ret2) {
	      ret.push(ret2[0]);
	    }
	  }

	  return ret;
	}

	//判断流程控制块close tag
	function isControlCloseTag(obj, tagName) {
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
	    if(name != null) {
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

	    if(name != null) {
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
	    tools.listPush(parent.paramsExpr.content, node.content);
	  }
	}

	//获取全部内联组件
	function getTagComponents(selector, isAuto) {
	  if (!selector) {
	    selector = 'script[type="text/nornj"]' + (isAuto ? '[autorender]' : '');
	  }

	  return document.querySelectorAll(selector);
	}

	//Remove all dom child node
	function removeChildNode(node) {
	  var children = node.childNodes,
	    len = children.length,
	    i = 0;

	  for (; i < len; i++) {
	    node.removeChild(node.firstChild);
	  }
	}

	module.exports = {
	  getXmlOpenTag: getXmlOpenTag,
	  isXmlSelfCloseTag: isXmlSelfCloseTag,
	  verifySelfCloseTag: verifySelfCloseTag,
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
	  isParamsExpr: isParamsExpr,
	  addParamsExpr: addParamsExpr,
	  getTagComponents: getTagComponents,
	  removeChildNode: removeChildNode
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
	    prop = prop.replace(/\.([^\s.:\/]+)/g, ':prop($1)');
	  }

	  //If there are colons in the property,then use filter
	  if (prop.indexOf(':') >= 0) {
	    var filters = [],
	      filtersTmp;
	    filtersTmp = prop.split(':');
	    prop = filtersTmp[0].trim();  //Extract property

	    filtersTmp = filtersTmp.slice(1);
	    tools.each(filtersTmp, function (filter) {
	      var retF = _getFilterParam(filter.trim()),
	        filterObj = tools.lightObj(),
	        filterName = retF[1].toLowerCase();  //Get filter name

	      if (filterName) {
	        var paramsF = retF[3];  //Get filter param

	        //Multiple params are separated by commas.
	        if (paramsF) {
	          var params = [];
	          tools.each(paramsF.split(','), function (p) {
	            params[params.length] = p.trim();
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
	    patternP = /[^\s:]+([\s]?:[\s]?[^\s\(\)]+(\([^\(\)]+\))?(\.[^\s.]+)?){0,}/g,
	    matchArr, matchArrP, ret, prop, i = 0;

	  while ((matchArr = pattern.exec(obj))) {
	    if (!ret) {
	      ret = [];
	    }

	    var j = 0;
	    prop = matchArr[3];

	    //To extract parameters by interval space.
	    while ((matchArrP = patternP.exec(prop))) {
	      var propP = matchArrP[0],
	        item = [matchArr[0], matchArr[1], propP, false, true];

	      //Clear parameter at both ends of the space.
	      propP = propP.trim();

	      //If parameter has quotation marks, this's a pure string parameter.
	      if (_quots.indexOf(propP[0]) > -1) {
	        propP = tools.clearQuot(propP);
	        item[3] = true;
	      }

	      item[2] = propP;
	      ret.push(item);

	      //If there are several parameters in a curly braces, fill the space for the "strs" array.
	      if (j > 0) {
	        item[4] = false;  //Sign not contain all of placehorder
	        strs.splice(++i, 0, '');
	      }
	      j++;
	    }
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
	      isAll = param[4] ? param[0] === value : false;  //If there are several parameters in a curly braces, "isAll" must be false.
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
	  if(isAll) {
	    var prop = props[0].prop;
	    if(prop.name.indexOf('!#') === 0) {
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
	function getDatasValue(datas, prop) {
	  var ret, obj;
	  for (var i = 0, l = datas.length; i < l; i++) {
	    obj = datas[i];
	    if (obj) {
	      ret = obj[prop];
	      if (ret != null) {
	        return ret;
	      }
	    }
	  }
	}

	//获取each块中的item参数
	function getNewData(item, data, isArr, addData) {
	  var ret = item,
	    isAdd = addData != null;

	  if (isArr == null) {
	    isArr = tools.isArray(data);
	  }
	  if (isArr || isAdd) {
	    ret = tools.listPush([item], !isAdd ? data.slice(1) : (isArr ? data : [data]));
	  }

	  return ret;
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
	function exprRet(p1, p2, p3, fn, p5) {
	  return function (param) {
	    return fn(p1, p2, p3, param, p5);
	  };
	}

	//构建可运行的模板函数
	function tmplWrap(configs, main) {
	  return function () {
	    var args = arguments,
	      len = args.length,
	      data;

	    if (len <= 0) {
	      data = {};
	    }
	    else if (len === 1) {
	      data = args[0];
	    }
	    else {
	      data = [];
	      for (var i = 0; i < len; i++) {
	        data[data.length] = args[i];
	      }
	    }

	    return main(configs, { data: data, parent: this && this._njParent ? this._njParent : null }, { multiData: nj.isArray(data) });
	  };
	}

	//创建模板函数
	function template(fns) {
	  var configs = {
	    useString: fns.useString,
	    exprs: nj.exprs,
	    filters: nj.filters,
	    getDatasValue: nj.getDatasValue,
	    noop: nj.noop,
	    lightObj: nj.lightObj,
	    throwIf: nj.throwIf,
	    warn: nj.warn,
	    getNewData: nj.getNewData,
	    styleProps: nj.styleProps,
	    exprRet: nj.exprRet
	  };

	  if (!configs.useString) {
	    configs.compPort = nj.componentPort;
	    configs.compLib = nj.componentLibObj;
	    configs.compClass = nj.componentClasses;
	    //configs.assign = nj.assign;
	  }
	  else {
	    configs.assignStringProp = nj.assignStringProp;
	    configs.escape = nj.escape;
	  }

	  tools.each(fns, function (v, k) {
	    if (k.indexOf('main') === 0) {  //将每个主函数构建为可运行的模板函数
	      configs[k] = tmplWrap(configs, v);
	      configs['_' + k] = v;
	    }
	    else if (k.indexOf('fn') === 0) {  //块表达式函数
	      configs[k] = v;
	    }
	  }, false, false);

	  return configs;
	}

	module.exports = {
	  getNewData: getNewData,
	  getDatasValue: getDatasValue,
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

	    //if (tools.isString(obj)) {
	    node.type = 'nj_plaintext';
	    node.content = [tranParam.compiledParam(obj)];
	    parent[parentContent].push(node);
	    //}

	    return;
	  }

	  var first = obj[0];
	  if (tools.isString(first)) {  //第一个子节点为字符串
	    var first = first,
	      len = obj.length,
	      last = obj[len - 1],
	      isElemNode = false,
	      control,
	      refer;

	    //判断是否为xml标签
	    var xmlOpenTag,
	      openTagName,
	      hasCloseTag = false,
	      isTmpl, isParamsExpr;
	    
	    control = tranElem.isControl(first);
	    if (!control) {
	      xmlOpenTag = tranElem.getXmlOpenTag(first);
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
	      else {  //tagname不为xml标签时,必须有结束标签才认为是元素节点
	        var openTag = tranElem.getOpenTag(first);
	        if (openTag) {
	          openTagName = openTag[0];
	          
	          if (!tranElem.isSelfCloseTag(first)) {  //非自闭合标签
	            hasCloseTag = tranElem.isCloseTag(last, openTagName);
	            if (hasCloseTag) {
	              isElemNode = true;
	            }
	          }
	          else {  //如果是自闭合标签则直接认为是元素节点
	            node.selfCloseTag = true;
	            isElemNode = true;
	          }
	        }
	      }
	    }
	    else {  //为特殊节点,也可视为一个元素节点
	      var ctrl = control[0].toLowerCase();
	      refer = control[1];
	      isTmpl = tranElem.isTmpl(ctrl);
	      isParamsExpr = tranElem.isParamsExpr(ctrl);

	      node.type = 'nj_expr';
	      node.expr = ctrl;
	      if (refer != null && !isTmpl) {
	        node.refer = tranParam.compiledParam(refer);
	      }

	      if (tranElem.isControlCloseTag(last, ctrl)) {  //判断是否有流程控制块闭合标签
	        hasCloseTag = true;
	      }
	      isElemNode = true;
	    }

	    if (isElemNode) {  //判断是否为元素节点
	      var elseIndex = -1,
	        pushContent = true;

	      if (!control) {
	        node.type = openTagName;

	        //If open tag has a brace,add the typeRefer param.
	        var typeRefer = tranElem.getInsideBraceParam(openTagName);
	        if (typeRefer) {
	          node.typeRefer = tranParam.compiledParam(typeRefer[0]);
	        }

	        //获取openTag内参数
	        var tagParams = tranElem.getOpenTagParams(first, !xmlOpenTag);
	        if (tagParams) {
	          if (!node.params) {
	            node.params = tools.lightObj();
	          }

	          tools.each(tagParams, function (param) {
	            node.params[param.key] = tranParam.compiledParam(param.value);
	          }, false, true);
	        }

	        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
	        if (!node.selfCloseTag) {
	          node.selfCloseTag = tranElem.verifySelfCloseTag(openTagName);
	        }
	      }
	      else {  //为表达式块时判断是否有$else
	        if (isTmpl) {  //模板元素
	          pushContent = false;
	          var retR = tranElem.getInsideBraceParam(refer);

	          //将模板添加到父节点的params中
	          tranElem.addTmpl(node, parent, retR ? tools.clearQuot(retR[1]) : null);
	        }
	        else if (isParamsExpr) {
	          pushContent = false;
	        }
	        else {
	          elseIndex = tools.inArray(obj, tmplRule.exprRule + 'else');
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

	//Set component engine
	function setComponentEngine(name, obj, dom, port, render) {
	  //Component engine's name
	  nj.componentLib = name;

	  //Component engine's object
	  nj.componentLibObj = obj;

	  //Component engine's dom object
	  dom = dom || obj;
	  nj.componentLibDom = dom;

	  //Component engine's create element and render function
	  if (name === 'react') {
	    port = 'createElement';
	    render = 'render';
	  }
	  nj.componentPort = tools.isString(port) ? obj[port] : port;
	  nj.componentRender = tools.isString(render) ? dom[render] : render;
	}

	module.exports = {
	  setComponentEngine: setComponentEngine
	};

/***/ },
/* 11 */
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
	    nj.componentClasses[k.toLowerCase()] = v;
	  }, false, false);

	  return component;
	}

	module.exports = {
	  registerComponent: registerComponent
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(3);

	//Global filter list
	var filters = {
	  //Get param properties
	  prop: function (obj, props) {
	    var ret = obj;
	    ret && tools.each(props.split('.'), function (p) {
	      ret = ret[p];
	    }, false, true);

	    return ret;
	  },

	  //Get list count
	  count: function (obj) {
	    return obj ? obj.length : 0;
	  },

	  //Get list item
	  item: function (obj, no) {
	    return obj ? obj[no] : null;
	  },

	  //Judge equal
	  equal: function (obj, val) {
	    return obj == val;
	  },

	  //Less than
	  lt: function (val1, val2, noEqual) {
	    var ret;
	    val1 = parseFloat(val1);
	    val2 = parseFloat(val2);

	    if (noEqual) {
	      ret = val1 < val2;
	    }
	    else {
	      ret = val1 <= val2;
	    }

	    return ret;
	  },

	  //Greater than
	  gt: function (val1, val2, noEqual) {
	    var ret;
	    val1 = parseFloat(val1);
	    val2 = parseFloat(val2);

	    if (noEqual) {
	      ret = val1 > val2;
	    }
	    else {
	      ret = val1 >= val2;
	    }

	    return ret;
	  },

	  //Addition
	  add: function (val1, val2, isFloat) {
	    return val1 + (isFloat ? parseFloat(val2) : parseInt(val2, 10));
	  },

	  //Convert to int 
	  int: function (val) {
	    return parseInt(val, 10);
	  },

	  //Convert to float 
	  float: function (val) {
	    return parseFloat(val);
	  },

	  //Convert to boolean 
	  bool: function (val) {
	    if (val === 'false') {
	      return false;
	    }

	    return Boolean(val);
	  }
	};

	function _commonConfig(params) {
	  var ret = {
	    data: true,
	    parent: true,
	    index: true,
	    useString: true
	  };

	  if (params) {
	    ret = tools.assign(ret, params);
	  }
	  return ret;
	}

	//Filter default config
	var _defaultConfig = { data: false, parent: false, index: false },
	  filterConfig = {
	    prop: _commonConfig(_defaultConfig),
	    count: _commonConfig(_defaultConfig),
	    item: _commonConfig(_defaultConfig),
	    equal: _commonConfig(_defaultConfig),
	    lt: _commonConfig(_defaultConfig),
	    gt: _commonConfig(_defaultConfig),
	    add: _commonConfig(_defaultConfig),
	    int: _commonConfig(_defaultConfig),
	    float: _commonConfig(_defaultConfig),
	    bool: _commonConfig(_defaultConfig)
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

	  tools.each(params, function (v, k) {
	    var name = k.toLowerCase();
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
	      }
	      else {
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(3);

	//Global expression list
	var exprs = {
	  'if': function (refer, useUnless) {
	    if (refer === 'false') {
	      refer = false;
	    }

	    var referR, ret;
	    if (!useUnless) {
	      referR = !!refer;
	    }
	    else {
	      referR = !!!refer;
	    }
	    if (referR) {
	      ret = this.result();
	    }
	    else {
	      ret = this.inverse();
	    }

	    if (this.useString && ret == null) {
	      return '';
	    }

	    return ret;
	  },

	  unless: function (refer) {
	    return exprs['if'].call(this, refer, true);
	  },

	  each: function (refer) {
	    var thiz = this,
	      useString = thiz.useString,
	      ret;

	    if (refer) {
	      if (useString) {
	        ret = '';
	      }
	      else {
	        ret = [];
	      }

	      tools.each(refer, function (item, index) {
	        var retI = thiz.result({
	          item: item,
	          index: index,
	          fallback: true
	        });

	        if (useString) {
	          ret += retI;
	        }
	        else {
	          ret.push(retI);
	        }
	      }, false, tools.isArrayLike(refer));

	      //Return null when not use string and result is empty.
	      if (!useString && !ret.length) {
	        ret = null;
	      }
	    }
	    else {
	      ret = thiz.inverse();
	      if (useString && ret == null) {
	        ret = '';
	      }
	    }

	    return ret;
	  },

	  //Parameter
	  param: function () {
	    var ret = this.result(),  //Get parameter value
	      name = '',
	      value;

	    //Make property name by multiple parameters
	    tools.each(arguments, function (item, i) {
	      name += item;
	    }, false, true);

	    //If the value length greater than 1, it need to be connected to a whole string.
	    if (ret != null) {
	      if (!tools.isArray(ret)) {
	        value = ret;
	      }
	      else {
	        value = '';
	        tools.each(tools.flatten(ret), function (item) {
	          value += item != null ? item : '';
	        }, false, true);
	      }
	    }
	    else {  //Match to Similar to "checked" or "disabled" attribute.
	      value = !this.useString ? true : name;
	    }

	    this.paramsExpr[name] = value;
	  },

	  //Spread parameters
	  spreadparam: function (refer) {
	    if (!refer) {
	      return;
	    }

	    var thiz = this;
	    tools.each(refer, function (v, k) {
	      thiz.paramsExpr[k] = v;
	    }, false, false);
	  },

	  equal: function (value1, value2) {
	    var ret;
	    if (value1 == value2) {
	      ret = this.result();
	    }
	    else {
	      ret = this.inverse();
	    }

	    return ret;
	  },

	  'for': function (start, end) {
	    var ret, useString = this.useString;
	    if (useString) {
	      ret = '';
	    }
	    else {
	      ret = [];
	    }

	    if (end == null) {
	      end = start;
	      start = 0;
	    }
	    start = parseInt(start, 10);
	    end = parseInt(end, 10);

	    for (; start <= end; start++) {
	      var retI = this.result({
	        index: start
	      });

	      if (useString) {
	        ret += retI;
	      }
	      else {
	        ret.push(retI);
	      }
	    }

	    return ret;
	  },

	  blank: function () {
	    return this.result();
	  }
	};

	function _commonConfig(params) {
	  var ret = {
	    data: true,
	    parent: true,
	    index: true,
	    useString: true,
	    paramsExpr: false,
	    result: true,
	    inverse: true,
	    newContext: false
	  };

	  if (params) {
	    ret = tools.assign(ret, params);
	  }
	  return ret;
	}

	//Expression default config
	var _defaultConfig = { data: false, parent: false, index: false },
	  exprConfig = {
	    'if': _commonConfig(_defaultConfig),
	    unless: _commonConfig(_defaultConfig),
	    each: _commonConfig(tools.assign({ newContext: true }, _defaultConfig)),
	    param: _commonConfig(tools.assign({ inverse: false, paramsExpr: true }, _defaultConfig)),
	    spreadparam: _commonConfig(tools.assign({ useString: false, result: false, inverse: false, paramsExpr: true }, _defaultConfig)),
	    equal: _commonConfig(tools.assign({ useString: false }, _defaultConfig)),
	    'for': _commonConfig(tools.assign({ newContext: true }, _defaultConfig, { data: true })),
	    blank: _commonConfig(tools.assign({ useString: false, inverse: false }, _defaultConfig))
	  };

	//Expression alias
	exprs.prop = exprs.p = exprs.param;
	exprConfig.prop = exprConfig.p = exprConfig.param;
	exprs.spread = exprs.spreadparam;
	exprConfig.spread = exprConfig.spreadparam;

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

	  tools.each(params, function (v, k) {
	    var name = k.toLowerCase();
	    if (v) {
	      var expr = v.expr,
	        options = v.options;

	      if (expr || options) {
	        if(expr) {
	          exprs[name] = expr;
	        }
	        if(options) {
	          exprConfig[name] = _commonConfig(options);
	        }
	      }
	      else {
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
/* 14 */
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
	    externalRule = '$';
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
	    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + exprRules + '][-a-z0-9_:./' + otherChars + ']*)[^>]*>$', 'i'),
	    openTag: _createRegExp('^[a-z' + firstChar + exprRules + '][-a-z0-9_:./' + otherChars + ']*', 'i'),
	    insideBraceParam: _createRegExp(startRule + '([^' + allRules + ']+)' + endRule, 'i'),
	    replaceBraceParam: function() {
	      return _createRegExp('[\\s]+(' + startRule + '){1,2}([^' + allRules + ']+)(' + endRule + '){1,2}', 'g')
	    },
	    replaceSplit: _createRegExp('(?:' + startRule + '){1,2}[^' + allRules + ']+(?:' + endRule + '){1,2}'),
	    replaceParam: function() {
	      return _createRegExp('((' + startRule + '){1,2})([^' + allRules + ']+)(' + endRule + '){1,2}', 'g');
	    },
	    checkElem: function() {
	      return _createRegExp('([^>]*)(<([a-z' + firstChar + '/' + exprRules + '!][-a-z0-9_:.' + allRules + exprRules + ']*)[^>]*>)([^<]*)', 'ig');
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  tools = __webpack_require__(3),
	  registerComponent = __webpack_require__(11).registerComponent;

	//注册模板装饰器
	function registerTmpl(name, template) {
	  if (tools.isObject(name)) {
	    template = name.template;
	    name = name.name;
	  }

	  return function (target) {
	    //注册组件
	    if(name != null) {
	      registerComponent(name, target);
	    }

	    //创建模板函数
	    if(template) {
	      target.prototype.template = nj.compileComponent(template, name);
	    }
	  };
	}

	module.exports = registerTmpl;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  utils = __webpack_require__(2),
	  buildRuntime = __webpack_require__(17),
	  compileStringTmpl = __webpack_require__(19);

	//编译模板并返回转换函数
	function compile(tmpl, tmplName, isComponent, fileName) {
	  if (!tmpl) {
	    return;
	  }
	  if (utils.isObject(tmplName)) {
	    var params = tmplName;
	    tmplName = params.tmplName;
	    isComponent = params.isComponent;
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

	      fns = buildRuntime(root.content, !isComponent);
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
	function compileComponent(tmpl, tmplName) {
	  return compile(tmpl, tmplName, true);
	}

	//渲染内联标签组件
	function renderTagComponent(data, selector, isAuto) {
	  var tags = utils.getTagComponents(selector, isAuto),
	    ret = [];

	  utils.each(tags, function (tag) {
	    var tmpl = compileComponent(tag.innerHTML, tag.id),
	      parentNode = tag.parentNode;

	    if (nj.componentLib === 'inferno') {
	      utils.removeChildNode(parentNode);
	    }
	    ret.push(nj.componentRender(tmpl(data), parentNode));
	  }, false, true);

	  return ret;
	}

	//Set init data for inline component
	function setInitTagData(data) {
	  nj.initTagData = data;
	}

	//Precompile template
	function precompile(tmpl, isComponent) {
	  var root = _createAstRoot();

	  if (utils.isString(tmpl)) {
	    tmpl = compileStringTmpl(tmpl);
	  }
	  utils.checkElem(tmpl, root);

	  return buildRuntime(root.content, !isComponent);
	}

	module.exports = {
	  compile: compile,
	  compileComponent: compileComponent,
	  renderTagComponent: renderTagComponent,
	  setInitTagData: setInitTagData,
	  precompile: precompile
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  utils = __webpack_require__(2),
	  errorTitle = nj.errorTitle,
	  exprConfig = utils.exprConfig,
	  filterConfig = utils.filterConfig,
	  replaceSpecialSymbol = __webpack_require__(18);

	function _buildFn(content, fns, no, newContext, level) {
	  var fnStr = '',
	    useString = fns.useString,
	    isTmplExpr = utils.isString(no),  //如果no为字符串, 则本次将构建tmpl块模板函数
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
	      _this: 0,
	      _value: 0,
	      _filter: 0,
	      _thisF: 0,
	      newContext: newContext
	    };

	  if (!useString) {
	    counter._compParam = 0;
	  }
	  else {
	    counter._children = 0;
	  }

	  if (main) {
	    fnStr += _buildVar();
	    fnStr += 'if(!parent) {\n';
	    fnStr += '  parent = p1.lightObj();\n';
	    fnStr += '  if (data) {\n';
	    fnStr += '    parent.data = multiData ? data[0] : data;\n';
	    fnStr += '  }\n';
	    fnStr += '  p2.parent = parent;\n';
	    fnStr += '};\n';
	  }
	  else if (newContext) {
	    fnStr += 'var parent = p1.lightObj(),\n';
	    fnStr += '  _parent = p2.parent,\n';
	    fnStr += '  multiData = p3.multiData,\n';
	    fnStr += '  hasItem = \'item\' in p4;\n';
	    fnStr += 'parent.data = hasItem ? p4.item : _parent.data;\n';
	    fnStr += 'parent.parent = p4.fallback ? _parent : _parent.parent;\n';
	    fnStr += 'parent.index = \'index\' in p4 ? p4.index : _parent.index;\n';
	    fnStr += 'var data;\n';
	    fnStr += 'if(hasItem) data = p1.getNewData(p4.item, p2.data, multiData, p4.addData);\n';
	    fnStr += 'else data = p2.data;\n';
	    fnStr += 'var _p2 = p1.lightObj();\n';
	    fnStr += '_p2.parent = parent;\n';
	    fnStr += '_p2.data = data;\n';
	    fnStr += 'var _p3 = p1.lightObj();\n';
	    fnStr += 'if(p4.addData) multiData = true;\n';
	    fnStr += '_p3.multiData = multiData;\n';
	  }
	  else {
	    fnStr += _buildVar();
	  }

	  if (retType === '2') {
	    if (!useString) {
	      fnStr += 'var ret = [];\n';
	    }
	    else {
	      fnStr += 'var ret = \'\';\n';
	    }
	  }

	  fnStr += _buildContent(content, fns, counter, retType, level);

	  if (retType === '2') {
	    fnStr += 'return ret;';
	  }

	  /* 构建表达式块函数
	   p1: 全局模板配置信息,不可改变
	   p2: 当前模板数据信息
	   p3: 当前模板配置信息
	   p4: 表格式块内调用result及inverse方法传递的参数
	   p5: #param块变量
	  */
	  fns[main ? 'main' + (isTmplExpr ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', 'p5', fnStr);
	  return no;
	}

	function _buildVar() {
	  return ('var parent = p2.parent,\n'
	    + '  data = p2.data,\n'
	    + '  multiData = p3.multiData;\n');
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
	      special = false;

	    if (name === '#') {
	      data = 'parent.index';
	      special = true;
	    }
	    else if (name === '.') {
	      data = 'parent.data';
	      special = true;
	    }

	    if (parentNum) {
	      if (!data) {
	        data = 'parent.data';
	      }
	      for (var i = 0; i < parentNum; i++) {
	        data = 'parent.' + data;
	      }

	      if (!special) {
	        data += '[\'' + name + '\']';
	        special = true;
	      }
	    }

	    if (!special) {
	      dataValueStr = '(!multiData ? data[\'' + name + '\'] : p1.getDatasValue(data, \'' + name + '\'))';
	    }
	    else {
	      dataValueStr = data;
	    }
	  }
	  else {
	    dataValueStr = '\'' + obj.prop.name + '\'';
	  }

	  //有过滤器时需要生成"_value"值
	  var filters = obj.prop.filters;
	  if (filters) {
	    var valueStr = '_value' + counter._value++,
	      filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

	    utils.each(filters, function (o) {
	      var _filterC = counter._filter++,
	        _thisFC = counter._thisF++,
	        configF = filterConfig[o.name],
	        noConfig = !configF;

	      filterStr += '\nvar _filter' + _filterC + ' = p1.filters[\'' + o.name + '\'];\n';
	      filterStr += 'if (!_filter' + _filterC + ') {\n';
	      filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
	      filterStr += '}\n';
	      filterStr += 'else {\n';
	      filterStr += '  var _thisF' + _thisFC + ' = p1.lightObj();\n';
	      if (noConfig || configF.useString) {
	        filterStr += '  _thisF' + _thisFC + '.useString = p1.useString;\n';
	      }
	      if (noConfig || configF.data) {
	        filterStr += '  _thisF' + _thisFC + '.data = parent.data;\n';
	      }
	      if (noConfig || configF.parent) {
	        filterStr += '  _thisF' + _thisFC + '.parent = parent.parent;\n';
	      }
	      if (noConfig || configF.index) {
	        filterStr += '  _thisF' + _thisFC + '.index = parent.index;\n';
	      }
	      filterStr += '\n  ' + valueStr + ' = _filter' + _filterC + '.apply(_thisF' + _thisFC + ', [' + valueStr
	        + (o.params ? o.params.reduce(function (p, c) {
	          return p + ', \'' + c + '\'';
	        }, '') : '')
	        + ']);\n';
	      filterStr += '}\n';
	    }, false, true);

	    return {
	      valueStr: _buildEscape(valueStr, useString, escape),
	      filterStr: filterStr
	    };
	  }
	  else {
	    return _buildEscape(dataValueStr, useString, escape);
	  }
	}

	function _buildEscape(valueStr, useString, escape) {
	  if (useString && escape) {
	    return 'p1.escape(' + valueStr + ')';
	  }
	  else {
	    return valueStr;
	  }
	}

	function _buildProps(obj, counter, fns) {
	  var str0 = obj.strs[0],
	    valueStr = '',
	    filterStr = '';

	  if (utils.isString(str0)) {  //常规属性
	    valueStr = !obj.isAll && str0 !== '' ? ('\'' + str0 + '\'') : '';
	    filterStr = '';

	    utils.each(obj.props, function (o, i) {
	      var propData = _buildPropData(o, counter, fns),
	        dataValueStr;
	      if (utils.isString(propData)) {
	        dataValueStr = propData;
	      }
	      else {
	        dataValueStr = propData.valueStr;
	        filterStr += propData.filterStr;
	      }

	      if (!obj.isAll) {
	        var strI = obj.strs[i + 1];
	        dataValueStr = (str0 === '' && i == 0 ? '' : ' + ')
	          + '(' + dataValueStr + ')'
	          + (strI !== '' ? ' + \'' + strI + '\'' : '');
	      }
	      else if (obj.isTmplPlace) {  //执行tmpl块模板函数
	        dataValueStr += '.call({ _njParent: parent }, data)';
	      }

	      valueStr += dataValueStr;
	      if (obj.isAll) {
	        return false;
	      }
	    }, false, true, true);
	  }
	  else if (utils.isObject(str0) && str0.length != null) {  //tmpl块表达式
	    valueStr += '{\n';
	    utils.each(str0, function (v, k, i, l) {
	      if (k !== 'length') {
	        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, fns, 'T' + ++fns._noT);
	      }
	      else {
	        valueStr += '  length: ' + v;
	      }
	      if (i < l - 1) {
	        valueStr += ',';
	      }
	      valueStr += '\n';
	    }, false, false);
	    valueStr += '}';
	  }
	  else if (utils.isObject(str0) && str0._njEx) {
	    valueStr = str0._njEx;
	  }
	  else {  //非字符串值
	    //The "_njShim" property is used to distinguish whether the incoming is an normal array.
	    valueStr = JSON.stringify(str0._njShim ? str0._njShim : str0);
	  }

	  if (filterStr === '') {
	    return valueStr;
	  }
	  else {  //包含过滤器
	    return {
	      valueStr: valueStr,
	      filterStr: filterStr
	    };
	  }
	}

	function _buildNode(node, fns, counter, retType, level) {
	  var fnStr = '',
	    useString = fns.useString;

	  if (node.type === 'nj_plaintext') {  //文本节点
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
	    }
	    else {  //文本中的特殊字符需转义
	      fnStr += replaceSpecialSymbol(textStr);
	    }
	  }
	  else if (node.type === 'nj_expr') {  //块表达式节点
	    var _exprC = counter._expr++,
	      _dataReferC = counter._dataRefer++,
	      dataReferStr = '';
	    fnStr += '\nvar _expr' + _exprC + ' = p1.exprs[\'' + node.expr + '\'];\n';

	    if (node.refer) {
	      dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';
	      var props = node.refer.props,
	        len = props.length,
	        filterStr = '';

	      utils.each(props, function (o, i) {
	        var valueStr = _buildPropData(o, counter, fns, true);
	        if (utils.isObject(valueStr)) {
	          filterStr += valueStr.filterStr;
	          valueStr = valueStr.valueStr;
	        }

	        dataReferStr += '  ' + valueStr + (i < len - 1 ? ',' : '');
	      }, false, true);
	      dataReferStr += '\n];\n';

	      if (filterStr !== '') {
	        dataReferStr = filterStr + dataReferStr;
	      }

	      fnStr += dataReferStr;
	    }

	    //如果表达式不存在则打印警告信息
	    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

	    //执行表达式块
	    var _thisC = counter._this++,
	      configE = exprConfig[node.expr],
	      noConfig = !configE,
	      newContext = configE ? configE.newContext : false,
	      newContextP = counter.newContext;

	    fnStr += '\nvar _this' + _thisC + ' = p1.lightObj();\n';
	    if (noConfig || configE.useString) {
	      fnStr += '_this' + _thisC + '.useString = p1.useString;\n';
	    }
	    if (noConfig || configE.data) {
	      fnStr += '_this' + _thisC + '.data = parent.data;\n';
	    }
	    if (noConfig || configE.parent) {
	      fnStr += '_this' + _thisC + '.parent = parent.parent;\n';
	    }
	    if (noConfig || configE.index) {
	      fnStr += '_this' + _thisC + '.index = parent.index;\n';
	    }

	    //params块
	    var paramsEStr = 'p5';
	    if (retType && retType._paramsE) {
	      paramsEStr = retType._paramsE;
	    }
	    if (noConfig || configE.paramsExpr) {
	      fnStr += '_this' + _thisC + '.paramsExpr = ' + paramsEStr + ';\n';
	    }

	    if (noConfig || configE.result) {
	      fnStr += '_this' + _thisC + '.result = ' + (node.content ? 'p1.exprRet(p1, ' + (newContextP ? '_' : '') + 'p2, ' + (newContextP ? '_' : '') + 'p3, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext, level) + ', ' + paramsEStr + ')' : 'p1.noop') + ';\n';
	    }
	    if (noConfig || configE.inverse) {
	      fnStr += '_this' + _thisC + '.inverse = ' + (node.contentElse ? 'p1.exprRet(p1, ' + (newContextP ? '_' : '') + 'p2, ' + (newContextP ? '_' : '') + 'p3, p1.fn' + _buildFn(node.contentElse, fns, ++fns._no, newContext, level) + ', ' + paramsEStr + ')' : 'p1.noop') + ';\n';
	    }

	    //渲染
	    fnStr += _buildRender(2, retType, {
	      _expr: _exprC,
	      _dataRefer: dataReferStr !== '' ? _dataReferC : 'none',
	      _this: _thisC
	    }, fns, level);
	  }
	  else {  //元素节点
	    //节点类型和typeRefer
	    var _typeC = counter._type++,
	      _type;
	    if (node.typeRefer) {
	      _type = node.typeRefer.props[0].prop.name;
	    }
	    else {
	      _type = node.type.toLowerCase();
	    }

	    var typeStr;
	    if (!useString) {
	      typeStr = 'p1.compClass[\'' + _type + '\'] ? p1.compClass[\'' + _type + '\'] : \'' + _type + '\'';
	    }
	    else {
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
	    }
	    else {
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
	        }
	        else {
	          var keys = '';
	          utils.each(params, function (v, k, i, l) {
	            if (i == 0) {
	              keys += '{ ';
	            }
	            keys += k + ': 1';

	            if (i < l - 1) {
	              keys += ', '
	            }
	            else {
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
	          var valueStr = _buildProps(params[k], counter, fns);
	          if (utils.isObject(valueStr)) {
	            filterStr += valueStr.filterStr;
	            valueStr = valueStr.valueStr;
	          }

	          if (!useString && k === 'style') {  //将style字符串转换为对象
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
	            }
	            else {
	              paramsStr += (i > 0 ? '  + ' : '') + '\' ' + key + (!onlyKey ? '="\' + ' + valueStr + ' + \'"\'' : ' \'') + (i == len - 1 ? ';' : '') + '\n';
	            }
	          }
	          else {
	            if (!useString) {
	              paramsStr += '_params' + _paramsC + '[\'' + key + '\'] = ' + (!onlyKey ? valueStr : 'true') + ';\n';
	            }
	            else {
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
	    if (!useString) {  //组件引擎参数
	      _compParamC = counter._compParam++;
	      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';
	    }
	    else {  //子节点字符串
	      _childrenC = counter._children++;
	      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
	    }

	    //子节点
	    fnStr += _buildContent(node.content, fns, counter, !useString
	      ? { _compParam: '_compParam' + _compParamC }
	      : { _children: '_children' + _childrenC }, level != null ? level + 1 : level);

	    //渲染
	    fnStr += _buildRender(3, retType, !useString
	      ? { _compParam: _compParamC }
	      : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level);
	  }

	  return fnStr;
	}

	function _buildContent(content, fns, counter, retType, level) {
	  var fnStr = '';
	  if (!content) {
	    return fnStr;
	  }

	  utils.each(content, function (node) {
	    fnStr += _buildNode(node, fns, counter, retType, level);
	  }, false, true);

	  return fnStr;
	}

	function _buildRender(nodeType, retType, params, fns, level) {
	  var retStr,
	    useString = fns.useString;

	  switch (nodeType) {
	    case 1:  //文本节点
	      retStr = _buildLevelSpace(level, useString) + params.text + (!useString || level == null ? '' : ' + \'\\n\'');
	      break;
	    case 2:  //块表达式
	      retStr = '_expr' + params._expr + '.apply(_this' + params._this + (params._dataRefer !== 'none' ? ', _dataRefer' + params._dataRefer : '') + ')';
	      break;
	    case 3:  //元素节点
	      if (!useString) {
	        retStr = 'p1.compPort.apply(p1.compLib, _compParam' + params._compParam + ')';
	      }
	      else {
	        var levelSpace = _buildLevelSpace(level, useString);
	        retStr = levelSpace + '\'<\' + _type' + params._type + ' + ' + (params._params != null ? '_params' + params._params + ' + ' : '');
	        if (!params._selfClose) {
	          retStr += '\'>\\n\'';
	          retStr += ' + _children' + params._children + ' + ';
	          retStr += levelSpace + '\'</\' + _type' + params._type + ' + \'>\\n\'';
	        }
	        else {
	          retStr += '\' />\\n\'';
	        }
	      }
	      break;
	  }

	  //保存方式
	  if (retType === '1') {
	    return '\nreturn ' + retStr + ';';
	  }
	  else if (retType === '2') {
	    if (!useString) {
	      return '\nret.push(' + retStr + ');\n';
	    }
	    else {
	      return '\nret += ' + retStr + ';\n';
	    }
	  }
	  else if (retType._paramsE) {
	    return '\n' + retStr + ';\n';
	  }
	  else {
	    if (!useString) {
	      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
	    }
	    else {
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

	module.exports = function (ast, useString) {
	  var fns = {
	    useString: useString,
	    _no: 0,  //块表达式函数计数
	    _noT: 0  //tmpl块模板函数计数
	  };

	  _buildFn(ast, fns, fns._no, null, 0);
	  return fns;
	};


/***/ },
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  tools = __webpack_require__(3),
	  tranElem = __webpack_require__(5),
	  tmplRule = nj.tmplRule,
	  shim = __webpack_require__(20);

	//Cache the string template by unique key
	nj.strTmpls = {};

	//Compile string template
	function compileStringTmpl(tmpl) {
	  var tmplKey, ret;
	  if (this) {  //The "tmplKey" parameter can be passed by the "this" object.
	    tmplKey = this.tmplKey;
	  }

	  if (tmplKey) {  //If the cache already has template data, direct return the template.
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
	  tools.each(xmls, function (xml, i) {
	    var split = '';
	    if (i < l - 1) {
	      var last = xml.length - 1,
	        useShim = xml[last] === '@',
	        arg, isEx;

	      if (isStr) {
	        var exArg = exArgs[i],
	          match = exArg.match(/#(\d+)/);

	        if (match && match[1] != null) {  //分隔符格式为"${#x}", 则按其编号顺序从nj函数参数列表中获取
	          arg = args[parseInt(match[1], 10) + 1];
	        }
	        else {
	          arg = exArg;
	          useShim = isEx = true;
	        }
	      }
	      else {
	        arg = args[i + 1];
	      }

	      if (!tools.isString(arg) || useShim) {
	        split = '_nj-split' + splitNo + '_';

	        //Use the shim function to convert the parameter when the front of it with a "@" mark.
	        if (useShim) {
	          if (isEx) {
	            arg = shim({ _njEx: arg });
	          }
	          else {
	            xml = xml.substr(0, last);
	            arg = shim(arg);
	          }
	        }

	        params.push(arg);
	        splitNo++;
	      }
	      else {
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
	      textAfter = matchArr[4];

	    //Text before tag
	    if (textBefore && textBefore !== '\n') {
	      textBefore = _formatText(textBefore);
	      _setText(textBefore, current.elem, params);
	    }

	    //Element tag
	    if (elem) {
	      if (elemName[0] === '/') {  //Close tag
	        if (elemName === '/' + current.elemName) {
	          current = current.parent;
	        }
	      }
	      else if (elem[elem.length - 2] === '/') {  //Self close tag
	        _setSelfCloseElem(elem, elemName, current.elem, params);
	      }
	      else {  //Open tag
	        parent = current;
	        current = {
	          elem: [],
	          elemName: elemName,
	          parent: parent
	        };

	        parent.elem.push(current.elem);
	        _setElem(elem, elemName, current.elem, params);
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
	  tools.each(params, function (p) {
	    if (tools.isArray(p)) {
	      str += '|' + _cascadeArr(p, true);
	    }
	    else {
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
	    }
	    else {
	      str = '';
	      for (var i = 0, l = p.length; i < l; i++) {
	        str += _cascadeArr(p[i]);
	      }
	    }
	  }
	  else {
	    str = '+' + p;
	  }

	  return str;
	}

	//Set element node
	function _setElem(elem, elemName, elemArr, params, bySelfClose) {
	  var ret, paramsExpr;
	  if (elemName[0] === tmplRule.exprRule) {
	    ret = elem.substring(1, elem.length - 1);
	  }
	  else if (elemName.indexOf(tmplRule.propRule) === 0) {
	    ret = tmplRule.exprRule + 'prop {\'' + elemName.substr(tmplRule.propRule.length) + '\'}';
	  }
	  else {
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
	  }
	  else {
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
	  elem = elem.replace(/([^\s={}>]+)=['"]?_nj-split(\d+)_['"]?/g, function (all, key, no) {
	    if (!paramsExpr) {
	      paramsExpr = [exprRule + 'params'];
	    }

	    paramsExpr.push([exprRule + "param " + startRule + "'" + key + "'" + endRule, params[no]]);
	    return '';
	  });

	  //Replace the parameter like "{...props}" and "{prop}".
	  elem = elem.replace(tmplRule.replaceBraceParam(), function (all, begin, prop) {
	    prop = prop.trim();
	    var propN = prop.replace(/\.\.\//g, '');

	    if (propN.indexOf('...') === 0) {
	      if (!paramsExpr) {
	        paramsExpr = [exprRule + 'params'];
	      }

	      paramsExpr.push([exprRule + 'spreadParam ' + startRule + prop.replace(/\.\.\./g, '') + endRule + '/']);
	      return ' ';
	    }
	    else {
	      return ' ' + propN + '=' + all.trim();
	    }
	  });

	  return {
	    elem: elem,
	    params: paramsExpr
	  };
	}

	//Set self close element node
	function _setSelfCloseElem(elem, elemName, elemArr, params) {
	  if (elemName === tmplRule.exprRule + 'else') {
	    elemArr.push(elem.substr(1, 5));
	  }
	  else {
	    _setElem(elem, elemName, elemArr, params, true);
	  }
	}

	//Set text node
	function _setText(text, elemArr, params) {
	  var pattern = /_nj-split(\d+)_/g, matchArr,
	    splitNos = [];

	  while ((matchArr = pattern.exec(text))) {
	    splitNos.push(matchArr[1]);
	  }

	  if (splitNos.length) {
	    tools.each(text.split(/_nj-split(?:\d+)_/), function (t) {
	      if (t !== '') {
	        elemArr.push(t);
	      }

	      var no = splitNos.shift();
	      if (no != null) {
	        elemArr.push(params[no]);
	      }
	    }, false, true);
	  }
	  else {
	    elemArr.push(text);
	  }
	}

	//Set template props
	function _setTmplProps(tmpl, key) {
	  tmpl.njKey = key;

	  tmpl.render = function () {
	    return nj.compile(this, this.njKey).apply(null, arguments);
	  };

	  tmpl.renderComponent = function () {
	    return nj.compileComponent(this, this.njKey).apply(null, arguments);
	  };
	}

	module.exports = compileStringTmpl;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	//Converts any value to the parameter of NornJ template can be parsed.
	module.exports = function (obj) {
	  return {
	    _njShim: obj
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var checkStringElem = __webpack_require__(19);

	module.exports = function (key) {
	  return function() {
	    return checkStringElem.apply({ tmplKey: key }, arguments);
	  };
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (callback) {
	  var doc = document;
	  if (doc.addEventListener) {
	    doc.addEventListener("DOMContentLoaded", callback, false);
	  }
	  else {
	    self.attachEvent("onload", callback);
	  }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var nj = __webpack_require__(1),
	  tools = __webpack_require__(3);

	module.exports = function (configs) {
	  tools.assign(nj, configs);
	};

/***/ }
/******/ ])
});
;