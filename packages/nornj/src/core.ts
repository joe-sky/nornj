const nj: {
  (strs: TemplateStringsArray, ...args: any[]): any;
  includeParser?: Function;
  createElement?: Function;
  createRegexOperators?: Function;
  createFilterAlias?: Function;
  outputH: boolean;
  textMode: boolean;
  noWsMode: boolean;
  fixTagName: boolean;
  [name: string]: any;
} = function() {
  return nj['taggedTmpl' + (nj.outputH ? 'H' : '')].apply(null, arguments);
};

nj.createElement = null;
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
