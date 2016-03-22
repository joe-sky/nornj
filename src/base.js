'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  setComponentEngine = utils.setComponentEngine,
  compiler = require('./compiler/compile'),
  compileStringTmpl = require('./checkElem/checkStringElem'),
  docReady = require('./utils/docReady');

nj.setComponentEngine = setComponentEngine;
nj.setParamRule = utils.setParamRule;
nj.registerComponent = utils.registerComponent;
nj.registerFilter = utils.registerFilter;
nj.compileStringTmpl = compileStringTmpl;
nj.docReady = docReady;
utils.assign(nj, compiler);

//Create vml tag namespace(primarily for IE8)
utils.createTagNamespace();

//Default use React as component engine
if (typeof React !== 'undefined') {
  setComponentEngine('react', React, typeof ReactDOM !== 'undefined' ? ReactDOM : null);
}

var inBrowser = typeof self !== 'undefined',
  global = inBrowser ? self : this;

//Init tag template
if (inBrowser) {
  docReady(function () {
    if (!nj.preventAutoRenderTag) {
      nj.renderTagComponent(nj.initTagData);
    }
  });
}

module.exports = global.NornJ = global.nj = nj;