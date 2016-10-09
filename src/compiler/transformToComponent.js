'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  transformContentToComponent = require('./transformContent')(transformToComponent),  //转换子节点为组件节点
  errorTitle = nj.errorTitle,
  exprConfig = utils.exprConfig,
  filterConfig = utils.filterConfig;

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
    noop = nj.noop,
    lightObj = nj.lightObj,
    throwIf = nj.throwIf,
    warn = nj.warn,
    getItemParam = nj.getItemParam,
    listPush = nj.listPush,
    assign = nj.assign;

  var parent = lightObj(),
    __parent_0 = parent;
  var __data_0 = data;
  if (data) {
    parent.data = multiData ? data[0] : data;
  }

  var _typeRefer0 = !multiData ? data['div'] : getDatasValue(data, 'div');

  var _type0 = _typeRefer0 ? _typeRefer0 : (compClass['div'] ? compClass['div'] : 'div');
  var _params0 = {
    id: (!multiData ? data['num'] : getDatasValue(data, 'num')) + '_100'
  };
  var _compParam0 = [_type0, _params0];

  /* div子节点开始 */
  var _expr0 = exprs['each'],
    _dataRefer0 = (!multiData ? data['arr'] : getDatasValue(data, 'arr'));

  throwIf(_expr0, 'each', 'expr');

  var _this0 = lightObj();
  //_this0.data = data;
  //_this0.parent = parent.parent;
  //_this0.index = parent.index;
  _this0.useString = useString;
  _this0.result = function (param) {
    var parent = lightObj(),
      __parent_1 = parent;
    parent.data = param.item;
    parent.parent = __parent_0;
    parent.index = param.index;
    var data = getItemParam(param.item, __data_0, multiData),
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

    throwIf(_expr0, 'each', 'expr');

    var _this0 = lightObj();
    _this0.useString = useString;
    _this0.result = function (param) {
      var parent = lightObj(),
        __parent_2 = parent;
      parent.data = param.item;
      parent.parent = __parent_1;
      parent.index = param.index;
      var data = getItemParam(param.item, __data_1, multiData),
        __data_2 = data;

      var _type0 = compClass['div'] ? compClass['div'] : 'div',
        _params0 = { key: param.index },
        __paramsE0_2 = lightObj();

      /* $params块开始 */
      var _filter0 = filters['five'],
        _value0 = __parent_1.index;
      if (!_filter0) {
        warn('five', 'filter');
      }
      else {
        var _thisF0 = lightObj();
        _thisF0.useString = useString;

        _value0 = _filter0.apply(_thisF0, [_value0]);
      }

      var _expr0 = exprs['if'],
        _dataRefer0 = _value0;

      throwIf(_expr0, 'if', 'expr');

      var _this0 = lightObj();
      _this0.useString = useString;
      _this0.result = function (param) {
        var _expr0 = exprs['param'],
          _dataRefer0 = 'name';

        throwIf(_expr0, 'param', 'expr');

        var _this0 = lightObj();
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
        assign(_params0, __paramsE0_2);
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

    _compParam0.push(_expr0.apply(_this0, [_dataRefer0]));
    //listPush(_compParam0, _expr0.apply(_this0, [_dataRefer0]), true, true);
    /* <$each {../list2}>结束 */

    ret.push(compPort.apply(compLib, _compParam0));
    /* span结束 */

    /* if开始 */
    var _value0 = parent.index;

    var _filter0 = filters['five'];
    if (!_filter0) {
      warn('five', 'filter');
    }
    else {
      var _thisF0 = lightObj();
      _thisF0.useString = useString;

      _value0 = _filter0.apply(_thisF0, [_value0, '1']);
    }

    var _filter1 = filters['test'];
    if (!_filter1) {
      warn('test', 'filter');
    }
    else {
      var _thisF1 = lightObj();
      _thisF1.useString = useString;

      _value0 = _filter1.apply(_thisF1, [_value0]);
    }

    var _expr1 = exprs['if'],
      _dataRefer1 = _value0;

    throwIf(_expr1, 'if', 'expr');

    var _this1 = lightObj();
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

    ret.push(_expr1.apply(_this1, [_dataRefer1]));
    //listPush(ret, _expr1.apply(_this1, [_dataRefer1]), true, true);
    /* if结束 */

    return ret;
  };
  _this0.inverse = noop;

  _compParam0.push(_expr0.apply(_this0, [_dataRefer0]));
  //listPush(_compParam0, _expr0.apply(_this0, [_dataRefer0]), true, true);
  /* div子节点结束 */

  return compPort.apply(compLib, _compParam0);
}

var __tmplFns = {
  fn1: function (p1, p2, p3, p4, p5) {
    var parent = p1.lightObj();
    parent.data = p4.item;
    parent.parent = p2.parent;
    parent.index = p4.index;
    var data = p1.getItemParam(p4.item, p2.data, p3.multiData);
    var _p2 = p1.lightObj();
    _p2.parent = parent;
    _p2.data = data;

    var ret = [];

    /* span开始 */
    var _type0 = p1.compClass['span'] ? p1.compClass['span'] : 'span';
    var _params0 = {
      className: 'test_' + parent.index,
      style: parent.parent.data['styles'],
      onClick: parent.parent.data['onClick']
    };
    var _compParam0 = [_type0, _params0];

    /* test_{../num} */
    _compParam0.push('test_' + parent.parent.data['num']);

    /* <$each {../list2}>开始 */
    var _expr0 = p1.exprs['each'];
    var _dataRefer0 = [
      parent.parent.data['list2']
    ];

    p1.throwIf(_expr0, 'each', 'expr');

    var _this0 = p1.lightObj();
    _this0.useString = p1.useString;
    _this0.result = p1.exprRet(p1, _p2, p3, p1.fn2);
    _this0.inverse = p1.noop;

    _compParam0.push(_expr0.apply(_this0, _dataRefer0));
    /* <$each {../list2}>结束 */

    ret.push(p1.compPort.apply(p1.compLib, _compParam0));
    /* span结束 */

    /* if开始 */
    var _value0 = parent.index;

    var _filter0 = p1.filters['five'];
    if (!_filter0) {
      p1.warn('five', 'filter');
    }
    else {
      var _thisF0 = p1.lightObj();
      _thisF0.useString = p1.useString;

      _value0 = _filter0.apply(_thisF0, [_value0, '1']);
    }

    var _filter1 = p1.filters['test'];
    if (!_filter1) {
      p1.warn('test', 'filter');
    }
    else {
      var _thisF1 = p1.lightObj();
      _thisF1.useString = p1.useString;

      _value0 = _filter1.apply(_thisF1, [_value0]);
    }

    var _expr1 = p1.exprs['if'];
    var _dataRefer1 = [
      _value0
    ];

    p1.throwIf(_expr1, 'if', 'expr');

    var _this1 = p1.lightObj();
    _this1.useString = p1.useString;
    _this1.result = p1.exprRet(p1, _p2, p3, p1.fn3);
    _this1.inverse = p1.exprRet(p1, _p2, p3, p1.fn4);

    ret.push(_expr1.apply(_this1, _dataRefer1));
    /* if结束 */

    return ret;
  },
  fn2: function (p1, p2, p3, p4, p5) {
    var parent = p1.lightObj();
    parent.data = p4.item;
    parent.parent = p2.parent;
    parent.index = p4.index;
    var data = p1.getItemParam(p4.item, p2.data, p3.multiData);
    var _p2 = p1.lightObj();
    _p2.parent = parent;
    _p2.data = data;

    var _type0 = p1.compClass['div'] ? p1.compClass['div'] : 'div';
    var _params0 = {};
    var _paramsE0 = p1.lightObj();

    /* $params块开始 */
    var _filter0 = p1.filters['five'];
    var _value0 = p2.parent.index;
    if (!_filter0) {
      p1.warn('five', 'filter');
    }
    else {
      var _thisF0 = p1.lightObj();
      _thisF0.useString = p1.useString;

      _value0 = _filter0.apply(_thisF0, [_value0]);
    }

    var _expr0 = p1.exprs['if'];
    var _dataRefer0 = [
      _value0
    ];

    p1.throwIf(_expr0, 'if', 'expr');

    var _this0 = p1.lightObj();
    _this0.useString = p1.useString;
    _this0.result = p1.exprRet(p1, _p2, p3, p1.fn5, _paramsE0);
    _this0.inverse = p1.noop;

    _expr0.apply(_this0, _dataRefer0);
    /* $params块结束 */

    p1.assign(_params0, _paramsE0);
    _params0.key = parent.index;

    var _compParam0 = [_type0, _params0];

    /* span开始 */
    var _type1 = p1.compClass['span'] ? p1.compClass['span'] : 'span';
    var _compParam1 = [_type1, null];

    _compParam1.push('span' + (!p3.multiData ? data['no'] : p1.getDatasValue(data, 'no')));

    _compParam0.push(p1.compPort.apply(p1.compLib, _compParam1));
    /* span结束 */

    /* i开始 */
    var _type2 = p1.compClass['i'] ? p1.compClass['i'] : 'i';
    var _compParam2 = [_type2, null];

    _compParam2.push((!p3.multiData ? data['no'] : p1.getDatasValue(data, 'no')));

    _compParam0.push(p1.compPort.apply(p1.compLib, _compParam2));
    /* i结束 */

    return p1.compPort.apply(p1.compLib, _compParam0);
  },
  fn3: function (p1, p2, p3, p4, p5) {
    var _type0 = p1.compClass['br'] ? p1.compClass['br'] : 'br';
    var _compParam0 = [_type0, null];

    return p1.compPort.apply(p1.compLib, _compParam0);
  },
  fn4: function (p1, p2, p3, p4, p5) {
    var _type0 = p1.compClass['img'] ? p1.compClass['img'] : 'img';
    var _compParam0 = [_type0, null];

    return p1.compPort.apply(p1.compLib, _compParam0);
  },
  fn5: function (p1, p2, p3, p4, p5) {
    var _expr0 = p1.exprs['param'];
    var _dataRefer0 = [
      'name'
    ];

    p1.throwIf(_expr0, 'param', 'expr');

    var _this0 = p1.lightObj();
    _this0.useString = p1.useString;
    _this0.paramsExpr = p5;
    _this0.result = p1.exprRet(p1, p2, p3, p1.fn6);

    return _expr0.apply(_this0, _dataRefer0);
  },
  fn6: function (p1, p2, p3, p4, p5) {
    return 'five';
  },
  useString: false,
  main: function (p1, p2, p3, p4, p5) {
    var parent = p1.lightObj();
    var data = p2.data;
    if (data) {
      parent.data = p3.multiData ? data[0] : data;
    }
    p2.parent = parent;

    var _typeRefer0 = !p3.multiData ? data['div'] : p1.getDatasValue(data, 'div');
    var _type0 = _typeRefer0 ? _typeRefer0 : (p1.compClass['div'] ? p1.compClass['div'] : 'div');
    var _params0 = {
      id: (!p3.multiData ? data['num'] : p1.getDatasValue(data, 'num')) + '_100'
    };
    var _compParam0 = [_type0, _params0];

    /* div子节点开始 */
    var _expr0 = p1.exprs['each'];
    var _dataRefer0 = [
      (!p3.multiData ? data['arr'] : p1.getDatasValue(data, 'arr'))
    ];

    p1.throwIf(_expr0, 'each', 'expr');

    var _this0 = p1.lightObj();
    //_this0.data = data;
    //_this0.parent = parent.parent;
    //_this0.index = parent.index;
    _this0.useString = p1.useString;
    _this0.result = p1.exprRet(p1, p2, p3, p1.fn1);
    _this0.inverse = p1.noop;

    _compParam0.push(_expr0.apply(_this0, _dataRefer0));
    /* div子节点结束 */

    return p1.compPort.apply(p1.compLib, _compParam0);
  }
};

function _buildFn(content, fns, no, newContext) {
  var fnStr = '',
    main = no === 0,
    /* retType
     1: 只有单个子节点
     2: 有多个子节点
     object: 非构建函数时
    */
    retType = content.length === 1 ? '1' : '2',
    counter = {
      _type: 0,
      _typeRefer: 0,
      _params: 0,
      _paramsE: 0,
      _compParam: 0,
      _dataRefer: 0,
      _expr: 0,
      _this: 0,
      _value: 0,
      _filter: 0,
      _thisF: 0,
      newContext: newContext
    };

  if (main) {
    fnStr += 'var parent = p1.lightObj();\n';
    fnStr += 'var data = p2.data;\n';
    fnStr += 'if (data) {\n';
    fnStr += '  parent.data = p3.multiData ? data[0] : data;\n';
    fnStr += '}\n';
    fnStr += 'p2.parent = parent;\n';
  }
  else if (newContext) {
    fnStr += 'var parent = p1.lightObj();\n';
    fnStr += 'parent.data = p4.item;\n';
    fnStr += 'parent.parent = p2.parent;\n';
    fnStr += 'parent.index = p4.index;\n';
    fnStr += 'var data = p1.getItemParam(p4.item, p2.data, p3.multiData);\n';
    fnStr += 'var _p2 = p1.lightObj();\n';
    fnStr += '_p2.parent = parent;\n';
    fnStr += '_p2.data = data;\n';
  }
  else {
    fnStr += 'var parent = p2.parent;\n';
    fnStr += 'var data = p2.data;\n';
  }

  if (retType === 2) {
    fnStr += 'var ret = [];\n';
  }

  fnStr += _buildContent(content, fns, counter, retType);

  if (retType === 2) {
    fnStr += 'return ret;';
  }

  /* 构建表达式块函数
   p1: 全局模板成员,不可改变
   p2: 当前模板的局部成员
   p3: 当前模板的全局成员
   p4: 表格式块内调用result及inverse方法传递的参数
   p5: #param块变量
  */
  fns[main ? 'main' : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', 'p5', fnStr);
  return no;
}

function _buildPropData(obj, counter) {
  var dataValueStr;

  //先生成数据值
  if (!obj.prop.isStr) {
    var name = obj.prop.name,
      parentNum = obj.prop.parentNum,
      data = '',
      special = false;

    if (name === '#') {
      data = 'parent.index';
      special = true;
    }
    else if (name === '.') {
      data = 'parent.data';
      special = true;
    }

    if (parentNum) {
      if (!data) {
        data = 'parent.data';
      }
      for (var i = 0; i < parentNum; i++) {
        data = 'parent.' + data;
      }

      if (!special) {
        data += '[\'' + name + '\']';
        special = true;
      }
    }

    if (!special) {
      dataValueStr = '!p3.multiData ? data[\'' + name + '\'] : p1.getDatasValue(data, \'' + name + '\')';
    }
    else {
      dataValueStr = data;
    }
  }
  else {
    dataValueStr = '\'' + obj.prop.name + '\'';
  }

  //有过滤器时需要生成"_value"值
  var filters = obj.prop.filters;
  if (filters) {
    var valueStr = '_value' + counter._value++,
      filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

    utils.each(filters, function (o) {
      var _filterC = counter._filter++,
        _thisFC = counter._thisF++,
        configF = filterConfig[o.name];

      filterStr += '\nvar _filter' + _filterC + ' = p1.filters[\'' + o.name + '\'];\n';
      filterStr += 'if (!_filter' + _filterC + ') {\n';
      filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
      filterStr += '}\n';
      filterStr += 'else {\n';
      filterStr += '  var _thisF' + _thisFC + ' = p1.lightObj();\n';
      if (configF.useString) {
        filterStr += '  _thisF' + _thisFC + '.useString = p1.useString;\n';
      }
      if (configF.data) {
        filterStr += '  _thisF' + _thisFC + '.data = data;\n';
      }
      if (configF.parent) {
        filterStr += '  _thisF' + _thisFC + '.parent = parent.parent;\n';
      }
      if (configF.index) {
        filterStr += '  _thisF' + _thisFC + '.index = parent.index;\n';
      }
      filterStr += '\n  ' + valueStr + ' = _filter' + _filterC + '.apply(_thisF' + _thisFC + ', [' + valueStr
        + (o.params ? o.params.reduce(function (p, c) {
          return p + ', \'' + c + '\'';
        }, '') : '')
        + ']);\n';
      filterStr += '}\n';
    }, false, true);

    return {
      valueStr: valueStr,
      filterStr: filterStr
    };
  }
  else {
    return dataValueStr;
  }
}

function _buildProps(obj, counter) {
  var str0 = obj.strs[0],
    valueStr = !obj.isAll && str0 !== '' ? ('\'' + str0 + '\' + ') : '',
    filterStr = '';

  utils.each(obj.props, function (o, i) {
    var propData = _buildPropData(o, counter),
      dataValueStr;
    if (utils.isString(propData)) {
      dataValueStr = propData;
    }
    else {
      dataValueStr = propData.valueStr;
      filterStr += propData.filterStr;
    }

    if (!obj.isAll) {
      var strI = obj.strs[i + 1];
      dataValueStr = (i > 0 ? ' + ' : '')
        + '(' + dataValueStr + ')'
        + (strI !== '' ? ' + \'' + strI + '\'' : '');
    }
    valueStr += dataValueStr;

    if (obj.isAll) {
      return false;
    }
  }, false, true, true);

  if (filterStr === '') {
    return valueStr;
  }
  else {  //包含过滤器
    return {
      valueStr: valueStr,
      filterStr: filterStr
    };
  }
}

function _buildNode(node, fns, counter, retType) {
  var fnStr = '';

  if (node.type === 'nj_plaintext') {  //文本节点
    var valueStr = _buildProps(node.content[0], counter),
      filterStr;
    if (utils.isObject(valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }

    var textStr = _buildRender(1, retType, { text: valueStr });
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    fnStr += textStr;
  }
  else if (node.type === 'nj_expr') {  //Expression block node
    var _exprC = counter._expr++,
      _dataReferC = counter._dataRefer++,
      dataReferStr = '';
    fnStr += '\nvar _expr' + _exprC + ' = p1.exprs[\'' + node.expr + '\'];\n';

    if (node.refer) {
      dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';
      var props = node.refer.props,
        len = props.length,
        filterStr = '';

      utils.each(props, function (o, i) {
        var valueStr = _buildPropData(o, counter);
        if (utils.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + (i < len - 1 ? ',' : '');
      }, false, true);
      dataReferStr += '\n];\n';

      if(filterStr !== '') {
        dataReferStr = filterStr + dataReferStr;
      }

      fnStr += dataReferStr;
    }

    //如果表达式不存在则打印警告信息
    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

    //执行表达式块
    var _thisC = counter._this++,
      configE = exprConfig[node.expr],
      newContext = configE.newContext,
      newContextP = counter.newContext;

    fnStr += '\nvar _this' + _thisC + ' = p1.lightObj();\n';
    if (configE.useString) {
      fnStr += '_this' + _thisC + '.useString = p1.useString;\n';
    }
    if (configE.data) {
      fnStr += '_this' + _thisC + '.data = data;\n';
    }
    if (configE.parent) {
      fnStr += '_this' + _thisC + '.parent = parent.parent;\n';
    }
    if (configE.index) {
      fnStr += '_this' + _thisC + '.index = parent.index;\n';
    }
    fnStr += '_this' + _thisC + '.result = ' + (node.content ? 'p1.exprRet(p1, ' + (newContextP ? '_' : '') + 'p2, p3, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext) + ')' : 'p1.noop') + ';\n';
    fnStr += '_this' + _thisC + '.inverse = ' + (node.contentElse ? 'p1.exprRet(p1, ' + (newContextP ? '_' : '') + 'p2, p3, p1.fn' + _buildFn(node.contentElse, fns, ++fns._no, newContext) + ')' : 'p1.noop') + ';\n';

    //渲染
    fnStr += _buildRender(2, retType, {
      _expr: _exprC,
      _dataRefer: _dataReferC,
      _this: _thisC
    });
  }
  else {  //元素节点
    //节点类型和typeRefer
    var _typeC = counter._type++,
      _type;
    if (node.typeRefer) {
      _type = node.typeRefer.props[0].prop.name;
    }
    else {
      _type = node.type.toLowerCase();
    }
    var typeStr = 'p1.compClass[\'' + _type + '\'] ? p1.compClass[\'' + _type + '\'] : \'' + _type + '\'';

    if (node.typeRefer) {
      var _typeReferC = counter._typeRefer++;
      fnStr += '\nvar _typeRefer' + _typeReferC + ' = ' + _buildProps(node.typeRefer, counter) + ';\n';
      fnStr += 'var _type' + _typeC + ' = _typeRefer' + _typeReferC + ' ? _typeRefer' + _typeReferC + ' : (' + typeStr + ');\n';
    }
    else {
      fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';
    }

    //节点参数
    var _paramsC = counter._params++,
      paramsStr = '';
    if (node.params) {
      var paramKeys = Object.keys(node.params),
        len = paramKeys.length,
        filterStr = '';

      paramsStr += 'var _params' + _paramsC + ' = {\n';
      utils.each(paramKeys, function (k, i) {
        var valueStr = _buildProps(node.params[k], counter);
        if (utils.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        paramsStr += '  ' + k + ': ' + valueStr + (i < len - 1 ? ',\n' : '');
      }, false, false);
      paramsStr += '\n};\n';

      if(filterStr !== '') {
        paramsStr = filterStr + paramsStr;
      }

      fnStr += paramsStr;
    }

    //组件引擎参数
    var _compParamC = counter._compParam++;
    fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';

    //子节点
    fnStr += _buildContent(node.content, fns, counter, { _compParam: '_compParam' + _compParamC });

    //渲染
    fnStr += _buildRender(3, retType, { _compParam: _compParamC });
  }

  return fnStr;
}

function _buildContent(content, fns, counter, retType) {
  var fnStr = '';
  if (!content) {
    return fnStr;
  }

  utils.each(content, function (node) {
    fnStr += _buildNode(node, fns, counter, retType);
  }, false, true);

  return fnStr;
}

function _buildRender(nodeType, retType, params) {
  var retStr;
  switch (nodeType) {
    case 1:  //文本节点
      retStr = params.text;
      break;
    case 2:  //表达式块
      retStr = '_expr' + params._expr + '.apply(_this' + params._this + ', _dataRefer' + params._dataRefer + ')';
      break;
    case 3:  //元素节点
      retStr = 'p1.compPort.apply(p1.compLib, _compParam' + params._compParam + ')';
      break;
  }

  if (retType === '1') {
    return '\nreturn ' + retStr + ';';
  }
  else if (retType === '2') {
    return '\nret.push(' + retStr + ');\n';
  }
  else {
    return '\n' + retType._compParam + '.push(' + retStr + ');\n';
  }
}

//module.exports = {
//  transformToComponent: transformToComponent,
//  transformContentToComponent: transformContentToComponent,
//  __transformToComponent: __transformToComponent2
//};
module.exports = function (ast) {
  //return __tmplFns;
  var fns = {
    useString: false,
    _no: 0
  };

  _buildFn(ast, fns, 0);
  console.log(fns.main.toString());
  console.log('\n');
  console.log(fns.fn1.toString());
  return fns;
};