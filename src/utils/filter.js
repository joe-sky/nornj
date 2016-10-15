'use strict';

var tools = require('./tools');

//Global filter list
var filters = {
  //Get param properties
  prop: function (obj, props) {
    var ret = obj;
    ret && tools.each(props.split('.'), function (p) {
      ret = ret[p];
    }, false, true);

    return ret;
  },

  //Get list count
  count: function (obj) {
    return obj ? obj.length : 0;
  },

  //Get list item
  item: function (obj, no) {
    return obj ? obj[no] : null;
  },

  //Judge equal
  equal: function (obj, val) {
    return obj == val;
  },

  //Less than
  lt: function (val1, val2, noEqual) {
    var ret;
    val1 = parseFloat(val1);
    val2 = parseFloat(val2);

    if (noEqual) {
      ret = val1 < val2;
    }
    else {
      ret = val1 <= val2;
    }

    return ret;
  },

  //Greater than
  gt: function (val1, val2, noEqual) {
    var ret;
    val1 = parseFloat(val1);
    val2 = parseFloat(val2);

    if (noEqual) {
      ret = val1 > val2;
    }
    else {
      ret = val1 >= val2;
    }

    return ret;
  },

  //Addition
  add: function (val1, val2, isFloat) {
    return val1 + (isFloat ? parseFloat(val2) : parseInt(val2, 10));
  },

  //Convert to int 
  int: function (val) {
    return parseInt(val, 10);
  },

  //Convert to float 
  float: function (val) {
    return parseFloat(val);
  },

  //Convert to boolean 
  bool: function (val) {
    if (val === 'false') {
      return false;
    }

    return Boolean(val);
  }
};

function _commonConfig(params) {
  var ret = {
    data: false,
    parent: false,
    index: false,
    useString: true
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

//Filter default config
var filterConfig = {
  prop: _commonConfig(),
  count: _commonConfig(),
  item: _commonConfig(),
  equal: _commonConfig(),
  lt: _commonConfig(),
  gt: _commonConfig(),
  add: _commonConfig(),
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

  tools.each(params, function (v, k) {
    var name = k.toLowerCase(),
      options;

    if (v && v.filter) {
      filters[name] = v.filter;
      options = v.options;
    }
    else {
      filters[name] = v;
    }

    filterConfig[name] = _commonConfig(options);
  }, false, false);
}

module.exports = {
  filters: filters,
  filterConfig: filterConfig,
  registerFilter: registerFilter
};