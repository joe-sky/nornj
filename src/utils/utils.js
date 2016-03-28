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
  setParamRule = require('./setParamRule');

//Set default param rule
setParamRule();

module.exports = tools.assign(
  { 
    escape: escape,
    setParamRule: setParamRule
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