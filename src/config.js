'use strict';

var nj = require('./core'),
  setTmplRule = require('./utils/setTmplRule');

module.exports = function (configs) {
  var delimiters = configs.delimiters,
    includeParser = configs.includeParser,
    createElement = configs.createElement;

  if(delimiters) {
    setTmplRule(delimiters);
  }

  if(includeParser) {
    nj.includeParser = includeParser;
  }

  if(createElement) {
    nj.createElement = createElement;
  }
};