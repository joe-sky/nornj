import nj from './core';
import { assign } from './utils/tools';
import registerComponent, { getComponentConfig } from './utils/registerComponent';
import config from './config.runtime';
import './utils/escape';

assign(nj, {
  registerComponent,
  getComponentConfig,
  config
});

const { global: _global } = nj;
_global.NornJ = _global.nj = nj;

export { registerExtension } from './helpers/extension';
export { registerFilter } from './helpers/filter';
export { compile, compileH, render, renderH } from './compiler/compile.runtime';
export { registerComponent };
export default nj;
