'use strict';

var compileStringTmpl = require('../parser/checkStringElem');

module.exports = {
  tmplTag: function() {
    return compileStringTmpl.apply({ outputH: false }, arguments);
  },
  tmplTagH: function() {
    return compileStringTmpl.apply({ outputH: true }, arguments);
  }
};