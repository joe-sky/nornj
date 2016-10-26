'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  errorTitle = nj.errorTitle,
  exprConfig = utils.exprConfig,
  filterConfig = utils.filterConfig,
  replaceSpecialSymbol = require('../utils/replaceSpecialSymbol');

function _buildFn(content, fns, no, newContext) {
  var fnStr = '',
    useString = fns.useString,
    isTmplExpr = utils.isString(no),  //如果no为字符串, 则本次将构建tmpl块模板函数
    main = isTmplExpr || no === 0,
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

  if (!useString) {
    counter._compParam = 0;
  }
  else {
    counter._children = 0;
  }

  if (main) {
    fnStr += _buildVar();
    fnStr += 'if(!parent) {\n';
    fnStr += '  parent = p1.lightObj();\n';
    fnStr += '  if (data) {\n';
    fnStr += '    parent.data = multiData ? data[0] : data;\n';
    fnStr += '  }\n';
    fnStr += '  p2.parent = parent;\n';
    fnStr += '};\n';
  }
  else if (newContext) {
    fnStr += 'var parent = p1.lightObj(),\n';
    fnStr += '  _parent = p2.parent,\n';
    fnStr += '  multiData = p3.multiData,\n';
    fnStr += '  hasItem = \'item\' in p4;\n';
    fnStr += 'parent.data = hasItem ? p4.item : _parent.data;\n';
    fnStr += 'parent.parent = p4.fallback ? _parent : _parent.parent;\n';
    fnStr += 'parent.index = \'index\' in p4 ? p4.index : _parent.index;\n';
    fnStr += 'var data;\n';
    fnStr += 'if(hasItem) data = p1.getNewData(p4.item, p2.data, multiData, p4.addData);\n';
    fnStr += 'else data = p2.data;\n';
    fnStr += 'var _p2 = p1.lightObj();\n';
    fnStr += '_p2.parent = parent;\n';
    fnStr += '_p2.data = data;\n';
    fnStr += 'var _p3 = p1.lightObj();\n';
    fnStr += 'if(p4.addData) multiData = true;\n';
    fnStr += '_p3.multiData = multiData;\n';
  }
  else {
    fnStr += _buildVar();
  }

  if (retType === '2') {
    if (!useString) {
      fnStr += 'var ret = [];\n';
    }
    else {
      fnStr += 'var ret = \'\';\n';
    }
  }

  fnStr += _buildContent(content, fns, counter, retType);

  if (retType === '2') {
    fnStr += 'return ret;';
  }

  /* 构建表达式块函数
   p1: 全局模板配置信息,不可改变
   p2: 当前模板数据信息
   p3: 当前模板配置信息
   p4: 表格式块内调用result及inverse方法传递的参数
   p5: #param块变量
  */
  fns[main ? 'main' + (isTmplExpr ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', 'p5', fnStr);
  return no;
}

function _buildVar() {
  return ('var parent = p2.parent,\n'
    + '  data = p2.data,\n'
    + '  multiData = p3.multiData;\n');
}

function _buildPropData(obj, counter, fns, noEscape) {
  var dataValueStr,
    useString = fns.useString,
    escape = !noEscape ? obj.escape : false;

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
      dataValueStr = '(!multiData ? data[\'' + name + '\'] : p1.getDatasValue(data, \'' + name + '\'))';
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
        configF = filterConfig[o.name],
        noConfig = !configF;

      filterStr += '\nvar _filter' + _filterC + ' = p1.filters[\'' + o.name + '\'];\n';
      filterStr += 'if (!_filter' + _filterC + ') {\n';
      filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
      filterStr += '}\n';
      filterStr += 'else {\n';
      filterStr += '  var _thisF' + _thisFC + ' = p1.lightObj();\n';
      if (noConfig || configF.useString) {
        filterStr += '  _thisF' + _thisFC + '.useString = p1.useString;\n';
      }
      if (noConfig || configF.data) {
        filterStr += '  _thisF' + _thisFC + '.data = parent.data;\n';
      }
      if (noConfig || configF.parent) {
        filterStr += '  _thisF' + _thisFC + '.parent = parent.parent;\n';
      }
      if (noConfig || configF.index) {
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
      valueStr: _buildEscape(valueStr, useString, escape),
      filterStr: filterStr
    };
  }
  else {
    return _buildEscape(dataValueStr, useString, escape);
  }
}

function _buildEscape(valueStr, useString, escape) {
  if (useString && escape) {
    return 'p1.escape(' + valueStr + ')';
  }
  else {
    return valueStr;
  }
}

function _buildProps(obj, counter, fns) {
  var str0 = obj.strs[0],
    valueStr = '',
    filterStr = '';

  if (utils.isString(str0)) {  //常规属性
    valueStr = !obj.isAll && str0 !== '' ? ('\'' + str0 + '\'') : '';
    filterStr = '';

    utils.each(obj.props, function (o, i) {
      var propData = _buildPropData(o, counter, fns),
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
        dataValueStr = (str0 === '' && i == 0 ? '' : ' + ')
          + '(' + dataValueStr + ')'
          + (strI !== '' ? ' + \'' + strI + '\'' : '');
      }
      else if (obj.isTmplPlace) {  //执行tmpl块模板函数
        dataValueStr += '.call({ _njParent: parent }, data)';
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true, true);
  }
  else if (utils.isObject(str0) && str0.length) {  //tmpl块表达式
    valueStr += '{\n';
    utils.each(str0, function (v, k, i, l) {
      if (k !== 'length') {
        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, fns, 'T' + ++fns._noT);
      }
      else {
        valueStr += '  length: ' + v;
      }
      if (i < l - 1) {
        valueStr += ',';
      }
      valueStr += '\n';
    }, false, false);
    valueStr += '}';
  }
  else {  //非字符串值
    valueStr = JSON.stringify(str0);
  }

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
  var fnStr = '',
    useString = fns.useString;

  if (node.type === 'nj_plaintext') {  //文本节点
    var valueStr = _buildProps(node.content[0], counter, fns),
      filterStr;
    if (utils.isObject(valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }

    var textStr = _buildRender(1, retType, { text: valueStr }, fns);
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    if (useString) {
      fnStr += textStr;
    }
    else {  //文本中的特殊字符需转义
      fnStr += replaceSpecialSymbol(textStr);
    }
  }
  else if (node.type === 'nj_expr') {  //块表达式节点
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
        var valueStr = _buildPropData(o, counter, fns, true);
        if (utils.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + (i < len - 1 ? ',' : '');
      }, false, true);
      dataReferStr += '\n];\n';

      if (filterStr !== '') {
        dataReferStr = filterStr + dataReferStr;
      }

      fnStr += dataReferStr;
    }

    //如果表达式不存在则打印警告信息
    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

    //执行表达式块
    var _thisC = counter._this++,
      configE = exprConfig[node.expr],
      noConfig = !configE,
      newContext = configE ? configE.newContext : false,
      newContextP = counter.newContext;

    fnStr += '\nvar _this' + _thisC + ' = p1.lightObj();\n';
    if (noConfig || configE.useString) {
      fnStr += '_this' + _thisC + '.useString = p1.useString;\n';
    }
    if (noConfig || configE.data) {
      fnStr += '_this' + _thisC + '.data = parent.data;\n';
    }
    if (noConfig || configE.parent) {
      fnStr += '_this' + _thisC + '.parent = parent.parent;\n';
    }
    if (noConfig || configE.index) {
      fnStr += '_this' + _thisC + '.index = parent.index;\n';
    }

    //params块
    var paramsEStr = 'p5';
    if (retType && retType._paramsE) {
      paramsEStr = retType._paramsE;
    }
    if (noConfig || configE.paramsExpr) {
      fnStr += '_this' + _thisC + '.paramsExpr = ' + paramsEStr + ';\n';
    }

    if (noConfig || configE.result) {
      fnStr += '_this' + _thisC + '.result = ' + (node.content ? 'p1.exprRet(p1, ' + (newContextP ? '_' : '') + 'p2, ' + (newContextP ? '_' : '') + 'p3, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext) + ', ' + paramsEStr + ')' : 'p1.noop') + ';\n';
    }
    if (noConfig || configE.inverse) {
      fnStr += '_this' + _thisC + '.inverse = ' + (node.contentElse ? 'p1.exprRet(p1, ' + (newContextP ? '_' : '') + 'p2, ' + (newContextP ? '_' : '') + 'p3, p1.fn' + _buildFn(node.contentElse, fns, ++fns._no, newContext) + ', ' + paramsEStr + ')' : 'p1.noop') + ';\n';
    }

    //渲染
    fnStr += _buildRender(2, retType, {
      _expr: _exprC,
      _dataRefer: dataReferStr !== '' ? _dataReferC : 'none',
      _this: _thisC
    }, fns);
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

    var typeStr;
    if (!useString) {
      typeStr = 'p1.compClass[\'' + _type + '\'] ? p1.compClass[\'' + _type + '\'] : \'' + _type + '\'';
    }
    else {
      typeStr = '\'' + _type + '\'';
    }

    if (node.typeRefer) {
      var _typeReferC = counter._typeRefer++,
        valueStrT = _buildProps(node.typeRefer, counter, fns);
      if (utils.isObject(valueStrT)) {
        fnStr += valueStrT.filterStr;
        valueStrT = valueStrT.valueStr;
      }

      fnStr += '\nvar _typeRefer' + _typeReferC + ' = ' + valueStrT + ';\n';
      fnStr += 'var _type' + _typeC + ' = _typeRefer' + _typeReferC + ' ? _typeRefer' + _typeReferC + ' : (' + typeStr + ');\n';
    }
    else {
      fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';
    }

    //节点参数
    var params = node.params,
      paramsExpr = node.paramsExpr,
      paramsStr = '';
    if (params || paramsExpr) {
      var _paramsC = counter._params++;
      paramsStr = 'var _params' + _paramsC + ' = ';

      //params块
      if (paramsExpr) {
        var _paramsEC = counter._paramsE++;
        paramsStr += (useString ? '\'\'' : 'null') + ';\n';
        paramsStr += 'var _paramsE' + _paramsEC + ' = {};\n';

        //params块的子节点
        paramsStr += _buildContent(paramsExpr.content, fns, counter, { _paramsE: '_paramsE' + _paramsEC });

        //合并params块的值
        if (!useString) {
          paramsStr += '\n_params' + _paramsC + ' = _paramsE' + _paramsEC + ';\n';
          //paramsStr += '\np1.assign(_params' + _paramsC + ', _paramsE' + _paramsEC + ');\n';
        }
        else {
          var keys = '';
          utils.each(params, function (v, k, i, l) {
            if (i == 0) {
              keys += '{ ';
            }
            keys += k + ': 1';

            if (i < l - 1) {
              keys += ', '
            }
            else {
              keys += ' }';
            }
          }, false, false);
          paramsStr += '_params' + _paramsC + ' += p1.assignStringProp(_paramsE' + _paramsEC + ', ' + (keys === '' ? 'null' : keys) + ');\n';
        }
      }

      if (params) {
        var paramKeys = Object.keys(params),
          len = paramKeys.length,
          filterStr = '';

        if (!useString && !paramsExpr) {
          paramsStr += '{\n';
        }

        utils.each(paramKeys, function (k, i) {
          var valueStr = _buildProps(params[k], counter, fns);
          if (utils.isObject(valueStr)) {
            filterStr += valueStr.filterStr;
            valueStr = valueStr.valueStr;
          }

          if (!useString && k === 'style') {  //将style字符串转换为对象
            valueStr = 'p1.styleProps(' + valueStr + ')';
          }

          var key;
          if (useString) {
            key = k;
          }
          else {
            key = utils.fixPropName(k);
          }
          if (!paramsExpr) {
            if (!useString) {
              paramsStr += '  ' + key + ': ' + valueStr + (i < len - 1 ? ',\n' : '');
            }
            else {
              paramsStr += (i > 0 ? '  + ' : '') + '\' ' + key + '="\' + ' + valueStr + ' + \'"\'' + (i == len - 1 ? ';' : '') + '\n';
            }
          }
          else {
            if (!useString) {
              paramsStr += '_params' + _paramsC + '.' + key + ' = ' + valueStr + ';\n';
            }
            else {
              paramsStr += '_params' + _paramsC + ' += \' ' + key + '="\' + ' + valueStr + ' + \'"\';\n';
            }
          }
        }, false, false);

        if (!useString && !paramsExpr) {
          paramsStr += '\n};\n';
        }

        if (filterStr !== '') {
          paramsStr = filterStr + paramsStr;
        }

        fnStr += paramsStr;
      }
    }

    var _compParamC, _childrenC;
    if (!useString) {  //组件引擎参数
      _compParamC = counter._compParam++;
      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';
    }
    else {  //子节点字符串
      _childrenC = counter._children++;
      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
    }

    //子节点
    fnStr += _buildContent(node.content, fns, counter, !useString
      ? { _compParam: '_compParam' + _compParamC }
      : { _children: '_children' + _childrenC });

    //渲染
    fnStr += _buildRender(3, retType, !useString
      ? { _compParam: _compParamC }
      : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns);
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

function _buildRender(nodeType, retType, params, fns) {
  var retStr,
    useString = fns.useString;

  switch (nodeType) {
    case 1:  //文本节点
      retStr = params.text;
      break;
    case 2:  //块表达式
      retStr = '_expr' + params._expr + '.apply(_this' + params._this + (params._dataRefer !== 'none' ? ', _dataRefer' + params._dataRefer : '') + ')';
      break;
    case 3:  //元素节点
      if (!useString) {
        retStr = 'p1.compPort.apply(p1.compLib, _compParam' + params._compParam + ')';
      }
      else {
        retStr = '\'<\' + _type' + params._type + ' + ' + (params._params != null ? '_params' + params._params + ' + ' : '');
        if (!params._selfClose) {
          retStr += '\'>\'';
          retStr += ' + _children' + params._children + ' + ';
          retStr += '\'</\' + _type' + params._type + ' + \'>\'';
        }
        else {
          retStr += '\'/>\'';
        }
      }
      break;
  }

  //保存方式
  if (retType === '1') {
    return '\nreturn ' + retStr + ';';
  }
  else if (retType === '2') {
    if (!useString) {
      return '\nret.push(' + retStr + ');\n';
    }
    else {
      return '\nret += ' + retStr + ';\n';
    }
  }
  else if (retType._paramsE) {
    return '\n' + retStr + ';\n';
  }
  else {
    if (!useString) {
      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
    }
    else {
      return '\n' + retType._children + ' += ' + retStr + ';\n';
    }
  }
}

module.exports = function (ast, useString) {
  var fns = {
    useString: useString,
    _no: 0,  //块表达式函数计数
    _noT: 0  //tmpl块模板函数计数
  };

  _buildFn(ast, fns, fns._no);
  return fns;
};
