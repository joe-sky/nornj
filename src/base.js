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
  defineProp,
  defineProps,
  arrayPush,
  arraySlice,
  isArray,
  isObject,
  isString,
  isArrayLike,
  each,
  noop,
  obj,
  toCamelCase,
  assign
} from './utils/tools';
export * from './helpers/expression';
export * from './helpers/filter';
export * from './compiler/compile';
export * from './utils/escape';
export * from './utils/tmplTag';
export {
  registerComponent,
  setTmplRule,
  config
};
export default nj;