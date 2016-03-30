'use strict';

var nj = require('../core'),
  utils = require('../utils/utils');

//转换节点为字符串
function transformToString(obj, data, parent) {
  var ret = '';

  if (obj.type === 'nj_plaintext') {
    //替换插入在文本中的参数
    ret = utils.replaceParams(obj.content[0], data, false, false, parent);
  }
  else if (obj.type === 'nj_expr') {  //Expression block
    var dataRefer = utils.getExprParam(obj.refer, data, parent),
      hasElse = obj.hasElse,
      expr = nj.exprs[obj.expr],
      itemIsArray;

    utils.throwIf(expr, 'Expression "' + obj.expr + '" is undefined, please check it has been registered.');

    //Create expression parameters
    dataRefer.push({
      result: function (param) {
        if(param && param.loop) {
          if(itemIsArray == null) {
            itemIsArray = utils.isArray(data);
          }

          //Create a parent data object
          var _parent = utils.lightObj();
          _parent.data = param.item;
          _parent.parent = parent;
          _parent.index = param.index;

          ret += transformContentToString(obj.content, utils.getItemParam(param.item, data, itemIsArray), _parent);
        }
        else {
          ret = transformContentToString(obj.content, data, parent);
        }
      },
      inverse: function () {
        if(hasElse) {
          ret = transformContentToString(obj.contentElse, data, parent);
        }
      }
    });

    //Execute expression block
    expr.apply(null, dataRefer);
  }
  else {
    var type = obj.type;

    //If typeRefer isn't undefined,use it to replace the node type.
    if (obj.typeRefer) {
      var typeRefer = utils.replaceParams(obj.typeRefer, data, false, false, parent);
      if (typeRefer) {
        type = typeRefer;
      }
    }

    var openTag = '<' + type + utils.transformParams(obj.params, data, parent);
    if (!obj.selfCloseTag) {
      ret = openTag + '>' + transformContentToString(obj.content, data, parent) + '</' + type + '>';
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