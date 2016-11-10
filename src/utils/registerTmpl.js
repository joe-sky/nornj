'use strict';

var nj = require('../core'),
  tools = require('./tools'),
  registerComponent = require('./registerComponent').registerComponent;

//注册模板装饰器
function registerTmpl(name, template) {
  if (tools.isObject(name)) {
    template = name.template;
    name = name.name;
  }

  return function (target) {
    //注册组件
    if(name != null) {
      registerComponent(name, target);
    }

    //创建模板函数
    if(template) {
      target.prototype.template = nj.compileComponent(template, name);
    }
  };
}

module.exports = registerTmpl;