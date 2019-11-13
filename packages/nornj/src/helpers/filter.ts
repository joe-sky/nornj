import nj from '../core';
import * as tools from '../utils/tools';
import { getAccessorData, styleProps } from '../transforms/transformData';
import { FilterDelegate, FilterOption } from '../interface';
const REGEX_DIGITS_RE = /(\d{3})(?=\d)/g;

//Global filter list
export const filters: { [name: string]: FilterDelegate } = {
  //Get properties
  '.': (obj, prop, callFn) => {
    if (obj == null) {
      return obj;
    }
    if (obj._njSrc) {
      return {
        source: obj.value,
        value: obj.value[prop],
        prop,
        parent: obj,
        _njSrc: true
      };
    } else if (callFn) {
      return {
        source: obj,
        value: obj[prop],
        prop,
        _njSrc: true
      };
    }

    return obj[prop];
  },

  //Call function
  _: function(fn, args) {
    if (fn == null) {
      return fn;
    }
    if (fn._njSrc) {
      const _fn = fn.source[fn.prop];
      return _fn != null ? _fn.apply(fn.source, args) : _fn;
    }

    return fn.apply(null, args);
  },

  //Get accessor properties
  '#': (obj, prop, options) => {
    if (obj == null) {
      return obj;
    }

    return getAccessorData(obj[prop], options.context);
  },

  '**': (val1: number, val2: number) => {
    const ret = Math.pow(val1, val2);
    return isNaN(ret) ? 0 : ret;
  },

  '%%': (val1: number, val2: number) => {
    const ret = Math.floor(val1 / val2);
    return isNaN(ret) ? 0 : ret;
  },

  //Ternary operator
  '?:': (val, val1, val2) => (val ? val1 : val2),

  '!': val => !val,

  //Convert to int
  int: (val: string, radix = 10) => {
    const ret = parseInt(val, radix);
    return isNaN(ret) ? 0 : ret;
  },

  //Convert to float
  float: (val: string, bit: number) => {
    const ret = parseFloat(val);
    return isNaN(ret) ? 0 : bit != null ? ret.toFixed(bit) : ret;
  },

  //Convert to boolean
  bool: (val: boolean | string) => {
    if (val === 'false') {
      return false;
    }

    return Boolean(val);
  },

  reg: (pattern: string | RegExp, flags: string) => new RegExp(pattern, flags),

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

  upperFirst: (str: string) => tools.upperFirst(str),

  lowerFirst: (str: string) => tools.lowerFirst(str),

  camelCase: (str: string) => tools.camelCase(str),

  isObject: val => tools.isObject(val),

  isNumber: val => tools.isNumber(val),

  isString: val => tools.isString(val),

  isArrayLike: val => tools.isArrayLike(val),

  currency(value, decimals: number, symbol, placeholder: string) {
    if (!(value - parseFloat(value) >= 0)) {
      return placeholder != null ? placeholder : filterConfig.currency.placeholder;
    }
    value = parseFloat(value);
    symbol = decimals != null && tools.isString(decimals) ? decimals : symbol;
    symbol = symbol != null && tools.isString(symbol) ? symbol : filterConfig.currency.symbol;
    decimals = decimals != null && tools.isNumber(decimals) ? decimals : 2;

    const stringified = Math.abs(value).toFixed(decimals);
    const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    const i = _int.length % 3;
    const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
    const _float = decimals ? stringified.slice(-1 - decimals) : '';
    const sign = value < 0 ? '-' : '';

    return sign + symbol + head + _int.slice(i).replace(REGEX_DIGITS_RE, '$1,') + _float;
  }
};

function _getArrayByNum(isContainEnd) {
  return function(val1, val2) {
    return Object.keys(Array.apply(null, { length: val2 - val1 + isContainEnd })).map(item => +item + val1);
  };
}

function _config(params?: FilterOption, extra?: FilterOption): FilterOption {
  let ret: FilterOption = {
    onlyGlobal: false,
    hasOptions: false,
    isOperator: false,
    hasLevel: false,
    hasTmplCtx: true,
    alias: null
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  if (extra) {
    ret = tools.assign(ret, extra);
  }
  return ret;
}

const _defaultCfg: FilterOption = { onlyGlobal: true, hasOptions: false };

//Filter default config
export const filterConfig: { [name: string]: FilterOption } = {
  '.': _config(_defaultCfg),
  _: _config({ onlyGlobal: true }),
  '#': _config({ onlyGlobal: true, hasOptions: true, hasLevel: true }),
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
  upperFirst: _config(_defaultCfg),
  lowerFirst: _config(_defaultCfg),
  camelCase: _config(_defaultCfg),
  isObject: _config(_defaultCfg),
  isNumber: _config(_defaultCfg),
  isString: _config(_defaultCfg),
  isArrayLike: _config(_defaultCfg),
  currency: _config(_defaultCfg, { symbol: '$', placeholder: '' })
};

filters.capitalize = filters.upperFirst;
filterConfig.capitalize = _config(filterConfig.upperFirst);

export function registerFilter(options: {
  [name: string]: FilterDelegate | { filter?: FilterDelegate; options?: FilterOption };
}): void;
export function registerFilter(
  name: string,
  filter: FilterDelegate,
  options?: FilterOption,
  mergeConfig?: boolean
): void;
export function registerFilter(name, filter?: FilterDelegate, options?: FilterOption, mergeConfig?: boolean): void {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      filter,
      options
    };
  }

  tools.each(
    params,
    (v, name) => {
      if (v) {
        const { filter, options }: { filter: FilterDelegate; options: FilterOption } = v;
        if (options) {
          if (options.isOperator) {
            const createRegexOperators = nj.createRegexOperators;
            if (createRegexOperators) {
              createRegexOperators(name);
            }
          }

          const { alias } = options;
          if (alias) {
            const createFilterAlias = nj.createFilterAlias;
            if (createFilterAlias) {
              createFilterAlias(name, alias);
            }
            name = alias;
          }
        }

        if (filter) {
          filters[name] = filter;
        } else if (!mergeConfig) {
          filters[name] = v;
        }

        if (mergeConfig) {
          if (!filterConfig[name]) {
            filterConfig[name] = _config();
          }
          if (tools.isObject(options)) {
            tools.assign(filterConfig[name], options);
          } else {
            filterConfig[name] = _config();
          }
        } else {
          filterConfig[name] = _config(options);
        }
      }
    },
    false
  );
}

tools.assign(nj, {
  filters,
  filterConfig,
  registerFilter
});
