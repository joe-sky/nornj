import nj from './core';
import { assign } from './utils/tools';
import registerComponent, { getComponentConfig, copyComponentConfig } from './utils/registerComponent';
import createTmplRule from './utils/createTmplRule';
import config from './config';
import './utils/escape';

assign(nj, {
  registerComponent,
  getComponentConfig,
  copyComponentConfig,
  createTmplRule,
  config
});

const { global: _global } = nj;
_global.NornJ = _global.nj = nj;

export { registerExtension } from './helpers/extension';
export { registerFilter } from './helpers/filter';
export { compile, compileH, render, renderH } from './compiler/compile';
export { taggedTmpl, taggedTmplH, template, expression, css } from './utils/taggedTmpl';
export { registerComponent };
export default nj;
