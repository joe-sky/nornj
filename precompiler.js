'use strict';

var nj = require('./src/base'),
  precompile = nj.precompile,
  glob = require('glob'),
  fs = require('fs');

module.exports = function (param) {
  glob.sync(param.source).forEach(function (file) {
    var name = file.substr(0, file.lastIndexOf('.')),
		  newName = name.substr(0, name.lastIndexOf('.')) + '.js',
		  preTmpl,
      tmpl = require(name);  //Load original template

    preTmpl = param.esVersion === 'es6' ? 'export default ' : 'module.exports = ';
    preTmpl += JSON.stringify(precompile(tmpl));  //Precompile template

    fs.writeFile(newName, preTmpl, function (err) {
      if (err) {
        throw err;
      }
    });
  });
};