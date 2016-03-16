'use strict';

var nj = require('../core'),
    utils = require('../utils/utils');

//转换节点为组件节点
function transformToComponent(obj, data, parent) {
  var ret = null,
    controlRefer = obj.refer;

  if (obj.type === 'nj_plaintext') {
    //替换插入在文本中的参数
    ret = utils.replaceParams(obj.content[0], data, true, false, parent);

    //执行模板数据
    if (utils.isObject(ret) && ret.type === 'nj_tmpl') {
      ret = transformContentToComponent(ret.content, data, parent);
    }
  }
  else if (controlRefer != null) {  //流程控制块
    var dataRefer = utils.getDataValue(data, controlRefer, parent);

    switch (obj.type) {
      case 'nj_if':
        ret = transformContentToComponent(!!dataRefer ? obj.content : obj.contentElse, data, parent);
        break;
      case 'nj_each':
        if (dataRefer && dataRefer.length) {
          ret = [];

          var itemIsArray = utils.isArray(data);
          utils.each(dataRefer, function (item, index) {
            var _parent = utils.lightObj();  //Create a parent data object
            _parent.data = item;
            _parent.parent = parent;
            _parent.index = index;

            ret.push(transformContentToComponent(obj.content, utils.getItemParam(item, data, itemIsArray), _parent));
          }, false, utils.isArray(dataRefer));
        }
        else if (obj.hasElse) {
          ret = transformContentToComponent(obj.contentElse, data, parent);
        }
        break;
    }
  }
  else {
    //如果有相应组件,则使用组件类作为type值
    var componentClass = nj.componentClasses[obj.type.toLowerCase()],
      type = componentClass ? componentClass : obj.type;

    //If typeRefer isn't undefined,use it to replace the node type.
    if (obj.typeRefer) {
      var typeRefer = utils.getDataValue(data, obj.typeRefer, parent);
      if (typeRefer) {
        type = typeRefer;
      }
    }

    //Make React.createElement's parameters
    var params = [type,                                                  //组件名
      utils.transformParamsToObj(obj.params, data, parent)],             //参数
      content = transformContentToComponent(obj.content, data, parent);  //子组件
    if (content) {
      utils.listPush(params, content);
    }

    //调用创建组件接口,必须需要用apply以多个参数的形式传参,否则在react中,元素放在数组里时会报需要加key属性的警告
    ret = nj.componentLibObj[nj.componentPort].apply(nj.componentLibObj, params);
  }

  return ret;
}

//转换子节点为组件节点
function transformContentToComponent(content, data, parent) {
  if (!content) {
    return null;
  }
  if (!parent && data) {  //Init a parent data object and cascade pass on the children node
    parent = utils.lightObj();
    parent.data = utils.isArray(data) ? data[0] : data;
  }

  var ret = [];
  utils.each(content, function (obj) {
    ret.push(transformToComponent(obj, data, parent));
  }, false, true);

  return ret;
}

module.exports = {
  transformToComponent: transformToComponent,
  transformContentToComponent: transformContentToComponent
};