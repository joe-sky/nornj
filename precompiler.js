'use strict';

var nj = require('./src/base'),
  precompile = nj.precompile,
  glob = require('glob'),
  fs = require('fs');

function checkExtension(filePath, extension) {
  return (filePath.length - filePath.lastIndexOf(extension)) === extension.length;
}

module.exports = function (param) {
  var sources = param.source;
  if (!Array.isArray(sources)) {
    sources = [param.source];
  }

  //Only transform the files with specific extensions
  var extension = param.extension;
  if (!extension) {
    extension = '.nj.js';
  }

  var needTransformFiles = [];
  sources.forEach(function (source) {
    glob.sync(source, param.options).forEach(function (file) {
      if (checkExtension(file, extension)) {
        needTransformFiles.push(file);
      }

      //First clear the module cache
      delete require.cache[require.resolve(file)];
    });
  });

  needTransformFiles.forEach(function (file) {
    var name = file.substr(0, file.lastIndexOf('.')),
      newName = name.substr(0, name.lastIndexOf('.')) + '.js',
      preTmpl = param.esVersion === 'es6' ? 'export default ' : 'module.exports = ',
      tmpl = require(name);  //Load original template

    //Precompile template
    preTmpl += JSON.stringify(precompile(tmpl));

    fs.writeFile(newName, preTmpl, function (err) {
      if (err) {
        throw err;
      }
    });
  });
};