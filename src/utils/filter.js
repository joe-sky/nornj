'use strict';

var nj = require('../core'),
  tools = require('./tools');

//过滤器对象
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

//注册过滤器
function registerFilter(name, filter) {
  var params = name;
  if (!tools.isArray(name)) {
    params = [{ name: name, filter: filter }];
  }

  tools.each(params, function (param) {
    nj.filters[param.name.toLowerCase()] = param.filter;
  }, false, true);
}

module.exports = {
  registerFilter: registerFilter
};