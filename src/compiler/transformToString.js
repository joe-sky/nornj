'use strict';

var utils = require('../utils/utils');

//转换节点为字符串
function transformToString(obj, data, parent) {
  var ret = '',
    controlRefer = obj.refer;

  if (obj.type === 'nj_plaintext') {
    //替换插入在文本中的参数
    ret = utils.replaceParams(obj.content[0], data, false, false, parent);
  }
  else if (controlRefer != null) {  //流程控制块
    var dataRefer = utils.getDataValue(data, controlRefer, parent);

    switch (obj.type) {
      case 'nj_if':
        ret = transformContentToString(!!dataRefer ? obj.content : obj.contentElse, data, parent);
        break;
      case 'nj_each':
        if (dataRefer && dataRefer.length) {
          utils.each(dataRefer, function (item, index) {
            var _parent = utils.lightObj();  //Create a parent data object
            _parent.data = item;
            _parent.parent = parent;
            _parent.index = index;

            ret += transformContentToString(obj.content, utils.getItemParam(item, data), _parent);
          });
        }
        else if (obj.hasElse) {
          ret = transformContentToString(obj.contentElse, data, parent);
        }
        break;
    }
  }
  else {
    var type = obj.type;

    //If typeRefer isn't undefined,use it replace the node type.
    if (obj.typeRefer) {
      var typeRefer = utils.escape(utils.getDataValue(data, obj.typeRefer, parent));
      if (typeRefer) {
        type = typeRefer;
      }
    }

    var openTag = '<' + type + utils.transformParams(obj.params, data, parent);
    if (!obj.selfCloseTag) {
      ret = openTag + '>' + transformContentToString(obj.content, data, parent) + "</" + type + ">";
    }
    else {  //自闭合标签
      ret = openTag + '/>';
    }
  }

  return ret;
}

//转换子节点为字符串
function transformContentToString(content, data, parent) {
  var ret = '';
  if (!content) {
    return ret;
  }
  if (!parent && data) {  //Init a parent data object and cascade pass on the children node
    parent = utils.lightObj();
    parent.data = utils.isArray(data) ? data[0] : data;
  }

  utils.each(content, function (obj) {
    ret += transformToString(obj, data, parent);
  }, false, true);

  return ret;
}

module.exports = {
  transformToString: transformToString,
  transformContentToString: transformContentToString
};