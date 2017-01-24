'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  errorTitle = nj.errorTitle,
  exprConfig = utils.exprConfig,
  filterConfig = utils.filterConfig,
  replaceSpecialSymbol = require('../utils/replaceSpecialSymbol');

function _buildFn(content, fns, no, newContext, level) {
  var fnStr = '',
    useString = fns.useString,
    isTmplExpr = utils.isString(no), //如果no为字符串, 则本次将构建tmpl块模板函数
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
      _value: 0,
      _filter: 0,
      newContext: newContext
    };

  if (!useString) {
    counter._compParam = 0;
  } else {
    counter._children = 0;
  }

  if (!main && newContext) {
    fnStr += 'p2 = p1.newContext(p2, p3);\n';
  }

  if (retType === '2') {
    if (!useString) {
      fnStr += 'var ret = [];\n';
    } else {
      fnStr += 'var ret = \'\';\n';
    }
  }

  fnStr += _buildContent(content, fns, counter, retType, level);

  if (retType === '2') {
    fnStr += 'return ret;';
  }

  /* 构建块表达式函数
   p1: 模板全局数据
   p2: 节点上下文数据
   p3: 块表达式内调用result及inverse方法传递的参数
   p4: #props块变量
  */
  fns[main ? 'main' + (isTmplExpr ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', fnStr);
  return no;
}

function _buildOptions(config, node, fns, exprPropsStr, level) {
  var hashStr = '',
    noConfig = !config;

  if (noConfig || config.useString) {
    hashStr += ', useString: p1.useString';
  }
  if (node) {
    var newContext = config ? config.newContext : true;
    if (noConfig || config.exprProps) {
      hashStr += ', exprProps: ' + exprPropsStr;
    }

    hashStr += ', result: ' + (node.content ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext, level) + ', ' + exprPropsStr + ')' : 'p1.noop');
    hashStr += ', inverse: ' + (node.contentElse ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.contentElse, fns, ++fns._no, newContext, level) + ', ' + exprPropsStr + ')' : 'p1.noop');
  }

  return hashStr.length ? '{ _njOpts: true' + hashStr + ' }' : '';
}

