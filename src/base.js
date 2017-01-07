'use strict';

var nj = require('./core'),
  utils = require('./utils/utils'),
  compiler = require('./compiler/compile'),
  compileStringTmpl = require('./parser/checkStringElem'),
  tmplTag = require('./utils/tmplTag'),
  config = require('./config');

nj.compileStringTmpl = compileStringTmpl;
nj.config = config;
utils.assign(nj, compiler, tmplTag, utils);

var global = typeof self !== 'undefined' ? self : this;

module.exports = global.NornJ = global.nj = nj;