import nj from './core';
import { assign } from './utils/tools';
import { ConfigOption } from './interface';

export function config(configs: ConfigOption): void {
  const { createElement, outputH } = configs;

  if (createElement) {
    nj.createElement = createElement;
  }

  if (outputH != null) {
    nj.outputH = outputH;
  }
}

assign(nj, {
  config
});
