'use strict';

var nj = require('../core'),
  tools = require('./tools');

//Global filter list
nj.filters = {
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
  }
};

//Register filter and also can batch add
function registerFilter(name, filter) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = filter;
  }

  tools.each(params, function (v, k) {
    nj.filters[k.toLowerCase()] = v;
  }, false, false);
}

module.exports = {
  registerFilter: registerFilter
};
