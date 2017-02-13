export default function nj() {
  return nj['tmplTag' + (nj.outputH ? 'H' : '')].apply(null, arguments);
}

nj.createElement = null;
nj.components = {};
nj.asts = {};
nj.templates = {};
nj.tmplStrs = {};
nj.errorTitle = '[NornJ]';
nj.tmplRule = {};
nj.outputH = false;