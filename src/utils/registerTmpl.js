'use strict';

var nj = require('../core'),
  registerComponent = require('./registerComponent').registerComponent;

//注册模板装饰器
function registerTmpl(name) {
  return function (target) {
    registerComponent(name, target);
  };
}

module.exports = registerTmpl;