import nj from '../core';
import * as tools from '../utils/tools';
import { getComputedData } from '../transforms/transformData';

//Global filter list
export const filters = {
  //Get properties
  '.': (obj, prop) => {
    if (obj == null) {
      return obj;
    }

    return obj[prop];
  },

  //Call method
  _: function(method) {
    if (method == null) {
      return method;
    }

    const args = arguments;
    return method.apply(args[args.length - 1].lastValue, tools.arraySlice(args, 1, args.length - 1));
  },

  //Get computed properties
  '#': (obj, prop, options) => {
    if (obj == null) {
      return obj;
    }

    return getComputedData({
      val: obj[prop],
      ctx: obj
    }, options.context, options.level);
  },

  '==': (val1, val2) => val1 == val2,

  '===': (val1, val2) => val1 === val2,

  '!=': (val1, val2) => val1 != val2,

  '!==': (val1, val2) => val1 !== val2,

  //Less than
  '<': (val1, val2) => val1 < val2,

  '<=': (val1, val2) => val1 <= val2,

  //Greater than
  '>': (val1, val2) => val1 > val2,

  '>=': (val1, val2) => val1 >= val2,

  '+': (val1, val2) => val1 + val2,

  '-': (val1, val2) => val1 - val2,

  '*': (val1, val2) => val1 * val2,

  '/': (val1, val2) => val1 / val2,

  '%': (val1, val2) => val1 % val2,

  //Ternary operator
  '?': (val, val1, val2) => val ? val1 : val2,

  '!': val => !val,

  '&&': (val1, val2) => val1 && val2,

  or: (val1, val2) => val1 || val2,

  //Convert to int 
  int: val => parseInt(val, 10),

  //Convert to float 
  float: val => parseFloat(val),

  //Convert to boolean 
  bool: val => {
    if (val === 'false') {
      return false;
    }

    return Boolean(val);
  },

  obj: function() {
    let args = arguments,
      ret = {};

    if (args.length > 1) {
      tools.each(args, (v, i, l) => {
        if (i < l - 1) {
          ret[v.key] = v.val;
        }
      }, false, true);
    }
    return ret;
  },

  ':': (key, val) => {
    return { key, val };
  },

  list: function() {
    let args = arguments;
    if (args.length === 1) {
      return [];
    } else {
      return tools.arraySlice(args, 0, args.length - 1);
    }
  },

  reg: (pattern, flags) => {
    if (flags._njOpts) {
      flags = '';
    }

    return new RegExp(pattern, flags);
  }
};

function _config(params) {
  let ret = {
    onlyGlobal: false,
    transOperator: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

const _defaultCfg = { onlyGlobal: true },
  _defaultCfgO = { onlyGlobal: true, transOperator: true };

//Filter default config
export const filterConfig = {
  '.': _config(_defaultCfg),
  '_': _config(_defaultCfg),
  '#': _config(_defaultCfg),
  '==': _config(_defaultCfgO),
  '===': _config(_defaultCfgO),
  '!=': _config(_defaultCfgO),
  '!==': _config(_defaultCfgO),
  '<': _config(_defaultCfgO),
  '<=': _config(_defaultCfgO),
  '>': _config(_defaultCfgO),
  '>=': _config(_defaultCfgO),
  '+': _config(_defaultCfgO),
  '-': _config(_defaultCfgO),
  '*': _config(_defaultCfgO),
  '/': _config(_defaultCfgO),
  '%': _config(_defaultCfgO),
  '?': _config(_defaultCfg),
  '!': _config(_defaultCfg),
  '&&': _config(_defaultCfgO),
  or: _config(_defaultCfgO),
  int: _config(_defaultCfg),
  float: _config(_defaultCfg),
  bool: _config(_defaultCfg),
  obj: _config(_defaultCfg),
  ':': _config(_defaultCfgO),
  list: _config(_defaultCfg),
  reg: _config(_defaultCfg)
};

//Filter alias
filters.prop = filters['.'];
filterConfig.prop = filterConfig['.'];

//Register filter and also can batch add
export function registerFilter(name, filter, options) {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      filter,
      options
    };
  }

  tools.each(params, (v, name) => {
    if (v) {
      const { filter, options } = v;

      if (filter) {
        filters[name] = filter;
      } else {
        filters[name] = v;
      }
      filterConfig[name] = _config(options);

      if(options && options.transOperator) {
        _REGEX_TRANSOPTS += '|' + name;
        nj.regexTransOpts = _getRegexTransopts(_REGEX_TRANSOPTS);
      }
    }
  }, false, false);
}

function _getRegexTransopts(opts) {
  return new RegExp('[\\s]+(' + opts.replace(/\+|\*/g, match => '\\' + match) + ')[\\s]+' + nj.regexJsBase + '([^\\s,()]*)', 'g');
}

let _REGEX_TRANSOPTS = '';
tools.each(filterConfig, (v, k) => {
  if(v.transOperator) {
    _REGEX_TRANSOPTS += '|' + k;
  }
});
_REGEX_TRANSOPTS = _REGEX_TRANSOPTS.substr(1);

tools.assign(nj, {
  filters,
  filterConfig,
  registerFilter,
  regexTransOpts: _getRegexTransopts(_REGEX_TRANSOPTS)
});