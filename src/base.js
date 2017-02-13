import nj from './core';
import { assign } from './utils/tools';
import escape from './utils/escape';
import registerComponent from './utils/registerComponent';
import replaceSpecialSymbol from './utils/replaceSpecialSymbol';
import setTmplRule from './utils/setTmplRule';
import config from './config';

assign(nj, {
  escape,
  registerComponent,
  replaceSpecialSymbol,
  setTmplRule,
  config
});

//Set default template rules
setTmplRule();

const _global = typeof self !== 'undefined' ? self : global;
_global.NornJ = _global.nj = nj;

export * from './utils/tools';
export * from './helpers/expression';
export * from './helpers/filter';
export * from './compiler/compile';
export * from './utils/tmplTag';
export {
  escape,
  registerComponent,
  replaceSpecialSymbol,
  setTmplRule,
  config
};
export default nj;