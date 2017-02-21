import nj from '../core';
import * as tools from '../utils/tools';

//Global filter list
export const filters = {
  //Get param properties
  prop: (val, prop) => {
    if (val != null) {
      return val[prop];
    }

    return val;
  },

  '==': (val1, val2) => val1 == val2,

  '===': (val1, val2) => val1 === val2,

  //Less than
  lt: (val1, val2) => val1 < val2,

  lte: (val1, val2) => val1 <= val2,

  //Greater than
  gt: (val1, val2) => val1 > val2,

  gte: (val1, val2) => val1 >= val2,

  '+': (val1, val2) => val1 + val2,

  '-': (val1, val2) => val1 - val2,

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

  //Execute method
  '#': function(val, method) {
    if (val != null) {
      let args = arguments;
      return val[method].apply(val, tools.arraySlice(args, 2, args.length - 1));
    }

    return val;
  }
};

function _commonConfig(params) {
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
  prop: _commonConfig(),
  '==': _commonConfig(),
  '===': _commonConfig(),
  lt: _commonConfig(),
  lte: _commonConfig(),
  gt: _commonConfig(),
  gte: _commonConfig(),
  '+': _commonConfig(),
  '-': _commonConfig(),
  '?': _commonConfig(),
  '!': _commonConfig(),
  '&&': _commonConfig(),
  or: _commonConfig(),
  int: _commonConfig(),
  float: _commonConfig(),
  bool: _commonConfig(),
  '#': _commonConfig()
};

//Register filter and also can batch add
export function registerFilter(name, filter, options) {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      filter: filter,
      options: options
    };
  }

  tools.each(params, (v, name) => {
    if (v) {
      const { filter, options } = v;

      if (filter || options) {
        if (filter) {
          filters[name] = filter;
        }
        if (options) {
          filterConfig[name] = _commonConfig(options);
        }
      } else {
        filters[name] = v;
      }
    }
  }, false, false);
}

tools.assign(nj, {
  filters,
  filterConfig,
  registerFilter
});