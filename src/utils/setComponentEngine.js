'use strict';

var nj = require('../core'),
  tools = require('./tools');

//设置组件引擎
function setComponentEngine(name, obj, dom, port, render) {
  //Component engine's name
  nj.componentLib = name;

  //Component engine's object
  nj.componentLibObj = obj;

  //Component engine's dom object
  dom = dom || obj;
  nj.componentLibDom = dom;

  //Component engine's create element and render function
  if (name === 'react') {
    port = 'createElement';
    render = 'render';
  }
  else {
    if (tools.isString(port)) {
      port = obj[port];
    }
    if (tools.isString(render)) {
      render = dom[render];
    }
  }
  nj.componentPort = port;
  nj.componentRender = render;
}

module.exports = {
  setComponentEngine: setComponentEngine
};