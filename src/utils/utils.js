'use strict';

var tools = require('./tools'),
  transformElement = require('../transforms/transformElement'),
  transformParam = require('../transforms/transformParam'),
  transformData = require('../transforms/transformData'),
  escape = require('./escape'),
  checkElem = require('../parser/checkElem'),
  registerComponent = require('./registerComponent'),
  filter = require('../helpers/filter'),
  expression = require('../helpers/expression'),
  setTmplRule = require('./setTmplRule');

//Set default param rule
setTmplRule();

module.exports = tools.assign(
  {
    escape,
    setTmplRule
  },
  checkElem,
  registerComponent,
  filter,
  expression,
  tools,
  transformElement,
  transformParam,
  transformData
);