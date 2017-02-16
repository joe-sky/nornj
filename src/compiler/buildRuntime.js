import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';
import { unescape } from '../utils/escape';
import { exprConfig } from '../helpers/expression';
import { filterConfig } from '../helpers/filter';
const { errorTitle } = nj;

function _buildFn(content, fns, no, newContext, level, useStringLocal) {
  let fnStr = '',
    useString = useStringLocal != null ? useStringLocal : fns.useString,
    isTmplExpr = tools.isString(no), //如果no为字符串, 则本次将构建tmpl块模板函数
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

  fnStr += _buildContent(content, fns, counter, retType, level, useStringLocal);

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

function _buildOptions(config, useStringLocal, node, fns, exprPropsStr, level, hashProps) {
  let hashStr = '',
    noConfig = !config;

  if (noConfig || config.useString) {
    hashStr += ', useString: ' + (useStringLocal == null ? 'p1.useString' : (useStringLocal ? 'true' : 'false'));
  }
  if (node) { //块表达式
    let newContext = config ? config.newContext : true;
    if (noConfig || config.exprProps) {
      hashStr += ', exprProps: ' + exprPropsStr;
    }

    hashStr += ', result: ' + (node.content ? 'p1.exprRet(p1, p2, p1.fn' + _buildFn(node.content, fns, ++fns._no, newContext, level, useStringLocal) + ', ' + exprPropsStr + ')' : 'p1.noop');

    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
  }

  return '{ _njOpts: true, ctx: p2, outputH: ' + !fns.useString + hashStr + ' }';
}

function _buildPropData(obj, counter, fns, useStringLocal) {
  let dataValueStr,
    escape = obj.escape;
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
      for (let i = 0; i < parentNum; i++) {
        data = 'parent.' + data;
      }

      if (!special) {
        specialP = true;
      }
    }

    if (!special && !specialP) {
      dataValueStr = (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\')' + (isComputed ? ', p2)' : '') + jsProp;
    } else {
      let dataStr = 'p2.' + data;
      dataValueStr = (special ? dataStr : (isComputed ? 'p1.getComputedData(' : '') + 'p2.getData(\'' + name + '\', ' + dataStr + ')' + (isComputed ? ', p2)' : '')) + jsProp;
    }
  } else {
    dataValueStr = obj.prop.name + jsProp;
  }

  //有过滤器时需要生成"_value"值
  let filters = obj.prop.filters;
  if (filters) {
    let valueStr = '_value' + counter._value++,
      filterStr = 'var ' + valueStr + ' = ' + dataValueStr + ';\n';

    tools.each(filters, function(o) {
      let _filterC = counter._filter++,
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
          return p + ', ' + _buildPropData({
            prop: c,
            escape
          }, counter, fns, useStringLocal);
        }, '') : '') +
        ', ' + _buildOptions(configF, useStringLocal, null, fns) +
        ']);\n';
      filterStr += '}\n';
    }, false, true);

    return {
      valueStr: _buildEscape(valueStr, fns, isComputed ? false : escape),
      filterStr: filterStr
    };
  } else {
    return _buildEscape(dataValueStr, fns, isComputed ? false : escape);
  }
}

function _buildEscape(valueStr, fns, escape) {
  if (fns.useString) {
    if (escape) {
      return 'p1.escape(' + valueStr + ')';
    } else {
      return valueStr;
    }
  } else { //文本中的特殊字符需转义
    return unescape(valueStr);
  }
}

