import nj from '../core';
import * as tools from '../utils/tools';
import { getComputedData, styleProps } from '../transforms/transformData';
const digitsRE = /(\d{3})(?=\d)/g;
//Global filter list
export const filters = {
  //Get properties
  '.': (obj, prop, callFn) => {
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
    else if (callFn) {
      return {
        obj,
        prop
      };
    }

    return obj[prop];
  },

  //Call function
  _: function (fn, args) {
    return (fn && fn.obj[fn.prop] != null) ? fn.obj[fn.prop].apply(fn.obj, args) : null;
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

  // '=': (obj, val) => {
  //   if (obj == null) {
  //     return obj;
  //   }

  //   obj._njCtx[obj.prop] = val;
  // },

  '**': (val1, val2) => Math.pow(val1, val2),

  '%%': (val1, val2) => Math.floor(val1 / val2),

  //Ternary operator
  '?:': (val, val1, val2) => val ? val1 : val2,

  '!': val => !val,

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

  capitalize: str => tools.capitalize(str),
  
  currency (value, currency, decimals) {
    if(!(value - parseFloat(value) >= 0)) return '';
    value = parseFloat(value);
    currency = currency != null ? currency : '$';
    decimals = decimals != null ? decimals : 2;
    var stringified = Math.abs(value).toFixed(decimals);
    var _int = decimals
      ? stringified.slice(0, -1 - decimals)
      : stringified;
    var i = _int.length % 3;
    var head = i > 0
      ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
      : '';
    var _float = decimals
      ? stringified.slice(-1 - decimals)
      : '';
    var sign = value < 0 ? '-' : '';
    return sign + currency + head +
      _int.slice(i).replace(digitsRE, '$1,') +
      _float;
  }
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
  '**': _config(_defaultCfg),
  '%%': _config(_defaultCfg),
  '?:': _config(_defaultCfg),
  '!': _config(_defaultCfg),
  int: _config(_defaultCfg),
  float: _config(_defaultCfg),
  bool: _config(_defaultCfg),
  reg: _config(_defaultCfg),
  css: _config(_defaultCfg),
  '..': _config(_defaultCfg),
  rLt: _config(_defaultCfg),
  '<=>': _config(_defaultCfg),
  capitalize: _config(_defaultCfg),
  currency: _config(_defaultCfg)
};

//Filter alias
filters.prop = filters['.'];
filterConfig.prop = filterConfig['.'];

export const operators = [
  '+=',
  '+',
  '-[0-9]',
  '-',
  '**',
  '*',
  '%%',
  '%',
  '===',
  '!==',
  '==',
  '!=',
  '<=>',
  '<=',
  '>=',
  '=',
  '..<',
  '<',
  '>',
  '&&',
  '||',
  '?:',
  '?',
  ':',
  '../',
  '..',
  '/'
];

const REGEX_OPERATORS_ESCAPE = /\*|\||\/|\.|\?|\+/g;
function _createRegexOperators() {
  return new RegExp(operators.map(o => {
    return o.replace(REGEX_OPERATORS_ESCAPE, match => '\\' + match);
  }).join('|'), 'g');
}

nj.REGEX_OPERATORS = _createRegexOperators();

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