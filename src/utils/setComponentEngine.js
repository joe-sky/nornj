'use strict';

var nj = require('../core'),
  tools = require('./tools');

//设置组件引擎
function setComponentEngine(name, obj, dom, port, render) {
  nj.componentLib = name;
  nj.componentLibObj = obj;
  dom = dom || obj;
  nj.componentLibDom = dom;
  if (name === 'react') {
    port = 'createElement';
    render = 'render';
  }
  nj.componentPort = tools.isString(port) ? obj[port] : port;
  nj.componentRender = tools.isString(render) ? dom[render] : render;
}

module.exports = {
  setComponentEngine: setComponentEngine
};