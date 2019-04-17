import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';
import { unescape } from '../utils/escape';
import { extensionConfig } from '../helpers/extension';
import { filterConfig } from '../helpers/filter';
const { errorTitle } = nj;
// const DEPRECATE_FILTER = {
//   //'?': '?:',
//   '//': '%%'
// };

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
    */
    const fn = fns[main ? 'main' + (isTmplEx ? no : '') : 'fn' + no] = new Function('p1', 'p2', 'p3', fnStr);
    if (isTmplEx && name != null) { //设置函数名
      fn._njName = name;
    }
  } catch (err) {
    tools.error('Failed to generate template function:\n\n' + err.toString() + ' in\n\n' + fnStr + '\n');
  }
  return no;
}

function _buildOptions(config, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, hashProps, tagName, attrs) {
  let hashStr = ', useString: ' + (useStringLocal == null ? 'p1.us' : (useStringLocal ? 'true' : 'false')),
    noConfig = !config,
    no = fns._no;

  if (node) { //tags
    let newContext = config ? config.newContext : true;
    const isDirective = node.isDirective || (config && config.isDirective);
    // if (noConfig || config.exProps || node.isProp) {
    //   hashStr += ', exProps: ' + exPropsStr;
    // }
    // if (noConfig || config.subExProps || node.isProp) {
    //   hashStr += ', subExProps: ' + subExPropsStr;
    // }
    if (noConfig || config.hasName) {
      hashStr += ', name: \'' + node.ex + '\'';
    }
    if (tagName && isDirective && (noConfig || !config.noTagName)) {
      hashStr += ', tagName: ' + tagName;
      hashStr += ', setTagName: function(c) { ' + tagName + ' = c }';
    }
    if (attrs && (noConfig || config.hasAttrs)) {
      hashStr += ', attrs: ' + attrs;
    }
    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
    hashStr += ', ' + (isDirective ? 'value' : 'children') + ': ' + (node.content ? 'p1.r(p1, p2, p1.fn' + _buildFn(node.content, node, fns, ++fns._no, newContext, level, useStringLocal) + ')' : 'p1.np');
  }

  return '{ _njOpts: ' + (no == 0 ? '\'main\'' : no)
    + ((noConfig || config.hasTmplCtx) ? ', global: p1, context: p2' : '')
    + ((noConfig || config.hasOutputH) ? ', outputH: ' + !fns.useString : '')
    + hashStr 
    + ((level != null && (noConfig || config.hasLevel)) ? ', level: ' + level : '') 
    + ' }';
}

const CUSTOM_VAR = 'nj_custom';
const OPERATORS = ['+', '-', '*', '/', '%', '===', '!==', '==', '!=', '<=', '>=', '=', '+=', '<', '>', '&&', '||', '?', ':'];
const ASSIGN_OPERATORS = ['=', '+='];
const SP_FILTER_REPLACE = {
  'or': '||'
};

