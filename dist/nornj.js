/*!
* NornJ template engine v5.0.0-rc.13
* (c) 2016-2019 Joe_Sky
* Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.NornJ = {}));
}(this, function (exports) { 'use strict';

  function nj() {
    return nj['taggedTmpl' + (nj.outputH ? 'H' : '')].apply(null, arguments);
  }
  nj.createElement = null;
  nj.components = {};
  nj.componentConfig = new Map();
  nj.preAsts = {};
  nj.asts = {};
  nj.templates = {};
  nj.errorTitle = '[NornJ]';
  nj.tmplRule = {};
  nj.outputH = false;
  nj.global = typeof self !== 'undefined' ? self : global;
  nj.textTag = 'nj-text';
  nj.textMode = false;
  nj.noWsTag = 'nj-noWs';
  nj.noWsMode = false;
  nj.fixTagName = true;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nativeArrayPush = Array.prototype.push,
      nativeArraySlice = Array.prototype.slice,
      hasOwnProperty = Object.prototype.hasOwnProperty,
      toString = Object.prototype.toString;
  var errorTitle = nj.errorTitle;
  var defineProp = Object.defineProperty;
  var defineProps = Object.defineProperties; //Push one by one to array

  function arrayPush(arr1, arr2) {
    nativeArrayPush.apply(arr1, arr2);
    return arr1;
  }
  function arraySlice(arrLike, start, end) {
    return nativeArraySlice.call(arrLike, start, end);
  } //判断是否为数组

  function isArray(obj) {
    return Array.isArray(obj);
  } //判断是否为对象

  function isObject(obj) {
    var type = _typeof(obj);

    return !isArray(obj) && (type === 'function' || type === 'object' && !!obj);
  } //判断是否为数字

  function isNumber(obj) {
    return toString.call(obj) === '[object Number]';
  } //判断是否为字符串

  function isString(obj) {
    return toString.call(obj) === '[object String]';
  } //获取属性值

  function _getProperty(key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  } //是否为类数组


  var _getLength = _getProperty('length');

  function isArrayLike(obj) {
    var length = _getLength(obj);

    return typeof length == 'number' && length >= 0;
  } //遍历数组或对象

  function each(obj, func, isArr) {
    if (!obj) {
      return;
    }

    if (isArr == null) {
      isArr = isArrayLike(obj);
    }

    if (isArr) {
      for (var i = 0, l = obj.length; i < l; i++) {
        var ret = func.call(obj, obj[i], i, l);

        if (ret === false) {
          break;
        }
      }
    } else {
      var keys = Object.keys(obj),
          _l = keys.length;

      for (var _i = 0; _i < _l; _i++) {
        var k = keys[_i],
            _ret = func.call(obj, obj[k], k, _i, _l);

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
  } //Noop function

  function noop() {} //抛出异常

  function throwIf(val, msg, type) {
    if (!val) {
      switch (type) {
        case 'ex':
          throw Error(errorTitle + 'Extension tag "' + msg + '" is undefined, please check it has been registered.');

        default:
          throw Error(errorTitle + (msg || val));
      }
    }
  } //Print warn

  function warn(msg, type) {
    switch (type) {
      case 'f':
        msg = 'A filter called "' + msg + '" is undefined.';
        break;
    }

    console.warn(errorTitle + msg);
  } //Print error

  function error(msg) {
    console.error(errorTitle + msg);
  } //create light weight object

  function obj() {
    return Object.create(null);
  } //Clear quotation marks

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
  } //Transform to camel-case

  function camelCase(str) {
    if (str.indexOf('-') > -1) {
      str = str.replace(/-\w/g, function (letter) {
        return letter.substr(1).toUpperCase();
      });
    }

    return str;
  } //Reference by babel-external-helpers

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
  function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1);
  }
  function lowerFirst(str) {
    return str[0].toLowerCase() + str.substr(1);
  }
  assign(nj, {
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
    camelCase: camelCase,
    assign: assign,
    capitalize: capitalize,
    lowerFirst: lowerFirst
  });

  var tools = /*#__PURE__*/Object.freeze({
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
    trimRight: trimRight,
    noop: noop,
    throwIf: throwIf,
    warn: warn,
    error: error,
    obj: obj,
    clearQuot: clearQuot,
    camelCase: camelCase,
    assign: assign,
    capitalize: capitalize,
    lowerFirst: lowerFirst
  });

  var components = nj.components,
      componentConfig = nj.componentConfig;
  function registerComponent(name, component, options) {
    var params = name,
        ret;

    if (!isObject(name)) {
      params = {};
      params[name] = {
        component: component,
        options: options
      };
    }

    each(params, function (v, k, i) {
      var comp;

      if (v != null) {
        var _component = v.component,
            _options = v.options;

        var _name = k.toLowerCase();

        comp = _component ? _component : v;
        components[_name] = comp;
        componentConfig.set(comp, _options);
      }

      if (i == 0) {
        ret = comp;
      } else {
        if (i == 1) {
          ret = [ret];
        }

        ret.push(comp);
      }
    }, false);
    return ret;
  }
  function getComponentConfig(name) {
    return componentConfig.get(isString(name) ? components[name] || name : name);
  }
  function copyComponentConfig(component, from) {
    componentConfig.set(component, componentConfig.get(from));
    return component;
  }

  function _createRegExp(reg, mode) {
    return new RegExp(reg, mode);
  } //Clear the repeated characters


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

  function _replace$(str) {
    return str.replace(/\$/g, '\\$');
  }

  function _replaceMinus(str) {
    return str.replace(/\-/g, '\\-');
  }

  function createTmplRule() {
    var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isGlobal = arguments.length > 1 ? arguments[1] : undefined;
    var _nj$tmplRule = nj.tmplRule,
        _nj$tmplRule$startRul = _nj$tmplRule.startRule,
        startRule = _nj$tmplRule$startRul === void 0 ? '{{' : _nj$tmplRule$startRul,
        _nj$tmplRule$endRule = _nj$tmplRule.endRule,
        endRule = _nj$tmplRule$endRule === void 0 ? '}}' : _nj$tmplRule$endRule,
        _nj$tmplRule$extensio = _nj$tmplRule.extensionRule,
        extensionRule = _nj$tmplRule$extensio === void 0 ? 'n-' : _nj$tmplRule$extensio,
        _nj$tmplRule$propRule = _nj$tmplRule.propRule,
        propRule = _nj$tmplRule$propRule === void 0 ? 'p-' : _nj$tmplRule$propRule,
        _nj$tmplRule$strPropR = _nj$tmplRule.strPropRule,
        strPropRule = _nj$tmplRule$strPropR === void 0 ? 's' : _nj$tmplRule$strPropR,
        _nj$tmplRule$template = _nj$tmplRule.templateRule,
        templateRule = _nj$tmplRule$template === void 0 ? 'template' : _nj$tmplRule$template,
        _nj$tmplRule$tagSpRul = _nj$tmplRule.tagSpRule,
        tagSpRule = _nj$tmplRule$tagSpRul === void 0 ? '#$@' : _nj$tmplRule$tagSpRul,
        _nj$tmplRule$commentR = _nj$tmplRule.commentRule,
        commentRule = _nj$tmplRule$commentR === void 0 ? '-' : _nj$tmplRule$commentR;
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

    var firstChar = startRule[0],
        lastChar = endRule[endRule.length - 1],
        extensionRules = _replaceMinus(_clearRepeat(extensionRule + propRule + strPropRule + tagSpRule)),
        escapeExtensionRule = _replace$(extensionRule),
        escapePropRule = _replace$(propRule),
        escapeStrPropRule = _replace$(strPropRule),
        startRuleR = firstChar + startRule,
        endRuleR = endRule + lastChar,
        varContent = '[\\s\\S]+?',
        varContentS = '\\.\\.\\.' + varContent,
        braceParamStr = startRuleR + varContent + endRuleR + '|' + startRule + varContent + endRule;

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
      braceParamStr: braceParamStr,
      xmlOpenTag: _createRegExp('^<([a-z' + firstChar + extensionRules + '][^\\s>]*)[^>]*>$', 'i'),
      openTagParams: _createRegExp('[\\s]+(((' + startRuleR + '(' + varContent + ')' + endRuleR + ')|(' + startRule + '(' + varContent + ')' + endRule + '))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
      directives: _createRegExp('[\\s]+(((' + startRuleR + '(' + varContent + ')' + endRuleR + ')|(' + startRule + '(' + varContent + ')' + endRule + '))|((:?)(' + escapeExtensionRule + ')?([^\\s=>]+)))(=((\'[^\']+\')|("[^"]+")|([^"\'\\s>]+)))?', 'g'),
      braceParam: _createRegExp(braceParamStr, 'i'),
      braceParamG: _createRegExp(braceParamStr, 'ig'),
      spreadProp: _createRegExp('[\\s]+(' + startRuleR + '[\\s]*(' + varContentS + ')' + endRuleR + ')|(' + startRule + '[\\s]*(' + varContentS + ')' + endRule + ')', 'g'),
      replaceSplit: _createRegExp(braceParamStr),
      replaceParam: _createRegExp('((' + startRuleR + ')(' + varContent + ')' + endRuleR + ')|((' + startRule + ')(' + varContent + ')' + endRule + ')', 'g'),
      checkElem: _createRegExp('([^<>]+)|(<([a-z/!' + firstChar + extensionRules + '][^\\s<>]*)([^<>]*)>|<)([^<]*)', 'ig'),
      extension: _createRegExp('^' + escapeExtensionRule + '([^\\s]+)', 'i'),
      exAll: _createRegExp('^([/]?)(' + escapeExtensionRule + '|' + escapeStrPropRule + escapePropRule + '|' + escapePropRule + ')([^\\s]+)', 'i'),
      include: _createRegExp('<' + escapeExtensionRule + 'include([^>]*)>', 'ig'),
      incompleteStart: _createRegExp(startRule + '((?!' + endRule + ')[\\s\\S])*$'),
      incompleteStartR: _createRegExp(startRuleR + '((?!' + endRuleR + ')[\\s\\S])*$'),
      incompleteEnd: _createRegExp('^[\\s\\S]*?' + endRule),
      incompleteEndR: _createRegExp('^[\\s\\S]*?' + endRuleR)
    };

    if (isGlobal) {
      //Reset the regexs to global list
      assign(nj.tmplRule, tmplRules);
    } else {
      return tmplRules;
    }
  }

  createTmplRule({}, true);

  function config (configs) {
    var delimiters = configs.delimiters,
        includeParser = configs.includeParser,
        createElement = configs.createElement,
        outputH = configs.outputH,
        textMode = configs.textMode,
        noWsMode = configs.noWsMode,
        fixTagName = configs.fixTagName;

    if (delimiters) {
      createTmplRule(delimiters, true);
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

    if (textMode != null) {
      nj.textMode = textMode;
    }

    if (noWsMode != null) {
      nj.noWsMode = noWsMode;
    }

    if (fixTagName != null) {
      nj.fixTagName = fixTagName;
    }
  }

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
    nbsp: "\xA0",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lt: '<',
    gt: '>',
    amp: '&',
    quot: '"',
    '#x27': '\''
  };
  var REGEX_UNESCAPE = new RegExp('&(' + Object.keys(UNESCAPE_LOOKUP).join('|') + ');', 'g');
  function unescape(str) {
    if (str == null) {
      return '';
    } else if (!str.replace) {
      return str;
    }

    return str.replace(REGEX_UNESCAPE, function (all, match) {
      return UNESCAPE_LOOKUP[match];
    });
  }
  assign(nj, {
    escape: escape,
    unescape: unescape
  });

  var REGEX_NUM = /^(-?([0-9]+[\.]?[0-9]+)|[0-9])$/; //提取style内参数

  function styleProps(obj) {
    //If the parameter is a style object,then direct return.
    if (isObject(obj) || isArray(obj) || isNumber(obj)) {
      return obj;
    } //参数为字符串


    var pattern = /([^\s:]+)[\s]?:[\s]?([^;]+)[;]?/g,
        matchArr,
        ret;

    while (matchArr = pattern.exec(obj)) {
      var key = matchArr[1],
          value = matchArr[2];

      if (!ret) {
        ret = {};
      } //Convert to lowercase when style name is all capital.


      if (/^[A-Z-]+$/.test(key)) {
        key = key.toLowerCase();
      } //将连字符转为驼峰命名


      key = camelCase(key);
      ret[key] = REGEX_NUM.test(value) ? Number(value) : value;
    }

    return ret;
  } //Get value from multiple datas

  function getData(prop, data, hasSource) {
    var value, obj;

    if (!data) {
      data = this.data;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      obj = data[i];

      if (obj) {
        value = obj[prop];

        if (value !== undefined) {
          if (hasSource) {
            return {
              source: obj,
              value: value,
              prop: prop,
              _njSrc: true
            };
          }

          return value;
        }
      }
    }
  }
  function getAccessorData(fn, context) {
    if (fn == null) {
      return fn;
    }

    if (fn._njTmpl) {
      //模板函数
      return fn.call(context);
    } else {
      //普通函数
      return fn.call(context.$this, context);
    }
  }
  function getElement(name, global, nameO, context, subName) {
    var element;

    if (!context.icp) {
      element = global.cp[name];
    } else {
      element = getData(nameO, context.icp);

      if (!element) {
        element = global.cp[name];
      }
    }

    if (subName != null && element) {
      element = element[subName];
    }

    return element ? element : nameO;
  }
  function getElementRefer(refer, name, global, nameO, context) {
    return refer != null ? isString(refer) ? getElement(refer.toLowerCase(), global, refer, context) : refer : getElement(name, global, nameO, context);
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
  } //Rebuild local variables in the new context

  function newContext(context, params) {
    if (!params) {
      return context;
    }

    return assign({}, context, {
      data: params.data ? arrayPush(params.data, context.data) : context.data,
      parent: params.newParent ? context : context.parent,
      index: params.index != null ? params.index : context.index,
      item: params.item != null ? params.item : context.item
    });
  } //修正属性名

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
  } //合并字符串属性

  function assignStrProps() {
    var ret = '',
        retObj = assign.apply(tools, arguments);

    for (var k in retObj) {
      var v = retObj[k];
      ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
    }

    return ret;
  } //创建扩展标签子节点函数

  function exRet(global, context, fn) {
    return function (param) {
      return fn(global, context, param);
    };
  }

  function _getLocalComponents(localConfigs) {
    var icp;

    if (localConfigs && localConfigs.components) {
      icp = localConfigs.components;

      if (!isArray(icp)) {
        icp = [icp];
      }
    }

    return icp;
  } //构建可运行的模板函数


  function tmplWrap(configs, main) {
    return function (param1, param2) {
      var ctx = this,
          data = arraySlice(arguments);
      return main(configs, ctx && ctx._njCtx ? assign({}, ctx, {
        data: arrayPush(data, ctx.data)
      }) : {
        data: data,
        getData: getData,

        get $this() {
          return this.data[this.data.length - 1];
        },

        d: getData,
        icp: _getLocalComponents(param1 && param1._njParam ? param2 : param1),
        _njCtx: true
      });
    };
  }

  function levelSpace(context) {
    if (context.level == null) {
      return '';
    }

    var ret = '';

    for (var i = 0; i < context.level; i++) {
      ret += '  ';
    }

    return ret;
  }

  function firstNewline(context) {
    return context.index == null ? '' : context.index == 0 ? '' : '\n';
  }

  function createElementApply(p) {
    return nj.createElement.apply(null, p);
  }

  function callFilter(filter) {
    return filter.source ? filter.value.bind(filter.source) : filter;
  } //创建模板函数


  function template(fns, tmplKey) {
    var configs = {
      tmplKey: tmplKey,
      us: fns.useString,
      x: nj.extensions,
      f: nj.filters,
      np: noop,
      tf: throwIf,
      wn: warn,
      n: newContext,
      c: getAccessorData,
      sp: styleProps,
      r: exRet,
      e: getElement,
      er: getElementRefer,
      en: getElementName,
      aa: addArgs,
      an: assign,
      g: nj.global,
      cf: callFilter
    };

    if (!configs.us) {
      configs.h = nj.createElement;
      configs.H = createElementApply;
      configs.cp = nj.components;
    } else {
      configs.ans = assignStrProps;
      configs.es = nj.escape;
      configs.ls = levelSpace;
      configs.fl = firstNewline;
    }

    each(fns, function (v, k) {
      if (k === 'main') {
        //将每个主函数构建为可运行的模板函数
        configs[k] = tmplWrap(configs, v);
        defineProps(configs[k], {
          _njTmpl: {
            value: true
          }
        });
        configs['_' + k] = v;
      } else if (k.indexOf('fn') === 0) {
        //扩展标签函数
        configs[k] = v;
      }
    }, false);
    return configs;
  }

  var extensions = {
    'if': function _if(value, options) {
      if (value && value._njOpts) {
        options = value;
        value = options.props.condition;
      }

      if (value === 'false') {
        value = false;
      }

      var ret;

      if (!!value) {
        ret = options.children();
      } else {
        var props = options.props;

        if (props) {
          var elseFn = props['else'];

          if (props.elseifs) {
            var l = props.elseifs.length;
            each(props.elseifs, function (elseif, i) {
              if (!!elseif.value) {
                ret = elseif.fn();
                return false;
              } else if (i === l - 1) {
                if (elseFn) {
                  ret = elseFn();
                }
              }
            }, true);
          } else {
            if (elseFn) {
              ret = elseFn();
            }
          }
        }
      }

      if (options.useString && ret == null) {
        return '';
      }

      return ret;
    },
    'else': function _else(options) {
      return options.tagProps['else'] = options.children;
    },
    'elseif': function elseif(value, options) {
      if (value && value._njOpts) {
        options = value;
        value = options.props.condition || options.props.value;
      }

      var _options = options,
          tagProps = _options.tagProps;

      if (!tagProps.elseifs) {
        tagProps.elseifs = [];
      }

      tagProps.elseifs.push({
        value: value,
        fn: options.children
      });
    },
    'switch': function _switch(value, options) {
      if (value && value._njOpts) {
        options = value;
        value = options.props.value;
      }

      var ret,
          props = options.props,
          l = props.elseifs.length;
      each(props.elseifs, function (elseif, i) {
        if (value === elseif.value) {
          ret = elseif.fn();
          return false;
        } else if (i === l - 1) {
          if (props['else']) {
            ret = props['else']();
          }
        }
      }, true);
      return ret;
    },
    each: function each$1(list, options) {
      if (list && list._njOpts) {
        options = list;
        list = options.props.of;
      }

      var useString = options.useString,
          props = options.props,
          ret;

      if (list) {
        if (useString) {
          ret = '';
        } else {
          ret = [];
        }

        var isArrayLike$1 = isArrayLike(list);
        each(list, function (item, index, len, lenObj) {
          var param = {
            data: [item],
            index: isArrayLike$1 ? index : len,
            item: item,
            newParent: true
          };

          var _len = isArrayLike$1 ? len : lenObj;

          var extra = {
            '@first': param.index === 0,
            '@last': param.index === _len - 1
          };

          if (!isArrayLike$1) {
            extra['@key'] = index;
          }

          param.data.push(extra);
          var retI = options.children(param);

          if (useString) {
            ret += retI;
          } else {
            ret.push(retI);
          }
        }, isArrayLike$1); //Return null when not use string and result is empty.

        if (!useString && !ret.length) {
          ret = null;
        }

        if ((!ret || !ret.length) && props && props['else']) {
          ret = props['else']();
        }
      } else {
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
      var ret = options.value(),
          //Get parameter value
      value;

      if (ret !== undefined) {
        value = ret;
      } else {
        //Match to Similar to "checked" or "disabled" attribute.
        value = !options.useString ? true : name;
      }

      options.tagProps[options.outputH ? fixPropName(name) : name] = value;
    },
    //Spread parameters
    spread: function spread(props, options) {
      var tagProps = options.tagProps;
      each(props, function (v, k) {
        tagProps[k] === undefined && (options.tagProps[k] = v);
      }, false);
    },
    show: function show(options) {
      if (!options.value()) {
        var tagProps = options.tagProps,
            useString = options.useString;

        if (!tagProps.style) {
          tagProps.style = useString ? '' : {};
        }

        if (useString) {
          tagProps.style += (tagProps.style ? ';' : '') + 'display:none';
        } else if (isArray(tagProps.style)) {
          tagProps.style.push({
            display: 'none'
          });
        } else {
          tagProps.style.display = 'none';
        }
      }
    },
    obj: function obj(options) {
      return options.props;
    },
    block: function block(options) {
      return options.children();
    },
    'with': function _with(originalData, options) {
      if (originalData && originalData._njOpts) {
        options = originalData;
        return options.children({
          data: [options.props]
        });
      } else {
        var _options2 = options,
            props = _options2.props;
        return options.children({
          data: [props && props.as ? _defineProperty({}, props.as, originalData) : originalData]
        });
      }
    },
    arg: function arg(options) {
      var tagProps = options.tagProps;

      if (!tagProps.args) {
        tagProps.args = [];
      }

      tagProps.args.push(options.value());
    },
    css: function css(options) {
      return options.props.style;
    }
  };

  function _config(params, extra) {
    var ret = {
      onlyGlobal: false,
      useString: false,
      newContext: true,
      isSubTag: false,
      isDirective: false,
      isBindable: false,
      useExpressionInProps: true,
      hasName: true,
      noTagName: false,
      hasTagProps: true,
      hasTmplCtx: true,
      hasOutputH: false
    };

    if (params) {
      ret = assign(ret, params);
    }

    if (extra) {
      ret = assign(ret, extra);
    }

    return ret;
  }

  var _defaultCfg = {
    onlyGlobal: true,
    newContext: false,
    hasName: false,
    hasTagProps: false,
    hasTmplCtx: false
  }; //Extension default config

  var extensionConfig = {
    'if': _config(_defaultCfg),
    'else': _config(_defaultCfg, {
      isSubTag: true,
      hasTagProps: true
    }),
    'switch': _config(_defaultCfg, {
      needPrefix: 'onlyLowerCase'
    }),
    each: _config(_defaultCfg, {
      newContext: {
        item: 'item',
        index: 'index',
        data: {
          first: ['@first', 'first'],
          last: ['@last', 'last'],
          key: ['@key', 'key']
        }
      }
    }),
    prop: _config(_defaultCfg, {
      isDirective: true,
      needPrefix: true,
      hasTagProps: true
    }),
    obj: _config(_defaultCfg, {
      needPrefix: true
    }),
    'with': _config(_defaultCfg, {
      newContext: {
        getDataFromProps: true
      }
    }),
    style: {
      useExpressionInProps: false,
      needPrefix: true
    }
  };
  extensionConfig.elseif = _config(extensionConfig['else']);
  extensionConfig.spread = _config(extensionConfig.prop);
  extensionConfig.block = _config(extensionConfig.obj);
  extensionConfig.arg = _config(extensionConfig.prop);
  extensionConfig.show = _config(extensionConfig.prop, {
    noTagName: true,
    hasOutputH: true
  });
  extensionConfig.css = _config(extensionConfig.obj); //Extension alias

  extensions['for'] = extensions.each;
  extensionConfig['for'] = _config(extensionConfig.each);
  extensions['case'] = extensions.elseif;
  extensionConfig['case'] = extensionConfig.elseif;
  extensions['empty'] = extensions['default'] = extensions['else'];
  extensionConfig['empty'] = extensionConfig['default'] = extensionConfig['else'];
  extensions.strProp = extensions.prop;
  extensionConfig.strProp = _config(extensionConfig.prop, {
    useString: true
  });
  extensions.strArg = extensions.arg;
  extensionConfig.strArg = _config(extensionConfig.strProp);
  extensions.pre = extensions.block;
  extensionConfig.pre = extensionConfig.block; //Register extension and also can batch add

  function registerExtension(name, extension, options, mergeConfig) {
    var params = name;

    if (!isObject(name)) {
      params = {};
      params[name] = {
        extension: extension,
        options: options
      };
    }

    each(params, function (v, name) {
      if (v) {
        var _extension = v.extension,
            _options3 = v.options;

        if (_extension) {
          extensions[name] = _extension;
        } else if (!mergeConfig) {
          extensions[name] = v;
        }

        if (mergeConfig) {
          if (!extensionConfig[name]) {
            extensionConfig[name] = _config();
          }

          if (isObject(_options3)) {
            assign(extensionConfig[name], _options3);
          } else {
            extensionConfig[name] = _config();
          }
        } else {
          extensionConfig[name] = _config(_options3);
        }
      }
    }, false);
  }
  assign(nj, {
    extensions: extensions,
    extensionConfig: extensionConfig,
    registerExtension: registerExtension
  });

  var REGEX_DIGITS_RE = /(\d{3})(?=\d)/g; //Global filter list

  var filters = {
    //Get properties
    '.': function _(obj, prop, callFn) {
      if (obj == null) {
        return obj;
      }

      if (obj._njSrc) {
        return {
          source: obj.value,
          value: obj.value[prop],
          prop: prop,
          parent: obj,
          _njSrc: true
        };
      } else if (callFn) {
        return {
          source: obj,
          value: obj[prop],
          prop: prop,
          _njSrc: true
        };
      }

      return obj[prop];
    },
    //Call function
    _: function _(fn, args) {
      if (fn == null) {
        return fn;
      }

      if (fn._njSrc) {
        var _fn = fn.source[fn.prop];
        return _fn != null ? _fn.apply(fn.source, args) : _fn;
      }

      return fn.apply(null, args);
    },
    //Get accessor properties
    '#': function _(obj, prop, options) {
      if (obj == null) {
        return obj;
      }

      return getAccessorData(obj[prop], options.context);
    },
    '**': function _(val1, val2) {
      var ret = Math.pow(val1, val2);
      return isNaN(ret) ? 0 : ret;
    },
    '%%': function _(val1, val2) {
      var ret = Math.floor(val1 / val2);
      return isNaN(ret) ? 0 : ret;
    },
    //Ternary operator
    '?:': function _(val, val1, val2) {
      return val ? val1 : val2;
    },
    '!': function _(val) {
      return !val;
    },
    //Convert to int 
    int: function int(val) {
      var radix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var ret = parseInt(val, radix);
      return isNaN(ret) ? 0 : ret;
    },
    //Convert to float 
    float: function float(val, bit) {
      var ret = parseFloat(val);
      return isNaN(ret) ? 0 : bit != null ? ret.toFixed(bit) : ret;
    },
    //Convert to boolean 
    bool: function bool(val) {
      if (val === 'false') {
        return false;
      }

      return Boolean(val);
    },
    reg: function reg(pattern, flags) {
      return new RegExp(pattern, flags);
    },
    //Transform css string to object
    css: function css(cssText) {
      return styleProps(cssText);
    },
    //Generate array by two positive integers,closed interval 
    '..': _getArrayByNum(1),
    //Generate array by two positive integers,right open interval
    rLt: _getArrayByNum(0),
    //Compare two number or letter 
    '<=>': function _(val1, val2) {
      if (val1 > val2) {
        return 1;
      } else if (val1 == val2) {
        return 0;
      } else {
        return -1;
      }
    },
    capitalize: function capitalize$1(str) {
      return capitalize(str);
    },
    lowerFirst: function lowerFirst$1(str) {
      return lowerFirst(str);
    },
    camelCase: function camelCase$1(str) {
      return camelCase(str);
    },
    isObject: function isObject$1(val) {
      return isObject(val);
    },
    isNumber: function isNumber$1(val) {
      return isNumber(val);
    },
    isString: function isString$1(val) {
      return isString(val);
    },
    isArrayLike: function isArrayLike$1(val) {
      return isArrayLike(val);
    },
    currency: function currency(value, decimals, _currency) {
      if (!(value - parseFloat(value) >= 0)) return filterConfig.currency.placeholder;
      value = parseFloat(value);
      _currency = decimals != null && typeof decimals == 'string' ? decimals : _currency;
      _currency = _currency != null && typeof _currency == 'string' ? _currency : filterConfig.currency.symbol;
      decimals = decimals != null && typeof decimals == 'number' ? decimals : 2;
      var stringified = Math.abs(value).toFixed(decimals);

      var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;

      var i = _int.length % 3;
      var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';

      var _float = decimals ? stringified.slice(-1 - decimals) : '';

      var sign = value < 0 ? '-' : '';
      return sign + _currency + head + _int.slice(i).replace(REGEX_DIGITS_RE, '$1,') + _float;
    }
  };

  function _getArrayByNum(isContainEnd) {
    return function (val1, val2) {
      return Object.keys(Array.apply(null, {
        length: val2 - val1 + isContainEnd
      })).map(function (item) {
        return +item + val1;
      });
    };
  }

  function _config$1(params, extra) {
    var ret = {
      onlyGlobal: false,
      hasOptions: false,
      isOperator: false,
      hasLevel: false,
      hasTmplCtx: true,
      alias: null
    };

    if (params) {
      ret = assign(ret, params);
    }

    if (extra) {
      ret = assign(ret, extra);
    }

    return ret;
  }

  var _defaultCfg$1 = {
    onlyGlobal: true,
    hasOptions: false
  }; //Filter default config

  var filterConfig = {
    '.': _config$1(_defaultCfg$1),
    '_': _config$1({
      onlyGlobal: true
    }),
    '#': _config$1({
      onlyGlobal: true,
      hasOptions: true,
      hasLevel: true
    }),
    '**': _config$1(_defaultCfg$1),
    '%%': _config$1(_defaultCfg$1),
    '?:': _config$1(_defaultCfg$1),
    '!': _config$1(_defaultCfg$1),
    int: _config$1(_defaultCfg$1),
    float: _config$1(_defaultCfg$1),
    bool: _config$1(_defaultCfg$1),
    reg: _config$1(_defaultCfg$1),
    css: _config$1(_defaultCfg$1),
    '..': _config$1(_defaultCfg$1),
    rLt: _config$1(_defaultCfg$1),
    '<=>': _config$1(_defaultCfg$1),
    capitalize: _config$1(_defaultCfg$1),
    lowerFirst: _config$1(_defaultCfg$1),
    camelCase: _config$1(_defaultCfg$1),
    isObject: _config$1(_defaultCfg$1),
    isNumber: _config$1(_defaultCfg$1),
    isString: _config$1(_defaultCfg$1),
    isArrayLike: _config$1(_defaultCfg$1),
    currency: _config$1(_defaultCfg$1, {
      symbol: '$',
      placeholder: ''
    })
  }; //Register filter and also can batch add

  function registerFilter(name, filter, options, mergeConfig) {
    var params = name;

    if (!isObject(name)) {
      params = {};
      params[name] = {
        filter: filter,
        options: options
      };
    }

    each(params, function (v, name) {
      if (v) {
        var _filter = v.filter,
            _options = v.options;

        if (_options) {
          if (_options.isOperator) {
            var createRegexOperators = nj.createRegexOperators;

            if (createRegexOperators) {
              createRegexOperators(name);
            }
          }

          var alias = _options.alias;

          if (alias) {
            var createFilterAlias = nj.createFilterAlias;

            if (createFilterAlias) {
              createFilterAlias(name, alias);
              name = alias;
            }
          }
        }

        if (_filter) {
          filters[name] = _filter;
        } else if (!mergeConfig) {
          filters[name] = v;
        }

        if (mergeConfig) {
          if (!filterConfig[name]) {
            filterConfig[name] = _config$1();
          }

          if (isObject(_options)) {
            assign(filterConfig[name], _options);
          } else {
            filterConfig[name] = _config$1();
          }
        } else {
          filterConfig[name] = _config$1(_options);
        }
      }
    }, false);
  }
  assign(nj, {
    filters: filters,
    filterConfig: filterConfig,
    registerFilter: registerFilter
  });

  var REGEX_JS_PROP = /('[^']*')|("[^"]*")|(-?[0-9][0-9]*(\.\d+)?)|true|false|null|undefined|Object|Array|Math|Date|JSON|(([a-zA-Z_$#@])([a-zA-Z_$\d]*))/;
  var REGEX_REPLACE_CHAR = /_njQs(\d+)_/g;
  var REGEX_REPLACE_SET = /_njSet_/;

  function _replaceStr(prop, innerQuotes) {
    return prop.replace(REGEX_REPLACE_CHAR, function (all, g1) {
      return innerQuotes[g1];
    });
  } // const SPACE_ERROR = 'This may be because the operator must have at least one space before and after';
  // function _syntaxError(errorStr, expression, source) {
  //   return 'Filter or expression syntax error: ' + errorStr + ' in\n\nexpression: ' + expression + '\n\nsource: ' + source + '\n\nNornJ expression syntax specification please see the document: https://joe-sky.github.io/nornj-guide/templateSyntax/filter.html\n';
  // }


  function _compiledProp(prop, innerBrackets, innerQuotes, source) {
    var ret = obj();

    if (prop.indexOf('|') >= 0) {
      var filters = [],
          filtersTmp;
      filtersTmp = prop.split('|');
      prop = filtersTmp[0].trim(); //Extract property

      filtersTmp = filtersTmp.slice(1);
      each(filtersTmp, function (filter) {
        filter = filter.trim();

        if (filter === '') {
          return;
        }

        var retF = _getFilterParam(filter),
            filterObj = obj(),
            filterName = retF[0].trim(); //Get filter name


        if (filterName) {
          var paramsF = retF[1]; //Get filter param
          //Multiple params are separated by commas.

          if (paramsF != null) {
            //tools.throwIf(innerBrackets[paramsF] != null, _syntaxError(_replaceStr(paramsF, innerQuotes) + '. ' + SPACE_ERROR, _replaceStr(propO, innerQuotes), source));
            var params = [];
            each(innerBrackets[paramsF].split(','), function (p) {
              if (p !== '') {
                params[params.length] = _compiledProp(p.trim(), innerBrackets, innerQuotes, source);
              }
            }, true);
            filterObj.params = params;
          }

          filterObj.name = filterName;
          filters.push(filterObj);
        }
      }, true);
      ret.filters = filters;
    } //替换字符串值


    prop = _replaceStr(prop, innerQuotes); //Extract the parent data path

    if (prop.indexOf('../') === 0) {
      var n = 0;
      prop = prop.replace(/\.\.\//g, function () {
        n++;
        return '';
      });
      ret.parentNum = n;
    } //Extract the js property


    if (prop !== '') {
      var matchProp = REGEX_JS_PROP.exec(prop);
      var hasAccessor = matchProp[6] === '#';
      ret.name = hasAccessor ? matchProp[7] : matchProp[0]; // if (matchProp[0] !== prop) {
      //   tools.error(_syntaxError(SPACE_ERROR, _replaceStr(propO, innerQuotes), source));
      // }

      if (!matchProp[5]) {
        //Sign the parameter is a basic type value.
        ret.isBasicType = true;
      }

      if (hasAccessor) {
        ret.isAccessor = true;
      }

      ret.name = ret.name.replace(REGEX_REPLACE_SET, function () {
        ret.hasSet = true;
        return '';
      });
    } else {
      ret.isEmpty = true;
    }

    return ret;
  } //Get filter param


  function _getFilterParam(obj) {
    return obj.split('\'bracket_');
  } //Extract replace parameters


  var REGEX_LT_GT = /_nj(L|G)t_/g;
  var LT_GT_LOOKUP = {
    '_njLt_': '<',
    '_njGt_': '>'
  };
  var REGEX_QUOTE = /"[^"]*"|'[^']*'/g;
  var REGEX_OPERATORS_ESCAPE = /\*|\||\/|\.|\?|\+/g;
  var SP_FILTER_LOOKUP = {
    '||': 'or',
    '..<': 'rLt'
  };
  var REGEX_SP_FILTER;

  function createFilterAlias(name, alias) {
    if (name && alias) {
      SP_FILTER_LOOKUP[name] = alias;
    }

    REGEX_SP_FILTER = new RegExp('[\\s]+((' + Object.keys(SP_FILTER_LOOKUP).map(function (o) {
      return o.replace(REGEX_OPERATORS_ESCAPE, function (match) {
        return '\\' + match;
      });
    }).join('|') + ')[\\s]*)', 'g');
  }

  createFilterAlias();
  var FN_FILTER_LOOKUP = {
    ')': ')_(',
    ']': ']_('
  };
  var REGEX_FN_FILTER = /(\)|\]|\.([^\s'"._#()|]+))[\s]*\(/g;
  var REGEX_SPACE_S_FILTER = /([(,|])[\s]+/g;
  var REGEX_PROP_FILTER = /\.([a-zA-Z_$#@][a-zA-Z_$\d]*)/g;
  var REGEX_ARRPROP_FILTER = /([^\s([,])(\[)/g;
  var ARR_OBJ_FILTER_LOOKUP = {
    '[': 'list(',
    ']': ')',
    '{': 'obj(',
    '}': ')'
  };
  var REGEX_ARR_OBJ_FILTER = /\[|\]|\{|\}/g; //const REGEX_OBJKEY_FILTER = /([(,][\s]*)([^\s:,'"()|]+):/g;

  var REGEX_SET_FILTER = /^[\s]*set[\s]+|([(,])[\s]*set[\s]+/g;
  var REGEX_BRACKET_FILTER = /^[\s]*([(]+)|([(,])[\s]*([(]+)/g;
  var NOT_OPERATORS = ['../'];
  var REGEX_NEGATIVE = /-[0-9]/;
  var BEGIN_CHARS = ['', '(', '[', ','];
  var OPERATORS = ['+=', '+', '-[0-9]', '-', '**', '*', '%%', '%', '===', '!==', '==', '!=', '<=>', '<=', '>=', '=', '..<', '<', '>', '&&', '||', '?:', '?', ':', '../', '..', '/'];
  var REGEX_OPERATORS;

  function createRegexOperators(operator) {
    if (operator) {
      var insertIndex = 0;
      OPERATORS.forEach(function (o, i) {
        if (o.indexOf(operator) >= 0) {
          insertIndex = i + 1;
        }
      });
      OPERATORS.splice(insertIndex, 0, operator);
    }

    REGEX_OPERATORS = new RegExp(OPERATORS.map(function (o) {
      return o.replace(REGEX_OPERATORS_ESCAPE, function (match) {
        return '\\' + match;
      });
    }).join('|'), 'g');
  }

  createRegexOperators();

  function _getProp(matchArr, innerQuotes, i, addSet) {
    var prop = matchArr[2].trim(),
        item = [matchArr[0], matchArr[1], null, true];

    if (i > 0) {
      item[3] = false; //Sign not contain all of placehorder
    }

    if (addSet) {
      prop = 'set ' + prop;
    } //替换特殊过滤器名称并且为简化过滤器补全"|"符


    prop = prop.replace(REGEX_LT_GT, function (match) {
      return LT_GT_LOOKUP[match];
    }).replace(REGEX_QUOTE, function (match) {
      innerQuotes.push(match);
      return '_njQs' + (innerQuotes.length - 1) + '_';
    }).replace(REGEX_OPERATORS, function (match, index) {
      if (REGEX_NEGATIVE.test(match)) {
        if (index > 0 && BEGIN_CHARS.indexOf(prop[index - 1].trim()) < 0) {
          //Example: 123-456
          return match.split('-').join(' - ');
        } else {
          //Example: -123+456
          return match;
        }
      } else {
        return NOT_OPERATORS.indexOf(match) < 0 ? " ".concat(match, " ") : match;
      }
    }).replace(REGEX_SP_FILTER, function (all, g1, match) {
      return ' ' + SP_FILTER_LOOKUP[match] + ' ';
    }).replace(REGEX_PROP_FILTER, function (all, g1) {
      var startWithHash = g1[0] === '#';

      if (startWithHash) {
        g1 = g1.substr(1);
      }

      var lastCharIndex = g1.length - 1,
          endWithUnderline = lastCharIndex > 0 && g1[lastCharIndex] === '_';
      return (startWithHash ? '#' : '.') + '(\'' + (endWithUnderline ? g1.substr(0, lastCharIndex) : g1) + '\')' + (endWithUnderline ? '_' : '');
    }).replace(REGEX_ARRPROP_FILTER, function (all, g1, g2) {
      return g1 + '.(';
    }).replace(REGEX_ARR_OBJ_FILTER, function (match) {
      return ARR_OBJ_FILTER_LOOKUP[match];
    }).replace(REGEX_SET_FILTER, function (all, g1) {
      return (g1 ? g1 : '') + '_njSet_';
    }).replace(REGEX_BRACKET_FILTER, function (all, g1, g2, g3) {
      return (g2 ? g2 : '') + (g2 ? g3 : g1).replace(/[(]/g, 'bracket(');
    }) //.replace(REGEX_OBJKEY_FILTER, (all, g1, g2) => g1 + ' \'' + g2 + '\' : ')
    .replace(REGEX_SPACE_S_FILTER, function (all, match) {
      return match;
    }).replace(REGEX_FN_FILTER, function (all, match, g1) {
      return !g1 ? FN_FILTER_LOOKUP[match] : '.(\'' + g1 + '\')_(';
    });
    item[2] = prop.trim();
    return item;
  }

  function _getReplaceParam(obj, tmplRule, innerQuotes, hasColon, addSet) {
    var pattern = tmplRule.replaceParam,
        matchArr,
        ret,
        i = 0;

    if (!hasColon) {
      while (matchArr = pattern.exec(obj)) {
        if (!ret) {
          ret = [];
        }

        var startRuleR = matchArr[2];
        ret.push(_getProp([matchArr[0], startRuleR ? startRuleR : matchArr[5], startRuleR ? matchArr[3] : matchArr[6]], innerQuotes, i, addSet));
        i++;
      }
    } else {
      matchArr = [obj, tmplRule.startRule, obj];
      ret = [_getProp(matchArr, innerQuotes, i, addSet)];
    }

    return ret;
  }

  var REGEX_INNER_BRACKET = /\(([^()]*)\)/g;
  var REGEX_FIX_OPERATOR_1 = /([!]+)((-?[0-9][0-9]*(\.\d+)?|[^\s,|'=]+)('bracket_\d+)?([._#]'bracket_\d+)*)/g;
  var REGEX_FIX_OPERATOR = /[\s]+([^\s(),|"']+)[\s]+((-?[0-9][0-9]*(\.\d+)?|[^\s,|']+)('bracket_\d+)?([._#]'bracket_\d+)*)/g;
  var REGEX_SPACE_FILTER = /[(,]/g;
  var REGEX_FIX_FILTER = /(\|)?(((\.+|_|#+)'bracket_)|[\s]+([^\s._#|]+[\s]*'bracket_))/g;

  function _fixOperator(prop, innerBrackets) {
    prop = prop.replace(REGEX_FIX_OPERATOR_1, function () {
      var args = arguments;
      innerBrackets.push(_fixFilter(args[2]));
      return args[1] + '\'bracket_' + (innerBrackets.length - 1);
    });
    return _fixFilter(prop.replace(REGEX_FIX_OPERATOR, function () {
      var args = arguments;
      innerBrackets.push(_fixFilter(args[2]));
      return ' ' + args[1] + '\'bracket_' + (innerBrackets.length - 1);
    }));
  }

  function _fixFilter(prop) {
    return (' ' + prop).replace(REGEX_SPACE_FILTER, function (all) {
      return all + ' ';
    }).replace(REGEX_FIX_FILTER, function (all, g1, g2, g3, g4, g5) {
      return g1 ? all : ' | ' + (g3 ? g3 : g5);
    }).trim();
  }

  function _replaceInnerBrackets(prop, innerBrackets) {
    var propR = prop.replace(REGEX_INNER_BRACKET, function (all, s1) {
      innerBrackets.push(_fixOperator(s1, innerBrackets));
      return '\'bracket_' + (innerBrackets.length - 1);
    });

    if (propR !== prop) {
      return _replaceInnerBrackets(propR, innerBrackets);
    } else {
      return _fixOperator(propR, innerBrackets);
    }
  } //Get compiled parameter


  function compiledParam(value, tmplRule, hasColon, onlyKey, addSet) {
    var ret = obj(),
        isStr = isString(value),
        strs = isStr ? !hasColon ? value.split(tmplRule.replaceSplit) : ['', ''] : [value],
        props = null,
        isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

    if (isStr) {
      //替换插值变量以外的文本中的换行符
      strs = strs.map(function (str) {
        return str.replace(/\n/g, '_njNl_').replace(/\r/g, '');
      });
    } //If have placehorder


    if (strs.length > 1) {
      var innerQuotes = [];

      var params = _getReplaceParam(value, tmplRule, innerQuotes, hasColon, addSet);

      props = [];
      each(params, function (param) {
        var retP = obj(),
            innerBrackets = [];
        isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.

        var prop = _replaceInnerBrackets(param[2], innerBrackets);

        retP.prop = _compiledProp(prop, innerBrackets, innerQuotes, value); //To determine whether it is necessary to escape

        retP.escape = param[1] !== tmplRule.firstChar + tmplRule.startRule;
        props.push(retP);
      }, true);
    }

    ret.props = props;
    ret.strs = strs;
    ret.isAll = isAll;
    ret.onlyKey = onlyKey;
    return ret;
  }
  assign(nj, {
    createFilterAlias: createFilterAlias,
    createRegexOperators: createRegexOperators
  });

  function getXmlOpenTag(obj, tmplRule) {
    return tmplRule.xmlOpenTag.exec(obj);
  } //验证xml self close tag

  var REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;
  function isXmlSelfCloseTag(obj) {
    return REGEX_XML_SELF_CLOSE_TAG.test(obj);
  } //Verify self close tag name

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
  } //Extract parameters inside the xml open tag

  function getOpenTagParams(tag, tmplRule) {
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

      var value = matchArr[8],
          onlyBrace = matchArr[4] != null ? matchArr[4] : matchArr[6],
          onlyKey = false;

      if (value != null) {
        value = clearQuot(value); //Remove quotation marks
      } else {
        value = key; //Match to Similar to "checked" or "disabled" attribute.

        if (!onlyBrace) {
          onlyKey = true;
        }
      } //Removed at the end of "/>", ">" or "/".


      if (!matchArr[9] && !matchArr[10]) {
        if (/\/>$/.test(value)) {
          value = value.substr(0, value.length - 2);
        } else if (/>$/.test(value) || /\/$/.test(value)) {
          value = value.substr(0, value.length - 1);
        }
      } //Transform special key


      var hasColon = void 0;

      if (key[0] === ':') {
        key = key.substr(1);
        hasColon = true;
      }

      ret.push({
        key: key,
        value: value,
        onlyBrace: onlyBrace,
        hasColon: hasColon,
        onlyKey: onlyKey
      });
    }

    return ret;
  } //判断xml close tag

  function isXmlCloseTag(obj, tagName) {
    return isString(obj) && obj.toLowerCase() === '</' + tagName + '>';
  } //get inside brace param

  function getInsideBraceParam(obj, tmplRule) {
    return tmplRule.braceParam.exec(obj);
  } //判断扩展标签并返回参数

  function isEx(obj, tmplRule, noParams) {
    var ret,
        ret1 = tmplRule.extension.exec(obj);

    if (ret1) {
      ret = [ret1[1]];

      if (!noParams) {
        var params = getOpenTagParams(obj, tmplRule); //提取各参数

        if (params) {
          ret.push(params);
        }
      }
    }

    return ret;
  }
  function isExAll(obj, tmplRule) {
    return obj.match(tmplRule.exAll);
  }
  var REGEX_LOWER_CASE = /^[a-z]/;
  var REGEX_UPPER_CASE = /^[A-Z]/;
  function fixExTagName(tagName, tmplRule) {
    var ret;

    if (!nj.fixTagName) {
      return ret;
    }

    var _tagName = lowerFirst(tagName),
        config = extensionConfig[_tagName];

    if (config && (!config.needPrefix || config.needPrefix == 'onlyUpperCase' && REGEX_LOWER_CASE.test(tagName) || config.needPrefix == 'onlyLowerCase' && REGEX_UPPER_CASE.test(tagName))) {
      ret = tmplRule.extensionRule + _tagName;
    }

    return ret;
  } //Test whether as parameters extension

  function isParamsEx(name) {
    return name === 'params' || name === 'props';
  } //Add to the "paramsEx" property of the parent node

  function addParamsEx(node, parent, isDirective, isSubTag) {
    var exPropsName = 'paramsEx';

    if (!parent[exPropsName]) {
      var exPropsNode;

      if (isDirective || isSubTag) {
        exPropsNode = {
          type: 'nj_ex',
          ex: 'props',
          content: [node]
        };
      } else {
        exPropsNode = node;
      }

      exPropsNode.parentType = parent.type;
      parent[exPropsName] = exPropsNode;
    } else {
      arrayPush(parent[exPropsName].content, isDirective || isSubTag ? [node] : node.content);
    }
  }
  function exCompileConfig(name) {
    return extensionConfig[name] || {};
  }
  function isPropS(elemName, tmplRule) {
    return elemName.indexOf(tmplRule.propRule) === 0;
  }
  function isStrPropS(elemName, tmplRule) {
    return elemName.indexOf(tmplRule.strPropRule + tmplRule.propRule) === 0;
  }

  var NO_SPLIT_NEWLINE = ['style', 'script', 'textarea', 'pre', 'xmp', 'template', 'noscript', nj.textTag];

  function _plainTextNode(obj, parent, parentContent, noSplitNewline, tmplRule) {
    var node = {};
    node.type = 'nj_plaintext';
    node.content = [compiledParam(obj, tmplRule, null, null, parent.ex != null ? exCompileConfig(parent.ex).isBindable : null)];
    node.allowNewline = noSplitNewline;
    parent[parentContent].push(node);
  }

  var REGEX_REPLACE_BP = /_njBp(\d+)_/g; //检测元素节点

  function checkElem(obj$1, parent, tmplRule, hasExProps, noSplitNewline, isLast) {
    var parentContent = 'content';

    if (!isArray(obj$1)) {
      //判断是否为文本节点
      if (isString(obj$1)) {
        if (!noSplitNewline) {
          var braceParams = [];
          var strs = obj$1.replace(tmplRule.braceParamG, function (match) {
            braceParams.push(match);
            return '_njBp' + (braceParams.length - 1) + '_';
          }).split(/\n/g);
          strs.forEach(function (str, i) {
            str = str.trim();
            str !== '' && _plainTextNode(str.replace(REGEX_REPLACE_BP, function (all, g1) {
              return braceParams[g1];
            }), parent, parentContent, noSplitNewline, tmplRule);
          });
        } else {
          _plainTextNode(isLast && parent.allowNewline === 'nlElem' ? trimRight(obj$1) : obj$1, parent, parentContent, noSplitNewline, tmplRule);
        }
      } else {
        _plainTextNode(obj$1, parent, parentContent, noSplitNewline, tmplRule);
      }

      return;
    }

    var node = {},
        first = obj$1[0];

    if (isString(first)) {
      //第一个子节点为字符串
      var len = obj$1.length,
          last = obj$1[len - 1],
          isElemNode = false,
          ex,
          exParams; //判断是否为xml标签

      var openTagName,
          hasCloseTag = false,
          isParamsEx$1,
          isDirective,
          isSubTag,
          needAddToProps;
      ex = isEx(first, tmplRule);

      if (!ex) {
        var xmlOpenTag = getXmlOpenTag(first, tmplRule);

        if (xmlOpenTag) {
          //tagname为xml标签时,则认为是元素节点
          openTagName = xmlOpenTag[1];

          if (/\/$/.test(openTagName)) {
            openTagName = openTagName.substr(0, openTagName.length - 1);
          }

          if (!isXmlSelfCloseTag(first)) {
            //非自闭合标签才验证是否存在关闭标签
            hasCloseTag = isXmlCloseTag(last, openTagName);
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
        isParamsEx$1 = isParamsEx(exName);

        if (!isParamsEx$1) {
          var exConfig = exCompileConfig(exName);
          isDirective = exConfig.isDirective;
          isSubTag = exConfig.isSubTag;
          needAddToProps = isDirective ? !hasExProps : isSubTag;

          if (exConfig.useString) {
            node.useString = exConfig.useString;
          }
        }

        node.type = 'nj_ex';
        node.ex = exName;

        if (exParams != null && !isParamsEx$1) {
          if (!node.args) {
            node.args = [];
          }

          each(exParams, function (param) {
            var key = param.key,
                value = param.value;

            if (key === 'useString') {
              node.useString = !(value === 'false');
              return;
            } else if (key === '_njIsDirective') {
              node.isDirective = isDirective = true;
              needAddToProps = !hasExProps;
              return;
            }

            var paramV = compiledParam(value, tmplRule, param.hasColon, param.onlyKey);

            if (param.onlyBrace) {
              //提取匿名参数
              node.args.push(paramV);
            } else {
              if (!node.params) {
                node.params = obj();
              }

              node.params[key] = paramV;
            }
          }, true);
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
          node.type = openTagName; //If open tag has a brace,add the typeRefer param.

          var typeRefer = getInsideBraceParam(openTagName, tmplRule);

          if (typeRefer) {
            node.typeRefer = compiledParam(typeRefer[0], tmplRule);
          } //获取openTag内参数


          var tagParams = getOpenTagParams(first, tmplRule);

          if (tagParams) {
            if (!node.params) {
              node.params = obj();
            }

            each(tagParams, function (param) {
              //The parameter like "{prop}" needs to be replaced.
              node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = compiledParam(param.value, tmplRule, param.hasColon, param.onlyKey);
            }, true);
          } //Verify if self closing tag again, because the tag may be similar to "<br></br>".


          if (!node.selfCloseTag) {
            node.selfCloseTag = verifySelfCloseTag(openTagName);
          }

          if (noSplitNewline == null && NO_SPLIT_NEWLINE.indexOf(openTagName.toLowerCase()) > -1) {
            noSplitNewline = true;
            node.allowNewline = 'nlElem';
          }
        } else {
          if (isParamsEx$1 || needAddToProps) {
            pushContent = false;
          }

          if (noSplitNewline == null && node.ex === 'pre') {
            noSplitNewline = true;
            node.allowNewline = 'nlElem';
          }
        } //放入父节点content内


        if (pushContent) {
          parent[parentContent].push(node);
        } //取出子节点集合


        var end = len - (hasCloseTag ? 1 : 0),
            content = obj$1.slice(1, end);

        if (content && content.length) {
          _checkContentElem(content, node, tmplRule, isParamsEx$1 || hasExProps && !isDirective, noSplitNewline, tmplRule);
        } //If this is params block, set on the "paramsEx" property of the parent node.


        if (isParamsEx$1 || needAddToProps) {
          addParamsEx(node, parent, isDirective, isSubTag);
        }
      } else {
        //如果不是元素节点,则为节点集合
        _checkContentElem(obj$1, parent, tmplRule, hasExProps, noSplitNewline);
      }
    } else if (isArray(first)) {
      //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
      _checkContentElem(obj$1, parent, tmplRule, hasExProps, noSplitNewline);
    }
  } //检测子元素节点

  function _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline) {
    if (!parent.content) {
      parent.content = [];
    }

    each(obj, function (item, i, l) {
      checkElem(item, parent, tmplRule, hasExProps, noSplitNewline, i == l - 1);
    }, true);
  }

  var GLOBAL = 'g';
  var CONTEXT = 'c';
  var PARAMS = 'p';

  function _buildFn(content, node, fns, no, newContext, level, useStringLocal) {
    var fnStr = '',
        useString = useStringLocal != null ? useStringLocal : fns.useString,
        main = no === 0,

    /* retType
     1: single child node
     2: multiple child nodes
     object: not build function
    */
    retType = content.length === 1 ? '1' : '2',
        counter = {
      _type: 0,
      _params: 0,
      _compParam: 0,
      _dataRefer: 0,
      _ex: 0,
      _value: 0,
      _filter: 0,
      _fnH: 0,
      _tmp: 0,
      newContext: newContext
    };

    if (!useString) {
      counter._compParam = 0;
    } else {
      counter._children = 0;
    }

    if (!main && newContext) {
      fnStr += "".concat(CONTEXT, " = ").concat(GLOBAL, ".n(").concat(CONTEXT, ", ").concat(PARAMS, ");\n");
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

    try {
      /* build template functions
       g: global configs
       c: context
       p: parameters
      */
      fns[main ? 'main' : 'fn' + no] = new Function(GLOBAL, CONTEXT, PARAMS, fnStr);
    } catch (err) {
      error('Failed to generate template function:\n\n' + err.toString() + ' in\n\n' + fnStr + '\n');
    }

    return no;
  }

  function _buildOptions(config, useStringLocal, node, fns, level, hashProps, tagName, tagProps) {
    var hashStr = ', useString: ' + (useStringLocal == null ? "".concat(GLOBAL, ".us") : useStringLocal ? 'true' : 'false'),
        noConfig = !config,
        no = fns._no;

    if (node) {
      //tags
      var newContext = config ? config.newContext : true;
      var isDirective = node.isDirective || config && config.isDirective;

      if (noConfig || config.hasName) {
        hashStr += ', name: \'' + node.ex + '\'';
      }

      if (tagName && isDirective && (noConfig || !config.noTagName)) {
        hashStr += ', tagName: ' + tagName;
        hashStr += ', setTagName: function(c) { ' + tagName + ' = c }';
      }

      if (tagProps && (noConfig || config.hasTagProps)) {
        hashStr += ', tagProps: ' + tagProps;
      }

      if (hashProps != null) {
        hashStr += ', props: ' + hashProps;
      }

      hashStr += ', ' + (isDirective ? 'value' : 'children') + ': ' + (node.content ? "".concat(GLOBAL, ".r(").concat(GLOBAL, ", ").concat(CONTEXT, ", ").concat(GLOBAL, ".fn") + _buildFn(node.content, node, fns, ++fns._no, newContext, level, useStringLocal) + ')' : "".concat(GLOBAL, ".np"));
    }

    return '{ _njOpts: ' + (no + 1) + (noConfig || config.hasTmplCtx ? ", global: ".concat(GLOBAL, ", context: ").concat(CONTEXT) : '') + (noConfig || config.hasOutputH ? ', outputH: ' + !fns.useString : '') + hashStr + (level != null && (noConfig || config.hasLevel) ? ', level: ' + level : '') + ' }';
  }

  var CUSTOM_VAR = 'nj_custom';
  var OPERATORS$1 = ['+', '-', '*', '/', '%', '===', '!==', '==', '!=', '<=', '>=', '=', '+=', '<', '>', '&&', '||', '?', ':'];
  var ASSIGN_OPERATORS = ['=', '+='];
  var SP_FILTER_REPLACE = {
    'or': '||'
  };

  function _buildDataValue(ast, escape, fns, level) {
    var dataValueStr,
        special = false;
    var isBasicType = ast.isBasicType,
        isAccessor = ast.isAccessor,
        hasSet = ast.hasSet;

    if (isBasicType) {
      dataValueStr = ast.name;
    } else {
      var name = ast.name,
          parentNum = ast.parentNum;
      var data = '',
          specialP = false;

      switch (name) {
        case '@index':
          data = 'index';
          special = true;
          break;

        case '@item':
          data = 'item';
          special = true;
          break;

        case 'this':
          data = 'data';

          special = function special(data) {
            return "".concat(data, "[").concat(data, ".length - 1]");
          };

          break;

        case '@data':
          data = 'data';
          special = true;
          break;

        case '@g':
          data = "".concat(GLOBAL, ".g");
          special = CUSTOM_VAR;
          break;

        case '@context':
          data = CONTEXT;
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

        case '@q':
          data = '\'"\'';
          special = CUSTOM_VAR;
          break;

        case '@sq':
          data = '"\'"';
          special = CUSTOM_VAR;
          break;
      }

      if (parentNum) {
        if (!data) {
          data = 'data';
        }

        var isCtx = data == CONTEXT;

        for (var i = 0; i < parentNum; i++) {
          data = !isCtx ? 'parent.' + data : data + '.parent';
        }

        if (!special) {
          specialP = true;
        }
      }

      if (!special && !specialP) {
        dataValueStr = (isAccessor ? "".concat(GLOBAL, ".c(") : '') + "".concat(CONTEXT, ".d('") + name + '\'' + (hasSet ? ', 0, true' : '') + ')' + (isAccessor ? ", ".concat(CONTEXT) + ')' : '');
      } else {
        var dataStr = special === CUSTOM_VAR ? data : "".concat(CONTEXT, ".") + data;

        if (isObject(special)) {
          dataStr = special(dataStr);
        }

        dataValueStr = special ? dataStr : (isAccessor ? "".concat(GLOBAL, ".c(") : '') + "".concat(CONTEXT, ".d('") + name + '\', ' + dataStr + (hasSet ? ', true' : '') + ')' + (isAccessor ? ", ".concat(CONTEXT) + ')' : '');
      }
    }

    if (dataValueStr) {
      dataValueStr = _replaceBackslash(dataValueStr);
    }

    return _buildEscape(dataValueStr, fns, isBasicType || isAccessor ? false : escape, special);
  }

  function replaceFilterName(name) {
    var nameR = SP_FILTER_REPLACE[name];
    return nameR != null ? nameR : name;
  }

  function buildExpression(ast, inObj, escape, fns, useStringLocal, level) {
    var codeStr = ast.filters && OPERATORS$1.indexOf(replaceFilterName(ast.filters[0].name)) < 0 ? '' : !inObj ? _buildDataValue(ast, escape, fns, level) : ast.name;
    var lastCodeStr = '';
    ast.filters && ast.filters.forEach(function (filter, i) {
      var hasFilterNext = ast.filters[i + 1] && OPERATORS$1.indexOf(replaceFilterName(ast.filters[i + 1].name)) < 0;
      var filterName = replaceFilterName(filter.name);

      if (OPERATORS$1.indexOf(filterName) >= 0) {
        //Native operator
        if (ASSIGN_OPERATORS.indexOf(filterName) >= 0) {
          codeStr += ".source.".concat(i == 0 ? ast.name : clearQuot(ast.filters[i - 1].params[0].name), " ").concat(filterName, " ");
        } else {
          codeStr += " ".concat(filterName, " ");
        }

        if (!ast.filters[i + 1] || OPERATORS$1.indexOf(replaceFilterName(ast.filters[i + 1].name)) >= 0) {
          if (filter.params[0].filters) {
            codeStr += '(';
            codeStr += buildExpression(filter.params[0], null, escape, fns, useStringLocal, level);
            codeStr += ')';
          } else {
            codeStr += _buildDataValue(filter.params[0], escape, fns, level);
          }
        }
      } else if (filterName === '_') {
        //Call function
        var _codeStr = "".concat(GLOBAL, ".f['").concat(filterName, "'](").concat(lastCodeStr);

        if (filter.params.length) {
          _codeStr += ', [';
          filter.params.forEach(function (param, j) {
            _codeStr += buildExpression(param, null, escape, fns, useStringLocal, level);

            if (j < filter.params.length - 1) {
              _codeStr += ', ';
            }
          });
          _codeStr += ']';
        }

        _codeStr += ')';

        if (hasFilterNext) {
          lastCodeStr = _codeStr;
        } else {
          codeStr += _codeStr;
          lastCodeStr = '';
        }
      } else {
        //Custom filter
        var startStr, endStr, isObj, configF;
        var isMethod = ast.isEmpty && i == 0;

        if (filterName === 'bracket') {
          startStr = '(';
          endStr = ')';
        } else if (filterName === 'list') {
          startStr = '[';
          endStr = ']';
        } else if (filterName === 'obj') {
          startStr = '{ ';
          endStr = ' }';
          isObj = true;
        } else {
          if (filterName == 'require') {
            startStr = 'require';
          } else {
            var filterStr = "".concat(GLOBAL, ".f['").concat(filterName, "']"),
                warnStr = "".concat(GLOBAL, ".wn('").concat(filterName, "', 'f')"),
                isDev = "development" !== 'production';
            configF = filterConfig[filterName];

            if (configF && configF.onlyGlobal) {
              startStr = isDev ? "(".concat(filterStr, " || ").concat(warnStr, ")") : filterStr;
            } else {
              startStr = "".concat(GLOBAL, ".cf(").concat(CONTEXT, ".d('").concat(filterName, "', 0, true) || ").concat(filterStr).concat(isDev ? " || ".concat(warnStr) : '', ")");
            }
          }

          startStr += '(';
          endStr = ')';
        }

        var _codeStr2 = startStr;

        if (isMethod) {
          //Method
          filter.params.forEach(function (param, j) {
            _codeStr2 += buildExpression(param, isObj, escape, fns, useStringLocal, level);

            if (j < filter.params.length - 1) {
              _codeStr2 += ', ';
            }
          });
        } else {
          //Operator
          if (i == 0) {
            _codeStr2 += _buildDataValue(ast, escape, fns, level);
          } else if (lastCodeStr !== '') {
            _codeStr2 += lastCodeStr;
          } else {
            if (ast.filters[i - 1].params[0].filters) {
              _codeStr2 += buildExpression(ast.filters[i - 1].params[0], null, escape, fns, useStringLocal, level);
            } else {
              _codeStr2 += _buildDataValue(ast.filters[i - 1].params[0], escape, fns, level);
            }
          }

          filter.params && filter.params.forEach(function (param, j) {
            _codeStr2 += ', ';

            if (param.filters) {
              _codeStr2 += buildExpression(param, null, escape, fns, useStringLocal, level);
            } else {
              _codeStr2 += _buildDataValue(param, escape, fns, level);
            }
          });
          var nextFilter = ast.filters[i + 1];

          if (filterName === '.' && nextFilter && replaceFilterName(nextFilter.name) === '_') {
            _codeStr2 += ', true';
          } //if (!configF || configF.hasOptions) {


          if (configF && configF.hasOptions) {
            _codeStr2 += ", ".concat(_buildOptions(configF, useStringLocal, null, fns, level));
          }
        }

        _codeStr2 += endStr;

        if (hasFilterNext) {
          lastCodeStr = _codeStr2;
        } else {
          codeStr += _codeStr2;
          lastCodeStr = '';
        }
      }
    });
    return codeStr;
  }

  function _buildEscape(valueStr, fns, escape, special) {
    if (fns.useString) {
      if (escape && special !== CUSTOM_VAR) {
        return "".concat(GLOBAL, ".es(") + valueStr + ')';
      } else {
        return valueStr;
      }
    } else {
      //文本中的特殊字符需转义
      return unescape(valueStr);
    }
  }

  function _replaceStrs(str) {
    return _replaceBackslash(str).replace(/_njNl_/g, '\\n').replace(/'/g, '\\\'');
  }

  function _replaceBackslash(str) {
    return str = str.replace(/\\/g, '\\\\');
  }

  function _buildProps(obj, fns, useStringLocal, level) {
    var str0 = obj.strs[0],
        valueStr = '';

    if (isString(str0)) {
      //常规属性
      valueStr = !obj.isAll && str0 !== '' ? '\'' + _replaceStrs(str0) + '\'' : '';
      each(obj.props, function (o, i) {
        var dataValueStr = buildExpression(o.prop, null, o.escape, fns, useStringLocal, level);

        if (!obj.isAll) {
          var strI = obj.strs[i + 1],
              prefixStr = str0 === '' && i == 0 ? '' : ' + '; // if (strI.trim() === '\\n') { //如果只包含换行符号则忽略
          //   valueStr += prefixStr + dataValueStr;
          //   return;
          // }

          dataValueStr = prefixStr + '(' + dataValueStr + ')' + (strI !== '' ? ' + \'' + _replaceStrs(strI) + '\'' : '');
        } else {
          dataValueStr = '(' + dataValueStr + ')';
        }

        valueStr += dataValueStr;

        if (obj.isAll) {
          return false;
        }
      }, true);
    }

    return valueStr;
  }

  function _buildParams(node, fns, counter, useString, level, tagName) {
    //节点参数
    var params = node.params,
        paramsEx = node.paramsEx;
    var useStringF = fns.useString,
        hasPropsEx = paramsEx;

    var paramsStr = '',
        _paramsC,
        _tagProps;

    if (params || hasPropsEx) {
      _paramsC = counter._params++;
      _tagProps = '_params' + _paramsC;
      paramsStr = 'var ' + _tagProps + ' = ';

      if (params) {
        var paramKeys = Object.keys(params),
            len = paramKeys.length;
        paramsStr += '{\n';
        each(paramKeys, function (k, i) {
          var valueStr = _buildProps(params[k], fns, useString, level);

          if (!useStringF && k === 'style') {
            //将style字符串转换为对象
            valueStr = "".concat(GLOBAL, ".sp(") + valueStr + ')';
          }

          var key = _replaceStrs(k),
              onlyKey = params[k].onlyKey;

          if (!useStringF) {
            key = fixPropName(key);
          }

          paramsStr += '  \'' + key + '\': ' + (!onlyKey ? valueStr : !useString ? 'true' : '\'' + key + '\'') + (i < len - 1 ? ',\n' : '');
        }, false);
        paramsStr += '\n};\n';
      }

      if (hasPropsEx) {
        if (!params) {
          paramsStr += '{};\n';
        }

        if (paramsEx) {
          paramsStr += _buildContent(paramsEx.content, paramsEx, fns, counter, {
            _paramsE: true
          }, null, useString, tagName, _tagProps);
        }

        if (useString) {
          paramsStr += '\n' + _tagProps + " = ".concat(GLOBAL, ".ans(") + _tagProps + ');\n';
        }
      } else if (useString) {
        paramsStr += '\n' + _tagProps + " = ".concat(GLOBAL, ".ans({}, ") + _tagProps + ');\n';
      }
    }

    return [paramsStr, _paramsC];
  }

  function _buildNode(node, parent, fns, counter, retType, level, useStringLocal, isFirst, tagName, tagProps) {
    var fnStr = '',
        useStringF = fns.useString;

    if (node.type === 'nj_plaintext') {
      //文本节点
      var valueStr = _buildProps(node.content[0], fns, useStringLocal, level);

      if (valueStr === '') {
        return fnStr;
      }

      var textStr = _buildRender(node, parent, 1, retType, {
        text: valueStr
      }, fns, level, useStringLocal, node.allowNewline, isFirst);

      if (useStringF) {
        fnStr += textStr;
      } else {
        //文本中的特殊字符需转义
        fnStr += unescape(textStr);
      }
    } else if (node.type === 'nj_ex') {
      //扩展标签节点
      var _exC = counter._ex++,
          _dataReferC = counter._dataRefer++,
          dataReferStr = '',
          configE = extensionConfig[node.ex],
          exVarStr = '_ex' + _exC,
          globalExStr = "".concat(GLOBAL, ".x['") + node.ex + '\']',
          fnHVarStr;

      if (configE && configE.onlyGlobal) {
        //只能从全局获取
        fnStr += '\nvar ' + exVarStr + ' = ' + globalExStr + ';\n';
      } else {
        //优先从context.data中获取
        fnHVarStr = '_fnH' + counter._fnH++;
        fnStr += '\nvar ' + exVarStr + ';\n';
        fnStr += 'var ' + fnHVarStr + " = ".concat(CONTEXT, ".d('") + node.ex + '\', 0, true);\n';
        fnStr += 'if (' + fnHVarStr + ') {\n';
        fnStr += '  ' + exVarStr + ' = ' + fnHVarStr + '.value;\n';
        fnStr += '} else {\n';
        fnStr += '  ' + exVarStr + ' = ' + globalExStr + ';\n';
        fnStr += '}\n';
      }

      dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

      if (node.args) {
        //构建匿名参数
        each(node.args, function (arg, i) {
          var valueStr = _buildProps(arg, fns, useStringLocal, level);

          dataReferStr += '  ' + valueStr + ',';
        }, true);
      } //hash参数


      var retP = _buildParams(node, fns, counter, false, level, tagName),
          paramsStr = retP[0],
          _paramsC = retP[1];

      dataReferStr += _buildOptions(configE, useStringLocal, node, fns, level, paramsStr !== '' ? '_params' + _paramsC : null, tagName, tagProps);
      dataReferStr += '\n];\n'; //添加匿名参数

      if (paramsStr !== '') {
        dataReferStr += "".concat(GLOBAL, ".aa(_params") + _paramsC + ', _dataRefer' + _dataReferC + ');\n';
      }

      fnStr += paramsStr + dataReferStr;

      {
        //如果扩展标签不存在则打印警告信息
        fnStr += "".concat(GLOBAL, ".tf(_ex") + _exC + ', \'' + node.ex + '\', \'ex\');\n';
      } //渲染


      fnStr += _buildRender(node, parent, 2, retType, {
        _ex: _exC,
        _dataRefer: _dataReferC,
        fnH: fnHVarStr
      }, fns, level, useStringLocal, node.allowNewline, isFirst);
    } else {
      //元素节点
      //节点类型和typeRefer
      var _typeC = counter._type++,
          _type,
          _typeRefer,
          _tagName = '_type' + _typeC;

      if (node.typeRefer) {
        var valueStrT = _buildProps(node.typeRefer, fns, level);

        _typeRefer = valueStrT;
        _type = node.typeRefer.props[0].prop.name;
      } else {
        _type = node.type;
      }

      var typeStr;

      if (!useStringF) {
        var _typeL = _type.toLowerCase(),
            subName = '';

        if (!_typeRefer && _typeL.indexOf('.') > -1) {
          var typeS = _type.split('.');

          _typeL = _typeL.split('.')[0];
          _type = typeS[0];
          subName = ', \'' + typeS[1] + '\'';
        }

        typeStr = _typeRefer ? "".concat(GLOBAL, ".er(") + _typeRefer + ', \'' + _typeL + "', ".concat(GLOBAL, ", '") + _type + "', ".concat(CONTEXT, ")") : "".concat(GLOBAL, ".e('") + _typeL + "', ".concat(GLOBAL, ", '") + _type + "', ".concat(CONTEXT) + subName + ')';
      } else {
        typeStr = _typeRefer ? "".concat(GLOBAL, ".en(") + _typeRefer + ', \'' + _type + '\')' : '\'' + _type + '\'';
      }

      fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n'; //节点参数

      var _retP = _buildParams(node, fns, counter, useStringF, level, _tagName),
          _paramsStr = _retP[0],
          _paramsC2 = _retP[1];

      fnStr += _paramsStr;

      var _compParamC, _childrenC;

      if (!useStringF) {
        //组件参数
        _compParamC = counter._compParam++;
        fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (_paramsStr !== '' ? '_params' + _paramsC2 : 'null') + '];\n';
      } else {
        //子节点字符串
        _childrenC = counter._children++;
        fnStr += 'var _children' + _childrenC + ' = \'\';\n';
      } //子节点


      fnStr += _buildContent(node.content, node, fns, counter, !useStringF ? {
        _compParam: '_compParam' + _compParamC
      } : {
        _children: '_children' + _childrenC
      }, useStringF && node.type === nj.noWsTag ? null : level != null ? level + 1 : level, useStringLocal, _tagName); //渲染

      fnStr += _buildRender(node, parent, 3, retType, !useStringF ? {
        _compParam: _compParamC
      } : {
        _type: _typeC,
        _typeS: _type,
        _typeR: _typeRefer,
        _params: _paramsStr !== '' ? _paramsC2 : null,
        _children: _childrenC,
        _selfClose: node.selfCloseTag
      }, fns, level, useStringLocal, node.allowNewline, isFirst);
    }

    return fnStr;
  }

  function _buildContent(content, parent, fns, counter, retType, level, useStringLocal, tagName, tagProps) {
    var fnStr = '';

    if (!content) {
      return fnStr;
    }

    each(content, function (node) {
      var useString = node.useString;
      fnStr += _buildNode(node, parent, fns, counter, retType, level, useString != null ? useString : useStringLocal, fns._firstNode && level == 0, tagName, tagProps);

      if (fns._firstNode) {
        //输出字符串时模板第一个节点前面不加换行符
        fns._firstNode = false;
      }
    }, true);
    return fnStr;
  }

  function _buildRender(node, parent, nodeType, retType, params, fns, level, useStringLocal, allowNewline, isFirst) {
    var retStr,
        useStringF = fns.useString,
        useString = useStringLocal != null ? useStringLocal : useStringF,
        noLevel = level == null;

    switch (nodeType) {
      case 1:
        //文本节点
        retStr = (!useStringF || allowNewline || noLevel ? '' : isFirst ? parent.type !== 'nj_root' ? "".concat(GLOBAL, ".fl(").concat(CONTEXT, ") + ") : '' : '\'\\n\' + ') + _buildLevelSpace(level, fns, allowNewline) + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + params.text;
        break;

      case 2:
        //扩展标签
        retStr = '_ex' + params._ex + '.apply(' + (params.fnH ? params.fnH + ' ? ' + params.fnH + ".source : ".concat(CONTEXT) : CONTEXT) + ', _dataRefer' + params._dataRefer + ')';
        break;

      case 3:
        //元素节点
        if (!useStringF) {
          retStr = "".concat(GLOBAL, ".H(_compParam") + params._compParam + ')';
        } else {
          if (allowNewline && allowNewline !== 'nlElem' || noLevel) {
            retStr = '';
          } else if (isFirst) {
            retStr = parent.type !== 'nj_root' ? "".concat(GLOBAL, ".fl(").concat(CONTEXT, ") + ") : '';
          } else {
            retStr = '\'\\n\' + ';
          }

          if (node.type !== nj.textTag && node.type !== nj.noWsTag) {
            var levelSpace = _buildLevelSpace(level, fns, allowNewline),
                content = node.content,
                hasTypeR = params._typeR,
                hasParams = params._params != null;

            retStr += levelSpace + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + '\'<' + (hasTypeR ? '\' + _type' + params._type : params._typeS) + (hasParams ? (!hasTypeR ? '\'' : '') + ' + _params' + params._params : '') + (hasTypeR || hasParams ? ' + \'' : '');

            if (!params._selfClose) {
              retStr += '>\'';
              retStr += ' + _children' + params._children + ' + ';
              retStr += (!content || allowNewline || noLevel ? '' : '\'\\n\' + ') + (content ? levelSpace : '') + //如果子节点为空则不输出缩进空格和换行符
              _buildLevelSpaceRt(useStringF, noLevel) + '\'</' + (hasTypeR ? '\' + _type' + params._type + ' + \'' : params._typeS) + '>\'';
            } else {
              retStr += ' />\'';
            }
          } else {
            retStr += '_children' + params._children;
          }
        }

        break;
    } //保存方式


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
      return "".concat(GLOBAL, ".ls(").concat(CONTEXT, ") + ");
    }

    return '';
  }

  var buildRuntime = (function (astContent, ast, useString) {
    var fns = {
      useString: useString,
      _no: 0,
      //扩展标签函数计数
      _firstNode: true
    };

    _buildFn(astContent, ast, fns, fns._no, null, 0);

    return fns;
  });

  var preAsts = nj.preAsts;
  var SPLIT_FLAG = '_njParam';
  var TEXT_CONTENT = ['style', 'script', 'textarea', 'xmp', nj.textTag];
  var OMITTED_CLOSE_TAGS$1 = OMITTED_CLOSE_TAGS; //Compile string template

  function compileStringTmpl(tmpl) {
    var tmplKey = tmpl.toString(),
        //Get unique key
    ret = preAsts[tmplKey];
    var outputH = this.outputH,
        tmplRule = this.tmplRule,
        onlyParse = this.onlyParse,
        fileName = this.fileName,
        isExpression = this.isExpression,
        isCss = this.isCss;

    if (!ret) {
      //If the cache already has template data, direct return the template.
      var isStr = isString(tmpl),
          xmls = isStr ? [tmpl] : tmpl,
          l = xmls.length,
          fullXml = '',
          isInBrace = false; //Connection xml string

      each(xmls, function (xml, i) {
        var split = '';

        if (i == 0) {
          if (isExpression) {
            xml = (outputH ? tmplRule.firstChar : '') + tmplRule.startRule + ' ' + xml;
          } else if (isCss) {
            xml = '<' + tmplRule.extensionRule + 'css style="' + xml;
          }
        }

        if (i < l - 1) {
          var last = xml.length - 1,
              lastChar = xml[last],
              lastChar3 = xml.substr(last - 2),
              isAccessor = lastChar === '#',
              isSpread = lastChar3 === '...';

          if (isInBrace) {
            isInBrace = !tmplRule['incompleteEnd' + (isInBrace === 'isR' ? 'R' : '')].test(xml);
          }

          if (!isInBrace) {
            if (tmplRule.incompleteStartR.test(xml)) {
              isInBrace = 'isR';
            } else {
              isInBrace = tmplRule.incompleteStart.test(xml);
            }
          }

          if (isAccessor) {
            xml = xml.substr(0, last);
          } else if (isSpread) {
            xml = xml.substr(0, last - 2);
          }

          split = (isAccessor ? '#' : isSpread ? '...' : '') + SPLIT_FLAG + i;

          if (!isInBrace) {
            split = tmplRule.startRule + split + tmplRule.endRule;
          }
        }

        if (i == l - 1) {
          if (isExpression) {
            xml += ' ' + tmplRule.endRule + (outputH ? tmplRule.lastChar : '');
          } else if (isCss) {
            xml += '" />';
          }
        }

        fullXml += xml + split;
      }, true); //Merge all include tags

      var includeParser = nj.includeParser;

      if (includeParser) {
        fullXml = includeParser(fullXml, fileName, tmplRule);
      }

      fullXml = _formatAll(fullXml, tmplRule);

      if (!outputH) {
        if (nj.textMode) {
          fullXml = '<' + nj.textTag + '>' + fullXml + '</' + nj.textTag + '>';
        }

        if (nj.noWsMode) {
          fullXml = '<' + nj.noWsTag + '>' + fullXml + '</' + nj.noWsTag + '>';
        }
      } //Resolve string to element


      ret = _checkStringElem(fullXml, tmplRule, outputH);
      defineProp(ret, '_njParamCount', {
        value: l - 1
      }); //Save to the cache

      preAsts[tmplKey] = ret;
    }

    var tmplFn;

    if (!onlyParse) {
      var params,
          args = arguments,
          paramCount = ret._njParamCount;

      if (paramCount > 0) {
        params = {};
        defineProp(params, '_njParam', {
          value: true
        });

        for (var i = 0; i < paramCount; i++) {
          params[SPLIT_FLAG + i] = args[i + 1];
        }
      }

      tmplFn = params ? function () {
        return tmplMainFn.apply(this, arrayPush([params], arguments));
      } : function () {
        return tmplMainFn.apply(this, arguments);
      };
      defineProps(tmplFn, {
        _njTmpl: {
          value: ret
        },
        _njTmplKey: {
          value: tmplKey
        }
      });
      var tmplMainFn = nj['compile' + (outputH ? 'H' : '')](tmplFn, tmplKey, null, null, tmplRule);
    } else {
      tmplFn = {
        _njTmpl: ret,
        _njTmplKey: tmplKey
      };
    }

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
  } //Resolve string to element


  function _checkStringElem(xml, tmplRule, outputH) {
    var root = [],
        current = {
      elem: root,
      elemName: 'root',
      parent: null
    },
        parent = null,
        pattern = tmplRule.checkElem,
        matchArr,
        inTextContent,
        omittedCloseElem = null;

    while (matchArr = pattern.exec(xml)) {
      var textBefore = matchArr[1],
          elem = matchArr[2],
          elemName = matchArr[3],
          elemParams = matchArr[4],
          textAfter = matchArr[5]; //处理上一次循环中的可省略闭合标签

      if (omittedCloseElem) {
        var _omittedCloseElem = omittedCloseElem,
            _omittedCloseElem2 = _slicedToArray(_omittedCloseElem, 4),
            _elem = _omittedCloseElem2[0],
            _elemName = _omittedCloseElem2[1],
            _elemParams = _omittedCloseElem2[2],
            _textAfter = _omittedCloseElem2[3];

        var isEx = elem ? isExAll(elemName, tmplRule) : false;

        if (isEx && !isEx[1] && (isPropS(elemName, tmplRule) || isStrPropS(elemName, tmplRule) || isParamsEx(isEx[3]) || exCompileConfig(isEx[3]).isDirective)) {
          parent = current;
          current = _createCurrent(_elemName, parent);

          _setElem(_elem, _elemName, _elemParams, current.elem, null, tmplRule, outputH);
        } else {
          _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule, outputH);
        }

        _setTextAfter(_textAfter, current);

        omittedCloseElem = null;
      } //Text before tag


      if (textBefore && textBefore !== '') {
        _setText(textBefore, current.elem);
      } //Element tag


      if (elem) {
        if (elem !== '<') {
          if (elem.indexOf('<!') === 0) {
            //一些特殊标签当做文本处理
            _setText(elem, current.elem);
          } else {
            var _isEx = isExAll(elemName, tmplRule);

            if (elemName[0] === '/') {
              //Close tag
              if (elemName.substr(1).toLowerCase() === inTextContent) {
                //取消纯文本子节点标记
                inTextContent = null;
              }

              if (_isEx || !inTextContent) {
                var cName = current.elemName;

                if (cName.indexOf(SPLIT_FLAG) < 0 ? elemName === '/' + cName : elemName.indexOf(SPLIT_FLAG) > -1 || elemName === '//') {
                  //如果开始标签包含SPLIT_FLAG，则只要结束标签包含SPLIT_FLAG就认为该标签已关闭
                  current = current.parent;
                }
              } else {
                _setText(elem, current.elem);
              }
            } else if (elem[elem.length - 2] === '/') {
              //Self close tag
              if (_isEx || !inTextContent) {
                _setSelfCloseElem(elem, elemName, elemParams, current.elem, tmplRule, outputH);
              } else {
                _setText(elem, current.elem);
              }
            } else {
              //Open tag
              if (_isEx || !inTextContent) {
                if (!inTextContent && OMITTED_CLOSE_TAGS$1[elemName.toLowerCase()]) {
                  //img等可不闭合标签
                  omittedCloseElem = [elem, elemName, elemParams, textAfter];
                } else {
                  var elemNameL = elemName.toLowerCase();

                  if (TEXT_CONTENT.indexOf(elemNameL) > -1) {
                    //标记该标签为纯文本子节点
                    inTextContent = elemNameL;
                  }

                  parent = current;
                  current = _createCurrent(elemName, parent);

                  _setElem(elem, elemName, elemParams, current.elem, null, tmplRule, outputH);
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
      } //Text after tag


      !omittedCloseElem && _setTextAfter(textAfter, current);
    } //处理最后一次循环中遗留的可省略闭合标签


    if (omittedCloseElem) {
      var _omittedCloseElem3 = omittedCloseElem,
          _omittedCloseElem4 = _slicedToArray(_omittedCloseElem3, 4),
          _elem2 = _omittedCloseElem4[0],
          _elemName2 = _omittedCloseElem4[1],
          _elemParams2 = _omittedCloseElem4[2],
          _textAfter2 = _omittedCloseElem4[3];

      _setSelfCloseElem(_elem2, _elemName2, _elemParams2, current.elem, tmplRule, outputH);

      _setTextAfter(_textAfter2, current);
    }

    return root;
  }

  var LT_GT_LOOKUP$1 = {
    '<': '_njLt_',
    '>': '_njGt_'
  };
  var REGEX_LT_GT$1 = />|</g;

  function _formatAll(str, tmplRule) {
    var commentRule = tmplRule.commentRule;
    return str.replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '').replace(new RegExp('([\\s]+:[^\\s=>]+=((\'[^\']+\')|("[^"]+")))|(' + tmplRule.braceParamStr + ')', 'g'), function (all, g1, g2, g3, g4, g5) {
      return (g1 ? g1 : g5).replace(REGEX_LT_GT$1, function (match) {
        return LT_GT_LOOKUP$1[match];
      });
    });
  }

  function _transformToEx(isStr, elemName, elemParams, tmplRule) {
    return tmplRule.extensionRule + (isStr ? 'strProp' : 'prop') + ' ' + tmplRule.startRule + '\'' + elemName.substr((isStr ? tmplRule.strPropRule.length : 0) + tmplRule.propRule.length) + '\'' + tmplRule.endRule + elemParams;
  } //Set element node


  function _setElem(elem, elemName, elemParams, elemArr, bySelfClose, tmplRule, outputH) {
    var ret,
        paramsEx,
        fixedExTagName = fixExTagName(elemName, tmplRule);

    if (fixedExTagName) {
      elemName = fixedExTagName;
    }

    if (isEx(elemName, tmplRule, true)) {
      ret = elem.substring(1, elem.length - 1);

      if (fixedExTagName) {
        ret = tmplRule.extensionRule + lowerFirst(ret);
      }

      var retS = _getSplitParams(ret, tmplRule, outputH);

      ret = retS.elem;
      paramsEx = retS.params;
    } else if (isStrPropS(elemName, tmplRule)) {
      ret = _transformToEx(true, elemName, elemParams, tmplRule);
    } else if (isPropS(elemName, tmplRule)) {
      ret = _transformToEx(false, elemName, elemParams, tmplRule);
    } else {
      var _retS = _getSplitParams(elem, tmplRule, outputH);

      ret = _retS.elem;
      paramsEx = _retS.params;
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

  var REGEX_EX_ATTR = /([^\s-$.]+)(([$.][^\s-$.]+)*)((-[^\s-$.]+([$.][^\s-$.]+)*)*)/; //Extract split parameters

  function _getSplitParams(elem, tmplRule, outputH) {
    var extensionRule = tmplRule.extensionRule,
        startRule = tmplRule.startRule,
        endRule = tmplRule.endRule,
        firstChar = tmplRule.firstChar,
        lastChar = tmplRule.lastChar,
        spreadProp = tmplRule.spreadProp,
        directives = tmplRule.directives;
    var paramsEx; //Replace the parameter like "{...props}".

    elem = elem.replace(spreadProp, function (all, g1, propR, g3, prop) {
      if (propR) {
        prop = propR;
      }

      if (!paramsEx) {
        paramsEx = [extensionRule + 'props'];
      }

      paramsEx.push([extensionRule + 'spread ' + (propR ? firstChar : '') + startRule + prop.replace(/\.\.\./, '') + endRule + (propR ? lastChar : '') + '/']);
      return ' ';
    }); //Replace the parameter like "#show={false}".

    elem = elem.replace(directives, function (all, g1, g2, g3, g4, g5, g6, key, hasColon, hasEx, name, hasEqual, value) {
      if (hasEx == null) {
        return all;
      }

      if (!paramsEx) {
        paramsEx = [extensionRule + 'props'];
      }

      var args, modifiers;
      name = name.replace(REGEX_EX_ATTR, function (all, name, modifier, g3, arg) {
        if (arg) {
          args = arg.substr(1).split('-').map(function (item) {
            var argStr;
            var modifierStr = '';
            var strs = item.split(/[$.]/);
            strs.forEach(function (str, i) {
              if (i == 0) {
                argStr = 'name:\'' + str + '\'' + (i < strs.length - 1 ? ',' : '');
              } else {
                modifierStr += '\'' + str + '\'' + (i < strs.length - 1 ? ',' : '');
              }
            });
            return '{' + argStr + (modifierStr != '' ? 'modifiers:[' + modifierStr + ']' : '') + '}';
          });
        }

        if (modifier) {
          modifiers = modifier.substr(1).split(/[$.]/).map(function (item) {
            return '\'' + item + '\'';
          });
        }

        return name;
      });
      var exPreAst = [extensionRule + name + ' _njIsDirective' + (args ? ' arguments="' + firstChar + startRule + '[' + args.join(',') + ']' + endRule + lastChar + '"' : '') + (modifiers ? ' modifiers="' + startRule + '[' + modifiers.join(',') + ']' + endRule + '"' : '') + (hasEqual ? '' : ' /')];
      hasEqual && exPreAst.push((hasColon ? (outputH ? firstChar : '') + startRule + ' ' : '') + clearQuot(value) + (hasColon ? ' ' + endRule + (outputH ? lastChar : '') : ''));
      paramsEx.push(exPreAst);
      return ' ';
    });
    return {
      elem: elem,
      params: paramsEx
    };
  } //Set self close element node


  function _setSelfCloseElem(elem, elemName, elemParams, elemArr, tmplRule, outputH) {
    if (/\/$/.test(elemName)) {
      elemName = elemName.substr(0, elemName.length - 1);
    }

    _setElem(elem, elemName, elemParams, elemArr, true, tmplRule, outputH);
  } //Set text node


  function _setText(text, elemArr) {
    elemArr.push(text);
  }

  function _createCompile(outputH) {
    return function (tmpl, tmplKey, fileName, delimiters, tmplRule) {
      if (!tmpl) {
        return;
      }

      if (isObject(tmplKey)) {
        var options = tmplKey;
        tmplKey = options.tmplKey;
        fileName = options.fileName;
        delimiters = options.delimiters;
        tmplRule = options.tmplRule;
      } //编译模板函数


      var tmplFns;

      if (tmplKey) {
        tmplFns = nj.templates[tmplKey];
      }

      if (!tmplFns) {
        var isObj = isObject(tmpl),
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
              if (!tmplRule) {
                tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;
              }

              root = _createAstRoot(); //Transform string template to preAst

              if (isString(tmpl)) {
                tmpl = compileStringTmpl.call({
                  tmplRule: tmplRule,
                  outputH: outputH,
                  onlyParse: true,
                  fileName: fileName
                }, tmpl);
              } //分析传入参数并转换为节点树对象


              checkElem(tmpl._njTmpl, root, tmplRule);
            } //保存模板AST编译结果到全局集合中


            if (tmplKey) {
              nj.asts[tmplKey] = root;
            }
          }

          fns = buildRuntime(root.content, root, !outputH);
        }

        tmplFns = template(fns, tmplKey); //保存模板函数编译结果到全局集合中

        if (tmplKey) {
          nj.templates[tmplKey] = tmplFns;
        }
      }

      return tmplFns.main;
    };
  }

  var compile = _createCompile();
  var compileH = _createCompile(true); //Create template root object

  function _createAstRoot() {
    var root = obj();
    root.type = 'nj_root';
    root.content = [];
    return root;
  } //Precompile template


  function precompile(tmpl, outputH, tmplRule) {
    var root = _createAstRoot();

    if (tmpl.quasis) {
      var _tmpl = tmpl,
          quasis = _tmpl.quasis,
          isExpression = _tmpl.isExpression,
          isCss = _tmpl.isCss;
      tmpl = compileStringTmpl.call({
        tmplRule: tmplRule,
        outputH: outputH,
        onlyParse: true,
        isExpression: isExpression,
        isCss: isCss
      }, quasis);
    } else if (isString(tmpl)) {
      tmpl = compileStringTmpl.call({
        tmplRule: tmplRule,
        outputH: outputH,
        onlyParse: true
      }, tmpl);
    }

    checkElem(tmpl._njTmpl, root, tmplRule);
    return buildRuntime(root.content, root, !outputH);
  }

  function _createRender(outputH) {
    return function (tmpl, options) {
      return (outputH ? compileH : compile)(tmpl, options ? {
        tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
        fileName: options.fileName,
        delimiters: options.delimiters
      } : tmpl._njTmplKey).apply(null, arraySlice(arguments, 1));
    };
  }

  var render = _createRender();
  var renderH = _createRender(true);

  function _buildRender$1(outputH) {
    return function (tmpl, params) {
      var tmplMainFn = (outputH ? compileH : compile)(tmpl, tmpl._njTmplKey);

      if (params) {
        var tmplFn = function tmplFn() {
          return tmplMainFn.apply(this, arrayPush([params], arguments));
        };

        defineProp(params, '_njParam', {
          value: true
        });
        defineProps(tmplFn, {
          _njTmpl: {
            value: true
          }
        });
        return tmplFn;
      }

      return tmplMainFn;
    };
  }

  var buildRender = _buildRender$1();
  var buildRenderH = _buildRender$1(true);
  assign(nj, {
    compile: compile,
    compileH: compileH,
    precompile: precompile,
    render: render,
    renderH: renderH,
    buildRender: buildRender,
    buildRenderH: buildRenderH
  });

  function createTaggedTmpl() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var outputH = opts.outputH,
        delimiters = opts.delimiters,
        fileName = opts.fileName,
        isExpression = opts.isExpression,
        isCss = opts.isCss;
    var tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;
    return function () {
      return compileStringTmpl.apply({
        tmplRule: tmplRule,
        outputH: outputH,
        fileName: fileName,
        isExpression: isExpression,
        isCss: isCss
      }, arguments);
    };
  }
  function createTaggedTmplH() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    opts.outputH = true;
    return createTaggedTmpl(opts);
  }
  var taggedTmpl = createTaggedTmpl();
  var taggedTmplH = createTaggedTmplH();
  function template$1() {
    return (nj.outputH ? taggedTmplH : taggedTmpl).apply(null, arguments)();
  }

  var _taggedExpression = createTaggedTmpl({
    isExpression: true
  });

  var _taggedExpressionH = createTaggedTmplH({
    isExpression: true
  });

  function expression() {
    return (nj.outputH ? _taggedExpressionH : _taggedExpression).apply(null, arguments)();
  }

  var _taggedCssH = createTaggedTmplH({
    isCss: true
  });

  function css() {
    return _taggedCssH.apply(null, arguments)();
  }
  assign(nj, {
    createTaggedTmpl: createTaggedTmpl,
    createTaggedTmplH: createTaggedTmplH,
    taggedTmpl: taggedTmpl,
    taggedTmplH: taggedTmplH,
    template: template$1,
    expression: expression,
    css: css
  });

  assign(nj, {
    registerComponent: registerComponent,
    getComponentConfig: getComponentConfig,
    copyComponentConfig: copyComponentConfig,
    createTmplRule: createTmplRule,
    config: config
  });
  var _global = nj.global;
  _global.NornJ = _global.nj = nj;

  exports.compile = compile;
  exports.compileH = compileH;
  exports.css = css;
  exports.default = nj;
  exports.expression = expression;
  exports.registerComponent = registerComponent;
  exports.registerExtension = registerExtension;
  exports.registerFilter = registerFilter;
  exports.render = render;
  exports.renderH = renderH;
  exports.taggedTmpl = taggedTmpl;
  exports.taggedTmplH = taggedTmplH;
  exports.template = template$1;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
