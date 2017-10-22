import nj from '../core';
import { assign } from '../utils/tools';
import compileStringTmpl from '../parser/checkStringElem';
import createTmplRule from '../utils/createTmplRule';

export function createTaggedTmpl(opts = {}) {
  const { outputH, delimiters } = opts;
  const tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;

  return function() {
    return compileStringTmpl.apply({ tmplRule, outputH }, arguments);
  };
}

export const taggedTmpl = createTaggedTmpl({ outputH: false });
export const taggedTmplH = createTaggedTmpl({ outputH: true });

assign(nj, {
  createTaggedTmpl,
  taggedTmpl,
  taggedTmplH
});