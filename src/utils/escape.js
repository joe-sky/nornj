'use strict';

var ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
},
ESCAPE_REGEX = /[&><"']/g,
ESCAPE_LOOKUP_BRACKETS = {
  '(': '\\(',
  ')': '\\)'
},
ESCAPE_REGEX_BRACKETS = /[()]/g;

function _escape(regex, lookup) {
  return function (text) {
    if (text == null) {
      return;
    }

    return ('' + text).replace(regex, function (match) {
      return lookup[match];
    });
  };
}

module.exports = {
  escape: _escape(ESCAPE_REGEX, ESCAPE_LOOKUP),
  escapeBrackets: _escape(ESCAPE_REGEX_BRACKETS, ESCAPE_LOOKUP_BRACKETS)
};