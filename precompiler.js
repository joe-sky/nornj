'use strict';

var nj = require('./src/base'),
  precompile = nj.precompile,
  glob = require('glob'),
  fs = require('fs');

function checkExtension(fileName, extension) {
  return (fileName.length - fileName.lastIndexOf(extension)) === extension.length;
}

module.exports = function (param) {
  var sources = param.source;
  if (!Array.isArray(sources)) {
    sources = [param.source];
  }

  var extension = param.extension || '.nj.js',
    esVersion = param.esVersion || 'es6',
    beginRule = param.beginRule || '{',
    endRule = param.endRule || '}',
    exprRule = param.exprRule || '$';

  //Clear the cache of string template
  nj.strTmpls = {};

  //Set template rules
  nj.setTmplRule(beginRule, endRule, exprRule);

  var needTransformFiles = [];
  sources.forEach(function (source) {
    glob.sync(source, param.options).forEach(function (file) {
      //Convert to absolute path
      var fileName = require.resolve(file);

      //Only transform the files with specific extensions
      if (checkExtension(file, extension)) {
        needTransformFiles.push(fileName);
      }

      //First clear the module cache
      delete require.cache[fileName];
    });
  });

  needTransformFiles.forEach(function (file) {
    var newName = file.substr(0, file.lastIndexOf(extension)) + '.js',
      preTmpl = esVersion === 'es6' ? 'exports default ' : 'module.exports = ';

    if (param.devMode) {  //Direct return the original template in development mode.
      if (esVersion === 'es6') {
        preTmpl = 'import tmpl from ';
      }
      else {
        preTmpl += 'require(';
      }

      preTmpl += '\'./' + file.substr(file.lastIndexOf('\\') + 1) + '\'' + (esVersion === 'es6' ? ';\nexport default tmpl;' : ');');
    }
    else {
      //Load original template
      var tmpl = require(file);

      //Get the "default" object converted from babel.
      if (tmpl.default) {
        tmpl = tmpl.default;
      }

      //Precompiling template
      if (Array.isArray(tmpl)) {
        preTmpl += JSON.stringify(precompile(tmpl)) + ';';
      }
      else {  //Export multiple templates
        var tmpls = '';
        nj.each(tmpl, function(v, k) {
          tmpls += ', ' + k + ': ' + JSON.stringify(precompile(v));
        });
        preTmpl += '{ ' + tmpls.substr(2) + ' };';
      }
    }

    fs.writeFile(newName, preTmpl, function (err) {
      if (err) {
        throw err;
      }
    });
  });
};