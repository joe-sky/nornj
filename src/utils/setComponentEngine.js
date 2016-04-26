'use strict';

var nj = require('../core'),
  tools = require('./tools');

//Set component engine
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
  nj.componentPort = tools.isString(port) ? obj[port] : port;
  nj.componentRender = tools.isString(render) ? dom[render] : render;
}

module.exports = {
  setComponentEngine: setComponentEngine
};