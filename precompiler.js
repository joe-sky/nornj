'use strict';

var nj = require('./src/base'),
  precompile = nj.precompile,
  glob = require('glob'),
  fs = require('fs');

function checkExtension(fileName, extension) {
  return (fileName.length - fileName.lastIndexOf(extension)) === extension.length;
}

function buildTmplFns(fns) {
  var ret = '{\n';
  nj.each(fns, function(v, k, i, l) {
    if(k.indexOf('_') != 0) {
      ret += '  ' + k + ': ' + v.toString() + (i < l - 1 ? ',' : '') + '\n';
    }
  });
  return ret + '}';
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
    exprRule = param.exprRule || '#',
    output = param.output || 'component';  //component, string

  //Clear the cache of string template
  nj.strTmpls = {};

  //Set template rules
  nj.setTmplRule(beginRule, endRule, exprRule);

  //Set configs for expressions and filters
  if(param.exprConfig) {
    var exprConfig = {};
    nj.each(param.exprConfig, function(v, k) {
      exprConfig[k] = {
        options: v
      };
    });

    nj.registerExpr(exprConfig);
  }
  if(param.filterConfig) {
    var filterConfig = {};
    nj.each(param.filterConfig, function(v, k) {
      filterConfig[k] = {
        options: v
      };
    });

    nj.registerFilter(filterConfig);
  }

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
      preTmpl = esVersion === 'es6' ? 'const tmpl = ' : 'module.exports = ';

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
      var outputComponent = output === 'component';
      if (Array.isArray(tmpl)) {
        preTmpl += buildTmplFns(precompile(tmpl, outputComponent)) + ';';
      }
      else {  //Export multiple templates
        var tmpls = '';
        nj.each(tmpl, function(v, k, i, l) {
          tmpls += '  ' + k + ': ' + buildTmplFns(precompile(v, outputComponent)) + (i < l - 1 ? ',' : '') + '\n';
        });
        preTmpl += '{\n' + tmpls + '};';
      }
      preTmpl += '\nexport default tmpl;'
    }

    fs.writeFile(newName, preTmpl, function (err) {
      if (err) {
        throw err;
      }
    });
  });
};