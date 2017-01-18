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

var _global = typeof self !== 'undefined' ? self : global;

module.exports = _global.NornJ = _global.nj = nj;