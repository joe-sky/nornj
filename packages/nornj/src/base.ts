import nj from './core';
import './utils/createTmplRule';
import './config';
import './utils/escape';

const { global: _global } = nj;
_global.NornJ = _global.nj = nj;

export { registerExtension } from './helpers/extension';
export { registerFilter } from './helpers/filter';
export { registerComponent } from './helpers/component';
export { compile, compileH, render, renderH } from './compiler/compile';
export {
  taggedTmpl,
  taggedTmpl as htmlString,
  taggedTmplH,
  taggedTmplH as html,
  template,
  expression,
  css
} from './utils/taggedTmpl';
export default nj;
