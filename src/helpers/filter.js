import nj from '../core';
import * as tools from '../utils/tools';

//Global filter list
export const filters = {
  //Get properties
  '.': (obj, prop) => {
    if (obj != null) {
      if (prop == null) {
        return null;
      } else if (!prop._njMethod) { //获取属性
        return obj[prop];
      } else { //执行方法
        return obj[prop.method].apply(obj, prop.args);
      }
    }

    return obj;
  },

  //Call method
  call: function(method) {
    if (method == null) {
      return method;
    }

    let args = arguments;
    args = tools.arraySlice(args, 1, args.length - 1);

    if (tools.isFunction(method)) {
      return method.apply(null, args);
    } else {
      return {
        method,
        args,
        _njMethod: true
      };
    }
  },

  //Get computed properties
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
    onlyGlobal: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

const _defaultCfg = { onlyGlobal: true };

//Filter default config
export const filterConfig = {
  '.': _config(_defaultCfg),
  '#': _config(_defaultCfg),
  '==': _config(_defaultCfg),
  '===': _config(_defaultCfg),
  '!=': _config(_defaultCfg),
  '!==': _config(_defaultCfg),
  lt: _config(_defaultCfg),
  lte: _config(_defaultCfg),
  gt: _config(_defaultCfg),
  gte: _config(_defaultCfg),
  '+': _config(_defaultCfg),
  '-': _config(_defaultCfg),
  '*': _config(_defaultCfg),
  '/': _config(_defaultCfg),
  '%': _config(_defaultCfg),
  '?': _config(_defaultCfg),
  '!': _config(_defaultCfg),
  '&&': _config(_defaultCfg),
  or: _config(_defaultCfg),
  int: _config(_defaultCfg),
  float: _config(_defaultCfg),
  bool: _config(_defaultCfg),
  obj: _config(_defaultCfg),
  ':': _config(_defaultCfg),
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
    }
  }, false, false);
}

tools.assign(nj, {
  filters,
  filterConfig,
  registerFilter
});