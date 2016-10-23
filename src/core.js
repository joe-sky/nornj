'use strict';

function nj() {
  return nj.compileStringTmpl.apply(null, arguments);
}

nj.componentLib = null;
nj.componentLibObj = null;
nj.componentLibDom = null;
nj.componentPort = null;
nj.componentRender = null;
nj.componentClasses = {};
nj.asts = {};
nj.templates = {};
nj.errorTitle = 'NornJ:';
nj.tmplRule = {};

module.exports = nj;