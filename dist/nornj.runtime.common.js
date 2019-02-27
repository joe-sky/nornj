/*!
* NornJ template engine v5.0.0-alpha.2
* (c) 2016-2019 Joe_Sky
* Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
function warn(msg, type) {
  switch (type) {
    case 'f':
      msg = 'A filter called "' + msg + '" is undefined.';
      break;
  }
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

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
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
  toCamelCase: toCamelCase,
  assign: assign,
  capitalize: capitalize
});



var tools = Object.freeze({
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
	toCamelCase: toCamelCase,
	assign: assign,
	capitalize: capitalize
});

function registerComponent(name, component, options) {
  var params = name,
      ret = void 0;
  if (!isObject(name)) {
    params = {};
    params[name] = {
      component: component,
      options: options
    };
  }

  each(params, function (v, k, i) {
    if (v != null) {
      var _component = v.component,
          _options = v.options;

      var _name = k.toLowerCase();

      var comp = _component ? _component : v;
      nj.components[_name] = comp;
      nj.componentConfig.set(comp, _options);
    }

    if (i == 0) {
      ret = v;
    } else {
      if (i == 1) {
        ret = [ret];
      }
      ret.push(v);
    }
  }, false, false);

  return ret;
}

function getComponentConfig(name) {
  return nj.componentConfig.get(isString(name) ? nj.components[name] : name);
}

function config (configs) {
  var createElement = configs.createElement,
      outputH = configs.outputH;

  if (createElement) {
    nj.createElement = createElement;
  }

  if (outputH != null) {
    nj.outputH = outputH;
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
            _njCtx: obj$$1,
            val: ret,
            prop: prop
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
    return fn.val.call(p2.data[p2.data.length - 1], p2);
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

  return element ? element : nameO;
}

function getElementRefer(refer, name, p1, nameO, p2) {
  return refer != null ? isString(refer) ? getElement(refer.toLowerCase(), p1, refer, p2) : refer : getElement(name, p1, nameO, p2);
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
    item: 'item' in p3 ? p3.item : p2.item,
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
function assignStrProps() {
  var ret = '',
      retObj = assign.apply(tools, arguments);

  for (var k in retObj) {
    var v = retObj[k];
    ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
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
      item: initCtx ? initCtx._njItem : null,
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

function callFilter(filter) {
  return filter._njCtx ? filter.val.bind(filter._njCtx) : filter;
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
    l: _getLevel,
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
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition;
    }
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
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition || options.props.value;
    }

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
    if (value && value._njOpts) {
      options = value;
      value = options.props.value;
    }

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
    if (list && list._njOpts) {
      options = list;
      list = options.props.of;
    }

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
          item: item,
          fallback: true
        };

        var extra = void 0;
        var _len = isArrayLike$$1 ? len : lenObj;
        extra = {
          '@first': param.index === 0,
          '@last': param.index === _len - 1
        };

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
      var attrs = options.attrs,
          useString = options.useString;


      if (!attrs.style) {
        attrs.style = useString ? '' : {};
      }
      if (useString) {
        attrs.style += (attrs.style ? ';' : '') + 'display:none';
      } else if (isArray(attrs.style)) {
        attrs.style.push({ display: 'none' });
      } else {
        attrs.style.display = 'none';
      }
    }
  },

  'for': function _for(i, to, options) {
    var step = 1;
    var indexKey = void 0;

    if (i && i._njOpts) {
      options = i;
      var _options = options,
          props = _options.props;

      Object.keys(props).forEach(function (prop) {
        var value = props[prop];
        if (prop === 'to') {
          to = value;
        } else if (prop === 'step') {
          step = value;
        } else {
          i = value;
          indexKey = prop;
        }
      });
    } else if (options.props) {
      step = options.props.step || 1;
    }

    var ret = void 0,
        useString = options.useString;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; i <= to; i += step) {
      var retI = options.result({
        data: indexKey ? [defineProperty({}, indexKey, i)] : null,
        index: i,
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
    if (originalData && originalData._njOpts) {
      options = originalData;

      return options.result({
        data: [options.props]
      });
    } else {
      var _options2 = options,
          props = _options2.props;


      return options.result({
        data: [props && props.as ? defineProperty({}, props.as, originalData) : originalData]
      });
    }
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
    exProps: false,
    isProp: false,
    subExProps: false,
    isSub: false,
    addSet: false,
    useExpressionInJsx: 'onlyTemplateLiteral'
  };

  if (params) {
    ret = assign(ret, params);
  }
  if (extra) {
    ret = assign(ret, extra);
  }
  return ret;
}

var _defaultCfg = { onlyGlobal: true, newContext: false };

//Extension default config
var extensionConfig = {
  'if': _config(_defaultCfg),
  'else': _config({ onlyGlobal: true, newContext: false, subExProps: true, isSub: true }),
  'switch': _config(_defaultCfg, { needPrefix: 'onlyUpperCase' }),
  unless: _config(_defaultCfg),
  each: _config({
    onlyGlobal: true,
    newContext: {
      item: 'item',
      index: 'index',
      datas: {
        first: ['@first', 'first'],
        last: ['@last', 'last']
      }
    }
  }),
  'for': _config({
    onlyGlobal: true,
    newContext: {
      index: 'index',
      getDatasFromProp: { except: ['to', 'step', 'index'] }
    }
  }),
  prop: _config({ onlyGlobal: true, newContext: false, exProps: true, subExProps: true, isProp: true }),
  spread: _config({ onlyGlobal: true, newContext: false, exProps: true, subExProps: true, isProp: true }),
  obj: _config({ onlyGlobal: true, newContext: false }),
  list: _config(_defaultCfg, { needPrefix: 'onlyUpperCase' }),
  'with': _config({ onlyGlobal: true, newContext: { getDatasFromProp: true } }),
  style: { useExpressionInJsx: false, needPrefix: true }
};
extensionConfig.elseif = _config(extensionConfig['else']);
extensionConfig.fn = _config(extensionConfig['with']);
extensionConfig.block = _config(extensionConfig.obj);
extensionConfig.pre = _config(extensionConfig.obj, { needPrefix: true });
extensionConfig.arg = _config(extensionConfig.prop);
extensionConfig.once = _config(extensionConfig.obj);
extensionConfig.show = _config(extensionConfig.prop);
extensionConfig.css = _config(extensionConfig.obj);

//Extension alias
extensions['case'] = extensions.elseif;
extensionConfig['case'] = extensionConfig.elseif;
extensions['empty'] = extensions['default'] = extensions['else'];
extensionConfig['empty'] = extensionConfig['default'] = extensionConfig['else'];
extensions.strProp = extensions.prop;
extensionConfig.strProp = _config(extensionConfig.prop, { useString: true });
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);

//Register extension and also can batch add
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
          extensionConfig[name] = {};
        }
        assign(extensionConfig[name], _options3);
      } else {
        extensionConfig[name] = _config(_options3);
      }
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
  '.': function _(obj$$1, prop, callFn) {
    if (obj$$1 == null) {
      return obj$$1;
    }
    if (obj$$1._njCtx) {
      return {
        _njCtx: obj$$1.val,
        val: obj$$1.val[prop],
        prop: prop
      };
    } else if (callFn) {
      return {
        obj: obj$$1,
        prop: prop
      };
    }

    return obj$$1[prop];
  },

  //Call function
  _: function _(fn, args) {
    return fn != null ? fn.obj[fn.prop].apply(fn.obj, args) : null;
  },

  //Get computed properties
  '#': function _(obj$$1, prop, options) {
    if (obj$$1 == null) {
      return obj$$1;
    }

    return getComputedData({
      val: obj$$1[prop],
      _njCtx: obj$$1
    }, options.context, options.level);
  },

  // '=': (obj, val) => {
  //   if (obj == null) {
  //     return obj;
  //   }

  //   obj._njCtx[obj.prop] = val;
  // },

  '**': function _(val1, val2) {
    return Math.pow(val1, val2);
  },

  '%%': function _(val1, val2) {
    return Math.floor(val1 / val2);
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

  capitalize: function capitalize$$1(str) {
    return capitalize(str);
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
  capitalize: _config$1(_defaultCfg$1)
};

//Filter alias
filters.prop = filters['.'];
filterConfig.prop = filterConfig['.'];

var operators = ['+=', '+', '-[0-9]', '-', '**', '*', '%%', '%', '===', '!==', '==', '!=', '<=>', '<=', '>=', '=', '..<', '<', '>', '&&', '||', '?:', '?', ':', '../', '..', '/'];

var REGEX_OPERATORS_ESCAPE = /\*|\||\/|\.|\?|\+/g;
function _createRegexOperators() {
  return new RegExp(operators.map(function (o) {
    return o.replace(REGEX_OPERATORS_ESCAPE, function (match) {
      return '\\' + match;
    });
  }).join('|'), 'g');
}

nj.REGEX_OPERATORS = _createRegexOperators();

//Register filter and also can batch add
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


      if (_filter) {
        filters[name] = _filter;
      } else if (!mergeConfig) {
        filters[name] = v;
      }

      if (mergeConfig) {
        if (!filterConfig[name]) {
          filterConfig[name] = {};
        }
        assign(filterConfig[name], _options);
      } else {
        filterConfig[name] = _config$1(_options);
      }
    }
  }, false, false);
}

assign(nj, {
  filters: filters,
  filterConfig: filterConfig,
  registerFilter: registerFilter
});

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

function _buildRender(outputH) {
  return function (tmpl, params) {
    var tmplMainFn = (outputH ? compileH : compile)(tmpl, tmpl._njTmplKey);
    if (params) {
      var tmplFn = function tmplFn() {
        return tmplMainFn.apply(this, arrayPush([params], arguments));
      };
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

var buildRender = _buildRender();
var buildRenderH = _buildRender(true);

assign(nj, {
  compile: compile,
  compileH: compileH,
  render: render,
  renderH: renderH,
  buildRender: buildRender,
  buildRenderH: buildRenderH
});

assign(nj, {
  registerComponent: registerComponent,
  getComponentConfig: getComponentConfig,
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
