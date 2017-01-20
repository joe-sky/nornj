'use strict';

function uniqueKey(str, hash) {
  var len = str.length;
  if (len == 0) {
    return str;
  }
  if (hash == null) {
    hash = 0;
  }

  var i, chr;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  return hash;
}

module.exports = {
  uniqueKey
};