function _replaceQuot(str) {
  return str.replace(/'/g, "\\'");
}

function _buildProps(obj, counter, fns, useStringLocal) {
  let str0 = obj.strs[0],
    valueStr = '',
    filterStr = '';

  if (tools.isString(str0)) { //常规属性
    valueStr = !obj.isAll && str0 !== '' ? ('\'' + _replaceQuot(str0) + '\'') : '';
    filterStr = '';

    tools.each(obj.props, function(o, i) {
      let propData = _buildPropData(o, counter, fns, useStringLocal),
        dataValueStr;
      if (tools.isString(propData)) {
        dataValueStr = propData;
      } else {
        dataValueStr = propData.valueStr;
        filterStr += propData.filterStr;
      }

      if (!obj.isAll) {
        let strI = obj.strs[i + 1],
          prefixStr = (str0 === '' && i == 0 ? '' : ' + ');

        if (strI.trim() === '\\n') { //如果只包含换行符号则忽略
          valueStr += prefixStr + dataValueStr;
          return;
        }

        dataValueStr = prefixStr +
          '(' + dataValueStr + ')' +
          (strI !== '' ? ' + \'' + _replaceQuot(strI) + '\'' : '');
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true);
  } else if (tools.isObject(str0) && str0.length != null) { //tmpl块表达式
    valueStr += '{\n';
    tools.each(str0, function(v, k, i, l) {
      if (k !== 'length') {
        valueStr += '  "' + k + '": p1.main' + _buildFn(v.content, fns, 'T' + ++fns._noT);
      } else {
        valueStr += '  length: ' + v;
      }

      valueStr += ',\n';
      if (i === l - 1) { //传递上下文参数
        valueStr += '  _njData: p2.data,\n  _njParent: p2.parent,\n  _njIndex: p2.index\n';
      }
    }, false, false);
    valueStr += '}';
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

function _buildParams(node, fns, counter, useString) {
  //节点参数
  const { params, paramsExpr } = node;
  let paramsStr = '',
    _paramsC,
    useStringF = fns.useString;

  if (params || paramsExpr) {
    _paramsC = counter._params++;
    paramsStr = 'var _params' + _paramsC + ' = ';

    //params块
    if (paramsExpr) {
      let _paramsEC = counter._paramsE++;
      paramsStr += (useString ? '\'\'' : 'null') + ';\n';
      paramsStr += 'var _paramsE' + _paramsEC + ' = {};\n';

      //params块的子节点
      paramsStr += _buildContent(paramsExpr.content, fns, counter, { _paramsE: '_paramsE' + _paramsEC }, null, useString);

      //合并params块的值
      if (!useString) {
        paramsStr += '\n_params' + _paramsC + ' = _paramsE' + _paramsEC + ';\n';
        //paramsStr += '\np1.assign(_params' + _paramsC + ', _paramsE' + _paramsEC + ');\n';
      } else {
        let keys = '';
        tools.each(params, function(v, k, i, l) {
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
      let paramKeys = Object.keys(params),
        len = paramKeys.length,
        filterStr = '';

      if (!useString && !paramsExpr) {
        paramsStr += '{\n';
      }

      tools.each(paramKeys, function(k, i) {
        let valueStr = _buildProps(params[k], counter, fns, useString);
        if (tools.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        if (!useStringF && k === 'style') { //将style字符串转换为对象
          valueStr = 'p1.styleProps(' + valueStr + ')';
        }

        let key = k,
          onlyKey = ('\'' + key + '\'') === valueStr;
        if (!useStringF) {
          key = tranData.fixPropName(k);
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
  }

  return [paramsStr, _paramsC];
}

function _buildNode(node, fns, counter, retType, level, useStringLocal) {
  let fnStr = '',
    useStringF = fns.useString;

  if (node.type === 'nj_plaintext') { //文本节点
    let valueStr = _buildProps(node.content[0], counter, fns, useStringLocal),
      filterStr;
    if (tools.isObject(valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }

    let textStr = _buildRender(1, retType, { text: valueStr }, fns, level, useStringLocal);
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    if (useStringF) {
      fnStr += textStr;
    } else { //文本中的特殊字符需转义
      fnStr += unescape(textStr);
    }
  } else if (node.type === 'nj_expr') { //块表达式节点
    let _exprC = counter._expr++,
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

    if (node.args) { //构建匿名参数
      tools.each(node.args, function(arg, i) {
        let valueStr = _buildProps(arg, counter, fns, useStringLocal);
        if (tools.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + ',';
      }, false, true);
    }

    //props块
    let exprPropsStr = 'p4';
    if (retType && retType._paramsE) {
      exprPropsStr = retType._paramsE;
    }

    //hash参数
    let retP = _buildParams(node, fns, counter, false),
      paramsStr = retP[0],
      _paramsC = retP[1];

    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exprPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null);
    dataReferStr += '\n];\n';

    if (filterStr !== '') {
      dataReferStr = filterStr + dataReferStr;
    }

    fnStr += paramsStr + dataReferStr;

    //如果块表达式不存在则打印警告信息
    fnStr += 'p1.throwIf(_expr' + _exprC + ', \'' + node.expr + '\', \'expr\');\n';

    //渲染
    fnStr += _buildRender(2, retType, {
      _expr: _exprC,
      _dataRefer: _dataReferC
    }, fns, level, useStringLocal);
  } else { //元素节点
    //节点类型和typeRefer
    let _typeC = counter._type++,
      _type;
    if (node.typeRefer) {
      _type = node.typeRefer.props[0].prop.name;
    } else {
      _type = node.type;
    }

    let typeStr;
    if (!useStringF) {
      typeStr = 'p1.components[\'' + _type.toLowerCase() + '\'] ? p1.components[\'' + _type.toLowerCase() + '\'] : \'' + _type + '\'';
    } else {
      typeStr = '\'' + _type + '\'';
    }

    if (node.typeRefer) {
      let _typeReferC = counter._typeRefer++,
        valueStrT = _buildProps(node.typeRefer, counter, fns);
      if (tools.isObject(valueStrT)) {
        fnStr += valueStrT.filterStr;
        valueStrT = valueStrT.valueStr;
      }

      fnStr += '\nvar _typeRefer' + _typeReferC + ' = ' + valueStrT + ';\n';
      fnStr += 'var _type' + _typeC + ' = _typeRefer' + _typeReferC + ' ? _typeRefer' + _typeReferC + ' : (' + typeStr + ');\n';
    } else {
      fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';
    }

    //节点参数
    let retP = _buildParams(node, fns, counter, useStringF),
      paramsStr = retP[0],
      _paramsC = retP[1];
    fnStr += paramsStr;

    let _compParamC, _childrenC;
    if (!useStringF) { //组件参数
      _compParamC = counter._compParam++;
      fnStr += 'var _compParam' + _compParamC + ' = [_type' + _typeC + ', ' + (paramsStr !== '' ? '_params' + _paramsC : 'null') + '];\n';
    } else { //子节点字符串
      _childrenC = counter._children++;
      fnStr += 'var _children' + _childrenC + ' = \'\';\n';
    }

    //子节点
    fnStr += _buildContent(node.content, fns, counter, !useStringF ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, level != null ? level + 1 : level, useStringLocal);

    //渲染
    fnStr += _buildRender(3, retType, !useStringF ? { _compParam: _compParamC } : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level, useStringLocal);
  }

  return fnStr;
}

function _buildContent(content, fns, counter, retType, level, useStringLocal) {
  let fnStr = '';
  if (!content) {
    return fnStr;
  }

  tools.each(content, function(node) {
    fnStr += _buildNode(node, fns, counter, retType, level, node.useString ? true : useStringLocal);
  }, false, true);

  return fnStr;
}

function _buildRender(nodeType, retType, params, fns, level, useStringLocal) {
  let retStr,
    useStringF = fns.useString,
    useString = useStringLocal != null ? useStringLocal : useStringF;

  switch (nodeType) {
    case 1: //文本节点
      retStr = _buildLevelSpace(level, fns) + params.text + (!useStringF || level == null ? '' : ' + \'\\n\'');
      break;
    case 2: //块表达式
      retStr = '_expr' + params._expr + '.apply(p2, _dataRefer' + params._dataRefer + ')';
      break;
    case 3: //元素节点
      if (!useStringF) {
        retStr = 'p1.h.apply(null, _compParam' + params._compParam + ')';
      } else {
        let levelSpace = _buildLevelSpace(level, fns);
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
    if (!useStringF) {
      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
    } else {
      return '\n' + retType._children + ' += ' + retStr + ';\n';
    }
  }
}

function _buildLevelSpace(level, fns) {
  let ret = '';
  if (fns.useString && level != null && level > 0) {
    ret += '\'';
    for (let i = 0; i < level; i++) {
      ret += '  ';
    }
    ret += '\' + ';
  }
  return ret;
}

export default (ast, useString) => {
  const fns = {
    useString,
    _no: 0, //块表达式函数计数
    _noT: 0 //tmpl块模板函数计数
  };

  _buildFn(ast, fns, fns._no, null, 0);
  return fns;
};