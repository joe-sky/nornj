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
nj.namespace = 'nj';
nj.tagNamespaces = { nj: 'nj' };
nj.tagId = 'nj-id';
nj.tagStyle = 'nj-style';
nj.tagClassName = 'nj-component';
nj.asts = {};
nj.templates = {};
nj.errorTitle = 'NornJ:';
nj.tmplRule = {};
nj.autoRenderTag = true;

module.exports = nj;