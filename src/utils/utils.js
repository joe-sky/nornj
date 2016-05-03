'use strict';

var tools = require('./tools'),
  transformElement = require('../transforms/transformElement'),
  transformParam = require('../transforms/transformParam'),
  transformData = require('../transforms/transformData'),
  escape = require('./escape'),
  checkElem = require('../checkElem/checkElem'),
  setComponentEngine = require('./setComponentEngine'),
  registerComponent = require('./registerComponent'),
  filter = require('./filter'),
  expression = require('./expression'),
  setTmplRule = require('./setTmplRule');

//Set default param rule
setTmplRule();

module.exports = tools.assign(
  { 
    escape: escape,
    setTmplRule: setTmplRule
  },
  checkElem,
  setComponentEngine,
  registerComponent,
  filter,
  expression,
  tools,
  transformElement,
  transformParam,
  transformData
);