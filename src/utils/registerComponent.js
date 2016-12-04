'use strict';

var nj = require('../core'),
  tools = require('./tools');

//注册组件
function registerComponent(name, component) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = component;
  }

  tools.each(params, function (v, k) {
    nj.components[k.toLowerCase()] = v;
  }, false, false);

  return component;
}

module.exports = {
  registerComponent: registerComponent
};