/*!
* NornJ template engine v5.0.0-rc.43
* (c) 2016-2019 Joe_Sky
* Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nj = function nj() {
  return nj['taggedTmpl' + (nj.outputH ? 'H' : '')].apply(null, arguments);
};

nj.createElement = null;
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
function upperFirst(str) {
  return str[0].toUpperCase() + str.substr(1);
}
function lowerFirst(str) {
  return str[0].toLowerCase() + str.substr(1);
}
function capitalize(str) {
  return upperFirst(str);
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
  upperFirst: upperFirst,
  lowerFirst: lowerFirst,
  capitalize: capitalize
});

var tools = /*#__PURE__*/Object.freeze({
  __proto__: null,
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
  upperFirst: upperFirst,
  lowerFirst: lowerFirst,
  capitalize: capitalize
});

function config(configs) {
  var createElement = configs.createElement,
      outputH = configs.outputH;

  if (createElement) {
    nj.createElement = createElement;
  }

  if (outputH != null) {
    nj.outputH = outputH;
  }
}
assign(nj, {
  config: config
});

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

var REGEX_NUM = /^(-?([0-9]+[.]?[0-9]+)|[0-9])$/; //提取style内参数

function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (isObject(obj) || isArray(obj) || isNumber(obj)) {
    return obj;
  } //参数为字符串


  var pattern = /([^\s:]+)[\s]?:[\s]?([^;]+)[;]?/g;
  var matchArr, ret;

  while (matchArr = pattern.exec(obj)) {
    var key = matchArr[1];
    var value = matchArr[2];

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

function assignStrProps(target) {
  var ret = '';

  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  var retObj = assign.apply(tools, [target].concat(params));

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

/**
 * React(or other such as Preact) components.
 */

var SwitchPrefixConfig;

(function (SwitchPrefixConfig) {
  SwitchPrefixConfig["OnlyLowerCase"] = "onlyLowerCase";
  SwitchPrefixConfig["OnlyUpperCase"] = "onlyUpperCase";
})(SwitchPrefixConfig || (SwitchPrefixConfig = {}));

var extensions = {
  "if": function _if(value, options) {
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition;
    }

    if (value === 'false') {
      value = false;
    }

    var ret;
    var props = options.props;

    if (value) {
      ret = (props && props.then || options.children)();
    } else if (props) {
      var elseFn = props['else'];

      if (props.elseifs) {
        var l = props.elseifs.length;
        each(props.elseifs, function (elseif, i) {
          if (elseif.value) {
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

    if (options.useString && ret == null) {
      return '';
    }

    return ret;
  },
  then: function then(options) {
    return options.tagProps.then = options.children;
  },
  "else": function _else(options) {
    return options.tagProps['else'] = options.children;
  },
  elseif: function elseif(value, options) {
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
  "switch": function _switch(value, options) {
    if (value && value._njOpts) {
      options = value;
      value = options.props.value;
    }

    var ret;
    var props = options.props,
        elseifs = props.elseifs || [{}],
        l = elseifs.length;
    each(elseifs, function (elseif, i) {
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
        props = options.props;
    var ret;

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
    var ret = options.value(); //Get parameter value

    var value;

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
  "with": function _with(originalData, options) {
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
  "if": _config(_defaultCfg),
  "else": _config(_defaultCfg, {
    isSubTag: true,
    hasTagProps: true
  }),
  "switch": _config(_defaultCfg, {
    needPrefix: SwitchPrefixConfig.OnlyLowerCase
  }),
  each: _config(_defaultCfg, {
    newContext: {
      item: 'item',
      index: 'index',
      data: {
        first: ['@first', 'first'],
        last: ['@last', 'last'],
        $key: ['@key', 'key']
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
  "with": _config(_defaultCfg, {
    newContext: {
      getDataFromProps: true
    }
  }),
  style: {
    useExpressionInProps: false,
    needPrefix: true
  }
};
extensionConfig.then = _config(extensionConfig['else']);
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
extensionConfig['case'] = _config(extensionConfig.elseif);
extensions.empty = extensions['default'] = extensions['else'];
extensionConfig.empty = _config(extensionConfig['else']);
extensionConfig['default'] = _config(extensionConfig['else']);
extensions.strProp = extensions.prop;
extensionConfig.strProp = _config(extensionConfig.prop, {
  useString: true
});
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);
extensions.pre = extensions.block;
extensionConfig.pre = _config(extensionConfig.block);
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
  "int": function int(val) {
    var radix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    var ret = parseInt(val, radix);
    return isNaN(ret) ? 0 : ret;
  },
  //Convert to float
  "float": function float(val, bit) {
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
  upperFirst: function upperFirst$1(str) {
    return upperFirst(str);
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
  currency: function currency(value, decimals, symbol, placeholder) {
    if (!(value - parseFloat(value) >= 0)) {
      return placeholder != null ? placeholder : filterConfig.currency.placeholder;
    }

    value = parseFloat(value);
    symbol = decimals != null && isString(decimals) ? decimals : symbol;
    symbol = symbol != null && isString(symbol) ? symbol : filterConfig.currency.symbol;
    decimals = decimals != null && isNumber(decimals) ? decimals : 2;
    var stringified = Math.abs(value).toFixed(decimals);

    var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;

    var i = _int.length % 3;
    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';

    var _float = decimals ? stringified.slice(-1 - decimals) : '';

    var sign = value < 0 ? '-' : '';
    return sign + symbol + head + _int.slice(i).replace(REGEX_DIGITS_RE, '$1,') + _float;
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
  _: _config$1({
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
  "int": _config$1(_defaultCfg$1),
  "float": _config$1(_defaultCfg$1),
  bool: _config$1(_defaultCfg$1),
  reg: _config$1(_defaultCfg$1),
  css: _config$1(_defaultCfg$1),
  '..': _config$1(_defaultCfg$1),
  rLt: _config$1(_defaultCfg$1),
  '<=>': _config$1(_defaultCfg$1),
  upperFirst: _config$1(_defaultCfg$1),
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
};
filters.capitalize = filters.upperFirst;
filterConfig.capitalize = _config$1(filterConfig.upperFirst);
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
          }

          name = alias;
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

var components = {};
var componentConfig = new Map();
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
assign(nj, {
  components: components,
  componentConfig: componentConfig,
  registerComponent: registerComponent,
  getComponentConfig: getComponentConfig,
  copyComponentConfig: copyComponentConfig
});

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
      var isObj = isObject(tmpl);
      var fns;

      if (isObj && tmpl.main) {
        //直接传入预编译模板
        fns = tmpl;
      }

      tmplFns = template(fns); //保存模板函数编译结果到全局集合中

      if (tmplKey) {
        nj.templates[tmplKey] = tmplFns;
      }
    }

    return tmplFns.main;
  };
}

var compile = _createCompile();
var compileH = _createCompile();

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

var _global = nj.global;
_global.NornJ = _global.nj = nj;

exports.compile = compile;
exports.compileH = compileH;
exports.default = nj;
exports.registerComponent = registerComponent;
exports.registerExtension = registerExtension;
exports.registerFilter = registerFilter;
exports.render = render;
exports.renderH = renderH;
