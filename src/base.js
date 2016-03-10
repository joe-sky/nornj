'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  setComponentEngine = utils.setComponentEngine,
  compiler = require('./compiler/compile'),
  compileStringTmpl = require('./checkElem/checkStringElem'),
  docReady = require('./utils/docReady');

nj.setComponentEngine = setComponentEngine;
nj.registerComponent = utils.registerComponent;
nj.registerFilter = utils.registerFilter;
nj.compileStringTmpl = compileStringTmpl;
nj.docReady = docReady;
utils.assign(nj, compiler);

//创建标签命名空间
utils.createTagNamespace();

//默认使用react作为组件引擎
if (typeof React !== 'undefined') {
  setComponentEngine('react', React, typeof ReactDOM !== 'undefined' ? ReactDOM : null);
}

var inBrowser = typeof self !== 'undefined',
  global = inBrowser ? self : this;

//Init tag template
if (inBrowser) {
  docReady(function() {

  });
}

module.exports = global.NornJ = global.nj = nj;