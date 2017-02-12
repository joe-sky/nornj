import compileStringTmpl from '../parser/checkStringElem';

export function tmplTag() {
  return compileStringTmpl.apply({ outputH: false }, arguments);
}

export function tmplTagH() {
  return compileStringTmpl.apply({ outputH: true }, arguments);
}