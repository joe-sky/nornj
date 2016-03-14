'use strict';

var ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
},
ESCAPE_REGEX = /[&><"']/g;

function escape(text) {
  if (text == null) {
    return;
  }

  return ('' + text).replace(ESCAPE_REGEX, function (match) {
    return ESCAPE_LOOKUP[match];
  });
}

module.exports = escape;