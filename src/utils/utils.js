'use strict';

var tools = require('./tools'),
  checkElem = require('../checkElem/checkElem'),
  setComponentEngine = require('./setComponentEngine'),
  registerComponent = require('./registerComponent'),
  filter = require('./filter');

module.exports = tools.assign(
  {},
  checkElem,
  setComponentEngine,
  registerComponent,
  filter,
  tools
);