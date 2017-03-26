import nj from '../core';
import * as tools from '../utils/tools';

//Global filter list
export const filters = {
  //Get object properties
  prop: (obj, prop) => {
    if (obj != null) {
      return obj[prop];
    }

    return obj;
  },

  //Call object method
  '#': function(obj, method) {
    if (obj != null) {
      let args = arguments;
      return obj[method].apply(obj, tools.arraySlice(args, 2, args.length - 1));
    }

    return obj;
  },

  '==': (val1, val2) => val1 == val2,

  '===': (val1, val2) => val1 === val2,

  '!=': (val1, val2) => val1 != val2,

  '!==': (val1, val2) => val1 !== val2,

  //Less than
  lt: (val1, val2) => val1 < val2,

  lte: (val1, val2) => val1 <= val2,

  //Greater than
  gt: (val1, val2) => val1 > val2,

  gte: (val1, val2) => val1 >= val2,

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
  }
};

function _config(params) {
  let ret = {
    useString: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

//Filter default config
export const filterConfig = {
  prop: _config(),
  '==': _config(),
  '===': _config(),
  '!=': _config(),
  '!==': _config(),
  lt: _config(),
  lte: _config(),
  gt: _config(),
  gte: _config(),
  '+': _config(),
  '-': _config(),
  '*': _config(),
  '/': _config(),
  '%': _config(),
  '?': _config(),
  '!': _config(),
  '&&': _config(),
  or: _config(),
  int: _config(),
  float: _config(),
  bool: _config(),
  '#': _config()
};

//Filter alias
filters['.'] = filters.prop;
filterConfig['.'] = filterConfig.prop;

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
    }
  }, false, false);
}

tools.assign(nj, {
  filters,
  filterConfig,
  registerFilter
});