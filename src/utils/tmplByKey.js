'use strict';

var checkStringElem = require('../parser/checkStringElem');

module.exports = function (key) {
  return function() {
    return checkStringElem.apply({ tmplKey: key }, arguments);
  };
};