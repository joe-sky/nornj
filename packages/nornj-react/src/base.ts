import njr from './core';
import nj from 'nornj';
import React from 'react';
import { bindTemplate } from './bindTemplate';
import './extension/debounce';

nj.assign(njr, {
  bindTemplate,
  registerTmpl: bindTemplate
});

//Set createElement function for NornJ
nj.config({
  createElement: React.createElement,
  outputH: true,
  delimiters: {
    start: '{',
    end: '}',
    comment: ''
  }
});

const _defaultCfg = { hasEventObject: true },
  componentConfig = nj.componentConfig;
componentConfig.set('input', _defaultCfg);
componentConfig.set('select', _defaultCfg);
componentConfig.set('textarea', _defaultCfg);

const { global: _global } = nj;
_global.NornJReact = _global.njr = njr;

export { bindTemplate, bindTemplate as registerTmpl };
export default njr;
