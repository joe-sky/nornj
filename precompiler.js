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

  var extension = param.extension;
  if (!extension) {
    extension = '.nj.js';
  }

  var esVersion = param.esVersion;
  if (!esVersion) {
    esVersion = 'es6';
  }

  //Clear the cache of string template
  nj.strTmpls = {};

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
      preTmpl = esVersion === 'es6' ? 'export default ' : 'module.exports = ',
      tmpl = require(file);  //Load original template

    //Get the "default" object converted from babel.
    if (tmpl.default) {
      tmpl = tmpl.default;
    }

    //Precompiling template
    preTmpl += JSON.stringify(precompile(tmpl));

    fs.writeFile(newName, preTmpl, function (err) {
      if (err) {
        throw err;
      }
    });
  });
};