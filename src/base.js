'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  setComponentEngine = utils.setComponentEngine,
  compiler = require('./compiler/compile'),
  registerComponent = require('./utils/registerComponent'),
  compileStringTmpl = require('./checkElem/checkStringElem'),
  docReady = require('./utils/docReady');

nj.setComponentEngine = setComponentEngine;
nj.setTmplRule = utils.setTmplRule;
nj.registerFilter = utils.registerFilter;
nj.registerExpr= utils.registerExpr;
nj.compileStringTmpl = compileStringTmpl;
nj.docReady = docReady;
utils.assign(nj, compiler, registerComponent);

//Create vml tag namespace(primarily for IE8)
utils.registerTagNamespace();

//Default use React as component engine
if (typeof React !== 'undefined') {
  setComponentEngine('react', React, typeof ReactDOM !== 'undefined' ? ReactDOM : null);
}

var global;
if (typeof self !== 'undefined') {
  global = self;

  //Init tag template
  docReady(function () {
    if (nj.componentLib && nj.autoRenderTag) {
      nj.renderTagComponent(nj.initTagData);
    }
  });
}
else {
  global = this;
}

module.exports = global.NornJ = global.nj = nj;