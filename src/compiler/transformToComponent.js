'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  transformContentToComponent = require('./transformContent')(transformToComponent),  //转换子节点为组件节点
  errorTitle = nj.errorTitle;

//转换节点为组件节点
function transformToComponent(obj, data, parent, paramsExpr) {
  var ret = null;

  if (obj.type === 'nj_plaintext') {
    //替换插入在文本中的参数
    ret = utils.replaceParams(obj.content[0], data, true, false, parent, false);

    //执行模板数据
    if (utils.isObject(ret) && ret.expr === 'tmpl') {
      ret = transformContentToComponent(ret.content, data, parent);
    }
  }
  else if (obj.type === 'nj_expr') {  //Expression block
    var dataRefer = utils.getExprParam(obj.refer, data, parent, false),
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
    thisObj.useString = false;
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

        return transformContentToComponent(obj.content, utils.getItemParam(param.item, data, itemIsArray), _parent, paramsExpr);
      }
      else {
        return transformContentToComponent(obj.content, data, parent, paramsExpr);
      }
    };
    thisObj.inverse = function () {
      return hasElse ? transformContentToComponent(obj.contentElse, data, parent, paramsExpr) : null;
    };

    //Execute expression block
    ret = expr.apply(thisObj, dataRefer);
  }
  else {
    //如果有相应组件,则使用组件类作为type值
    var componentClass = nj.componentClasses[obj.type.toLowerCase()],
      type = componentClass ? componentClass : obj.type;

    //If typeRefer isn't undefined,use it to replace the node type.
    if (obj.typeRefer) {
      var typeRefer = utils.replaceParams(obj.typeRefer, data, true, false, parent, false);
      if (typeRefer) {
        type = typeRefer;
      }
    }

    //Make parameters from the parameters expression.
    var exprP = obj.paramsExpr,
      paramsE;
    if (exprP) {
      paramsE = utils.lightObj();
      transformContentToComponent(exprP.content, data, parent, paramsE);
    }

    //Make React.createElement's parameters
    var params = [type,                                                  //组件名
      utils.transformParamsToObj(obj.params, data, parent, paramsE)],    //参数
      content = transformContentToComponent(obj.content, data, parent);  //子组件
    if (content) {
      utils.listPush(params, content);
    }

    //调用创建组件接口,必须需要用apply以多个参数的形式传参,否则在react中,元素放在数组里时会报需要加key属性的警告
    ret = nj.componentPort.apply(nj.componentLibObj, params);
  }

  return ret;
}

