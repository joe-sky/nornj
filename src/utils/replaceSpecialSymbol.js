'use strict';

var SPACIAL_SYMBOLS = {
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

var REGEX_SYMBOLS = new RegExp('&(' + Object.keys(SPACIAL_SYMBOLS).join('|') + ');', 'g');
function replace(str) {
  return str.replace(REGEX_SYMBOLS, function (all, match) {
    return SPACIAL_SYMBOLS[match];
  });
}

module.exports = replace;