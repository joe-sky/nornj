import nj from '../core';
import { assign } from './tools';

const ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
};

const REGEX_ESCAPE = /[&><"']/g;
export function escape(str) {
  if (str == null) {
    return '';
  }
  else if(!str.replace) {
    return str;
  }

  return str.replace(REGEX_ESCAPE, match => ESCAPE_LOOKUP[match]);
}

const UNESCAPE_LOOKUP = {
  nbsp: '\u00A0',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwnj: '\u200C',
  zwj: '\u200D',
  lt: '<',
  gt: '>',
  amp: '&'
};

const REGEX_UNESCAPE = new RegExp('&(' + Object.keys(UNESCAPE_LOOKUP).join('|') + ');', 'g');
export function unescape(str) {
  return str.replace(REGEX_UNESCAPE, (all, match) => UNESCAPE_LOOKUP[match]);
}

assign(nj, {
  escape,
  unescape
});