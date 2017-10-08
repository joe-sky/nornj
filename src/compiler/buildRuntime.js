import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';
import { unescape } from '../utils/escape';
import { extensionConfig } from '../helpers/extension';
import { filterConfig } from '../helpers/filter';
const { errorTitle } = nj;

function _buildFn(content, node, fns, no, newContext, level, useStringLocal, name) {
  let fnStr = '',
    useString = useStringLocal != null ? useStringLocal : fns.useString,
    isTmplEx = tools.isString(no), //如果no为字符串, 则本次将构建tmpl块模板函数
    main = isTmplEx || no === 0,
    /* retType
     1: 只有单个子节点
     2: 有多个子节点
     object: 非构建函数时
    */
    retType = content.length === 1 ? '1' : '2',
    counter = {
      _type: 0,
      _params: 0,
      _paramsE: 0,
      _compParam: 0,
      _dataRefer: 0,
      _ex: 0,
      _value: 0,
      _filter: 0,
      _fnH: 0,
      _tmp: 0,
      newContext
    };

  if (!useString) {
    counter._compParam = 0;
  } else {
    counter._children = 0;
  }

  if (!main && newContext) {
    fnStr += 'p2 = p1.n(p2, p3);\n';
  }

  if (retType === '2') {
    if (!useString) {
      fnStr += 'var ret = [];\n';
    } else {
      fnStr += 'var ret = \'\';\n';
    }
  }

  fnStr += _buildContent(content, node, fns, counter, retType, level, useStringLocal);

  if (retType === '2') {
    fnStr += 'return ret;';
  }

  try {
    /* 构建扩展标签函数
     p1: 模板全局数据
     p2: 节点上下文数据
     p3: 扩展标签内调用result方法传递的参数
     p4: #props变量
     p5：子扩展标签#props变量
    */
    const fn = fns[main ? 'main' + (isTmplEx ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', 'p4', 'p5', fnStr);
    if (isTmplEx && name != null) { //设置函数名
      fn._njName = name;
    }
  } catch (err) {
    tools.error(`Failed to generate template function:\n\n` + err.toString() + ' in\n\n' + fnStr + '\n');
  }
  return no;
}

function _buildOptions(config, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, hashProps, valueL) {
  let hashStr = ', useString: ' + (useStringLocal == null ? 'p1.us' : (useStringLocal ? 'true' : 'false')),
    noConfig = !config;

  if (node) { //扩展标签
    let newContext = config ? config.newContext : true;
    if (noConfig || config.exProps) {
      hashStr += ', exProps: ' + exPropsStr;
    }
    if (noConfig || config.subExProps) {
      hashStr += ', subExProps: ' + subExPropsStr;
    }

    hashStr += ', result: ' + (node.content ? 'p1.r(p1, p2, p1.fn' + _buildFn(node.content, node, fns, ++fns._no, newContext, level, useStringLocal) + ', ' + exPropsStr + ', ' + subExPropsStr + ')' : 'p1.np');

    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
  }

  return '{ _njOpts: true, _njFnsNo: ' + fns._no + ', global: p1, context: p2, outputH: ' + !fns.useString + hashStr + (valueL ? ', lastValue: ' + valueL : '') + (level != null ? ', level: ' + level : '') + ' }';
}

const CUSTOM_VAR = 'nj_custom';

function _buildPropData(obj, counter, fns, useStringLocal, level) {
  let dataValueStr,
    escape = obj.escape,
    isEmpty = false,
    special = false;
  const { jsProp, isComputed } = obj.prop;

  //先生成数据值
  if (obj.prop.isBasicType) {
    dataValueStr = obj.prop.name + jsProp;
  } else if (obj.prop.isEmpty) {
    isEmpty = true;
  } else {
    const { name, parentNum } = obj.prop;
    let data = '',
      specialP = false;

    switch (name) {
      case '@index':
        data = 'index';
        special = true;
        break;
      case 'this':
        data = 'data[0]';
        special = true;
        break;
      case '@data':
        data = 'data';
        special = true;
        break;
      case '@g':
        data = 'p1.g';
        special = CUSTOM_VAR;
        break;
      case '@lt':
        data = '\'<\'';
        special = CUSTOM_VAR;
        break;
      case '@gt':
        data = '\'>\'';
        special = CUSTOM_VAR;
        break;
      case '@lb':
        data = '\'{\'';
        special = CUSTOM_VAR;
        break;
      case '@rb':
        data = '\'}\'';
        special = CUSTOM_VAR;
        break;
      case '@q':
        data = '\'"\'';
        special = CUSTOM_VAR;
        break;
      case '@sq':
        data = '"\'"';
        special = CUSTOM_VAR;
        break;
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
      dataValueStr = (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\'' + (isComputed ? ', 0, true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : '') + jsProp;
    } else {
      let dataStr = special === CUSTOM_VAR ? data : 'p2.' + data;
      dataValueStr = (special ? dataStr : (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\', ' + dataStr + (isComputed ? ', true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : '')) + jsProp;
    }
  }
  if (dataValueStr) {
    dataValueStr = _replaceBackslash(dataValueStr);
  }

  //有过滤器时需要生成"_value"值
  let filters = obj.prop.filters;
  if (filters) {
    const counterValue = counter._value++;
    let valueStr = '_value' + counterValue,
      valueStrL = '_valueL' + counterValue,
      filterStr = 'var ' + valueStr + ' = ' + (!isEmpty ? dataValueStr : 'null') + ', ' + valueStrL + ';\n';

    const tmpStr = '_tmp';
    if (!counter._tmp) { //在同一函数作用域内_tmp变量只创建一次
      filterStr += 'var ' + tmpStr + ';\n';
      counter._tmp++;
    }

    tools.each(filters, (o, i) => {
      let _filterC = counter._filter++,
        configF = filterConfig[o.name],
        hasOptions = !configF || configF.hasOptions,
        filterVarStr = '_filter' + _filterC,
        globalFilterStr = 'p1.f[\'' + o.name + '\']',
        filterStrI = '',
        fnHVarStr;

      if (configF && configF.onlyGlobal) { //只能从全局获取
        filterStr += '\nvar ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
      } else { //优先从p2.data中获取
        fnHVarStr = '_fnH' + counter._fnH++;
        filterStr += '\nvar ' + filterVarStr + ';\n';
        filterStr += 'var ' + fnHVarStr + ' = p2.d(\'' + o.name + '\', 0, true);\n';

        filterStr += 'if (' + fnHVarStr + ') {\n';
        filterStr += '  ' + filterVarStr + ' = ' + fnHVarStr + '.val;\n';
        filterStr += '} else {\n';
        filterStr += '  ' + filterVarStr + ' = ' + globalFilterStr + ';\n';
        filterStr += '}\n';
      }
      if (process.env.NODE_ENV !== 'production') {
        filterStr += 'if (!' + filterVarStr + ') {\n';
        filterStr += '  p1.wn(\'A filter called "' + o.name + '" is undefined.\');\n';
        filterStr += '} else {\n';
      }

      let _filterStr = '  ' + tmpStr + ' = ' + filterVarStr + '.apply(' + (fnHVarStr ? fnHVarStr + ' ? ' + fnHVarStr + '.ctx : p2' : 'p2') + ', [' + ((!isEmpty || i > 0) ? valueStr + ', ' : '') +
        ((o.params && o.params.length) ? o.params.reduce((p, c, i, arr) => {
          const propStr = _buildPropData({
              prop: c,
              escape
            }, counter, fns, useStringLocal, level),
            hasComma = hasOptions || i < arr.length - 1;

          if (tools.isString(propStr)) {
            return p + propStr + (hasComma ? ', ' : '');
          } else {
            filterStrI += propStr.filterStr;
            return p + propStr.valueStr + (hasComma ? ', ' : '');
          }
        }, '') : '') +
        (hasOptions ? _buildOptions(configF, useStringLocal, null, fns, null, null, level, null, valueStrL) : '') +
        ']);\n';
      _filterStr += '  ' + valueStrL + ' = ' + valueStr + ';\n';
      _filterStr += '  ' + valueStr + ' = ' + tmpStr + ';\n';

      if (filterStrI !== '') {
        filterStr += filterStrI;
      }
      filterStr += _filterStr;

      if (process.env.NODE_ENV !== 'production') {
        filterStr += '}';
      }
      filterStr += '\n';
    }, false, true);

    return {
      valueStr: _buildEscape(valueStr, fns, isComputed ? false : escape, special),
      filterStr
    };
  } else {
    return _buildEscape(dataValueStr, fns, isComputed ? false : escape, special);
  }
}

function _buildEscape(valueStr, fns, escape, special) {
  if (fns.useString) {
    if (escape && special !== CUSTOM_VAR) {
      return 'p1.es(' + valueStr + ')';
    } else {
      return valueStr;
    }
  } else { //文本中的特殊字符需转义
    return unescape(valueStr);
  }
}

function _replaceStrs(str) {
  return _replaceBackslash(str).replace(/_njNl_/g, '\\n').replace(/'/g, "\\'");
}

function _replaceBackslash(str) {
  return str = str.replace(/\\/g, '\\\\');
}

function _buildProps(obj, counter, fns, useStringLocal, level) {
  let str0 = obj.strs[0],
    valueStr = '',
    filterStr = '';

  if (tools.isString(str0)) { //常规属性
    valueStr = !obj.isAll && str0 !== '' ? ('\'' + _replaceStrs(str0) + '\'') : '';
    filterStr = '';

    tools.each(obj.props, function(o, i) {
      let propData = _buildPropData(o, counter, fns, useStringLocal, level),
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

        // if (strI.trim() === '\\n') { //如果只包含换行符号则忽略
        //   valueStr += prefixStr + dataValueStr;
        //   return;
        // }

        dataValueStr = prefixStr +
          '(' + dataValueStr + ')' +
          (strI !== '' ? ' + \'' + _replaceStrs(strI) + '\'' : '');
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true);
  } else if (tools.isObject(str0) && str0._njLen != null) { //tmpl标签
    valueStr += '{\n';
    tools.each(str0, function(v, k, i, l) {
      if (k !== '_njLen') {
        const hasName = k.indexOf('_njT') !== 0,
          fnStr = 'p1.main' + _buildFn(v.node.content, v.node, fns, 'T' + ++fns._noT, null, null, null, hasName ? k : null);

        valueStr += '  "' + v.no + '": ' + fnStr;
        if (hasName) {
          valueStr += ',\n  "' + k + '": ' + fnStr;
        }
      } else {
        valueStr += '  length: ' + v;
      }

      valueStr += ',\n';
      if (i === l - 1) { //传递上下文参数
        valueStr += '  _njData: p2.data,\n  \
                       _njParent: p2.parent,\n  \
                       _njIndex: p2.index,\n  \
                       _njLevel: p1.l(' + level + ', p2),\n  \
                       _njIcp: p2.icp\n';
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

function _buildPropsEx(isSub, paramsEC, propsEx, fns, counter, useString, exPropsStr, subExPropsStr) {
  let paramsStr = 'var _paramsE' + paramsEC + ' = {};\n';

  const ret = {};
  if (isSub) {
    ret._paramsE = exPropsStr;
    ret._paramsSE = '_paramsE' + paramsEC;
  } else {
    ret._paramsE = '_paramsE' + paramsEC;
    ret._paramsSE = subExPropsStr;
  }

  //props标签的子节点
  paramsStr += _buildContent(propsEx.content, propsEx, fns, counter, ret, null, useString);
  return paramsStr;
}

function _buildParams(node, fns, counter, useString, level, exPropsStr, subExPropsStr) {
  //节点参数
  const { params, paramsEx, propsExS } = node;
  const useStringF = fns.useString,
    hasPropsEx = paramsEx || propsExS;
  let paramsStr = '',
    _paramsC;

  if (params || hasPropsEx) {
    _paramsC = counter._params++;
    paramsStr = 'var _params' + _paramsC + ' = ';

    //props tag
    if (hasPropsEx) {
      let bothPropsEx = paramsEx && propsExS,
        _paramsEC, _paramsSEC;
      paramsStr += (useString ? '\'\'' : (bothPropsEx ? '{}' : 'null')) + ';\n';

      if (paramsEx) {
        _paramsEC = counter._paramsE++;
        paramsStr += _buildPropsEx(false, _paramsEC, paramsEx, fns, counter, useString, exPropsStr, subExPropsStr);
      }
      if (propsExS) {
        _paramsSEC = counter._paramsE++;
        paramsStr += _buildPropsEx(true, _paramsSEC, propsExS, fns, counter, useString, exPropsStr, subExPropsStr);
      }

      //合并params块的值
      if (!useString) {
        if (bothPropsEx) {
          paramsStr += '\np1.an(_params' + _paramsC + ', _paramsE' + _paramsEC + ', _paramsE' + _paramsSEC + ');\n';
        } else {
          paramsStr += '\n_params' + _paramsC + ' = _paramsE' + (_paramsEC != null ? _paramsEC : _paramsSEC) + ';\n';
        }
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

        paramsStr += '\n_params' + _paramsC + ' += p1.ans(_paramsE' + _paramsEC + ', ' + (keys === '' ? 'null' : keys) + ');\n';
      }
    }

    if (params) {
      let paramKeys = Object.keys(params),
        len = paramKeys.length,
        filterStr = '';

      if (!useString && !hasPropsEx) {
        paramsStr += '{\n';
      }

      tools.each(paramKeys, function(k, i) {
        let valueStr = _buildProps(params[k], counter, fns, useString, level);
        if (tools.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        if (!useStringF && k === 'style') { //将style字符串转换为对象
          valueStr = 'p1.sp(' + valueStr + ')';
        }

        let key = _replaceStrs(k),
          onlyKey = ('\'' + key + '\'') === valueStr;
        if (!useStringF) {
          key = tranData.fixPropName(key);
        }
        if (!hasPropsEx) {
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

      if (!useString && !hasPropsEx) {
        paramsStr += '\n};\n';
      }

      if (filterStr !== '') {
        paramsStr = filterStr + paramsStr;
      }
    }
  }

  return [paramsStr, _paramsC];
}

function _buildNode(node, parent, fns, counter, retType, level, useStringLocal, isFirst) {
  let fnStr = '',
    useStringF = fns.useString;

  if (node.type === 'nj_plaintext') { //文本节点
    let valueStr = _buildProps(node.content[0], counter, fns, useStringLocal, level),
      filterStr;
    if (tools.isObject(valueStr)) {
      filterStr = valueStr.filterStr;
      valueStr = valueStr.valueStr;
    }
    if (valueStr === '') {
      return fnStr;
    }

    let textStr = _buildRender(node, parent, 1, retType, { text: valueStr }, fns, level, useStringLocal, node.allowNewline, isFirst);
    if (filterStr) {
      textStr = filterStr + textStr;
    }

    if (useStringF) {
      fnStr += textStr;
    } else { //文本中的特殊字符需转义
      fnStr += unescape(textStr);
    }
  } else if (node.type === 'nj_ex') { //扩展标签节点
    let _exC = counter._ex++,
      _dataReferC = counter._dataRefer++,
      dataReferStr = '',
      filterStr = '',
      configE = extensionConfig[node.ex],
      exVarStr = '_ex' + _exC,
      globalExStr = 'p1.x[\'' + node.ex + '\']',
      fnHVarStr;

    if (configE && configE.onlyGlobal) { //只能从全局获取
      fnStr += '\nvar ' + exVarStr + ' = ' + globalExStr + ';\n';
    } else { //优先从p2.data中获取
      fnHVarStr = '_fnH' + counter._fnH++;
      fnStr += '\nvar ' + exVarStr + ';\n';
      fnStr += 'var ' + fnHVarStr + ' = p2.d(\'' + node.ex + '\', 0, true);\n';

      fnStr += 'if (' + fnHVarStr + ') {\n';
      fnStr += '  ' + exVarStr + ' = ' + fnHVarStr + '.val;\n';
      fnStr += '} else {\n';
      fnStr += '  ' + exVarStr + ' = ' + globalExStr + ';\n';
      fnStr += '}\n';
    }

    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

    if (node.args) { //构建匿名参数
      tools.each(node.args, function(arg, i) {
        let valueStr = _buildProps(arg, counter, fns, useStringLocal, level);
        if (tools.isObject(valueStr)) {
          filterStr += valueStr.filterStr;
          valueStr = valueStr.valueStr;
        }

        dataReferStr += '  ' + valueStr + ',';
      }, false, true);
    }

    //props块
    let exPropsStr = 'p4',
      subExPropsStr = 'p5';
    if (retType) {
      const { _paramsE, _paramsSE } = retType;
      if (_paramsE) {
        exPropsStr = _paramsE;
      }
      if (_paramsSE) {
        subExPropsStr = _paramsSE;
      }
    }

    //hash参数
    let retP = _buildParams(node, fns, counter, false, level, exPropsStr, subExPropsStr),
      paramsStr = retP[0],
      _paramsC = retP[1];

    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null);
    dataReferStr += '\n];\n';

    //添加匿名参数
    if (paramsStr !== '') {
      dataReferStr += 'p1.aa(_params' + _paramsC + ', _dataRefer' + _dataReferC + ');\n';
    }

    if (filterStr !== '') {
      dataReferStr = filterStr + dataReferStr;
    }

    fnStr += paramsStr + dataReferStr;

    if (process.env.NODE_ENV !== 'production') {  //如果扩展标签不存在则打印警告信息
      fnStr += 'p1.tf(_ex' + _exC + ', \'' + node.ex + '\', \'ex\');\n';
    }

    //渲染
    fnStr += _buildRender(node, parent, 2, retType, {
      _ex: _exC,
      _dataRefer: _dataReferC,
      fnH: fnHVarStr
    }, fns, level, useStringLocal, node.allowNewline, isFirst);
  } else { //元素节点
    //节点类型和typeRefer
    let _typeC = counter._type++,
      _type, _typeRefer;

    if (node.typeRefer) {
      let valueStrT = _buildProps(node.typeRefer, counter, fns, level);
      if (tools.isObject(valueStrT)) {
        fnStr += valueStrT.filterStr;
        valueStrT = valueStrT.valueStr;
      }

      _typeRefer = valueStrT;
      _type = node.typeRefer.props[0].prop.name;
    } else {
      _type = node.type;
    }

    let typeStr;
    if (!useStringF) {
      const _typeL = _type.toLowerCase();
      typeStr = _typeRefer ? ('p1.er(' + _typeRefer + ', \'' + _typeL + '\', p1, \'' + _type + '\', p2)') : ('p1.e(\'' + _typeL + '\', p1, \'' + _type + '\', p2)');
    } else {
      typeStr = _typeRefer ? ('p1.en(' + _typeRefer + ', \'' + _type + '\')') : ('\'' + _type + '\'');
    }
    fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';

    //节点参数
    let retP = _buildParams(node, fns, counter, useStringF, level),
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
    fnStr += _buildContent(node.content, node, fns, counter, !useStringF ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, level != null ? level + 1 : level, useStringLocal);

    //渲染
    fnStr += _buildRender(node, parent, 3, retType, !useStringF ? { _compParam: _compParamC } : { _type: _typeC, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level, useStringLocal, node.allowNewline, isFirst);
  }

  return fnStr;
}

function _buildContent(content, parent, fns, counter, retType, level, useStringLocal) {
  let fnStr = '';
  if (!content) {
    return fnStr;
  }

  tools.each(content, node => {
    const { useString } = node;
    fnStr += _buildNode(node, parent, fns, counter, retType, level, useString != null ? useString : useStringLocal, fns._firstNode && level == 0);

    if (fns._firstNode) { //输出字符串时模板第一个节点前面不加换行符
      fns._firstNode = false;
    }
  }, false, true);

  return fnStr;
}

function _buildRender(node, parent, nodeType, retType, params, fns, level, useStringLocal, allowNewline, isFirst) {
  let retStr,
    useStringF = fns.useString,
    useString = useStringLocal != null ? useStringLocal : useStringF,
    noLevel = level == null;

  switch (nodeType) {
    case 1: //文本节点
      retStr = (!useStringF || allowNewline || noLevel ? '' : (isFirst ? (parent.type !== 'nj_root' ? 'p1.fl(p2) + ' : '') : '\'\\n\' + ')) + _buildLevelSpace(level, fns, allowNewline) + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + params.text;
      break;
    case 2: //扩展标签
      retStr = '_ex' + params._ex + '.apply(' + (params.fnH ? params.fnH + ' ? ' + params.fnH + '.ctx : p2' : 'p2') + ', _dataRefer' + params._dataRefer + ')';
      break;
    case 3: //元素节点
      if (!useStringF) {
        retStr = 'p1.H(_compParam' + params._compParam + ')';
      } else {
        let levelSpace = _buildLevelSpace(level, fns, allowNewline);
        const content = node.content;

        if ((allowNewline && allowNewline !== 'nlElem') || noLevel) {
          retStr = '';
        } else if (isFirst) {
          retStr = parent.type !== 'nj_root' ? 'p1.fl(p2) + ' : '';
        } else {
          retStr = '\'\\n\' + ';
        }

        retStr += levelSpace + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + '\'<\' + _type' + params._type + ' + ' + (params._params != null ? '_params' + params._params + ' + ' : '');
        if (!params._selfClose) {
          retStr += '\'>\'';
          retStr += ' + _children' + params._children + ' + ';
          retStr += (!content || allowNewline || noLevel ? '' : '\'\\n\' + ') + (content ? levelSpace : '') + //如果子节点为空则不输出缩进空格和换行符
            _buildLevelSpaceRt(useStringF, noLevel) + '\'</\' + _type' + params._type + ' + \'>\'';
        } else {
          retStr += '\' />\'';
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
  } else if (retType._paramsE || retType._paramsSE) {
    return '\n' + retStr + ';\n';
  } else {
    if (!useStringF) {
      return '\n' + retType._compParam + '.push(' + retStr + ');\n';
    } else {
      return '\n' + retType._children + ' += ' + retStr + ';\n';
    }
  }
}

function _buildLevelSpace(level, fns, allowNewline) {
  let ret = '';
  if (allowNewline && allowNewline !== 'nlElem') {
    return ret;
  }

  if (fns.useString && level != null && level > 0) {
    ret += '\'';
    for (let i = 0; i < level; i++) {
      ret += '  ';
    }
    ret += '\' + ';
  }
  return ret;
}

function _buildLevelSpaceRt(useString, noSpace) {
  if (useString && !noSpace) {
    return 'p1.ls(p2) + ';
  }
  return '';
}

export default (astContent, ast, useString) => {
  const fns = {
    useString,
    _no: 0, //扩展标签函数计数
    _noT: 0, //tmpl块模板函数计数
    _firstNode: true
  };

  _buildFn(astContent, ast, fns, fns._no, null, 0);
  return fns;
};