function _buildPropData(obj, counter, fns, noEscape) {
  let dataValueStr,
    useString = fns.useString,
    escape = !noEscape ? obj.escape : false;
  const { jsProp, isComputed } = obj.prop;

  //先生成数据值
  if (!obj.prop.isBasicType) {
    const { name, parentNum } = obj.prop;
    let data = '',
      special = false,
      specialP = false;

    if (name === '@index') {
      data = 'index';
      special = true;
    } else if (name === 'this') {
      data = 'data[0]';
      special = true;
    }

    if (parentNum) {
      if (!data) {
        data = 'data';
      }
      for (var i = 0; i < parentNum; i++) {
        data = 'parent.' + data;
      }

      if (!special) {
        specialP = true;
      }
    }

    if (!special && !specialP) {
      dataValueStr = (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\')' + (isComputed ? ', p2)' : '') + jsProp;
    } else {
      var dataStr = 'p2.' + data;
      dataValueStr = (special ? dataStr : (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\', ' + dataStr + ')' + (isComputed ? ', p2)' : '')) + jsProp;
    }
  } else {
    dataValueStr = obj.prop.name + jsProp;
  }

  //有过滤器时需要生成"_value"值
  var filters = obj.prop.filters;
  if (filters) {
    var valueStr = '_value' + counter._value++,
      filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

    utils.each(filters, function(o) {
      var _filterC = counter._filter++,
        configF = filterConfig[o.name],
        filterVarStr = '_filter' + _filterC,
        globalFilterStr = 'p1.filters[\'' + o.name + '\']';

      if (configF) {
        filterStr += '\nvar ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
      } else { //如果全局配置不存在,先从p2.data中获取
        filterStr += '\nvar ' + filterVarStr + ' = p2.getData(\'' + o.name + '\');\n';
        filterStr += 'if(!' + filterVarStr + ') ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
      }
      filterStr += 'if (!' + filterVarStr + ') {\n';
      filterStr += '  p1.warn(\'' + o.name + '\', \'filter\');\n';
      filterStr += '}\n';
      filterStr += 'else {\n';
      filterStr += '  ' + valueStr + ' = ' + filterVarStr + '.apply(p2, [' + valueStr +
        (o.params ? o.params.reduce(function(p, c) {
          return p + ', \'' + c + '\'';
        }, '') : '') +
        ', ' + _buildOptions(configF) +
        ']);\n';
      filterStr += '}\n';
    }, false, true);

    return {
      valueStr: _buildEscape(valueStr, useString, isComputed ? false : escape),
      filterStr: filterStr
    };
  } else {
    return _buildEscape(dataValueStr, useString, isComputed ? false : escape);
  }
}

function _buildEscape(valueStr, useString, escape) {
  if (useString) {
    if (escape) {
      return 'p1.escape(' + valueStr + ')';
    } else {
      return valueStr;
    }
  } else { //文本中的特殊字符需转义
    return replaceSpecialSymbol(valueStr);
  }
}

function _replaceQuot(str, fns) {
  if(fns.useString) {
    return str.replace(/'/g, "\\'");
  }
  else {
    return str;
  }
}

function _buildProps(obj, counter, fns) {
  var str0 = obj.strs[0],
    valueStr = '',
    filterStr = '';

  if (utils.isString(str0)) { //常规属性
    valueStr = !obj.isAll && str0 !== '' ? ('\'' + _replaceQuot(str0, fns) + '\'') : '';
    filterStr = '';

    utils.each(obj.props, function(o, i) {
      var propData = _buildPropData(o, counter, fns),
        dataValueStr;
      if (utils.isString(propData)) {
        dataValueStr = propData;
      } else {
        dataValueStr = propData.valueStr;
        filterStr += propData.filterStr;
      }

      if (!obj.isAll) {
        var strI = obj.strs[i + 1];
        if(!fns.useString && strI.trim() === '\\n') {  //在outputH时如果只包含换行符号则忽略
          valueStr += dataValueStr;
          return;
        }

        dataValueStr = (str0 === '' && i == 0 ? '' : ' + ') +
          '(' + dataValueStr + ')' +
          (strI !== '' ? ' + \'' + _replaceQuot(strI, fns) + '\'' : '');
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true);
  } else if (utils.isObject(str0) && str0.length != null) { //tmpl块表达式
    valueStr += '{\n';
    utils.each(str0, function(v, k, i, l) {
      if (k !== 'length') {
        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, fns, 'T' + ++fns._noT);
      } else {
        valueStr += '  length: ' + v;
      }

      valueStr += ',\n';
      if (i === l - 1) {  //传递上下文参数
        valueStr += '  _njData: p2.data,\n  _njParent: p2.parent,\n  _njIndex: p2.index\n';
      }
    }, false, false);
    valueStr += '}';
  } else if (utils.isObject(str0) && str0._njEx) {
    valueStr = str0._njEx;
  }

  if (filterStr === '') {
    return valueStr;
  } else { //包含过滤器
    return {
      valueStr: valueStr,
      filterStr: filterStr
    };
  }
}

function _buildNode(node, fns, counter, retType, level) {
  var fnStr = '',
    useString = fns.useString;

  if (node.type === 'nj_plaintext') { //文本节点
    var valueStr = _buildProps(node.content[0], counter, fns),
      filterStr;
    if (utils.isObject(valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }

    var textStr = _buildRender(1, retType, { text: valueStr }, fns, level);
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    if (useString) {
      fnStr += textStr;
    } else { //文本中的特殊字符需转义
      fnStr += replaceSpecialSymbol(textStr);
    }
  } else if (node.type === 'nj_expr') { //块表达式节点
    var _exprC = counter._expr++,
      _dataReferC = counter._dataRefer++,
      dataReferStr = '',
      filterStr = '',
      configE = exprConfig[node.expr],
      exprVarStr = '_expr' + _exprC,
      globalExprStr = 'p1.exprs[\'' + node.expr + '\']';

    if (configE) {
      fnStr += '\nvar ' + exprVarStr + ' = ' + globalExprStr + ';\n';
    } else { //如果全局配置不存在,先从p2.data中获取
      fnStr += '\nvar ' + exprVarStr + ' = p2.getData(\'' + node.expr + '\');\n';
      fnStr += 'if(!' + exprVarStr + ') ' + exprVarStr + ' = ' + globalExprStr + ';\n';
    }

    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

    if (node.refer) {
      var props = node.refer.props;
      utils.each(props, function(o, i) {
        var valueStr = _buildPropData(o, counter, fns, true);
        if (utils.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + ',';
      }, false, true);
    }

    //props块
    var exprPropsStr = 'p4';
    if (retType && retType._paramsE) {
      exprPropsStr = retType._paramsE;
    }

    dataReferStr += _buildOptions(configE, node, fns, exprPropsStr, level);
    dataReferStr += '\n];\n';

    if (filterStr !== '') {
      dataReferStr = filterStr + dataReferStr;
    }

    fnStr += dataReferStr;

    //如果块表达式不存在则打印警告信息
    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

    //渲染
    fnStr += _buildRender(2, retType, {
      _expr: _exprC,
      _dataRefer: _dataReferC
    }, fns, level);
  } else { //元素节点
    //节点类型和typeRefer
    var _typeC = counter._type++,
      _type;
    if (node.typeRefer) {
      _type = node.typeRefer.props[0].prop.name;
    } else {
      _type = node.type;
    }

    var typeStr;
    if (!useString) {
      typeStr = 'p1.components[\'' + _type.toLowerCase() + '\'] ? p1.components[\'' + _type.toLowerCase() + '\'] : \'' + _type + '\'';
    } else {
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
    } else {
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
        } else {
          var keys = '';
          utils.each(params, function(v, k, i, l) {
            if (i == 0) {
              keys += '{ ';
            }
            keys += k + ': 1';

            if (i < l - 1) {
              keys += ', ';
            } else {
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

        utils.each(paramKeys, function(k, i) {
          var valueStr = _buildProps(params[k], counter, fns);
          if (utils.isObject(valueStr)) {
            filterStr += valueStr.filterStr;
            valueStr = valueStr.valueStr;
          }

          if (!useString && k === 'style') { //将style字符串转换为对象
            valueStr = 'p1.styleProps(' + valueStr + ')';
          }

          var key = k,
            onlyKey = ('\'' + key + '\'') === valueStr;
          if (!useString) {
            key = utils.fixPropName(k);
          }
          if (!paramsExpr) {
            if (!useString) {
              paramsStr += '  \'' + key + '\': ' + (!onlyKey ? valueStr : 'true') + (i < len - 1 ? ',\n' : '');
            } else {
              paramsStr += (i > 0 ? '  + ' : '') + '\' ' + key + (!onlyKey ? '="\' + ' + valueStr + ' + \'"\'' : ' \'') + (i == len - 1 ? ';' : '') + '\n';
            }
          } else {
            if (!useString) {
              paramsStr += '_params' + _paramsC + '[\'' + key + '\'] = ' + (!onlyKey ? valueStr : 'true') + ';\n';
            } else {
              paramsStr += '_params' + _paramsC + ' += \' ' + key + (!onlyKey ? '="\' + ' + valueStr + ' + \'"\'' : ' \'') + ';\n';
            }
          }
        }, false, false);

        if (!useString && !paramsExpr) {
          paramsStr += '\n};\n';
        }

        if (filterStr !== '') {
          paramsStr = filterStr + paramsStr;
        }
      }

      fnStr += paramsStr;
    }

    var _compParamC, _childrenC;
    if (!useString) { //组件引擎参数
      _compParamC = counter._compParam++;
      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';
    } else { //子节点字符串
      _childrenC = counter._children++;
      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
    }

    //子节点
    fnStr += _buildContent(node.content, fns, counter, !useString ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, level != null ? level + 1 : level);

    //渲染
    fnStr += _buildRender(3, retType, !useString ? { _compParam: _compParamC } : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level);
  }

  return fnStr;
}

function _buildContent(content, fns, counter, retType, level) {
  var fnStr = '';
  if (!content) {
    return fnStr;
  }

  utils.each(content, function(node) {
    fnStr += _buildNode(node, fns, counter, retType, level);
  }, false, true);

  return fnStr;
}

function _buildRender(nodeType, retType, params, fns, level) {
  var retStr,
    useString = fns.useString;

  switch (nodeType) {
    case 1: //文本节点
      retStr = _buildLevelSpace(level, useString) + params.text + (!useString || level == null ? '' : ' + \'\\n\'');
      break;
    case 2: //块表达式
      retStr = '_expr' + params._expr + '.apply(p2, _dataRefer' + params._dataRefer + ')';
      break;
    case 3: //元素节点
      if (!useString) {
        retStr = 'p1.h.apply(null, _compParam' + params._compParam + ')';
      } else {
        var levelSpace = _buildLevelSpace(level, useString);
        retStr = levelSpace + '\'<\' + _type' + params._type + ' + ' + (params._params != null ? '_params' + params._params + ' + ' : '');
        if (!params._selfClose) {
          retStr += '\'>\\n\'';
          retStr += ' + _children' + params._children + ' + ';
          retStr += levelSpace + '\'</\' + _type' + params._type + ' + \'>\\n\'';
        } else {
          retStr += '\' />\\n\'';
        }
      }
      break;
  }

  //保存方式
  if (retType === '1') {
    return '\nreturn ' + retStr + ';';
  } else if (retType === '2') {
    if (!useString) {
      return '\nret.push(' + retStr + ');\n';
    } else {
      return '\nret += ' + retStr + ';\n';
    }
  } else if (retType._paramsE) {
    return '\n' + retStr + ';\n';
  } else {
    if (!useString) {
      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
    } else {
      return '\n' + retType._children + ' += ' + retStr + ';\n';
    }
  }
}

function _buildLevelSpace(level, useString) {
  var ret = '';
  if (useString && level != null && level > 0) {
    ret += '\'';
    for (var i = 0; i < level; i++) {
      ret += '  ';
    }
    ret += '\' + ';
  }
  return ret;
}

module.exports = function(ast, useString) {
  var fns = {
    useString: useString,
    _no: 0, //块表达式函数计数
    _noT: 0 //tmpl块模板函数计数
  };

  _buildFn(ast, fns, fns._no, null, 0);
  return fns;
};