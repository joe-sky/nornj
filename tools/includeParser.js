'use strict';

var nj = require('../src/base'),
  fs = require('fs'),
  path = require('path'),
  tmplRule = nj.tmplRule;

function getIncludeTmpl(tmplString, fileName) {
  return tmplString.replace(tmplRule.include(), function(all, params) {
    var props = nj.getOpenTagParams(params),
      src;

    props.forEach(function(prop) {
      if(prop.key === 'src') {
        src = prop.value;
      }
    });

    var basePath = path.dirname(fileName),
      targetFileName = path.resolve(basePath, src),
      targetTmplString = fs.readFileSync(targetFileName, 'utf-8');

    return getIncludeTmpl(targetTmplString, targetFileName);
  });
}

module.exports = getIncludeTmpl;