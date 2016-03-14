'use strict';

var tools = require('./tools'),
  transformElement = require('../transforms/transformElement'),
  transformParam = require('../transforms/transformParam'),
  transformData = require('../transforms/transformData'),
  escape = require('./escape'),
  checkElem = require('../checkElem/checkElem'),
  setComponentEngine = require('./setComponentEngine'),
  registerComponent = require('./registerComponent'),
  filter = require('./filter');

module.exports = tools.assign(
  { escape: escape },
  checkElem,
  setComponentEngine,
  registerComponent,
  filter,
  tools,
  transformElement,
  transformParam,
  transformData
);