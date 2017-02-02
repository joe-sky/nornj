'use strict';

const nj = require('../core'),
  utils = require('../utils/utils'),
  buildRuntime = require('./buildRuntime'),
  compileStringTmpl = require('../parser/checkStringElem');

//编译模板并返回转换函数
function _createCompile(outputH) {
  return function(tmpl, tmplKey, fileName) {
    if (!tmpl) {
      return;
    }
    if (utils.isObject(tmplKey)) {
      var options = tmplKey;
      tmplKey = options.tmplKey;
      fileName = options.fileName;
    }

    //编译模板函数
    var tmplFns;
    if (tmplKey) {
      tmplFns = nj.templates[tmplKey];
    }
    if (!tmplFns) {
      var isObj = utils.isObject(tmpl),
        fns;
      if (isObj && tmpl.main) { //直接传入预编译模板
        fns = tmpl;
      } else { //编译AST
        var root;
        if (tmplKey) {
          root = nj.asts[tmplKey];
        }
        if (!root) {
          //Can be directly introduced into the AST
          if (isObj && tmpl.type === 'nj_root') {
            root = tmpl;
          } else {
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

            //分析传入参数并转换为节点树对象
            utils.checkElem(tmpl._njTmpl, root);
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

    if (tmpl._njParams) {
      const tmplFn = function() {
        return tmplFns.main.apply(this, utils.arrayPush([tmpl._njParams], arguments));
      };
      tmplFn._njTmpl = true;
      return tmplFn;
    } else {
      return tmplFns.main;
    }
  };
}

const compile = _createCompile(),
  compileH = _createCompile(true);

//Create template root object
function _createAstRoot() {
  var root = utils.obj();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//Precompile template
function precompile(tmpl, outputH) {
  var root = _createAstRoot();

  if (utils.isString(tmpl)) {
    tmpl = compileStringTmpl(tmpl);
  }
  utils.checkElem(tmpl._njTmpl, root);

  return buildRuntime(root.content, !outputH);
}

function _createRender(outputH) {
  return function(tmpl, options) {
    return (outputH ? compileH : compile)(tmpl, options ? {
      tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
      fileName: options.fileName
    } : tmpl._njTmplKey).apply(null, utils.arraySlice(arguments, 1));
  };
}

module.exports = {
  compile,
  compileH,
  precompile,
  render: _createRender(),
  renderH: _createRender(true)
};