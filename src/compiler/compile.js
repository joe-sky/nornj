'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  tranString = require('./transformToString'),
  tranComponent = require('./transformToComponent'),
  compileStringTmpl = require('../checkElem/checkStringElem');

//编译模板并返回转换函数
function compile(obj, tmplName, isComponent, isTag) {
  if (!obj) {
    return;
  }

  //编译AST
  var root;
  if (tmplName) {
    root = nj.asts[tmplName];
  }
  if (!root) {
    //If obj is Object,we think obj is a precompiled template
    if (utils.isObject(obj) && obj.type === 'nj_root') {
      root = obj;
    }
    else {
      root = _createAstRoot();

      //Auto transform string template to array
      if (utils.isString(obj)) {
        obj = compileStringTmpl(obj);
      }

      //分析传入参数并转换为节点树对象
      if (isTag) {
        utils.checkTagElem(obj, root);
      }
      else {
        utils.checkElem(obj, root);
      }
    }

    //保存模板AST编译结果到全局集合中
    if (tmplName) {
      nj.asts[tmplName] = root;
    }
  }

  //编译模板函数
  var tmplFn;
  if (tmplName) {
    tmplFn = nj.templates[tmplName];
  }
  if (!tmplFn) {
    var tmplFns;
    if (isComponent) {
      tmplFns = tranComponent(root);
    }
    else {
      tmplFns = tranString(root);
    }
    tmplFn = utils.template(tmplFns);

    //保存模板函数编译结果到全局集合中
    if (tmplName) {
      nj.templates[tmplName] = tmplFn;
    }
  }

  return tmplFn;
}

//Create template root object
function _createAstRoot() {
  var root = utils.lightObj();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//编译字面量并返回组件转换函数
function compileComponent(obj, tmplName) {
  return compile(obj, tmplName, true);
}

//编译标签并返回组件转换函数
function compileTagComponent(obj, tmplName) {
  return compile(obj, tmplName, true, true);
}

//渲染标签组件
function renderTagComponent(data, selector) {
  var tags = utils.getTagComponents(selector),
    ret = [];

  utils.each(tags, function (tag) {
    var tmpl = compileTagComponent(tag, tag.getAttribute(nj.tagId)),
      parentNode = tag.parentNode;

    if (nj.componentLib === 'inferno') {
      utils.removeChildNode(parentNode);
    }
    ret.push(nj.componentRender(tmpl(data), parentNode));
  }, false, true);

  return ret;
}

//Precompile template
function precompile(obj) {
  var root = _createAstRoot();
  utils.checkElem(obj, root);

  return root;
}

//Render tmpl expression block
var _renderTmplExpr = compileComponent(['<{container}>', '{tmpl}'], 'tmplExpr');
function renderTmplExpr(tmpl, data, container) {
  if (!container) {
    container = 'div';
  }

  var extra = { tmpl: tmpl, container: container },
    datas;

  if (utils.isArray(data)) {
    datas = data;
    datas[datas.length] = extra;
  }
  else {
    datas = [data, extra];
  }

  return _renderTmplExpr(datas);
}

module.exports = {
  compile: compile,
  compileComponent: compileComponent,
  compileTagComponent: compileTagComponent,
  renderTagComponent: renderTagComponent,
  precompile: precompile,
  renderTmplExpr: renderTmplExpr
};