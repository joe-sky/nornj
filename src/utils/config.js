'use strict';

var nj = require('../core'),
  tools = require('./tools');

module.exports = function (configs) {
  tools.assign(nj, configs);
};