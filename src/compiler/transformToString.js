'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  transformContent = require('./transformContent'),
  transformContentToString = transformContent(transformToString, true),  //转换子节点为字符串
  transformContentToArray = transformContent(transformToString, false),  //转换子节点为数组
  errorTitle = nj.errorTitle;

//转换节点为字符串
function transformToString(obj, data, parent, paramsExpr) {
  var ret = '';

  if (obj.type === 'nj_plaintext') {
    //替换插入在文本中的参数
    ret = utils.replaceParams(obj.content[0], data, false, false, parent, true);
  }
  else if (obj.type === 'nj_expr') {  //Expression block
    var dataRefer = utils.getExprParam(obj.refer, data, parent, true),
      hasElse = obj.hasElse,
      expr = nj.exprs[obj.expr],
      itemIsArray;

    utils.throwIf(expr, errorTitle + 'Expression "' + obj.expr + '" is undefined, please check it has been registered.');

    //Create expression's context object and set parameters
    var thisObj = utils.lightObj();
    thisObj.data = data;
    if (parent) {
      thisObj.parent = parent.parent;
      thisObj.index = parent.index;
    }
    thisObj.useString = true;
    thisObj.paramsExpr = paramsExpr;
    thisObj.result = function (param) {
      if (param && param.loop) {
        if (itemIsArray == null) {
          itemIsArray = utils.isArray(data);
        }

        //Create a parent data object
        var _parent = utils.lightObj();
        _parent.data = param.item;
        _parent.parent = parent;
        _parent.index = param.index;

        return transformContentToString(obj.content, utils.getItemParam(param.item, data, itemIsArray), _parent, paramsExpr);
      }
      else {
        return transformContentToString(obj.content, data, parent, paramsExpr);
      }
    };
    thisObj.inverse = function () {
      return hasElse ? transformContentToString(obj.contentElse, data, parent, paramsExpr) : null;
    };

    //Execute expression block
    ret = expr.apply(thisObj, dataRefer);
  }
  else {
    var type = obj.type;

    //If typeRefer isn't undefined,use it to replace the node type.
    if (obj.typeRefer) {
      var typeRefer = utils.replaceParams(obj.typeRefer, data, false, false, parent, true);
      if (typeRefer) {
        type = typeRefer;
      }
    }

    //Make parameters from the parameters expression.
    var exprP = obj.paramsExpr,
      paramsE;
    if (exprP) {
      paramsE = utils.lightObj();
      transformContentToArray(exprP.content, data, parent, paramsE);
    }

    var openTag = '<' + type + utils.transformParams(obj.params, data, parent, paramsE);
    if (!obj.selfCloseTag) {
      ret = openTag + '>' + transformContentToString(obj.content, data, parent) + '</' + type + '>';
    }
    else {  //自闭合标签
      ret = openTag + '/>';
    }
  }

  return ret;
}

function __transformToString(data0) {
  var ret = '';

  var parent0 = utils.lightObj();
  if (data0) {
    parent0.data = utils.isArray(data0) ? data0[0] : data0;
  }

  var useString = true;

  var type0 = 'div';

  var openTag0 = '<' + type0 + ' checked disabled="disabled" name1="../111" name="my name:' + data0.name + ',id:' + data0.id + ',name:' + data0.name + '" id="test1"';
  ret += openTag0 + '>';

  //子节点

  ret += '</' + type0 + '>';

  return ret;
}

module.exports = {
  transformToString: transformToString,
  transformContentToString: transformContentToString,
  __transformToString: __transformToString
};