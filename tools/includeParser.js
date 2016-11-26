'use strict';

var nj = require('../src/base'),
  fs = require('fs'),
  path = require('path'),
  tmplRule = nj.tmplRule;

function getIncludeTmpl(tmplString, fileName, tmplStrs, tmplName) {
  //解析template块
  if (!tmplStrs) {
    tmplStrs = {};
    var pattern = new RegExp('<' + tmplRule.template + '([^>]*)>([\\s\\S]*?)</' + tmplRule.template + '>', 'ig'),
      matchArr, hasTemplate;

    while (matchArr = pattern.exec(tmplString)) {
      var props = nj.getOpenTagParams(matchArr[1]),
        name = 'main';

      props && props.forEach(function (prop) {
        if (prop.key === 'name') {
          name = prop.value;
        }
      });

      tmplStrs[name] = matchArr[2];
      hasTemplate = true;
    }

    if (!hasTemplate) {
      tmplStrs.main = tmplString;
    }
  }

  //解析include块
  return tmplStrs[tmplName == null ? 'main' : tmplName].replace(tmplRule.include(), function (all, params) {
    var props = nj.getOpenTagParams(params),
      src, name;

    props.forEach(function (prop) {
      switch (prop.key) {
        case 'src':
          src = prop.value;
          break;
        case 'name':
          name = prop.value;
          break;
      }
    });

    if (src != null) {  //读取其他文件中的模板
      var basePath = path.dirname(fileName),
        targetFileName = path.resolve(basePath, src),
        targetTmplString = fs.readFileSync(targetFileName, 'utf-8');

      return getIncludeTmpl(targetTmplString, targetFileName, null, name);
    }
    else {  //读取当前文件中的模板
      return getIncludeTmpl(null, fileName, tmplStrs, name);
    }
  });
}

module.exports = getIncludeTmpl;