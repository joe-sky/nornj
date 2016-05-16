'use strict';

var nj = require('../core'),
  tools = require('./tools');

//注册组件
function registerComponent(name, component) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = component;
  }

  tools.each(params, function (v, k) {
    nj.componentClasses[k.toLowerCase()] = v;
  }, false, false);

  return component;
}

//注册组件标签命名空间
function registerTagNamespace(name) {
  nj.namespace = name;
  createTagNamespace();

  //修改标签组件id及类名
  nj.tagId = name + '-id';
  nj.tagStyle = name + '-style';
  nj.tagClassName = name + '-component';
}

//创建标签命名空间
function createTagNamespace(name) {
  if (!name) {
    name = 'nj';
  }
  nj.tagNamespaces[name] = true;

  if (typeof document === 'undefined') {
    return;
  }

  var doc = document;
  if (doc && doc.namespaces) {
    doc.namespaces.add(name, 'urn:schemas-microsoft-com:vml', '#default#VML');
  }
}

module.exports = {
  registerComponent: registerComponent,
  registerTagNamespace: registerTagNamespace,
  createTagNamespace: createTagNamespace
};