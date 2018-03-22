/*!
* NornJ template engine v0.4.2-rc.36
* (c) 2016-2018 Joe_Sky
* Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
nj.textTag = 'nj-text';
nj.textMode = false;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
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
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var nativeArrayPush = Array.prototype.push;
var nativeArraySlice = Array.prototype.slice;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var errorTitle = nj.errorTitle;


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
function warn(msg) {
  console.warn(errorTitle + msg);
}

//Print error
function error(msg) {
  console.error(errorTitle + msg);
}

//create light weight object
function obj() {
  return Object.create(null);
}

//Clear quotation marks
var REGEX_QUOT_D = /["]+/g;
var REGEX_QUOT_S = /[']+/g;

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
  toCamelCase: toCamelCase,
  assign: assign
});

//注册组件
function registerComponent(name, component) {
  var params = name,
      ret = void 0;
  if (!isObject(name)) {
    params = {};
    params[name] = component;
  }

  each(params, function (v, k, i) {
    nj.components[k.toLowerCase()] = v;
    if (i == 0) {
      ret = v;
    }
  }, false, false);

  return ret;
}

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

function _replaceMinus(str) {
  return str.replace(/\-/g, '\\-');
}

function createTmplRule() {
  var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isGlobal = arguments[1];
  var _nj$tmplRule = nj.tmplRule,
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

  var firstChar = startRule[0],
      lastChar = endRule[endRule.length - 1],
      allRules = firstChar + lastChar,
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

//Set global template rules
createTmplRule({}, true);

function config (configs) {
  var delimiters = configs.delimiters,
      includeParser = configs.includeParser,
      createElement = configs.createElement,
      outputH = configs.outputH,
      textMode = configs.textMode;

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
  nbsp: '\xA0',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwnj: '\u200C',
  zwj: '\u200D',
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

var REGEX_NUM = /^(-?([0-9]+[\.]?[0-9]+)|[0-9])$/;

//提取style内参数
function styleProps(obj$$1) {
  //If the parameter is a style object,then direct return.
  if (isObject(obj$$1) || isArray(obj$$1) || isNumber(obj$$1)) {
    return obj$$1;
  }

  //参数为字符串
  var pattern = /([^\s:]+)[\s]?:[\s]?([^;]+)[;]?/g,
      matchArr = void 0,
      ret = void 0;

  while (matchArr = pattern.exec(obj$$1)) {
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
    key = toCamelCase(key);

    ret[key] = REGEX_NUM.test(value) ? Number(value) : value;
  }

  return ret;
}

//Get value from multiple datas
function getData(prop, data, hasCtx) {
  var ret = void 0,
      obj$$1 = void 0;
  if (!data) {
    data = this.data;
  }

  for (var i = 0, l = data.length; i < l; i++) {
    obj$$1 = data[i];
    if (obj$$1) {
      ret = obj$$1[prop];
      if (ret !== undefined) {
        if (hasCtx) {
          return {
            ctx: obj$$1,
            val: ret
          };
        }

        return ret;
      }
    }
  }
}

function _getLevel(level, p2) {
  if (level != null && p2.level != null) {
    level += p2.level;
  }
  return level;
}

function getComputedData(fn, p2, level) {
  if (fn == null) {
    return fn;
  }

  if (fn.val._njTmpl) {
    //模板函数
    return fn.val.call({
      _njData: p2.data,
      _njParent: p2.parent,
      _njIndex: p2.index,
      _njLevel: _getLevel(level, p2),
      _njIcp: p2.icp
    });
  } else {
    //普通函数
    return fn.val.call(fn.ctx, p2);
  }
}

function getElement(name, p1, nameO, p2, subName) {
  var element = void 0;
  if (!p2.icp) {
    element = p1.cp[name];
  } else {
    element = getData(nameO, p2.icp);
    if (!element) {
      element = p1.cp[name];
    }
  }

  if (subName != null && element) {
    element = element[subName];
  }

  return element ? element : name;
}

function getElementRefer(refer, name, p1, nameO, p2) {
  return refer != null ? isString(refer) ? getElement(refer.toLowerCase(), p1, nameO, p2) : refer : getElement(name, p1, nameO, p2);
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

  return {
    data: p3.data ? arrayPush(p3.data, p2.data) : p2.data,
    parent: p3.fallback ? p2 : p2.parent,
    root: p2.root || p2,
    index: 'index' in p3 ? p3.index : p2.index,
    level: p2.level,
    getData: getData,
    d: getData,
    icp: p2.icp
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

function _getLocalComponents(localConfigs, initCtx) {
  var icp = void 0;
  if (localConfigs && localConfigs.components) {
    icp = localConfigs.components;
    if (!isArray(icp)) {
      icp = [icp];
    }
  }
  if (initCtx && initCtx._njIcp) {
    icp = icp ? arrayPush(icp, initCtx._njIcp) : initCtx._njIcp;
  }
  return icp;
}

//构建可运行的模板函数
function tmplWrap(configs, main) {
  return function (lc, lc2) {
    var initCtx = this,
        data = arraySlice(arguments);

    return main(configs, {
      data: initCtx && initCtx._njData ? arrayPush(data, initCtx._njData) : data,
      parent: initCtx ? initCtx._njParent : null,
      index: initCtx ? initCtx._njIndex : null,
      level: initCtx ? initCtx._njLevel : null,
      getData: getData,
      d: getData,
      icp: _getLocalComponents(lc && lc._njParam ? lc2 : lc, initCtx)
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

function createElementApply(p) {
  return nj.createElement.apply(null, p);
}

//创建模板函数
function template(fns) {
  var configs = {
    us: fns.useString,
    x: nj.extensions,
    f: nj.filters,
    np: noop,
    tf: throwIf,
    wn: warn,
    n: newContext,
    c: getComputedData,
    sp: styleProps,
    r: exRet,
    e: getElement,
    er: getElementRefer,
    en: getElementName,
    aa: addArgs,
    an: assign,
    g: nj.global,
    l: _getLevel
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
    if (k.indexOf('main') === 0) {
      //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
      defineProps(configs[k], {
        _njTmpl: {
          value: true
        },
        tmplName: { //设置函数名
          value: v._njName
        }
      });
      configs['_' + k] = v;
    } else if (k.indexOf('fn') === 0) {
      //扩展标签函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}

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
          }, false, true);
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

    each(props.elseifs, function (elseif, i) {
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

  each: function each$$1(list, options) {
    var useString = options.useString,
        props = options.props,
        ret = void 0;

    if (list) {
      if (useString) {
        ret = '';
      } else {
        ret = [];
      }

      var isArrayLike$$1 = isArrayLike(list);
      each(list, function (item, index, len, lenObj) {
        var param = {
          data: [item],
          index: isArrayLike$$1 ? index : len,
          fallback: true
        };

        var extra = void 0;
        if (props && props.moreValues) {
          var _len = isArrayLike$$1 ? len : lenObj;
          extra = {
            '@first': param.index === 0,
            '@last': param.index === _len - 1,
            '@length': _len
          };
        }
        if (!isArrayLike$$1) {
          if (!extra) {
            extra = {};
          }
          extra['@key'] = index;
        }
        if (extra) {
          param.data.push(extra);
        }

        var retI = options.result(param);
        if (useString) {
          ret += retI;
        } else {
          ret.push(retI);
        }
      }, false, isArrayLike$$1);

      //Return null when not use string and result is empty.
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
    var ret = options.result(),
        //Get parameter value
    value = void 0;

    if (ret !== undefined) {
      value = ret;
    } else {
      //Match to Similar to "checked" or "disabled" attribute.
      value = !options.useString ? true : name;
    }

    options.exProps[options.outputH ? fixPropName(name) : name] = value;
  },

  //Spread parameters
  spread: function spread(props, options) {
    each(props, function (v, k) {
      options.exProps[k] = v;
    }, false, false);
  },

  show: function show(options) {
    if (!options.result()) {
      options.exProps.style = options.useString ? 'display:none' : { display: 'none' };
    }
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

  obj: function obj$$1(options) {
    return options.props;
  },

  list: function list() {
    var args = arguments,
        last = args.length - 1,
        options = args[last];

    if (last > 0) {
      var ret = arraySlice(args, 0, last);
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
        params = {};

        var paramNames = Object.keys(props);
        paramNames.forEach(function (v, i) {
          return params[paramNames[i]] = _arguments[i];
        });
      }

      return options.result({ data: [params] });
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
      data: [props && props.as ? defineProperty({}, props.as, originalData) : originalData]
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
    var cacheObj = options.context.root || options.context,
        props = options.props,
        cacheKey = props && props.name ? props.name : '_njOnceCache_' + options._njFnsNo,
        cache = cacheObj[cacheKey];

    if (cache === undefined) {
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
    ret = assign(ret, params);
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
extensionConfig.show = _config(extensionConfig.prop);

//Extension alias
extensions['case'] = extensions.elseif;
extensionConfig['case'] = extensionConfig.elseif;
extensions['empty'] = extensions['default'] = extensions['else'];
extensionConfig['empty'] = extensionConfig['default'] = extensionConfig['else'];
extensions.strProp = extensions.prop;
extensionConfig.strProp = assign(_config(extensionConfig.prop), { useString: true });
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);

//Register extension and also can batch add
function registerExtension(name, extension, options) {
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

assign(nj, {
  extensions: extensions,
  extensionConfig: extensionConfig,
  registerExtension: registerExtension
});

//Global filter list
var filters = {
  //Get properties
  '.': function _(obj$$1, prop) {
    if (obj$$1 == null) {
      return obj$$1;
    }

    return obj$$1[prop];
  },

  //Call method
  _: function _(method) {
    if (method == null) {
      return method;
    }

    var args = arguments;
    return method.apply(args[args.length - 1].lastValue, arraySlice(args, 1, args.length - 1));
  },

  //Get computed properties
  '#': function _(obj$$1, prop, options) {
    if (obj$$1 == null) {
      return obj$$1;
    }

    return getComputedData({
      val: obj$$1[prop],
      ctx: obj$$1
    }, options.context, options.level);
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
  '<': function _(val1, val2) {
    return val1 < val2;
  },

  '<=': function _(val1, val2) {
    return val1 <= val2;
  },

  //Greater than
  '>': function _(val1, val2) {
    return val1 > val2;
  },

  '>=': function _(val1, val2) {
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

  '**': function _(val1, val2) {
    return Math.pow(val1, val2);
  },

  '//': function _(val1, val2) {
    return Math.floor(val1 / val2);
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

  obj: function obj$$1() {
    var args = arguments,
        ret = {};

    each(args, function (v, i) {
      ret[v.key] = v.val;
    }, false, true);
    return ret;
  },

  ':': function _(key, val) {
    return { key: key, val: val };
  },

  list: function list() {
    var args = arguments;
    if (args.length === 0) {
      return [];
    } else {
      return arraySlice(args, 0, args.length);
    }
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
  }
};

function _getArrayByNum(isContainEnd) {
  return function (val1, val2) {
    return Object.keys(Array.apply(null, { length: val2 - val1 + isContainEnd })).map(function (item) {
      return +item + val1;
    });
  };
}

function _config$1(params) {
  var ret = {
    onlyGlobal: false,
    hasOptions: true
  };

  if (params) {
    ret = assign(ret, params);
  }
  return ret;
}

var _defaultCfg$1 = { onlyGlobal: true, hasOptions: false };

//Filter default config
var filterConfig = {
  '.': _config$1(_defaultCfg$1),
  '_': _config$1({ onlyGlobal: true }),
  '#': _config$1({ onlyGlobal: true }),
  '==': _config$1(_defaultCfg$1),
  '===': _config$1(_defaultCfg$1),
  '!=': _config$1(_defaultCfg$1),
  '!==': _config$1(_defaultCfg$1),
  '<': _config$1(_defaultCfg$1),
  '<=': _config$1(_defaultCfg$1),
  '>': _config$1(_defaultCfg$1),
  '>=': _config$1(_defaultCfg$1),
  '+': _config$1(_defaultCfg$1),
  '-': _config$1(_defaultCfg$1),
  '*': _config$1(_defaultCfg$1),
  '/': _config$1(_defaultCfg$1),
  '%': _config$1(_defaultCfg$1),
  '**': _config$1(_defaultCfg$1),
  '//': _config$1(_defaultCfg$1),
  '?': _config$1(_defaultCfg$1),
  '!': _config$1(_defaultCfg$1),
  '&&': _config$1(_defaultCfg$1),
  or: _config$1(_defaultCfg$1),
  int: _config$1(_defaultCfg$1),
  float: _config$1(_defaultCfg$1),
  bool: _config$1(_defaultCfg$1),
  obj: _config$1(_defaultCfg$1),
  ':': _config$1(_defaultCfg$1),
  list: _config$1(_defaultCfg$1),
  reg: _config$1(_defaultCfg$1),
  css: _config$1(_defaultCfg$1),
  '..': _config$1(_defaultCfg$1),
  rLt: _config$1(_defaultCfg$1),
  '<=>': _config$1(_defaultCfg$1)
};

//Filter alias
filters.prop = filters['.'];
filterConfig.prop = filterConfig['.'];

//Register filter and also can batch add
function registerFilter(name, filter, options) {
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


      if (_filter) {
        filters[name] = _filter;
      } else {
        filters[name] = v;
      }
      filterConfig[name] = _config$1(_options);
    }
  }, false, false);
}

assign(nj, {
  filters: filters,
  filterConfig: filterConfig,
  registerFilter: registerFilter
});

//Get compiled property
var REGEX_JS_PROP = /('[^']*')|("[^"]*")|(-?[0-9][0-9]*(\.\d+)?)|true|false|null|undefined|Object|Array|Math|Date|JSON|(([a-zA-Z_$#@])([a-zA-Z_$\d]*))/;
var REGEX_REPLACE_CHAR = /_njQs(\d+)_/g;
var REGEX_HAS_BRACKET = /bracket_\d+/;

function _replaceStr(prop, innerQuotes) {
  return prop.replace(REGEX_REPLACE_CHAR, function (all, g1) {
    return innerQuotes[g1];
  });
}

function _syntaxError(errorStr, expression, source) {
  return 'Filter or expression syntax error: ' + errorStr + ' in\n\nexpression: ' + expression + '\n\nsource: ' + source + '\n\nNornJ expression syntax specification please see the document: https://joe-sky.github.io/nornj-guide/templateSyntax/filter.html\n';
}

function _compiledProp(prop, innerBrackets, innerQuotes, source) {
  var ret = obj();
  var propO = prop;

  //If there are vertical lines in the property,then use filter
  if (prop.indexOf('|') >= 0) {
    var filters = [],
        filtersTmp = void 0;
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
          throwIf(innerBrackets[paramsF] != null, _syntaxError(_replaceStr(paramsF, innerQuotes), _replaceStr(propO, innerQuotes), source));

          var params = [];
          each(innerBrackets[paramsF].split(','), function (p) {
            if (p !== '') {
              params[params.length] = _compiledProp(p.trim(), innerBrackets, innerQuotes, source);
            }
          }, false, true);

          filterObj.params = params;
        }

        filterObj.name = filterName;
        filters.push(filterObj);
      }
    }, false, true);

    ret.filters = filters;
  }

  //替换字符串值
  prop = _replaceStr(prop, innerQuotes);

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
  if (prop !== '') {
    var matchProp = REGEX_JS_PROP.exec(prop);
    var hasComputed = matchProp[6] === '#';
    ret.name = hasComputed ? matchProp[7] : matchProp[0];

    if (matchProp[0] !== prop) {
      if (REGEX_HAS_BRACKET.test(ret.name)) {
        throwIf(0, _syntaxError('There is an extra bracket', _replaceStr(propO, innerQuotes), source));
      } else {
        error(_syntaxError('The operator must have at least one space before and after', _replaceStr(propO, innerQuotes), source));
      }
    }
    if (!matchProp[5]) {
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
function _getFilterParam(obj$$1) {
  return obj$$1.split('\'bracket_');
}

//Extract replace parameters
var REGEX_LT_GT = /_nj(L|G)t_/g;
var LT_GT_LOOKUP = {
  '_njLt_': '<',
  '_njGt_': '>'
};
var REGEX_QUOTE = /"[^"]*"|'[^']*'/g;
var SP_FILTER_LOOKUP = {
  '||': 'or',
  '..<': 'rLt'
};
var REGEX_SP_FILTER = /[\s]+((\|\||\.\.<)[\s]*)/g;
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
var REGEX_ARR_OBJ_FILTER = /\[|\]|\{|\}/g;
var REGEX_OBJKEY_FILTER = /([^\s:,'"()|]+):/g;

function _getProp(matchArr, innerQuotes, i) {
  var prop = matchArr[2].trim(),
      item = [matchArr[0], matchArr[1], null, true];

  if (i > 0) {
    item[3] = false; //Sign not contain all of placehorder
  }

  //替换特殊过滤器名称并且为简化过滤器补全"|"符
  prop = prop.replace(REGEX_LT_GT, function (match) {
    return LT_GT_LOOKUP[match];
  }).replace(REGEX_QUOTE, function (match) {
    innerQuotes.push(match);
    return '_njQs' + (innerQuotes.length - 1) + '_';
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
  }).replace(REGEX_OBJKEY_FILTER, function (all, g1) {
    return ' \'' + g1 + '\' : ';
  }).replace(REGEX_SP_FILTER, function (all, g1, match) {
    return ' ' + SP_FILTER_LOOKUP[match] + ' ';
  }).replace(REGEX_SPACE_S_FILTER, function (all, match) {
    return match;
  }).replace(REGEX_FN_FILTER, function (all, match, g1) {
    return !g1 ? FN_FILTER_LOOKUP[match] : '.(\'' + g1 + '\')_(';
  });

  item[2] = prop.trim();
  return item;
}

function _getReplaceParam(obj$$1, tmplRule, innerQuotes, hasColon) {
  var pattern = tmplRule.replaceParam,
      matchArr = void 0,
      ret = void 0,
      i = 0;

  if (!hasColon) {
    while (matchArr = pattern.exec(obj$$1)) {
      if (!ret) {
        ret = [];
      }

      var startRuleR = matchArr[2];
      ret.push(_getProp([matchArr[0], startRuleR ? startRuleR : matchArr[5], startRuleR ? matchArr[3] : matchArr[6]], innerQuotes, i));
      i++;
    }
  } else {
    matchArr = [obj$$1, tmplRule.startRule, obj$$1];
    ret = [_getProp(matchArr, innerQuotes, i)];
  }

  return ret;
}

var REGEX_INNER_BRACKET = /\(([^()]*)\)/g;
var REGEX_FIX_OPERATOR = /[\s]+([^\s(),|"']+)[\s]+((-?[0-9][0-9]*(\.\d+)?|[^\s,|']+)('bracket_\d+)?([._#]'bracket_\d+)*)/g;
var REGEX_SPACE_FILTER = /[(,]/g;
var REGEX_FIX_FILTER = /(\|)?(((\.+|_|#+)'bracket_)|[\s]+([^\s._#|]+[\s]*'bracket_))/g;

function _fixOperator(prop, innerBrackets) {
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
}

//Get compiled parameter
function compiledParam(value, tmplRule, hasColon) {
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
  }

  //If have placehorder
  if (strs.length > 1) {
    var innerQuotes = [];
    var params = _getReplaceParam(value, tmplRule, innerQuotes, hasColon);
    props = [];

    each(params, function (param) {
      var retP = obj(),
          innerBrackets = [];

      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      var prop = _replaceInnerBrackets(param[2], innerBrackets);
      retP.prop = _compiledProp(prop, innerBrackets, innerQuotes, value);

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

//提取xml open tag
function getXmlOpenTag(obj$$1, tmplRule) {
  return tmplRule.xmlOpenTag.exec(obj$$1);
}

//验证xml self close tag
var REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;

function isXmlSelfCloseTag(obj$$1) {
  return REGEX_XML_SELF_CLOSE_TAG.test(obj$$1);
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

    var value = matchArr[8],
        onlyBrace = matchArr[4] != null ? matchArr[4] : matchArr[6];
    if (value != null) {
      value = clearQuot(value); //Remove quotation marks
    } else {
      value = key; //Match to Similar to "checked" or "disabled" attribute.
    }

    //Removed at the end of "/>", ">" or "/".
    if (!matchArr[9] && !matchArr[10]) {
      if (/\/>$/.test(value)) {
        value = value.substr(0, value.length - 2);
      } else if (/>$/.test(value) || /\/$/.test(value)) {
        value = value.substr(0, value.length - 1);
      }
    }

    //Transform special key
    var hasColon = void 0;
    if (key[0] === ':') {
      key = key.substr(1);
      hasColon = true;
    }

    ret.push({
      key: key,
      value: value,
      onlyBrace: onlyBrace,
      hasColon: hasColon
    });
  }

  return ret;
}

//判断xml close tag
function isXmlCloseTag(obj$$1, tagName) {
  return isString(obj$$1) && obj$$1.toLowerCase() === '</' + tagName + '>';
}

//get inside brace param
function getInsideBraceParam(obj$$1, tmplRule) {
  return tmplRule.braceParam.exec(obj$$1);
}

//判断扩展标签并返回参数
function isEx(obj$$1, tmplRule, noParams) {
  var ret = void 0,
      ret1 = tmplRule.extension.exec(obj$$1);
  if (ret1) {
    ret = [ret1[1]];

    if (!noParams) {
      var params = getOpenTagParams(obj$$1, tmplRule); //提取各参数
      if (params) {
        ret.push(params);
      }
    }
  }

  return ret;
}

function isExAll(obj$$1, tmplRule) {
  return obj$$1.match(tmplRule.exAll);
}

//判断是否模板元素
function isTmpl(obj$$1) {
  return obj$$1 === 'tmpl';
}

//加入到模板集合中
function addTmpl(node, parent, name) {
  var paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = obj();
  }

  var tmpls = paramsP.tmpls;
  if (!tmpls) {
    var _objT;

    var objT = (_objT = {}, defineProperty(_objT, name != null ? name : '_njT0', { node: node, no: 0 }), defineProperty(_objT, '_njLen', 1), _objT);

    paramsP.tmpls = compiledParam(objT);
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

    exPropsNode.parentType = parent.type;
    parent[exPropsName] = exPropsNode;
  } else {
    arrayPush(parent[exPropsName].content, isProp || isSub ? [node] : node.content);
  }
}

function exCompileConfig(name) {
  var config = extensionConfig[name];
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

var NO_SPLIT_NEWLINE = ['style', 'script', 'textarea', 'pre', 'xmp', 'template', 'noscript', nj.textTag];

function _plainTextNode(obj$$1, parent, parentContent, noSplitNewline, tmplRule) {
  var node = {};
  node.type = 'nj_plaintext';
  node.content = [compiledParam(obj$$1, tmplRule)];
  node.allowNewline = noSplitNewline;
  parent[parentContent].push(node);
}

var REGEX_REPLACE_BP = /_njBp(\d+)_/g;

//检测元素节点
function checkElem(obj$$1, parent, tmplRule, hasExProps, noSplitNewline, isLast) {
  var parentContent = 'content';

  if (!isArray(obj$$1)) {
    //判断是否为文本节点
    if (isString(obj$$1)) {
      if (!noSplitNewline) {
        var braceParams = [];
        var strs = obj$$1.replace(tmplRule.braceParamG, function (match) {
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
        _plainTextNode(isLast && parent.allowNewline === 'nlElem' ? trimRight(obj$$1) : obj$$1, parent, parentContent, noSplitNewline, tmplRule);
      }
    } else {
      _plainTextNode(obj$$1, parent, parentContent, noSplitNewline, tmplRule);
    }

    return;
  }

  var node = {},
      first = obj$$1[0];
  if (isString(first)) {
    //第一个子节点为字符串
    var len = obj$$1.length,
        last = obj$$1[len - 1],
        isElemNode = false,
        ex = void 0,
        exParams = void 0;

    //判断是否为xml标签
    var openTagName = void 0,
        hasCloseTag = false,
        isTmpl$$1 = void 0,
        isParamsEx$$1 = void 0,
        isProp = void 0,
        isSub = void 0,
        needAddToProps = void 0;

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
      isTmpl$$1 = isTmpl(exName);
      isParamsEx$$1 = isParamsEx(exName);
      if (!isParamsEx$$1) {
        var exConfig = exCompileConfig(exName);
        isProp = exConfig.isProp;
        isSub = exConfig.isSub;
        needAddToProps = isProp ? !hasExProps : isSub;

        if (exConfig.useString) {
          node.useString = exConfig.useString;
        }
      }

      node.type = 'nj_ex';
      node.ex = exName;
      if (exParams != null && !isTmpl$$1 && !isParamsEx$$1) {
        if (!node.args) {
          node.args = [];
        }

        each(exParams, function (param) {
          var key = param.key,
              value = param.value;

          if (key === 'useString') {
            node.useString = !(value === 'false');
            return;
          }

          var paramV = compiledParam(value, tmplRule, param.hasColon);
          if (param.onlyBrace) {
            //提取匿名参数
            node.args.push(paramV);
          } else {
            if (!node.params) {
              node.params = obj();
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
        var typeRefer = getInsideBraceParam(openTagName, tmplRule);
        if (typeRefer) {
          node.typeRefer = compiledParam(typeRefer[0], tmplRule);
        }

        //获取openTag内参数
        var tagParams = getOpenTagParams(first, tmplRule);
        if (tagParams) {
          if (!node.params) {
            node.params = obj();
          }

          each(tagParams, function (param) {
            //The parameter like "{prop}" needs to be replaced.
            node.params[param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key] = compiledParam(param.value, tmplRule, param.hasColon);
          }, false, true);
        }

        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
        if (!node.selfCloseTag) {
          node.selfCloseTag = verifySelfCloseTag(openTagName);
        }

        if (noSplitNewline == null && NO_SPLIT_NEWLINE.indexOf(openTagName.toLowerCase()) > -1) {
          noSplitNewline = true;
          node.allowNewline = 'nlElem';
        }
      } else {
        if (isTmpl$$1) {
          //模板元素
          pushContent = false;

          //将模板添加到父节点的params中
          addTmpl(node, parent, exParams ? exParams[0].value : null);
        } else if (isParamsEx$$1 || needAddToProps) {
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
          content = obj$$1.slice(1, end);
      if (content && content.length) {
        _checkContentElem(content, node, tmplRule, isParamsEx$$1 || hasExProps && !isProp, noSplitNewline, tmplRule);
      }

      //If this is params block, set on the "paramsEx" property of the parent node.
      if (isParamsEx$$1 || needAddToProps) {
        addParamsEx(node, parent, isProp, isSub);
      }
    } else {
      //如果不是元素节点,则为节点集合
      _checkContentElem(obj$$1, parent, tmplRule, hasExProps, noSplitNewline);
    }
  } else if (isArray(first)) {
    //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
    _checkContentElem(obj$$1, parent, tmplRule, hasExProps, noSplitNewline);
  }
}

//检测子元素节点
function _checkContentElem(obj$$1, parent, tmplRule, hasExProps, noSplitNewline) {
  if (!parent.content) {
    parent.content = [];
  }

  each(obj$$1, function (item, i, l) {
    checkElem(item, parent, tmplRule, hasExProps, noSplitNewline, i == l - 1);
  }, false, true);
}

function _buildFn(content, node, fns, no, newContext$$1, level, useStringLocal, name) {
  var fnStr = '',
      useString = useStringLocal != null ? useStringLocal : fns.useString,
      isTmplEx = isString(no),
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
    _fnH: 0,
    _tmp: 0,
    newContext: newContext$$1
  };

  if (!useString) {
    counter._compParam = 0;
  } else {
    counter._children = 0;
  }

  if (!main && newContext$$1) {
    fnStr += 'p2 = p1.n(p2, p3);\n';
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
  } catch (err) {
    error('Failed to generate template function:\n\n' + err.toString() + ' in\n\n' + fnStr + '\n');
  }
  return no;
}

function _buildOptions(config, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, hashProps, valueL, parent) {
  var hashStr = ', useString: ' + (useStringLocal == null ? 'p1.us' : useStringLocal ? 'true' : 'false'),
      noConfig = !config;

  if (node) {
    //扩展标签
    var newContext$$1 = config ? config.newContext : true,
        hasProps = void 0;
    if (noConfig || config.exProps) {
      hashStr += ', exProps: ' + exPropsStr;
      hasProps = true;
    }
    if (noConfig || config.subExProps) {
      hashStr += ', subExProps: ' + subExPropsStr;
      hasProps = true;
    }
    if (hasProps && parent && parent.parentType) {
      hashStr += ', parentType: \'' + parent.parentType + '\'';
    }

    hashStr += ', result: ' + (node.content ? 'p1.r(p1, p2, p1.fn' + _buildFn(node.content, node, fns, ++fns._no, newContext$$1, level, useStringLocal) + ', ' + exPropsStr + ', ' + subExPropsStr + ')' : 'p1.np');

    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
  }

  return '{ _njOpts: true, _njFnsNo: ' + fns._no + ', global: p1, context: p2, outputH: ' + !fns.useString + hashStr + (valueL ? ', lastValue: ' + valueL : '') + (level != null ? ', level: ' + level : '') + ' }';
}

var CUSTOM_VAR = 'nj_custom';

function _buildPropData(obj$$1, counter, fns, useStringLocal, level) {
  var dataValueStr = void 0,
      escape$$1 = obj$$1.escape,
      isEmpty = false,
      special = false;
  var isComputed = obj$$1.prop.isComputed;

  //先生成数据值

  if (obj$$1.prop.isBasicType) {
    dataValueStr = obj$$1.prop.name;
  } else if (obj$$1.prop.isEmpty) {
    isEmpty = true;
  } else {
    var _obj$prop = obj$$1.prop,
        name = _obj$prop.name,
        parentNum = _obj$prop.parentNum;

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
      case '@g':
        data = 'p1.g';
        special = CUSTOM_VAR;
        break;
      case '@root':
        data = '(p2.root || p2)';
        special = CUSTOM_VAR;
        break;
      case '@context':
        data = 'p2';
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

      var isCtx = data == 'p2';
      for (var i = 0; i < parentNum; i++) {
        data = !isCtx ? 'parent.' + data : data + '.parent';
      }

      if (!special) {
        specialP = true;
      }
    }

    if (!special && !specialP) {
      dataValueStr = (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\'' + (isComputed ? ', 0, true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : '');
    } else {
      var dataStr = special === CUSTOM_VAR ? data : 'p2.' + data;
      dataValueStr = special ? dataStr : (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\', ' + dataStr + (isComputed ? ', true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : '');
    }
  }
  if (dataValueStr) {
    dataValueStr = _replaceBackslash(dataValueStr);
  }

  //有过滤器时需要生成"_value"值
  var filters$$1 = obj$$1.prop.filters;
  if (filters$$1) {
    var counterValue = counter._value++;
    var valueStr = '_value' + counterValue,
        valueStrL = '_valueL' + counterValue,
        filterStr = 'var ' + valueStr + ' = ' + (!isEmpty ? dataValueStr : 'null') + ', ' + valueStrL + ';\n';

    var tmpStr = '_tmp';
    if (!counter._tmp) {
      //在同一函数作用域内_tmp变量只创建一次
      filterStr += 'var ' + tmpStr + ';\n';
      counter._tmp++;
    }

    each(filters$$1, function (o, i) {
      var _filterC = counter._filter++,
          configF = filterConfig[o.name],
          hasOptions = !configF || configF.hasOptions,
          filterVarStr = '_filter' + _filterC,
          globalFilterStr = 'p1.f[\'' + o.name + '\']',
          filterStrI = '',
          fnHVarStr = void 0;

      if (isEmpty && i == 0 && (!configF || !configF.hasOptions)) {
        hasOptions = false;
      }

      if (configF && configF.onlyGlobal) {
        //只能从全局获取
        filterStr += '\nvar ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
      } else {
        //优先从p2.data中获取
        fnHVarStr = '_fnH' + counter._fnH++;
        filterStr += '\nvar ' + filterVarStr + ';\n';
        filterStr += 'var ' + fnHVarStr + ' = p2.d(\'' + o.name + '\', 0, true);\n';

        filterStr += 'if (' + fnHVarStr + ') {\n';
        filterStr += '  ' + filterVarStr + ' = ' + fnHVarStr + '.val;\n';
        filterStr += '} else {\n';
        filterStr += '  ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
        filterStr += '}\n';
      }
      if (process.env.NODE_ENV !== 'production') {
        filterStr += 'if (!' + filterVarStr + ') {\n';
        filterStr += '  p1.wn(\'A filter called "' + o.name + '" is undefined.\');\n';
        filterStr += '} else {\n';
      }

      var _filterStr = '  ' + tmpStr + ' = ' + filterVarStr + '.apply(' + (fnHVarStr ? fnHVarStr + ' ? ' + fnHVarStr + '.ctx : p2' : 'p2') + ', [' + (!isEmpty || i > 0 ? valueStr + ', ' : '') + (o.params && o.params.length ? o.params.reduce(function (p, c, i, arr) {
        var propStr = _buildPropData({
          prop: c,
          escape: escape$$1
        }, counter, fns, useStringLocal, level),
            hasComma = hasOptions || i < arr.length - 1;

        if (isString(propStr)) {
          return p + propStr + (hasComma ? ', ' : '');
        } else {
          filterStrI += propStr.filterStr;
          return p + propStr.valueStr + (hasComma ? ', ' : '');
        }
      }, '') : '') + (hasOptions ? _buildOptions(configF, useStringLocal, null, fns, null, null, level, null, valueStrL) : '') + ']);\n';
      _filterStr += '  ' + valueStrL + ' = ' + valueStr + ';\n';
      _filterStr += '  ' + valueStr + ' = ' + tmpStr + ';\n';

      if (filterStrI !== '') {
        filterStr += filterStrI;
      }
      filterStr += _filterStr;

      if (process.env.NODE_ENV !== 'production') {
        filterStr += '}';
      }
      filterStr += '\n';
    }, false, true);

    return {
      valueStr: _buildEscape(valueStr, fns, isComputed ? false : escape$$1, special),
      filterStr: filterStr
    };
  } else {
    return _buildEscape(dataValueStr, fns, isComputed ? false : escape$$1, special);
  }
}

function _buildEscape(valueStr, fns, escape$$1, special) {
  if (fns.useString) {
    if (escape$$1 && special !== CUSTOM_VAR) {
      return 'p1.es(' + valueStr + ')';
    } else {
      return valueStr;
    }
  } else {
    //文本中的特殊字符需转义
    return unescape(valueStr);
  }
}

function _replaceStrs(str) {
  return _replaceBackslash(str).replace(/_njNl_/g, '\\n').replace(/'/g, "\\'");
}

function _replaceBackslash(str) {
  return str = str.replace(/\\/g, '\\\\');
}

function _buildProps(obj$$1, counter, fns, useStringLocal, level) {
  var str0 = obj$$1.strs[0],
      valueStr = '',
      filterStr = '';

  if (isString(str0)) {
    //常规属性
    valueStr = !obj$$1.isAll && str0 !== '' ? '\'' + _replaceStrs(str0) + '\'' : '';
    filterStr = '';

    each(obj$$1.props, function (o, i) {
      var propData = _buildPropData(o, counter, fns, useStringLocal, level),
          dataValueStr = void 0;
      if (isString(propData)) {
        dataValueStr = propData;
      } else {
        dataValueStr = propData.valueStr;
        filterStr += propData.filterStr;
      }

      if (!obj$$1.isAll) {
        var strI = obj$$1.strs[i + 1],
            prefixStr = str0 === '' && i == 0 ? '' : ' + ';

        // if (strI.trim() === '\\n') { //如果只包含换行符号则忽略
        //   valueStr += prefixStr + dataValueStr;
        //   return;
        // }

        dataValueStr = prefixStr + '(' + dataValueStr + ')' + (strI !== '' ? ' + \'' + _replaceStrs(strI) + '\'' : '');
      }

      valueStr += dataValueStr;
      if (obj$$1.isAll) {
        return false;
      }
    }, false, true);
  } else if (isObject(str0) && str0._njLen != null) {
    //tmpl标签
    valueStr += '{\n';
    each(str0, function (v, k, i, l) {
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
        valueStr += '  _njData: p2.data,\n  \
                       _njParent: p2.parent,\n  \
                       _njIndex: p2.index,\n  \
                       _njLevel: p1.l(' + level + ', p2),\n  \
                       _njIcp: p2.icp\n';
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
          paramsStr += '\np1.an(_params' + _paramsC + ', _paramsE' + _paramsEC + ', _paramsE' + _paramsSEC + ');\n';
        } else {
          paramsStr += '\n_params' + _paramsC + ' = _paramsE' + (_paramsEC != null ? _paramsEC : _paramsSEC) + ';\n';
        }
      } else {
        var keys = '';
        each(params, function (v, k, i, l) {
          if (i == 0) {
            keys += '{ ';
          }
          keys += '\'' + k + '\': 1';

          if (i < l - 1) {
            keys += ', ';
          } else {
            keys += ' }';
          }
        }, false, false);

        paramsStr += '\n_params' + _paramsC + ' += p1.ans(_paramsE' + _paramsEC + ', ' + (keys === '' ? 'null' : keys) + ');\n';
      }
    }

    if (params) {
      var paramKeys = Object.keys(params),
          len = paramKeys.length,
          filterStr = '';

      if (!useString && !hasPropsEx) {
        paramsStr += '{\n';
      }

      each(paramKeys, function (k, i) {
        var valueStr = _buildProps(params[k], counter, fns, useString, level);
        if (isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        if (!useStringF && k === 'style') {
          //将style字符串转换为对象
          valueStr = 'p1.sp(' + valueStr + ')';
        }

        var key = _replaceStrs(k),
            onlyKey = '\'' + key + '\'' === valueStr;
        if (!useStringF) {
          key = fixPropName(key);
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
    if (isObject(valueStr)) {
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
      fnStr += unescape(textStr);
    }
  } else if (node.type === 'nj_ex') {
    //扩展标签节点
    var _exC = counter._ex++,
        _dataReferC = counter._dataRefer++,
        dataReferStr = '',
        _filterStr2 = '',
        configE = extensionConfig[node.ex],
        exVarStr = '_ex' + _exC,
        globalExStr = 'p1.x[\'' + node.ex + '\']',
        fnHVarStr = void 0;

    if (configE && configE.onlyGlobal) {
      //只能从全局获取
      fnStr += '\nvar ' + exVarStr + ' = ' + globalExStr + ';\n';
    } else {
      //优先从p2.data中获取
      fnHVarStr = '_fnH' + counter._fnH++;
      fnStr += '\nvar ' + exVarStr + ';\n';
      fnStr += 'var ' + fnHVarStr + ' = p2.d(\'' + node.ex + '\', 0, true);\n';

      fnStr += 'if (' + fnHVarStr + ') {\n';
      fnStr += '  ' + exVarStr + ' = ' + fnHVarStr + '.val;\n';
      fnStr += '} else {\n';
      fnStr += '  ' + exVarStr + ' = ' + globalExStr + ';\n';
      fnStr += '}\n';
    }

    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

    if (node.args) {
      //构建匿名参数
      each(node.args, function (arg, i) {
        var valueStr = _buildProps(arg, counter, fns, useStringLocal, level);
        if (isObject(valueStr)) {
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

    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null, null, parent);
    dataReferStr += '\n];\n';

    //添加匿名参数
    if (paramsStr !== '') {
      dataReferStr += 'p1.aa(_params' + _paramsC + ', _dataRefer' + _dataReferC + ');\n';
    }

    if (_filterStr2 !== '') {
      dataReferStr = _filterStr2 + dataReferStr;
    }

    fnStr += paramsStr + dataReferStr;

    if (process.env.NODE_ENV !== 'production') {
      //如果扩展标签不存在则打印警告信息
      fnStr += 'p1.tf(_ex' + _exC + ', \'' + node.ex + '\', \'ex\');\n';
    }

    //渲染
    fnStr += _buildRender(node, parent, 2, retType, {
      _ex: _exC,
      _dataRefer: _dataReferC,
      fnH: fnHVarStr
    }, fns, level, useStringLocal, node.allowNewline, isFirst);
  } else {
    //元素节点
    //节点类型和typeRefer
    var _typeC = counter._type++,
        _type = void 0,
        _typeRefer = void 0;

    if (node.typeRefer) {
      var valueStrT = _buildProps(node.typeRefer, counter, fns, level);
      if (isObject(valueStrT)) {
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
      var _typeL = _type.toLowerCase(),
          subName = '';

      if (!_typeRefer && _typeL.indexOf('.') > -1) {
        var typeS = _type.split('.');
        _typeL = _typeL.split('.')[0];
        _type = typeS[0];
        subName = ', \'' + typeS[1] + '\'';
      }

      typeStr = _typeRefer ? 'p1.er(' + _typeRefer + ', \'' + _typeL + '\', p1, \'' + _type + '\', p2)' : 'p1.e(\'' + _typeL + '\', p1, \'' + _type + '\', p2' + subName + ')';
    } else {
      typeStr = _typeRefer ? 'p1.en(' + _typeRefer + ', \'' + _type + '\')' : '\'' + _type + '\'';
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
    fnStr += _buildRender(node, parent, 3, retType, !useStringF ? { _compParam: _compParamC } : { _type: _typeC, _typeS: _type, _typeR: _typeRefer, _params: _paramsStr !== '' ? _paramsC2 : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level, useStringLocal, node.allowNewline, isFirst);
  }

  return fnStr;
}

function _buildContent(content, parent, fns, counter, retType, level, useStringLocal) {
  var fnStr = '';
  if (!content) {
    return fnStr;
  }

  each(content, function (node) {
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
      retStr = (!useStringF || allowNewline || noLevel ? '' : isFirst ? parent.type !== 'nj_root' ? 'p1.fl(p2) + ' : '' : '\'\\n\' + ') + _buildLevelSpace(level, fns, allowNewline) + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + params.text;
      break;
    case 2:
      //扩展标签
      retStr = '_ex' + params._ex + '.apply(' + (params.fnH ? params.fnH + ' ? ' + params.fnH + '.ctx : p2' : 'p2') + ', _dataRefer' + params._dataRefer + ')';
      break;
    case 3:
      //元素节点
      if (!useStringF) {
        retStr = 'p1.H(_compParam' + params._compParam + ')';
      } else {
        var levelSpace = _buildLevelSpace(level, fns, allowNewline);
        var content = node.content;

        if (allowNewline && allowNewline !== 'nlElem' || noLevel) {
          retStr = '';
        } else if (isFirst) {
          retStr = parent.type !== 'nj_root' ? 'p1.fl(p2) + ' : '';
        } else {
          retStr = '\'\\n\' + ';
        }

        if (node.type !== nj.textTag) {
          var hasTypeR = params._typeR,
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
    return 'p1.ls(p2) + ';
  }
  return '';
}

var buildRuntime = (function (astContent, ast, useString) {
  var fns = {
    useString: useString,
    _no: 0, //扩展标签函数计数
    _noT: 0, //tmpl块模板函数计数
    _firstNode: true
  };

  _buildFn(astContent, ast, fns, fns._no, null, 0);
  return fns;
});

var preAsts = nj.preAsts;

var SPLIT_FLAG = '_nj_split';
var TEXT_CONTENT = ['style', 'script', 'textarea', 'xmp', nj.textTag];
var OMITTED_CLOSE_TAGS$1 = OMITTED_CLOSE_TAGS;

//Compile string template

function compileStringTmpl(tmpl) {
  var tmplKey = tmpl.toString(),
      //Get unique key
  ret = preAsts[tmplKey];
  var outputH = this.outputH,
      tmplRule = this.tmplRule,
      onlyParse = this.onlyParse,
      fileName = this.fileName;


  if (!ret) {
    //If the cache already has template data, direct return the template.
    var isStr = isString(tmpl),
        xmls = isStr ? [tmpl] : tmpl,
        l = xmls.length,
        fullXml = '',
        isInBrace = false;

    //Connection xml string
    each(xmls, function (xml, i) {
      var split = '';
      if (i < l - 1) {
        var last = xml.length - 1,
            lastChar = xml[last],
            lastChar3 = xml.substr(last - 2),
            isComputed = lastChar === '#',
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

    //Merge all include tags
    var includeParser = nj.includeParser;
    if (includeParser) {
      fullXml = includeParser(fullXml, fileName, tmplRule);
    }

    fullXml = _formatAll(fullXml, tmplRule);
    if (nj.textMode && !outputH) {
      fullXml = '<' + nj.textTag + '>' + fullXml + '</' + nj.textTag + '>';
    }

    //Resolve string to element
    ret = _checkStringElem(fullXml, tmplRule, outputH);
    defineProp(ret, '_njParamCount', {
      value: l - 1
    });

    //Save to the cache
    preAsts[tmplKey] = ret;
  }

  var params = void 0,
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

  var tmplFn = void 0;
  if (!onlyParse) {
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
}

//Resolve string to element
function _checkStringElem(xml, tmplRule, outputH) {
  var root = [],
      current = {
    elem: root,
    elemName: 'root',
    parent: null
  },
      parent = null,
      pattern = tmplRule.checkElem,
      matchArr = void 0,
      inTextContent = void 0,
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
          _omittedCloseElem2 = slicedToArray(_omittedCloseElem, 4),
          _elem = _omittedCloseElem2[0],
          _elemName = _omittedCloseElem2[1],
          _elemParams = _omittedCloseElem2[2],
          _textAfter = _omittedCloseElem2[3];

      var isEx$$1 = elem ? isExAll(elemName, tmplRule) : false;

      if (isEx$$1 && !isEx$$1[1] && (isPropS(elemName, tmplRule) || isStrPropS(elemName, tmplRule) || isParamsEx(isEx$$1[3]) || exCompileConfig(isEx$$1[3]).isProp)) {
        parent = current;
        current = _createCurrent(_elemName, parent);
        _setElem(_elem, _elemName, _elemParams, current.elem, null, tmplRule, outputH);
      } else {
        _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule, outputH);
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
          var _isEx = isExAll(elemName, tmplRule);
          if (elemName[0] === '/') {
            //Close tag
            if (elemName.substr(1).toLowerCase() === inTextContent) {
              //取消纯文本子节点标记
              inTextContent = null;
            }

            if (_isEx || !inTextContent) {
              var cName = current.elemName;
              if (cName.indexOf(SPLIT_FLAG) < 0 ? elemName === '/' + cName : elemName.indexOf(SPLIT_FLAG) > -1) {
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
    }

    //Text after tag
    !omittedCloseElem && _setTextAfter(textAfter, current);
  }

  //处理最后一次循环中遗留的可省略闭合标签
  if (omittedCloseElem) {
    var _omittedCloseElem3 = omittedCloseElem,
        _omittedCloseElem4 = slicedToArray(_omittedCloseElem3, 4),
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
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose, tmplRule, outputH) {
  var ret = void 0,
      paramsEx = void 0;
  if (isEx(elemName, tmplRule, true)) {
    ret = elem.substring(1, elem.length - 1);
  } else if (isStrPropS(elemName, tmplRule)) {
    ret = _transformToEx(true, elemName, elemParams, tmplRule);
  } else if (isPropS(elemName, tmplRule)) {
    ret = _transformToEx(false, elemName, elemParams, tmplRule);
  } else {
    var retS = _getSplitParams(elem, tmplRule, outputH);
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
function _getSplitParams(elem, tmplRule, outputH) {
  var extensionRule = tmplRule.extensionRule,
      startRule = tmplRule.startRule,
      endRule = tmplRule.endRule,
      firstChar = tmplRule.firstChar,
      lastChar = tmplRule.lastChar,
      spreadProp = tmplRule.spreadProp;

  var paramsEx = void 0;

  //Replace the parameter like "{...props}".
  elem = elem.replace(spreadProp, function (all, g1, propR, g3, prop) {
    if (propR) {
      prop = propR;
    }

    if (!paramsEx) {
      paramsEx = [extensionRule + 'props'];
    }

    paramsEx.push([extensionRule + 'spread ' + (propR ? firstChar : '') + startRule + prop.replace(/\.\.\./, '') + endRule + (propR ? lastChar : '') + '/']);
    return ' ';
  });

  //Replace the parameter like "#show={false}".
  elem = elem.replace(new RegExp('[\\s]+(:?)' + extensionRule + '([^\\s=>]+)=((\'[^\']+\')|("[^"]+")|([^"\'\\s>]+))'), function (all, hasColon, name, value) {
    if (!paramsEx) {
      paramsEx = [extensionRule + 'props'];
    }

    paramsEx.push([extensionRule + name, (hasColon ? (outputH ? firstChar : '') + startRule + ' ' : '') + clearQuot(value) + (hasColon ? ' ' + endRule + (outputH ? lastChar : '') : '')]);
    return ' ';
  });

  return {
    elem: elem,
    params: paramsEx
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr, tmplRule, outputH) {
  if (/\/$/.test(elemName)) {
    elemName = elemName.substr(0, elemName.length - 1);
  }
  _setElem(elem, elemName, elemParams, elemArr, true, tmplRule, outputH);
}

//Set text node
function _setText(text, elemArr) {
  elemArr.push(text);
}

//编译模板并返回转换函数
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
    }

    //编译模板函数
    var tmplFns = void 0;
    if (tmplKey) {
      tmplFns = nj.templates[tmplKey];
    }
    if (!tmplFns) {
      var isObj = isObject(tmpl),
          fns = void 0;
      if (isObj && tmpl.main) {
        //直接传入预编译模板
        fns = tmpl;
      } else {
        //编译AST
        var root = void 0;
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
            root = _createAstRoot();

            //Transform string template to preAst
            if (isString(tmpl)) {
              tmpl = compileStringTmpl.call({ tmplRule: tmplRule, outputH: outputH, onlyParse: true, fileName: fileName }, tmpl);
            }

            //分析传入参数并转换为节点树对象
            checkElem(tmpl._njTmpl, root, tmplRule);
          }

          //保存模板AST编译结果到全局集合中
          if (tmplKey) {
            nj.asts[tmplKey] = root;
          }
        }

        fns = buildRuntime(root.content, root, !outputH);
      }

      tmplFns = template(fns);

      //保存模板函数编译结果到全局集合中
      if (tmplKey) {
        nj.templates[tmplKey] = tmplFns;
      }
    }

    return tmplFns.main;
  };
}

var compile = _createCompile();
var compileH = _createCompile(true);

//Create template root object
function _createAstRoot() {
  var root = obj();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//Precompile template
function precompile(tmpl, outputH, tmplRule) {
  var root = _createAstRoot();

  if (isString(tmpl)) {
    tmpl = compileStringTmpl.call({ tmplRule: tmplRule, outputH: outputH, onlyParse: true }, tmpl);
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

assign(nj, {
  compile: compile,
  compileH: compileH,
  precompile: precompile,
  render: render,
  renderH: renderH
});

function createTaggedTmpl() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var outputH = opts.outputH,
      delimiters = opts.delimiters,
      fileName = opts.fileName;

  var tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;

  return function () {
    return compileStringTmpl.apply({ tmplRule: tmplRule, outputH: outputH, fileName: fileName }, arguments);
  };
}

function createTaggedTmplH() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  opts.outputH = true;
  return createTaggedTmpl(opts);
}

var taggedTmpl = createTaggedTmpl({ outputH: false });
var taggedTmplH = createTaggedTmpl({ outputH: true });

assign(nj, {
  createTaggedTmpl: createTaggedTmpl,
  createTaggedTmplH: createTaggedTmplH,
  taggedTmpl: taggedTmpl,
  taggedTmplH: taggedTmplH
});

assign(nj, {
  registerComponent: registerComponent,
  createTmplRule: createTmplRule,
  config: config
});

var _global = nj.global;

_global.NornJ = _global.nj = nj;

exports.registerComponent = registerComponent;
exports.default = nj;
exports.registerExtension = registerExtension;
exports.registerFilter = registerFilter;
exports.compile = compile;
exports.compileH = compileH;
exports.render = render;
exports.renderH = renderH;
exports.taggedTmpl = taggedTmpl;
exports.taggedTmplH = taggedTmplH;
