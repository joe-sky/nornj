const nj = require('nornj/dist/nornj.common').default,
  includeParser = require('nornj/tools/includeParser'),
  njUtils = require('nornj/tools/utils'),
  loaderUtils = require('loader-utils');

function buildTmplFns(fns, tmplKey) {
  let ret = '{\n';
  ret += '  _njTmplKey: ' + tmplKey + ',\n';

  nj.each(fns, (v, k, i, l) => {
    if (k.indexOf('_') != 0) {
      ret += '  ' + k + ': ' + v.toString() + (i < l - 1 ? ',' : '') + '\n';
    }
  });

  return ret + '}';
}

function getCompileFnName(outputH) {
  return outputH ? 'compileH' : 'compile';
}

module.exports = function(source) {
  const options = loaderUtils.getOptions(this) || {},
    resourceOptions = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {};

  this.cacheable && this.cacheable();

  //Create delimiter rule of templates
  const { delimiters, fixTagName } = options;
  let tmplRule = nj.tmplRule;
  if (delimiters != null) {
    if (nj.isString(delimiters) && delimiters.toLowerCase() === 'react') {
      tmplRule = nj.createTmplRule({
        start: '{',
        end: '}',
        comment: ''
      });
    } else {
      tmplRule = nj.createTmplRule(delimiters);
    }
  }
  if (fixTagName != null) {
    nj.config({ fixTagName });
  }

  //Default conversion to compiled template functions
  let compiled = true;
  const raw = options.raw,
    rawR = resourceOptions.raw;
  if (raw) {
    compiled = false;
  }
  if (rawR) {
    compiled = rawR === 'false';
  }

  //Set configs for extension tags and filters
  if (options.extensionConfig) {
    const extensionConfig = {};
    let extensionConfigs = options.extensionConfig;
    if (!Array.isArray(extensionConfigs)) {
      extensionConfigs = [extensionConfigs];
    }

    nj.each(extensionConfigs, exConfig => {
      nj.each(exConfig, (v, k) => {
        extensionConfig[k] = {
          options: v
        };
      });
    });
    nj.registerExtension(extensionConfig);
  }
  if (options.filterConfig) {
    const filterConfig = {};
    let filterConfigs = options.filterConfig;
    if (!Array.isArray(filterConfigs)) {
      filterConfigs = [filterConfigs];
    }

    nj.each(filterConfigs, fConfig => {
      nj.each(fConfig, (v, k) => {
        filterConfig[k] = {
          options: v
        };
      });
    });
    nj.registerFilter(filterConfig);
  }

  //Parse the "include" and "template" block
  const tmpls = includeParser(source, this.resourcePath, tmplRule, true),
    tmplNames = Object.keys(tmpls);
  let output = '';

  //Precompiling template
  if (tmplNames.length == 1 && tmplNames[0] === 'main') {
    if (tmpls.main.trim().length > 0) {
      const tmplKey = njUtils.uniqueKey(tmpls.main);

      if (compiled) {
        output +=
          'nj.' +
          getCompileFnName(options.outputH) +
          '(' +
          buildTmplFns(nj.precompile(tmpls.main, options.outputH, tmplRule), tmplKey) +
          ');';
      } else {
        output += buildTmplFns(nj.precompile(tmpls.main, options.outputH, tmplRule), tmplKey) + ';';
      }
    }
  } else {
    //Output multiple templates
    let tmplsStr = '';
    nj.each(tmpls, (tmpl, name, i, l) => {
      if (tmpl.trim().length > 0) {
        const tmplKey = njUtils.uniqueKey(tmpl);
        tmplsStr += '  ' + name + ': ';

        if (compiled) {
          tmplsStr +=
            'nj.' +
            getCompileFnName(options.outputH) +
            '(' +
            buildTmplFns(nj.precompile(tmpl, options.outputH, tmplRule), tmplKey) +
            ')';
        } else {
          tmplsStr += buildTmplFns(nj.precompile(tmpl, options.outputH, tmplRule), tmplKey);
        }

        tmplsStr += (i < l - 1 ? ',' : '') + '\n';
      }
    });
    output += `{\n${tmplsStr}};`;
  }

  return '\'use strict\';\n\n' + (compiled ? 'var nj = require(\'nornj\');\n\n' : '') + `module.exports = ${output}`;
};
