import nj from './core';
import { assign } from './utils/tools';
import registerComponent from './utils/registerComponent';
import createTmplRule from './utils/createTmplRule';
import config from './config';

assign(nj, {
  registerComponent,
  createTmplRule,
  config
});

const _global = typeof self !== 'undefined' ? self : global;
_global.NornJ = _global.nj = nj;

export {
  registerExpr,
  registerExtension
} from './helpers/extension';
export { registerFilter } from './helpers/filter';
export * from './compiler/compile';
export { escape } from './utils/escape';
export * from './utils/tmplTag';
export {
  registerComponent,
  config
};
export default nj;