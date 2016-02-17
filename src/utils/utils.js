'use strict';

var checkElem = require('../checkElem/checkElem'),
    tools = require('./tools'),
    registerComponent = require('./registerComponent'),
    filter = require('./filter');

var utils = {
    checkElem: checkElem.checkElem,
    checkTagElem: checkElem.checkTagElem,
    setComponentEngine: require('./setComponentEngine'),
    registerComponent: registerComponent.registerComponent,
    registerTagNamespace: registerComponent.registerTagNamespace,
    createTagNamespace: registerComponent.createTagNamespace,
    registerFilter: filter.registerFilter
};
tools.assign(utils, tools);

module.exports = utils;