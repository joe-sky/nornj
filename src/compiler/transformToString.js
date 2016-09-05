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

function program(p, p2, fn, pE) {
  return function(param) {
    return fn(p, p2, param, pE);
  };
}

function fn1(p, p2, param) {
  var parent = p.lightObj();
  parent.data = param.item;
  parent.parent = p2.parent;
  parent.index = param.index;
  var data = p.getItemParam(param.item, p2.data, p.multiData);
  var _p2 = p.lightObj();
  _p2.parent = parent;
  _p2.data = data;

  var ret = '';

  /* span开始 */
  var _params0 = ' class="test_' + parent.index + '"';

  /* <$each {../list2}>开始 */
  var _expr0 = p.exprs['each'],
    _dataRefer0 = parent.parent.data['list2'];

  p.throwIf(_expr0, 'each', 'expr');

  var _this0 = p.lightObj();
  _this0.useString = p.useString;
  _this0.result = program(p, _p2, fn2);
  _this0.inverse = p.noop;
  /* <$each {../list2}>结束 */

  ret += '<span' + _params0 + '>'
    + ('test_' + parent.parent.data['num'])
    + _expr0.apply(_this0, [_dataRefer0])
    + '</span>';
  /* span结束 */

  /* if开始 */
  var _valueF0 = parent.index;

  var _filter0 = p.filters['five'];
  if (!_filter0) {
    p.warn('five', 'filter');
  }
  else {
    var _thisF0 = p.lightObj();
    _thisF0.useString = p.useString;

    _valueF0 = _filter0.apply(_thisF0, [_valueF0, '1']);
  }

  var _expr1 = p.exprs['if'],
    _dataRefer1 = _valueF0;

  p.throwIf(_expr1, 'if', 'expr');

  var _this1 = p.lightObj();
  _this1.useString = p.useString;
  _this1.result = program(p, _p2, fn3);
  _this1.inverse = program(p, _p2, fn4);

  ret += _expr1.apply(_this1, [_dataRefer1]);
  /* if结束 */

  return ret;
}

function fn2(p, p2, param) {
  var parent = p.lightObj();
  parent.data = param.item;
  parent.parent = p2.parent;
  parent.index = param.index;
  var data = p.getItemParam(param.item, p2.data, p.multiData);
  var _p2 = p.lightObj();
  _p2.parent = parent;
  _p2.data = data;

  var _params0 = '';
  var _paramsE0 = p.lightObj();

  /* $params块开始 */
  var _filter0 = p.filters['five'],
    _valueF0 = p2.parent.index;
  if (!_filter0) {
    p.warn('five', 'filter');
  }
  else {
    var _thisF0 = p.lightObj();
    _thisF0.useString = p.useString;

    _valueF0 = _filter0.apply(_thisF0, [_valueF0]);
  }

  var _expr0 = p.exprs['if'],
    _dataRefer0 = _valueF0;

  p.throwIf(_expr0, 'if', 'expr');

  var _this0 = p.lightObj();
  _this0.useString = p.useString;
  _this0.result = program(p, _p2, fn5, _paramsE0);
  _this0.inverse = p.noop;

  _expr0.apply(_this0, [_dataRefer0]);
  /* $params块结束 */

  var _k0,
    _keys0 = { key: 1 };
  for(var _k0 in _paramsE0) {
    if(!_keys0 || !_keys0[_k0]) {
      _params0 += ' ' + _k0 + '="' + _paramsE0[_k0] + '"';
    }
  }
  _params0 += ' key="' + parent.index + '"';

  return '<div' + _params0 + '>'
    + '<span>span' + (!p.multiData ? data['no'] : p.getDatasValue(data, 'no')) + '</span>'
    + '<i>' + (!p.multiData ? data['no'] : p.getDatasValue(data, 'no')) + '</i>'
    + '</div>';
}

function fn3(p, p2, param) {
  return '<br />';
}

function fn4(p, p2, param) {
  return '<img />';
}

function fn5(p, p2, param, pE) {
  var _expr0 = p.exprs['param'],
    _dataRefer0 = 'name';

  p.throwIf(_expr0, 'param', 'expr');

  var _this0 = p.lightObj();
  _this0.useString = p.useString;
  _this0.paramsExpr = pE;
  _this0.result = program(p, p2, fn6);

  return _expr0.apply(_this0, [_dataRefer0]);
}

function fn6(p, p2, param){
  return 'five';
}

function __transformToString(data) {
  var p = {
    useString: true,
    exprs: nj.exprs,
    filters: nj.filters,
    multiData: nj.isArray(data),
    getDatasValue: nj.getDatasValue,
    noop: nj.noop,
    lightObj: nj.lightObj,
    throwIf: nj.throwIf,
    warn: nj.warn,
    getItemParam: nj.getItemParam,
    //listPush: nj.listPush,
    assign: nj.assign
  };

  var parent = p.lightObj();
  if (data) {
    parent.data = p.multiData ? data[0] : data;
  }
  var p2 = p.lightObj();
  p2.parent = parent;
  p2.data = data;

  var _typeRefer0 = !p.multiData ? data['div'] : p.getDatasValue(data, 'div');
  var _type0 = _typeRefer0 ? _typeRefer0 : 'div';
  var _params0 = ' id="' + (!p.multiData ? data['num'] : p.getDatasValue(data, 'num')) + '_100"';

  /* div子节点开始 */
  var _expr0 = p.exprs['each'],
    _dataRefer0 = (!p.multiData ? data['arr'] : p.getDatasValue(data, 'arr'));

  p.throwIf(_expr0, 'each', 'expr');

  var _this0 = p.lightObj();
  //_this0.data = data;
  //_this0.parent = parent.parent;
  //_this0.index = parent.index;
  _this0.useString = p.useString;
  _this0.result = program(p, p2, fn1);
  _this0.inverse = p.noop;
  /* div子节点结束 */

  return '<' + _type0 + _params0 + '>'
    + _expr0.apply(_this0, [_dataRefer0])
    + '</' + _type0 + '>';
}

module.exports = {
  transformToString: transformToString,
  transformContentToString: transformContentToString,
  __transformToString: __transformToString
};