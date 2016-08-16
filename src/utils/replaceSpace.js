'use strict';

var SPACE_SYMBOLS = {
  nbsp: '\u00A0',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwnj: '\u200C',
  zwj: '\u200D'
};

function replaceSpace(str) {
  return str.replace(/&(nbsp|ensp|emsp|thinsp|zwnj|zwj);/g, function (all, match) {
    return SPACE_SYMBOLS[match];
  });
}

module.exports = replaceSpace;