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
nj.tagNamespace = 'nj';
nj.tagId = 'nj-id';
nj.tagStyle = 'nj-style';
nj.tagClassName = 'nj-component';
nj.templates = {};
nj.errorTitle = 'NornJ:';
nj.paramRule = {};
nj.autoRenderTag = true;

module.exports = nj;