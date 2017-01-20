'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  buildRuntime = require('./buildRuntime'),
  compileStringTmpl = require('../parser/checkStringElem');

//编译模板并返回转换函数
function compile(tmpl, tmplKey, outputH, fileName) {
  if (!tmpl) {
    return;
  }
  if (utils.isObject(tmplKey)) {
    var params = tmplKey;
    tmplKey = params.tmplKey;
    outputH = params.outputH;
    fileName = params.fileName;
  }

  //编译模板函数
  var tmplFns;
  if (tmplKey) {
    tmplFns = nj.templates[tmplKey];
  }
  if (!tmplFns) {
    var isObj = utils.isObject(tmpl), fns;
    if (isObj && tmpl.main) {  //直接传入预编译模板
      fns = tmpl;
    }
    else {  //编译AST
      var root;
      if (tmplKey) {
        root = nj.asts[tmplKey];
      }
      if (!root) {
        //Can be directly introduced into the AST
        if (isObj && tmpl.type === 'nj_root') {
          root = tmpl;
        }
        else {
          root = _createAstRoot();

          //Auto transform string template to array
          if (utils.isString(tmpl)) {
            //Merge all include blocks
            var includeParser = nj.includeParser;
            if (includeParser) {
              tmpl = includeParser(tmpl, fileName);
            }

            tmpl = compileStringTmpl(tmpl);
          }
          tmpl = tmpl._njTmpl;

          //分析传入参数并转换为节点树对象
          utils.checkElem(tmpl, root);
        }

        //保存模板AST编译结果到全局集合中
        if (tmplKey) {
          nj.asts[tmplKey] = root;
        }
      }

      fns = buildRuntime(root.content, !outputH);
    }

    tmplFns = utils.template(fns);

    //保存模板函数编译结果到全局集合中
    if (tmplKey) {
      nj.templates[tmplKey] = tmplFns;
    }
  }

  return tmplFns.main;
}

//Create template root object
function _createAstRoot() {
  var root = utils.lightObj();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//编译字面量并返回组件转换函数
function compileH(tmpl, tmplKey) {
  return compile(tmpl, tmplKey, true);
}

//Precompile template
function precompile(tmpl, outputH) {
  var root = _createAstRoot();

  if (utils.isString(tmpl)) {
    tmpl = compileStringTmpl(tmpl);
  }
  tmpl = tmpl._njTmpl;
  utils.checkElem(tmpl, root);

  return buildRuntime(root.content, !outputH);
}

function _createRender(outputH) {
  return function(tmpl) {
    return (outputH ? compileH : compile)(tmpl, tmpl._njKey ? tmpl._njKey : tmpl).apply(null, utils.arraySlice(arguments, 1));
  };
}

module.exports = {
  compile,
  compileH,
  precompile,
  render: _createRender(),
  renderH: _createRender(true)
};