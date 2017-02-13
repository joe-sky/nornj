'use strict';

const nj = require('../lib/base').default,
  { getOpenTagParams } = require('../lib/transforms/transformElement'),
  fs = require('fs'),
  path = require('path'),
  tmplRule = nj.tmplRule;

function getIncludeTmpl(tmplString, fileName, isAll, tmplStrs, tmplName) {
  //解析template块
  if (!tmplStrs) {
    tmplStrs = {};
    let templateRule = tmplRule.templateRule.replace(/\$/g, '\\$'),
      pattern = new RegExp('<' + templateRule + '([^>]*)>([\\s\\S]*?)</' + templateRule + '>', 'ig'),
      matchArr, hasTemplate;

    while (matchArr = pattern.exec(tmplString)) {
      let props = getOpenTagParams(matchArr[1]),
        name = 'main',
        isLocal = false;

      props && props.forEach(function (prop) {
        switch (prop.key) {
          case 'name':
            name = prop.value;
            break;
          case 'local':
            isLocal = true;
            break;
        }
      });

      tmplStrs[name] = {
        tmplStr: matchArr[2],
        isLocal: isLocal
      };
      hasTemplate = true;
    }

    if (!hasTemplate) {
      tmplStrs.main = { tmplStr: tmplString };
    }
  }

  let tmplStrList = [],
    ret;
  if (!isAll) {
    const tName = tmplName == null ? 'main' : tmplName;
    tmplStrList.push({ name: tName, tmpl: tmplStrs[tName].tmplStr });
  }
  else {  //按各子模板生成对象结构
    Object.keys(tmplStrs).forEach(function (tName) {
      const _tmplStr = tmplStrs[tName];
      if(!_tmplStr.isLocal) {
        tmplStrList.push({ name: tName, tmpl: _tmplStr.tmplStr });
      }
    });

    ret = {};
  }

  tmplStrList.forEach(function (obj) {
    //解析include块
    const _ret = obj.tmpl.replace(tmplRule.include, function (all, params) {
      let props = getOpenTagParams(params),
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
        const basePath = path.dirname(fileName),
          targetFileName = path.resolve(basePath, src),
          targetTmplString = fs.readFileSync(targetFileName, 'utf-8');

        return getIncludeTmpl(targetTmplString, targetFileName, false, null, name);
      }
      else {  //读取当前文件中的模板
        return getIncludeTmpl(null, fileName, false, tmplStrs, name);
      }
    });

    if (!isAll) {
      ret = _ret;
    }
    else {
      ret[obj.name] = _ret;
    }
  });

  return ret;
}

module.exports = getIncludeTmpl;