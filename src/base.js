'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  setComponentEngine = utils.setComponentEngine,
  compiler = require('./compiler/compile'),
  compileStringTmpl = require('./checkElem/checkStringElem');

nj.setComponentEngine = setComponentEngine;
nj.registerComponent = utils.registerComponent;
nj.registerFilter = utils.registerFilter;
nj.compileStringTmpl = compileStringTmpl;
utils.assign(nj, compiler);

//创建标签命名空间
utils.createTagNamespace();

//默认使用react作为组件引擎
if (typeof React !== 'undefined') {
  setComponentEngine('react', React, typeof ReactDOM !== 'undefined' ? ReactDOM : null);
}

var global = typeof self !== 'undefined' ? self : this;
module.exports = global.NornJ = global.nj = nj;