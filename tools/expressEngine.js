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
    extname = '.html', layoutsDir = 'views/layouts/', defaultLayout
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

    const viewsPath = options.settings && options.settings.views;
    if (viewsPath) {
      layoutsDir = path.join(viewsPath, 'layouts/');
    }

    let layoutHtml;
    if (layout) {
      layoutHtml = fs.readFileSync(layoutsDir + layout + extname, 'utf-8');
    }

    fs.readFile(filePath, function(err, content) {
      if (err) {
        return callback(new Error(err));
      }

      let bodyHtml = nj.compile(content.toString(), { fileName: filePath })(options),
        html = null;
      if (layoutHtml) {
        html = nj.compile(layoutHtml, { fileName: filePath })(Object.assign(options, { body: bodyHtml }));
      } else {
        html = bodyHtml;
      }

      return callback(null, html);
    });
  }
};