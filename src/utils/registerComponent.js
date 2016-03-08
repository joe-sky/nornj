'use strict';

var nj = require('../core'),
  tools = require('./tools');

//注册组件
function registerComponent(name, obj) {
  var params = name;
  if (!tools.isArray(name)) {
    params = [{ name: name, obj: obj }];
  }

  tools.each(params, function (param) {
    nj.componentClasses[param.name.toLowerCase()] = param.obj;
  }, false, true);
}

//注册组件标签命名空间
function registerTagNamespace(name) {
  nj.tagNamespace = name;
  createTagNamespace();

  //修改标签组件id及类名
  nj.tagId = name + '-id';
  nj.tagStyle = name + '-style';
  nj.tagClassName = name + '-component';
}

//创建标签命名空间
function createTagNamespace() {
  if (typeof document === 'undefined') {
    return;
  }

  var doc = document;
  if (doc && doc.namespaces) {
    doc.namespaces.add(nj.tagNamespace, 'urn:schemas-microsoft-com:vml', '#default#VML');
  }
}

module.exports = {
  registerComponent: registerComponent,
  registerTagNamespace: registerTagNamespace,
  createTagNamespace: createTagNamespace
};