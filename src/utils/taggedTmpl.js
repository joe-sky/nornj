import nj from '../core';
import { assign } from '../utils/tools';
import compileStringTmpl from '../parser/checkStringElem';
import createTmplRule from '../utils/createTmplRule';

export function createTaggedTmpl(opts = {}) {
  const { outputH, delimiters, fileName, isMustache, isCss } = opts;
  const tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;

  return function () {
    return compileStringTmpl.apply({ tmplRule, outputH, fileName, isMustache, isCss }, arguments);
  };
}

export function createTaggedTmplH(opts = {}) {
  opts.outputH = true;
  return createTaggedTmpl(opts);
}

export const taggedTmpl = createTaggedTmpl();
export const taggedTmplH = createTaggedTmplH();
export function template() {
  return (nj.outputH ? taggedTmplH : taggedTmpl).apply(null, arguments)();
}

const _taggedMustache = createTaggedTmpl({ isMustache: true });
const _taggedMustacheH = createTaggedTmplH({ isMustache: true });
export function mustache() {
  return (nj.outputH ? _taggedMustacheH : _taggedMustache).apply(null, arguments)();
}

const _taggedCssH = createTaggedTmplH({ isCss: true });
export function css() {
  return _taggedCssH.apply(null, arguments)();
}

assign(nj, {
  createTaggedTmpl,
  createTaggedTmplH,
  taggedTmpl,
  taggedTmplH,
  template,
  mustache,
  expression: mustache,
  css
});