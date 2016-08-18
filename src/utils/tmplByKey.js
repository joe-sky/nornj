'use strict';

var checkStringElem = require('../checkElem/checkStringElem');

module.exports = function (key) {
  return function() {
    return checkStringElem.apply({ tmplKey: key }, arguments);
  };
};