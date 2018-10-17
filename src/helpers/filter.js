import nj from '../core';
import * as tools from '../utils/tools';
import { getComputedData, styleProps } from '../transforms/transformData';

//Global filter list
export const filters = {
  //Get properties
  '.': (obj, prop) => {
    if (obj == null) {
      return obj;
    }
    if (obj._njCtx) {
      return {
        _njCtx: obj.val,
        val: obj.val[prop],
        prop
      };
    }

    return obj[prop];
  },

  //Call method
  _: function (method) {
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
      _njCtx: obj
    }, options.context, options.level);
  },

  '=': (obj, val) => {
    if (obj == null) {
      return obj;
    }

    obj._njCtx[obj.prop] = val;
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

  '**': (val1, val2) => Math.pow(val1, val2),

  '%%': (val1, val2) => Math.floor(val1 / val2),

  //Ternary operator
  '?:': (val, val1, val2) => val ? val1 : val2,

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

  obj: function () {
    let args = arguments,
      ret = {};

    tools.each(args, (v, i) => {
      ret[v.key] = v.val;
    }, false, true);
    return ret;
  },

  ':': (key, val) => {
    return { key, val };
  },

  list: function () {
    let args = arguments;
    if (args.length === 0) {
      return [];
    } else {
      return tools.arraySlice(args, 0, args.length);
    }
  },

  reg: (pattern, flags) => new RegExp(pattern, flags),

  //Transform css string to object
  css: cssText => styleProps(cssText),

  //Generate array by two positive integers,closed interval 
  '..': _getArrayByNum(1),

  //Generate array by two positive integers,right open interval
  rLt: _getArrayByNum(0),

  //Compare two number or letter 
  '<=>': (val1, val2) => {
    if (val1 > val2) {
      return 1;
    } else if (val1 == val2) {
      return 0;
    } else {
      return -1;
    }
  },

  bracket: val => val,

  capitalize: str => tools.capitalize(str)
};

function _getArrayByNum(isContainEnd) {
  return function (val1, val2) {
    return Object.keys(Array.apply(null, { length: val2 - val1 + isContainEnd })).map(item => +item + val1);
  };
}

function _config(params) {
  let ret = {
    onlyGlobal: false,
    hasOptions: true
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

const _defaultCfg = { onlyGlobal: true, hasOptions: false };

//Filter default config
export const filterConfig = {
  '.': _config(_defaultCfg),
  '_': _config({ onlyGlobal: true }),
  '#': _config({ onlyGlobal: true }),
  '==': _config(_defaultCfg),
  '===': _config(_defaultCfg),
  '!=': _config(_defaultCfg),
  '!==': _config(_defaultCfg),
  '<': _config(_defaultCfg),
  '<=': _config(_defaultCfg),
  '>': _config(_defaultCfg),
  '>=': _config(_defaultCfg),
  '+': _config(_defaultCfg),
  '-': _config(_defaultCfg),
  '*': _config(_defaultCfg),
  '/': _config(_defaultCfg),
  '%': _config(_defaultCfg),
  '**': _config(_defaultCfg),
  '%%': _config(_defaultCfg),
  '?:': _config(_defaultCfg),
  '!': _config(_defaultCfg),
  '&&': _config(_defaultCfg),
  or: _config(_defaultCfg),
  int: _config(_defaultCfg),
  float: _config(_defaultCfg),
  bool: _config(_defaultCfg),
  obj: _config(_defaultCfg),
  ':': _config(_defaultCfg),
  list: _config(_defaultCfg),
  reg: _config(_defaultCfg),
  css: _config(_defaultCfg),
  '..': _config(_defaultCfg),
  rLt: _config(_defaultCfg),
  '<=>': _config(_defaultCfg),
  bracket: _config(_defaultCfg),
  capitalize: _config(_defaultCfg)
};

//Filter alias
filters.prop = filters['.'];
filterConfig.prop = filterConfig['.'];
filters['?'] = filters['?:'];
filterConfig['?'] = filterConfig['?:'];
filters['//'] = filters['%%'];
filterConfig['//'] = filterConfig['%%'];

//Register filter and also can batch add
export function registerFilter(name, filter, options, mergeConfig) {
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
      } else if (!mergeConfig) {
        filters[name] = v;
      }

      if (mergeConfig) {
        if (!filterConfig[name]) {
          filterConfig[name] = {};
        }
        tools.assign(filterConfig[name], options);
      }
      else {
        filterConfig[name] = _config(options);
      }
    }
  }, false, false);
}

tools.assign(nj, {
  filters,
  filterConfig,
  registerFilter
});