import { Export } from './interface';

const nj: Export = function() {
  return nj['taggedTmpl' + (nj.outputH ? 'H' : '')].apply(null, arguments);
};

nj.preAsts = {};
nj.asts = {};
nj.templates = {};
nj.errorTitle = '[NornJ]';
nj.tmplRule = {};
nj.outputH = false;
nj.global = typeof self !== 'undefined' ? self : global;
nj.textTag = 'nj-text';
nj.textMode = false;
nj.noWsTag = 'nj-noWs';
nj.noWsMode = false;
nj.fixTagName = true;

export default nj;
