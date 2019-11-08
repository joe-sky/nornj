import nj from '../core';
import { assign } from '../utils/tools';
import { compileStringTmpl } from '../parser/checkStringElem';
import { createTmplRule } from '../utils/createTmplRule';

export function createTaggedTmpl(opts: any = {}) {
  const { outputH, delimiters, fileName, isExpression, isCss } = opts;
  const tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;

  return function() {
    return compileStringTmpl.apply({ tmplRule, outputH, fileName, isExpression, isCss }, arguments);
  };
}

export function createTaggedTmplH(opts: any = {}) {
  opts.outputH = true;
  return createTaggedTmpl(opts);
}

export const taggedTmpl = createTaggedTmpl();
export const taggedTmplH = createTaggedTmplH();
export function template() {
  return (nj.outputH ? taggedTmplH : taggedTmpl).apply(null, arguments)();
}

const _taggedExpressionH = createTaggedTmplH({ isExpression: true });
export function expression() {
  return _taggedExpressionH.apply(null, arguments)();
}

const _taggedCssH = createTaggedTmplH({ isCss: true });
export function css() {
  return _taggedCssH.apply(null, arguments)();
}

assign(nj, {
  createTaggedTmpl,
  createTaggedTmplH,
  taggedTmpl,
  htmlString: taggedTmpl,
  taggedTmplH,
  html: taggedTmplH,
  template,
  expression,
  css
});
