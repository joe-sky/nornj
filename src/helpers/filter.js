'use strict';

var tools = require('../utils/tools');

//Global filter list
var filters = {
  //Get param properties
  prop: (value, props) => {
    var ret = value;
    ret && props.split('.').forEach(p => {
      ret = ret[p];
    });

    return ret;
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

function _commonConfig(params) {
  var ret = {
    useString: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

//Filter default config
var filterConfig = {
  prop: _commonConfig(),
  '==': _commonConfig(),
  '===': _commonConfig(),
  lt: _commonConfig(),
  lte: _commonConfig(),
  gt: _commonConfig(),
  gte: _commonConfig(),
  '+': _commonConfig(),
  '-': _commonConfig(),
  int: _commonConfig(),
  float: _commonConfig(),
  bool: _commonConfig()
};

//Register filter and also can batch add
function registerFilter(name, filter, options) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      filter: filter,
      options: options
    };
  }

  tools.each(params, function(v, name) {
    if (v) {
      var filter = v.filter,
        options = v.options;

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

module.exports = {
  filters,
  filterConfig,
  registerFilter
};