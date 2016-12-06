'use strict';

const nj = require('../src/base'),
  includeParser = require('./includeParser'),
  fs = require('fs');

nj.config({
  includeParser
});

module.exports = (configs) => {
  return (filePath, options, callback) => {
    fs.readFile(filePath, function (err, content) {
      if (err) {
        return callback(new Error(err));
      }
      return callback(null, nj.compile(content.toString(), { fileName: filePath })(options));
    });
  }
};