'use strict';

function nj() {
  return nj.compileStringTmpl.apply(null, arguments);
}

nj.createElement = null;
nj.components = {};
nj.asts = {};
nj.templates = {};
nj.errorTitle = '[NornJ error]';
nj.tmplRule = {};

module.exports = nj;