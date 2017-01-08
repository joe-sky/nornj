'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  buildRuntime = require('./buildRuntime'),
  compileStringTmpl = require('../parser/checkStringElem');

//编译模板并返回转换函数
function compile(tmpl, tmplName, outputH, fileName) {
  if (!tmpl) {
    return;
  }
  if (utils.isObject(tmplName)) {
    var params = tmplName;
    tmplName = params.tmplName;
    outputH = params.outputH;
    fileName = params.fileName;
  }

  //编译模板函数
  var tmplFns;
  if (tmplName) {
    tmplFns = nj.templates[tmplName];
  }
  if (!tmplFns) {
    var isObj = utils.isObject(tmpl), fns;
    if (isObj && tmpl.main) {  //直接传入预编译模板
      fns = tmpl;
    }
    else {  //编译AST
      var root;
      if (tmplName) {
        root = nj.asts[tmplName];
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
        if (tmplName) {
          nj.asts[tmplName] = root;
        }
      }

      fns = buildRuntime(root.content, !outputH);
    }

    tmplFns = utils.template(fns);

    //保存模板函数编译结果到全局集合中
    if (tmplName) {
      nj.templates[tmplName] = tmplFns;
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
function compileH(tmpl, tmplName) {
  return compile(tmpl, tmplName, true);
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

module.exports = {
  compile: compile,
  compileH: compileH,
  precompile: precompile
};