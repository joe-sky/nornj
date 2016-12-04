'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  compiler = require('./compiler/compile'),
  compileStringTmpl = require('./parser/checkStringElem'),
  tmplByKey = require('./utils/tmplByKey'),
  config = require('./config');

nj.compileStringTmpl = compileStringTmpl;
nj.tmplByKey = tmplByKey;
nj.config = config;
utils.assign(nj, compiler, utils);

var global = typeof self !== 'undefined' ? self : this;

module.exports = global.NornJ = global.nj = nj;