function __transformToComponent(data) {
  var useString = false,
    compPort = nj.componentPort,
    compLib = nj.componentLibObj,
    compClass = nj.componentClasses,
    exprs = nj.exprs,
    filters = nj.filters,
    multiData = nj.isArray(data),
    getDatasValue = nj.getDatasValue,
    noop = nj.noop;

  var parent = nj.lightObj(),
    __parent_0 = parent;
  var __data_0 = data;
  if (data) {
    parent.data = multiData ? data[0] : data;
  }

  var _type0 = compClass['div'] ? compClass['div'] : 'div';
  var _params0 = {
    id: (!multiData ? data['num'] : getDatasValue(data, 'num'))
  };
  var _compParam0 = [_type0, _params0];

  /* div子节点开始 */
  var _expr0 = exprs['each'],
    _dataRefer0 = (!multiData ? data['arr'] : getDatasValue(data, 'arr'));

  nj.throwIf(_expr0, 'each', 'expr');

  var _this0 = nj.lightObj();
  //_this0.data = data;
  //_this0.parent = parent.parent;
  //_this0.index = parent.index;
  _this0.useString = useString;
  _this0.result = function (param) {
    var parent = nj.lightObj(),
      __parent_1 = parent;
    parent.data = param.item;
    parent.parent = __parent_0;
    parent.index = param.index;
    var data = nj.getItemParam(param.item, __data_0, multiData),
      __data_1 = data;

    var ret = [];

    /* span开始 */
    var _type0 = compClass['span'] ? compClass['span'] : 'span';
    var _params0 = {
      className: 'test_' + parent.index,
      style: __parent_0.data['styles'],
      onClick: __parent_0.data['onClick']
    };
    var _compParam0 = [_type0, _params0];

    /* test_{../num} */
    _compParam0.push('test_' + __parent_0.data['num']);

    /* <$each {../list2}>开始 */
    var _expr0 = exprs['each'],
      _dataRefer0 = __parent_0.data['list2'];

    nj.throwIf(_expr0, 'each', 'expr');

    var _this0 = nj.lightObj();
    _this0.useString = useString;
    _this0.result = function (param) {
      var parent = nj.lightObj(),
        __parent_2 = parent;
      parent.data = param.item;
      parent.parent = __parent_1;
      parent.index = param.index;
      var data = nj.getItemParam(param.item, __data_1, multiData),
        __data_2 = data;

      var _type0 = compClass['div'] ? compClass['div'] : 'div',
        _params0 = {},
        __paramsE0_2 = nj.lightObj();

      /* $params块开始 */
      var _filter0 = filters['five'],
        _valueF0 = __parent_1.index;
      if (!_filter0) {
        nj.warn('five', 'filter');
      }
      else {
        var _thisF0 = nj.lightObj();
        _thisF0.useString = useString;

        _valueF0 = _filter0.apply(_thisF0, [_valueF0]);
      }

      var _expr0 = exprs['if'],
        _dataRefer0 = _valueF0;

      nj.throwIf(_expr0, 'if', 'expr');

      var _this0 = nj.lightObj();
      _this0.useString = useString;
      _this0.result = function (param) {
        var _expr0 = exprs['param'],
          _dataRefer0 = 'name';

        nj.throwIf(_expr0, 'param', 'expr');

        var _this0 = nj.lightObj();
        _this0.useString = useString;
        _this0.paramsExpr = __paramsE0_2;
        _this0.result = function (param) {
          return 'five';
        };

        return _expr0.apply(_this0, [_dataRefer0]);
      };
      _this0.inverse = noop;

      _expr0.apply(_this0, [_dataRefer0]);
      /* $params块结束 */

      if (__paramsE0_2) {
        nj.assign(_params0, __paramsE0_2);
      }

      var _compParam0 = [_type0, _params0];

      /* span开始 */
      var _type1 = compClass['span'] ? compClass['span'] : 'span',
        _compParam1 = [_type1, null];

      _compParam1.push('span' + (!multiData ? data['no'] : getDatasValue(data, 'no')));

      _compParam0.push(compPort.apply(compLib, _compParam1));
      /* span结束 */

      /* i开始 */
      var _type2 = compClass['i'] ? compClass['i'] : 'i',
        _compParam2 = [_type2, null];

      _compParam2.push((!multiData ? data['no'] : getDatasValue(data, 'no')));

      _compParam0.push(compPort.apply(compLib, _compParam2));
      /* i结束 */

      return compPort.apply(compLib, _compParam0);
    };
    _this0.inverse = noop;

    nj.listPush(_compParam0, _expr0.apply(_this0, [_dataRefer0]), true, true);
    /* <$each {../list2}>结束 */

    ret.push(compPort.apply(compLib, _compParam0));
    /* span结束 */

    /* if开始 */
    var _valueF0 = parent.index;

    var _filter0 = filters['five'];
    if (!_filter0) {
      nj.warn('five', 'filter');
    }
    else {
      var _thisF0 = nj.lightObj();
      _thisF0.useString = useString;

      _valueF0 = _filter0.apply(_thisF0, [_valueF0, '1']);
    }

    var _filter1 = filters['test'];
    if (!_filter1) {
      nj.warn('test', 'filter');
    }
    else {
      var _thisF1 = nj.lightObj();
      _thisF1.useString = useString;

      _valueF0 = _filter1.apply(_thisF1, [_valueF0]);
    }

    var _expr1 = exprs['if'],
      _dataRefer1 = _valueF0;

    nj.throwIf(_expr1, 'if', 'expr');

    var _this1 = nj.lightObj();
    _this1.useString = useString;
    _this1.result = function (param) {
      var _type0 = compClass['br'] ? compClass['br'] : 'br',
        _compParam0 = [_type0, null];

      return compPort.apply(compLib, _compParam0);
    };
    _this1.inverse = function () {
      var _type0 = compClass['img'] ? compClass['img'] : 'img',
        _compParam0 = [_type0, null];

      return compPort.apply(compLib, _compParam0);
    };

    nj.listPush(ret, _expr1.apply(_this1, [_dataRefer1]), true, true);
    /* if结束 */

    return ret;
  };
  _this0.inverse = noop;

  nj.listPush(_compParam0, _expr0.apply(_this0, [_dataRefer0]), true, true);
  /* div子节点结束 */

  return compPort.apply(compLib, _compParam0);
}

module.exports = {
  transformToComponent: transformToComponent,
  transformContentToComponent: transformContentToComponent,
  __transformToComponent: __transformToComponent
};