export default function nj() {
  return nj['taggedTmpl' + (nj.outputH ? 'H' : '')].apply(null, arguments);
}

nj.createElement = null;
nj.components = {};
nj.preAsts = {};
nj.asts = {};
nj.templates = {};
nj.errorTitle = '[NornJ]';
nj.tmplRule = {};
nj.outputH = false;
nj.global = typeof self !== 'undefined' ? self : global;
nj.regexJsBase = '((\'[^\']*\')|("[^"]*")|(-?([0-9][0-9]*)(\\.\\d+)?)|true|false|null|undefined|Object|Array|Math|Date|JSON|([#]*)([^\\s.,[\\]()]+))';