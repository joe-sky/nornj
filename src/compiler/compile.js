'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  tranString = require('./transformToString'),
  tranComponent = require('./transformToComponent');

//编译字面量并返回转换函数
function compile(obj, tmplName, isComponent, isTag) {
  if (!obj) {
    return;
  }

  var root;
  if (tmplName) {
    root = nj.templates[tmplName];
  }
  if (!root) {
    if (utils.isObject(obj) && obj.type === 'nj_root') {  //If obj is Object,we think obj is a precompiled template.
      root = obj;
    }
    else {
      root = utils.lightObj();
      root.type = 'nj_root';
      root.content = [];

      //分析传入参数并转换为节点树对象
      if (isTag) {
        utils.checkTagElem(obj, root);
      }
      else {
        utils.checkElem(obj, root);
      }
    }

    //保存模板编译结果到全局集合中
    if (tmplName) {
      nj.templates[tmplName] = root;
    }
  }

  return function (data) {
    if (!data) {
      data = {};
    }

    return !isComponent
      ? tranString.transformContentToString(root.content, data)     //转换字符串
      : tranComponent.transformToComponent(root.content[0], data);  //转换组件
  };
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
function renderTagComponent(data, el) {
  var tags = utils.getTagComponents(el),
    ret = [];

  utils.each(tags, function (tag) {
    var tmpl = compileTagComponent(tag, tag.getAttribute(nj.tagId));
    ret.push(nj.componentLibDom[nj.componentRender](tmpl(data), tag.parentNode));
  }, false, true);

  return ret;
}

module.exports = {
  compile: compile,
  compileComponent: compileComponent,
  compileTagComponent: compileTagComponent,
  renderTagComponent: renderTagComponent
};