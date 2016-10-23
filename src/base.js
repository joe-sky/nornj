'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  compiler = require('./compiler/compile'),
  compileStringTmpl = require('./checkElem/checkStringElem'),
  tmplByKey = require('./utils/tmplByKey'),
  docReady = require('./utils/docReady');

nj.compileStringTmpl = compileStringTmpl;
nj.tmplByKey = tmplByKey;
nj.docReady = docReady;
utils.assign(nj, compiler, utils);

//Default use React as component engine
if (typeof React !== 'undefined') {
  nj.setComponentEngine('react', React, typeof ReactDOM !== 'undefined' ? ReactDOM : null);
}

var global;
if (typeof self !== 'undefined') {
  global = self;

  //Init tag template
  docReady(function () {
    if (nj.componentLib) {
      nj.renderInlineComp(nj.initRenderData, null, true);
    }
  });
}
else {
  global = this;
}

module.exports = global.NornJ = global.nj = nj;