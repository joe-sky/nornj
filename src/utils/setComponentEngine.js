'use strict';

var nj = require('../core');

//设置组件引擎
function setComponentEngine(name, obj, dom, port, render) {
    nj.componentLib = name;
    nj.componentLibObj = obj;
    nj.componentLibDom = dom || obj;
    if (name === "react") {
        port = "createElement";
        render = "render";
    }
    nj.componentPort = port;
    nj.componentRender = render;
}

module.exports = setComponentEngine;