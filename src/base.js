import nj from './core';
import { assign } from './utils/tools';
import registerComponent from './utils/registerComponent';
import setTmplRule from './utils/setTmplRule';
import config from './config';

assign(nj, {
  registerComponent,
  setTmplRule,
  config
});

//Set default template rules
setTmplRule();

const _global = typeof self !== 'undefined' ? self : global;
_global.NornJ = _global.nj = nj;

export {
  isObject,
  isString,
  isArrayLike,
  each,
  trimRight,
  noop,
  toCamelCase,
  assign
} from './utils/tools';
export * from './helpers/extension';
export * from './helpers/filter';
export * from './compiler/compile';
export * from './utils/escape';
export * from './utils/tmplTag';
export {
  registerComponent,
  config
};
export default nj;