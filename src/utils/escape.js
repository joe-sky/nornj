'use strict';

var ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
};

function escape(text) {
  if (text == null) {
    return '';
  }
  else if(!text.replace) {
    return text;
  }

  return text.replace(/[&><"']/g, function (match) {
    return ESCAPE_LOOKUP[match];
  });
}

module.exports = escape;