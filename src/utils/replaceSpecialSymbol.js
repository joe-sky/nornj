'use strict';

var SPACIAL_SYMBOLS = {
  nbsp: '\u00A0',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwnj: '\u200C',
  zwj: '\u200D',
  lt: '<',
  gt: '>'
};

function replace(str) {
  return str.replace(/&(nbsp|ensp|emsp|thinsp|zwnj|zwj|lt|gt);/g, function (all, match) {
    return SPACIAL_SYMBOLS[match];
  });
}

module.exports = replace;