function _buildDataValue(ast, escape, fns, level) {
  let dataValueStr, special = false;
  const { isBasicType, isComputed, hasSet } = ast;

  if (isBasicType) {
    dataValueStr = ast.name;
  } else {
    const { name, parentNum } = ast;
    let data = '',
      specialP = false;

    switch (name) {
      case '@index':
        data = 'index';
        special = true;
        break;
      case '@item':
        data = 'item';
        special = true;
        break;
      case 'this':
        data = 'data';
        special = data => `${data}[${data}.length - 1]`;
        break;
      case '@data':
        data = 'data';
        special = true;
        break;
      case '@g':
        data = 'p1.g';
        special = CUSTOM_VAR;
        break;
      case '@root':
        data = '(p2.root || p2)';
        special = CUSTOM_VAR;
        break;
      case '@context':
        data = 'p2';
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

      const isCtx = data == 'p2';
      for (let i = 0; i < parentNum; i++) {
        data = !isCtx ? ('parent.' + data) : (data + '.parent');
      }

      if (!special) {
        specialP = true;
      }
    }

    if (!special && !specialP) {
      dataValueStr = (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\'' + ((isComputed || hasSet) ? ', 0, true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : '');
    } else {
      let dataStr = special === CUSTOM_VAR ? data : 'p2.' + data;
      if (tools.isObject(special)) {
        dataStr = special(dataStr);
      }
      dataValueStr = (special ? dataStr : (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\', ' + dataStr + ((isComputed || hasSet) ? ', true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : ''));
    }
  }
  if (dataValueStr) {
    dataValueStr = _replaceBackslash(dataValueStr);
  }

  return _buildEscape(dataValueStr, fns, (isBasicType || isComputed) ? false : escape, special);
}

function replaceFilterName(name) {
  const nameR = SP_FILTER_REPLACE[name];
  return nameR != null ? nameR : name;
}

export function buildExpression(ast, inObj, escape, fns, useStringLocal, level) {
  let codeStr = (ast.filters && OPERATORS.indexOf(replaceFilterName(ast.filters[0].name)) < 0) ? '' : (!inObj ? _buildDataValue(ast, escape, fns, level) : ast.name);
  let lastCodeStr = '';

  ast.filters && ast.filters.forEach((filter, i) => {
    const hasFilterNext = ast.filters[i + 1] && OPERATORS.indexOf(replaceFilterName(ast.filters[i + 1].name)) < 0;
    const filterName = replaceFilterName(filter.name);

    if (OPERATORS.indexOf(filterName) >= 0) {  //Native operator
      if (ASSIGN_OPERATORS.indexOf(filterName) >= 0) {
        codeStr += `._njCtx.${i == 0 ? ast.name : tools.clearQuot(ast.filters[i - 1].params[0].name)} ${filterName} `;
      }
      else {
        codeStr += ` ${filterName} `;
      }

      if (!ast.filters[i + 1] || OPERATORS.indexOf(replaceFilterName(ast.filters[i + 1].name)) >= 0) {
        if (filter.params[0].filters) {
          codeStr += '(';
          codeStr += buildExpression(filter.params[0], null, escape, fns, useStringLocal, level);
          codeStr += ')';
        }
        else {
          codeStr += _buildDataValue(filter.params[0], escape, fns, level);
        }
      }
    }
    else if (filterName === '_') {  //Call function
      let _codeStr = `p1.f['${filterName}'](${lastCodeStr}`;
      if (filter.params.length) {
        _codeStr += ', [';
        filter.params.forEach((param, j) => {
          _codeStr += buildExpression(param, null, escape, fns, useStringLocal, level);
          if (j < filter.params.length - 1) {
            _codeStr += ', ';
          }
        });
        _codeStr += ']';
      }
      _codeStr += ')';

      if (hasFilterNext) {
        lastCodeStr = _codeStr;
      }
      else {
        codeStr += _codeStr;
        lastCodeStr = '';
      }
    }
    else {  //Custom filter
      let startStr, endStr, isObj, configF;
      const isMethod = ast.isEmpty && i == 0;
      if (filterName === 'bracket') {
        startStr = '(';
        endStr = ')';
      }
      else if (filterName === 'list') {
        startStr = '[';
        endStr = ']';
      }
      else if (filterName === 'obj') {
        startStr = '{ ';
        endStr = ' }';
        isObj = true;
      }
      else {
        if (filterName == 'require') {
          startStr = 'require';
        }
        else {
          const filterStr = `p1.f['${filterName}']`,
            warnStr = `p1.wn('${filterName}', 'f')`,
            isDev = process.env.NODE_ENV !== 'production';

          configF = filterConfig[filterName];
          if (configF && configF.onlyGlobal) {
            startStr = isDev ? `(${filterStr} || ${warnStr})` : filterStr;
          }
          else {
            startStr = `p1.cf(p2.d('${filterName}', 0, true) || ${filterStr}${isDev ? ` || ${warnStr}` : ''})`;
          }
        }
        startStr += '(';
        endStr = ')';
      }

      let _codeStr = startStr;
      if (isMethod) {  //Method
        filter.params.forEach((param, j) => {
          _codeStr += buildExpression(param, isObj, escape, fns, useStringLocal, level);
          if (j < filter.params.length - 1) {
            _codeStr += ', ';
          }
        });
      }
      else {  //Operator
        if (i == 0) {
          _codeStr += _buildDataValue(ast, escape, fns, level);
        }
        else if (lastCodeStr !== '') {
          _codeStr += lastCodeStr;
        }
        else {
          if (ast.filters[i - 1].params[0].filters) {
            _codeStr += buildExpression(ast.filters[i - 1].params[0], null, escape, fns, useStringLocal, level);
          }
          else {
            _codeStr += _buildDataValue(ast.filters[i - 1].params[0], escape, fns, level);
          }
        }

        filter.params && filter.params.forEach((param, j) => {
          _codeStr += ', ';
          if (param.filters) {
            _codeStr += buildExpression(param, null, escape, fns, useStringLocal, level);
          }
          else {
            _codeStr += _buildDataValue(param, escape, fns, level);
          }
        });

        const nextFilter = ast.filters[i + 1];
        if (filterName === '.' && nextFilter && replaceFilterName(nextFilter.name) === '_') {
          _codeStr += ', true';
        }

        //if (!configF || configF.hasOptions) {
        if (configF && configF.hasOptions) {
          _codeStr += `, ${_buildOptions(configF, useStringLocal, null, fns, null, null, level)}`;
        }
      }
      _codeStr += endStr;

      if (hasFilterNext) {
        lastCodeStr = _codeStr;
      }
      else {
        codeStr += _codeStr;
        lastCodeStr = '';
      }
    }
  });

  return codeStr;
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
  return _replaceBackslash(str).replace(/_njNl_/g, '\\n').replace(/'/g, '\\\'');
}

function _replaceBackslash(str) {
  return str = str.replace(/\\/g, '\\\\');
}

function _buildProps(obj, fns, useStringLocal, level) {
  let str0 = obj.strs[0],
    valueStr = '';

  if (tools.isString(str0)) { //常规属性
    valueStr = !obj.isAll && str0 !== '' ? ('\'' + _replaceStrs(str0) + '\'') : '';

    tools.each(obj.props, function (o, i) {
      let dataValueStr = buildExpression(o.prop, null, o.escape, fns, useStringLocal, level);

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
      else {
        dataValueStr = '(' + dataValueStr + ')';
      }

      valueStr += dataValueStr;
      if (obj.isAll) {
        return false;
      }
    }, false, true);
  } else if (tools.isObject(str0) && str0._njLen != null) { //tmpl标签
    valueStr += '{\n';
    tools.each(str0, function (v, k, i, l) {
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
                       _njItem: p2.item,\n  \
                       _njLevel: p1.l(' + level + ', p2),\n  \
                       _njIcp: p2.icp\n';
      }
    }, false, false);
    valueStr += '}';
  }

  return valueStr;
}

function _buildPropsEx(isSub, paramsEC, propsEx, fns, counter, useString, exPropsStr, subExPropsStr, tagName, attrs) {
  //let paramsStr = '';
  let paramsStr = 'var _paramsE' + paramsEC + ' = {};\n';

  const ret = {};
  if (isSub) {
    ret._paramsE = exPropsStr;
    //ret._paramsSE = '_paramsE' + paramsEC;
  } else {
    ret._paramsE = '_paramsE' + paramsEC;
    //ret._paramsSE = subExPropsStr;
  }

  //props标签的子节点
  paramsStr += _buildContent(propsEx.content, propsEx, fns, counter, ret, null, useString, tagName, attrs);
  return paramsStr;
}

function _buildParams(node, fns, counter, useString, level, exPropsStr, subExPropsStr, tagName) {
  //节点参数
  const { params, paramsEx, propsExS } = node;
  const useStringF = fns.useString,
    hasPropsEx = paramsEx || propsExS;
  let paramsStr = '',
    _paramsC,
    _attrs;

  if (params || hasPropsEx) {
    _paramsC = counter._params++;
    _attrs = '_params' + _paramsC;
    paramsStr = 'var ' + _attrs + ' = ';

    if (params) {
      let paramKeys = Object.keys(params),
        len = paramKeys.length;

      paramsStr += '{\n';
      tools.each(paramKeys, function (k, i) {
        let valueStr = _buildProps(params[k], fns, useString, level);

        if (!useStringF && k === 'style') { //将style字符串转换为对象
          valueStr = 'p1.sp(' + valueStr + ')';
        }

        let key = _replaceStrs(k),
          onlyKey = params[k].onlyKey;
        if (!useStringF) {
          key = tranData.fixPropName(key);
        }
        paramsStr += '  \'' + key + '\': ' + (!onlyKey ? valueStr : (!useString ? 'true' : '\'' + key + '\'')) + (i < len - 1 ? ',\n' : '');
      }, false, false);
      paramsStr += '\n};\n';
    }

    if (hasPropsEx) {
      let bothPropsEx = paramsEx && propsExS,
        _paramsEC, _paramsSEC;
      if (!params) {
        paramsStr += '{};\n';
      }

      if (paramsEx) {
        _paramsEC = counter._paramsE++;
        paramsStr += _buildPropsEx(false, _paramsEC, paramsEx, fns, counter, useString, exPropsStr, subExPropsStr, tagName, _attrs);
      }
      if (propsExS) {
        _paramsSEC = counter._paramsE++;
        paramsStr += _buildPropsEx(true, _paramsSEC, propsExS, fns, counter, useString, exPropsStr, subExPropsStr, tagName, _attrs);
      }

      if (!useString) {
        // if (bothPropsEx) {
        //   paramsStr += '\n' + _attrs + ' = p1.an({}, _paramsE' + _paramsEC + ', _paramsE' + _paramsSEC + ', ' + _attrs + ');\n';
        // } else {
        //   paramsStr += '\n' + _attrs + ' = p1.an({}, _paramsE' + (_paramsEC != null ? _paramsEC : _paramsSEC) + ', ' + _attrs + ');\n';
        // }
      } else {
        // paramsStr += '\n' + _attrs + ' = p1.ans({}, _paramsE' + _paramsEC + ', ' + _attrs + ');\n';
        paramsStr += '\n' + _attrs + ' = p1.ans(' + _attrs + ');\n';
      }
    }
    else if (useString) {
      paramsStr += '\n' + _attrs + ' = p1.ans({}, ' + _attrs + ');\n';
    }
  }

  return [paramsStr, _paramsC];
}

function _buildNode(node, parent, fns, counter, retType, level, useStringLocal, isFirst, tagName, attrs) {
  let fnStr = '',
    useStringF = fns.useString;

  if (node.type === 'nj_plaintext') { //文本节点
    const valueStr = _buildProps(node.content[0], fns, useStringLocal, level);
    if (valueStr === '') {
      return fnStr;
    }

    const textStr = _buildRender(node, parent, 1, retType, { text: valueStr }, fns, level, useStringLocal, node.allowNewline, isFirst);

    if (useStringF) {
      fnStr += textStr;
    } else { //文本中的特殊字符需转义
      fnStr += unescape(textStr);
    }
  } else if (node.type === 'nj_ex') { //扩展标签节点
    let _exC = counter._ex++,
      _dataReferC = counter._dataRefer++,
      dataReferStr = '',
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
      tools.each(node.args, function (arg, i) {
        const valueStr = _buildProps(arg, fns, useStringLocal, level);
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
    let retP = _buildParams(node, fns, counter, false, level, exPropsStr, subExPropsStr, tagName),
      paramsStr = retP[0],
      _paramsC = retP[1];

    dataReferStr += _buildOptions(configE, useStringLocal, node, fns, exPropsStr, subExPropsStr, level, paramsStr !== '' ? '_params' + _paramsC : null, tagName, attrs);
    dataReferStr += '\n];\n';

    //添加匿名参数
    if (paramsStr !== '') {
      dataReferStr += 'p1.aa(_params' + _paramsC + ', _dataRefer' + _dataReferC + ');\n';
    }

    fnStr += paramsStr + dataReferStr;

    if (process.env.NODE_ENV !== 'production') { //如果扩展标签不存在则打印警告信息
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
      _type, _typeRefer,
      _tagName = '_type' + _typeC;

    if (node.typeRefer) {
      const valueStrT = _buildProps(node.typeRefer, fns, level);

      _typeRefer = valueStrT;
      _type = node.typeRefer.props[0].prop.name;
    } else {
      _type = node.type;
    }

    let typeStr;
    if (!useStringF) {
      let _typeL = _type.toLowerCase(),
        subName = '';

      if (!_typeRefer && _typeL.indexOf('.') > -1) {
        const typeS = _type.split('.');
        _typeL = _typeL.split('.')[0];
        _type = typeS[0];
        subName = ', \'' + typeS[1] + '\'';
      }

      typeStr = _typeRefer ? ('p1.er(' + _typeRefer + ', \'' + _typeL + '\', p1, \'' + _type + '\', p2)') : ('p1.e(\'' + _typeL + '\', p1, \'' + _type + '\', p2' + subName + ')');
    } else {
      typeStr = _typeRefer ? ('p1.en(' + _typeRefer + ', \'' + _type + '\')') : ('\'' + _type + '\'');
    }
    fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';

    //节点参数
    let retP = _buildParams(node, fns, counter, useStringF, level, null, null, _tagName),
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
    fnStr += _buildContent(node.content, node, fns, counter, !useStringF ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC }, (useStringF && node.type === nj.noWsTag) ? null : (level != null ? level + 1 : level), useStringLocal, _tagName);

    //渲染
    fnStr += _buildRender(node, parent, 3, retType, !useStringF ? { _compParam: _compParamC } : { _type: _typeC, _typeS: _type, _typeR: _typeRefer, _params: paramsStr !== '' ? _paramsC : null, _children: _childrenC, _selfClose: node.selfCloseTag }, fns, level, useStringLocal, node.allowNewline, isFirst);
  }

  return fnStr;
}

function _buildContent(content, parent, fns, counter, retType, level, useStringLocal, tagName, attrs) {
  let fnStr = '';
  if (!content) {
    return fnStr;
  }

  tools.each(content, node => {
    const { useString } = node;
    fnStr += _buildNode(node, parent, fns, counter, retType, level, useString != null ? useString : useStringLocal, fns._firstNode && level == 0, tagName, attrs);

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
      retStr = '_ex' + params._ex + '.apply(' + (params.fnH ? params.fnH + ' ? ' + params.fnH + '._njCtx : p2' : 'p2') + ', _dataRefer' + params._dataRefer + ')';
      break;
    case 3: //元素节点
      if (!useStringF) {
        retStr = 'p1.H(_compParam' + params._compParam + ')';
      } else {
        if ((allowNewline && allowNewline !== 'nlElem') || noLevel) {
          retStr = '';
        } else if (isFirst) {
          retStr = parent.type !== 'nj_root' ? 'p1.fl(p2) + ' : '';
        } else {
          retStr = '\'\\n\' + ';
        }

        if (node.type !== nj.textTag && node.type !== nj.noWsTag) {
          const levelSpace = _buildLevelSpace(level, fns, allowNewline),
            content = node.content,
            hasTypeR = params._typeR,
            hasParams = params._params != null;

          retStr += levelSpace + _buildLevelSpaceRt(useStringF, isFirst || noLevel) + '\'<' + (hasTypeR ? ('\' + _type' + params._type) : params._typeS) + (hasParams ? ((!hasTypeR ? '\'' : '') + ' + _params') + params._params : '') + ((hasTypeR || hasParams) ? ' + \'' : '');
          if (!params._selfClose) {
            retStr += '>\'';
            retStr += ' + _children' + params._children + ' + ';
            retStr += (!content || allowNewline || noLevel ? '' : '\'\\n\' + ') + (content ? levelSpace : '') + //如果子节点为空则不输出缩进空格和换行符
              _buildLevelSpaceRt(useStringF, noLevel) + '\'</' + (hasTypeR ? ('\' + _type' + params._type + ' + \'') : params._typeS) + '>\'';
          } else {
            retStr += ' />\'';
          }
        } else {
          retStr += '_children' + params._children;
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