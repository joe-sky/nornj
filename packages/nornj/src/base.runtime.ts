import nj from './core';
import './config.runtime';
import './utils/escape';

const { global: _global } = nj;
_global.NornJ = _global.nj = nj;

export { registerExtension } from './helpers/extension';
export { registerFilter } from './helpers/filter';
export { registerComponent } from './helpers/component';
export { compile, compileH, render, renderH } from './compiler/compile.runtime';
export default nj;
