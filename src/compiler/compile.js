'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  buildRuntime = require('./buildRuntime'),
  compileStringTmpl = require('../checkElem/checkStringElem');

//编译模板并返回转换函数
function compile(tmpl, tmplName, isComponent, fileName) {
  if (!tmpl) {
    return;
  }
  if (utils.isObject(tmplName)) {
    var params = tmplName;
    tmplName = params.tmplName;
    isComponent = params.isComponent;
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

          //分析传入参数并转换为节点树对象
          utils.checkElem(tmpl, root);
        }

        //保存模板AST编译结果到全局集合中
        if (tmplName) {
          nj.asts[tmplName] = root;
        }
      }

      fns = buildRuntime(root.content, !isComponent);
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
function compileComponent(tmpl, tmplName) {
  return compile(tmpl, tmplName, true);
}

//渲染内联标签组件
function renderTagComponent(data, selector, isAuto) {
  var tags = utils.getTagComponents(selector, isAuto),
    ret = [];

  utils.each(tags, function (tag) {
    var tmpl = compileComponent(tag.innerHTML, tag.id),
      parentNode = tag.parentNode;

    if (nj.componentLib === 'inferno') {
      utils.removeChildNode(parentNode);
    }
    ret.push(nj.componentRender(tmpl(data), parentNode));
  }, false, true);

  return ret;
}

//Set init data for inline component
function setInitTagData(data) {
  nj.initTagData = data;
}

//Precompile template
function precompile(tmpl, isComponent) {
  var root = _createAstRoot();

  if (utils.isString(tmpl)) {
    tmpl = compileStringTmpl(tmpl);
  }
  utils.checkElem(tmpl, root);

  return buildRuntime(root.content, !isComponent);
}

module.exports = {
  compile: compile,
  compileComponent: compileComponent,
  renderTagComponent: renderTagComponent,
  setInitTagData: setInitTagData,
  precompile: precompile
};