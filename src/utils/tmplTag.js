import nj from '../core';
import { assign } from '../utils/tools';
import compileStringTmpl from '../parser/checkStringElem';
import createTmplRule from '../utils/createTmplRule';

export function createTmplTag(opts) {
  const { outputH, delimiters } = opts;
  const tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;

  return function() {
    return compileStringTmpl.apply({ tmplRule, outputH }, arguments);
  }
}

export const tmplTag = createTmplTag({ outputH: false });
export const tmplTagH = createTmplTag({ outputH: true });

assign(nj, {
  createTmplTag,
  tmplTag,
  tmplTagH
});