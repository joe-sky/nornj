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
    data: true,
    parent: true,
    index: true,
    useString: true
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

//Filter default config
var _defaultConfig = { data: false, parent: false, index: false },
  filterConfig = {
    prop: _commonConfig(_defaultConfig),
    count: _commonConfig(_defaultConfig),
    item: _commonConfig(_defaultConfig),
    equal: _commonConfig(_defaultConfig),
    lt: _commonConfig(_defaultConfig),
    gt: _commonConfig(_defaultConfig),
    add: _commonConfig(_defaultConfig),
    int: _commonConfig(_defaultConfig),
    float: _commonConfig(_defaultConfig),
    bool: _commonConfig(_defaultConfig)
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
    var name = k.toLowerCase();
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
      }
      else {
        filters[name] = v;
      }
    }
  }, false, false);
}

module.exports = {
  filters: filters,
  filterConfig: filterConfig,
  registerFilter: registerFilter
};