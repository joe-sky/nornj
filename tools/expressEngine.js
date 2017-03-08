'use strict';

const nj = require('../lib/base').default,
  includeParser = require('./includeParser'),
  fs = require('fs'),
  path = require('path');

nj.config({
  includeParser
});

module.exports = (configs = {}) => {
  let {
    extname = '.html',
    layoutsDir = 'layouts/',
    defaultLayout,
    bodyPlaceholder = 'body'
  } = configs;

  return (filePath, options, callback) => {
    let layout;
    if (defaultLayout != null) {
      layout = defaultLayout;
    }
    if (options && options.layout != null) {
      if (nj.isString(options.layout)) {
        layout = options.layout;
      } else if (options.layout === false) {
        layout = null;
      }
    }

    let viewsPath = options.settings && options.settings.views,
      _layoutsDir = layoutsDir;
    if (viewsPath) {
      _layoutsDir = path.join(viewsPath, layoutsDir);
    }

    let layoutFilePath = _layoutsDir + layout + extname,
      layoutTmpl;
    if (layout) {
      layoutTmpl = fs.readFileSync(layoutFilePath, 'utf-8');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        return callback(new Error(err));
      }

      let bodyHtml = nj.compile(content.toString(), { fileName: filePath })(options),
        html = null;
      if (layoutTmpl) {
        const layoutOpts = {};
        layoutOpts[bodyPlaceholder] = bodyHtml;

        html = nj.compile(layoutTmpl, { fileName: layoutFilePath })(layoutOpts, options);
      } else {
        html = bodyHtml;
      }

      return callback(null, html);
    });
  }
};