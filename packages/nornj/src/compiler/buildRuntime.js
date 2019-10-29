import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';
import { unescape } from '../utils/escape';
import { extensionConfig } from '../helpers/extension';
import { filterConfig } from '../helpers/filter';
const GLOBAL = 'g';
const CONTEXT = 'c';
const PARAMS = 'p';

function _buildFn(content, node, fns, no, newContext, level, useStringLocal) {
  let fnStr = '';
  const useString = useStringLocal != null ? useStringLocal : fns.useString,
    main = no === 0,
    /* retType
     1: single child node
     2: multiple child nodes
     object: not build function
    */
    retType = content.length === 1 ? '1' : '2',
    counter = {
      _type: 0,
      _params: 0,
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
    fnStr += `${CONTEXT} = ${GLOBAL}.n(${CONTEXT}, ${PARAMS});\n`;
  }

  if (retType === '2') {
    if (!useString) {
      fnStr += 'var ret = [];\n';
    } else {
      fnStr += `var ret = '';\n`;
    }
  }

  fnStr += _buildContent(content, node, fns, counter, retType, level, useStringLocal);

  if (retType === '2') {
    fnStr += 'return ret;';
  }

  try {
    /* build template functions
     g: global configs
     c: context
     p: parameters
    */
    fns[main ? 'main' : 'fn' + no] = new Function(GLOBAL, CONTEXT, PARAMS, fnStr);
  } catch (err) {
    tools.error('Failed to generate template function:\n\n' + err.toString() + ' in\n\n' + fnStr + '\n');
  }
  return no;
}

function _buildOptions(config, useStringLocal, node, fns, level, hashProps, tagName, tagProps) {
  let hashStr = ', useString: ' + (useStringLocal == null ? `${GLOBAL}.us` : useStringLocal ? 'true' : 'false');
  const noConfig = !config,
    no = fns._no;

  if (node) {
    //tags
    const newContext = config ? config.newContext : true;
    const isDirective = node.isDirective || (config && config.isDirective);
    if (noConfig || config.hasName) {
      hashStr += `, name: '${node.ex}'`;
    }
    if (tagName && isDirective && (noConfig || !config.noTagName)) {
      hashStr += ', tagName: ' + tagName;
      hashStr += `, setTagName: function(c) { ${tagName} = c }`;
    }
    if (tagProps && (noConfig || config.hasTagProps)) {
      hashStr += ', tagProps: ' + tagProps;
    }
    if (hashProps != null) {
      hashStr += ', props: ' + hashProps;
    }
    hashStr +=
      ', ' +
      (isDirective ? 'value' : 'children') +
      ': ' +
      (node.content
        ? `${GLOBAL}.r(${GLOBAL}, ${CONTEXT}, ${GLOBAL}.fn` +
          _buildFn(node.content, node, fns, ++fns._no, newContext, level, useStringLocal) +
          ')'
        : `${GLOBAL}.np`);
  }

  return (
    '{ _njOpts: ' +
    (no + 1) +
    (noConfig || config.hasTmplCtx ? `, global: ${GLOBAL}, context: ${CONTEXT}` : '') +
    (noConfig || config.hasOutputH ? ', outputH: ' + !fns.useString : '') +
    hashStr +
    (level != null && (noConfig || config.hasLevel) ? ', level: ' + level : '') +
    ' }'
  );
}

const CUSTOM_VAR = 'nj_custom';
const OPERATORS = [
  '+',
  '-',
  '*',
  '/',
  '%',
  '===',
  '!==',
  '==',
  '!=',
  '<=',
  '>=',
  '=',
  '+=',
  '<',
  '>',
  '&&',
  '||',
  '?',
  ':'
];
const ASSIGN_OPERATORS = ['=', '+='];
const SP_FILTER_REPLACE = {
  or: '||'
};

function _buildDataValue(ast, escape, fns, level) {
  let dataValueStr,
    special = false;
  const { isBasicType, isAccessor, hasSet } = ast;

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
        data = `${GLOBAL}.g`;
        special = CUSTOM_VAR;
        break;
      case '@context':
        data = CONTEXT;
        special = CUSTOM_VAR;
        break;
      case '@lt':
        data = `'<'`;
        special = CUSTOM_VAR;
        break;
      case '@gt':
        data = `'>'`;
        special = CUSTOM_VAR;
        break;
      case '@lb':
        data = `'{'`;
        special = CUSTOM_VAR;
        break;
      case '@rb':
        data = `'}'`;
        special = CUSTOM_VAR;
        break;
      case '@q':
        data = `'"'`;
        special = CUSTOM_VAR;
        break;
      case '@sq':
        data = `"'"`;
        special = CUSTOM_VAR;
        break;
    }

    if (parentNum) {
      if (!data) {
        data = 'data';
      }

      const isCtx = data == CONTEXT;
      for (let i = 0; i < parentNum; i++) {
        data = !isCtx ? 'parent.' + data : data + '.parent';
      }

      if (!special) {
        specialP = true;
      }
    }

    if (!special && !specialP) {
      dataValueStr =
        (isAccessor ? `${GLOBAL}.c(` : '') +
        `${CONTEXT}.d('` +
        name +
        `'` +
        (hasSet ? ', 0, true' : '') +
        ')' +
        (isAccessor ? `, ${CONTEXT}` + ')' : '');
    } else {
      let dataStr = special === CUSTOM_VAR ? data : `${CONTEXT}.` + data;
      if (tools.isObject(special)) {
        dataStr = special(dataStr);
      }
      dataValueStr = special
        ? dataStr
        : (isAccessor ? `${GLOBAL}.c(` : '') +
          `${CONTEXT}.d('` +
          name +
          `', ` +
          dataStr +
          (hasSet ? ', true' : '') +
          ')' +
          (isAccessor ? `, ${CONTEXT}` + ')' : '');
    }
  }
  if (dataValueStr) {
    dataValueStr = _replaceBackslash(dataValueStr);
  }

  return _buildEscape(dataValueStr, fns, isBasicType || isAccessor ? false : escape, special);
}

function replaceFilterName(name) {
  const nameR = SP_FILTER_REPLACE[name];
  return nameR != null ? nameR : name;
}

export function buildExpression(ast, inObj, escape, fns, useStringLocal, level) {
  let codeStr =
    ast.filters && OPERATORS.indexOf(replaceFilterName(ast.filters[0].name)) < 0
      ? ''
      : !inObj
        ? _buildDataValue(ast, escape, fns, level)
        : ast.name;
  let lastCodeStr = '';

  ast.filters &&
    ast.filters.forEach((filter, i) => {
      const hasFilterNext = ast.filters[i + 1] && OPERATORS.indexOf(replaceFilterName(ast.filters[i + 1].name)) < 0;
      const filterName = replaceFilterName(filter.name);

      if (OPERATORS.indexOf(filterName) >= 0) {
        //Native operator
        if (ASSIGN_OPERATORS.indexOf(filterName) >= 0) {
          codeStr += `.source.${i == 0 ? ast.name : tools.clearQuot(ast.filters[i - 1].params[0].name)} ${filterName} `;
        } else {
          codeStr += ` ${filterName} `;
        }

        if (!ast.filters[i + 1] || OPERATORS.indexOf(replaceFilterName(ast.filters[i + 1].name)) >= 0) {
          if (filter.params[0].filters) {
            codeStr += '(';
            codeStr += buildExpression(filter.params[0], null, escape, fns, useStringLocal, level);
            codeStr += ')';
          } else {
            codeStr += _buildDataValue(filter.params[0], escape, fns, level);
          }
        }
      } else if (filterName === '_') {
        //Call function
        let _codeStr = `${GLOBAL}.f['${filterName}'](${lastCodeStr}`;
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
        } else {
          codeStr += _codeStr;
          lastCodeStr = '';
        }
      } else {
        //Custom filter
        let startStr, endStr, isObj, configF;
        const isMethod = ast.isEmpty && i == 0;
        if (filterName === 'bracket') {
          startStr = '(';
          endStr = ')';
        } else if (filterName === 'list') {
          startStr = '[';
          endStr = ']';
        } else if (filterName === 'obj') {
          startStr = '{ ';
          endStr = ' }';
          isObj = true;
        } else {
          if (filterName == 'require') {
            startStr = 'require';
          } else {
            const filterStr = `${GLOBAL}.f['${filterName}']`,
              warnStr = `${GLOBAL}.wn('${filterName}', 'f')`,
              isDev = process.env.NODE_ENV !== 'production';

            configF = filterConfig[filterName];
            if (configF && configF.onlyGlobal) {
              startStr = isDev ? `(${filterStr} || ${warnStr})` : filterStr;
            } else {
              startStr = `${GLOBAL}.cf(${CONTEXT}.d('${filterName}', 0, true) || ${filterStr}${
                isDev ? ` || ${warnStr}` : ''
              })`;
            }
          }
          startStr += '(';
          endStr = ')';
        }

        let _codeStr = startStr;
        if (isMethod) {
          //Method
          filter.params.forEach((param, j) => {
            _codeStr += buildExpression(param, isObj, escape, fns, useStringLocal, level);
            if (j < filter.params.length - 1) {
              _codeStr += ', ';
            }
          });
        } else {
          //Operator
          if (i == 0) {
            _codeStr += _buildDataValue(ast, escape, fns, level);
          } else if (lastCodeStr !== '') {
            _codeStr += lastCodeStr;
          } else {
            if (ast.filters[i - 1].params[0].filters) {
              _codeStr += buildExpression(ast.filters[i - 1].params[0], null, escape, fns, useStringLocal, level);
            } else {
              _codeStr += _buildDataValue(ast.filters[i - 1].params[0], escape, fns, level);
            }
          }

          filter.params &&
            filter.params.forEach((param, j) => {
              _codeStr += ', ';
              if (param.filters) {
                _codeStr += buildExpression(param, null, escape, fns, useStringLocal, level);
              } else {
                _codeStr += _buildDataValue(param, escape, fns, level);
              }
            });

          const nextFilter = ast.filters[i + 1];
          if (filterName === '.' && nextFilter && replaceFilterName(nextFilter.name) === '_') {
            _codeStr += ', true';
          }

          //if (!configF || configF.hasOptions) {
          if (configF && configF.hasOptions) {
            _codeStr += `, ${_buildOptions(configF, useStringLocal, null, fns, level)}`;
          }
        }
        _codeStr += endStr;

        if (hasFilterNext) {
          lastCodeStr = _codeStr;
        } else {
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
      return `${GLOBAL}.es(` + valueStr + ')';
    } else {
      return valueStr;
    }
  } else {
    //文本中的特殊字符需转义
    return unescape(valueStr);
  }
}

function _replaceStrs(str) {
  return _replaceBackslash(str)
    .replace(/_njNl_/g, '\\n')
    .replace(/'/g, `\\'`);
}

function _replaceBackslash(str) {
  return (str = str.replace(/\\/g, '\\\\'));
}

function _buildProps(obj, fns, useStringLocal, level) {
  const str0 = obj.strs[0];
  let valueStr = '';

  if (tools.isString(str0)) {
    //常规属性
    valueStr = !obj.isAll && str0 !== '' ? `'${_replaceStrs(str0)}'` : '';

    tools.each(
      obj.props,
      function(o, i) {
        let dataValueStr = buildExpression(o.prop, null, o.escape, fns, useStringLocal, level);

        if (!obj.isAll) {
          const strI = obj.strs[i + 1],
            prefixStr = str0 === '' && i == 0 ? '' : ' + ';

          // if (strI.trim() === '\\n') { //如果只包含换行符号则忽略
          //   valueStr += prefixStr + dataValueStr;
          //   return;
          // }

          dataValueStr = prefixStr + '(' + dataValueStr + ')' + (strI !== '' ? ` + '${_replaceStrs(strI)}'` : '');
        } else {
          dataValueStr = '(' + dataValueStr + ')';
        }

        valueStr += dataValueStr;
        if (obj.isAll) {
          return false;
        }
      },
      true
    );
  }

  return valueStr;
}

function _buildParams(node, fns, counter, useString, level, tagName) {
  //节点参数
  const { params, paramsEx } = node;
  const useStringF = fns.useString,
    hasPropsEx = paramsEx;
  let paramsStr = '',
    _paramsC,
    _tagProps;

  if (params || hasPropsEx) {
    _paramsC = counter._params++;
    _tagProps = '_params' + _paramsC;
    paramsStr = 'var ' + _tagProps + ' = ';

    if (params) {
      const paramKeys = Object.keys(params),
        len = paramKeys.length;

      paramsStr += '{\n';
      tools.each(
        paramKeys,
        function(k, i) {
          let valueStr = _buildProps(params[k], fns, useString, level);

          if (!useStringF && k === 'style') {
            //将style字符串转换为对象
            valueStr = `${GLOBAL}.sp(` + valueStr + ')';
          }

          let key = _replaceStrs(k);
          const onlyKey = params[k].onlyKey;
          if (!useStringF) {
            key = tranData.fixPropName(key);
          }
          paramsStr +=
            `  '` + key + `': ` + (!onlyKey ? valueStr : !useString ? 'true' : `'${key}'`) + (i < len - 1 ? ',\n' : '');
        },
        false
      );
      paramsStr += '\n};\n';
    }

    if (hasPropsEx) {
      if (!params) {
        paramsStr += '{};\n';
      }

      if (paramsEx) {
        paramsStr += _buildContent(
          paramsEx.content,
          paramsEx,
          fns,
          counter,
          { _paramsE: true },
          null,
          useString,
          tagName,
          _tagProps
        );
      }

      if (useString) {
        paramsStr += '\n' + _tagProps + ` = ${GLOBAL}.ans(` + _tagProps + ');\n';
      }
    } else if (useString) {
      paramsStr += '\n' + _tagProps + ` = ${GLOBAL}.ans({}, ` + _tagProps + ');\n';
    }
  }

  return [paramsStr, _paramsC];
}

function _buildNode(node, parent, fns, counter, retType, level, useStringLocal, isFirst, tagName, tagProps) {
  let fnStr = '';
  const useStringF = fns.useString;

  if (node.type === 'nj_plaintext') {
    //文本节点
    const valueStr = _buildProps(node.content[0], fns, useStringLocal, level);
    if (valueStr === '') {
      return fnStr;
    }

    const textStr = _buildRender(
      node,
      parent,
      1,
      retType,
      { text: valueStr },
      fns,
      level,
      useStringLocal,
      node.allowNewline,
      isFirst
    );

    if (useStringF) {
      fnStr += textStr;
    } else {
      //文本中的特殊字符需转义
      fnStr += unescape(textStr);
    }
  } else if (node.type === 'nj_ex') {
    //扩展标签节点
    const _exC = counter._ex++,
      _dataReferC = counter._dataRefer++,
      configE = extensionConfig[node.ex],
      exVarStr = '_ex' + _exC,
      globalExStr = `${GLOBAL}.x['${node.ex}']`;

    let dataReferStr = '',
      fnHVarStr;

    if (configE && configE.onlyGlobal) {
      //只能从全局获取
      fnStr += '\nvar ' + exVarStr + ' = ' + globalExStr + ';\n';
    } else {
      //优先从context.data中获取
      fnHVarStr = '_fnH' + counter._fnH++;
      fnStr += '\nvar ' + exVarStr + ';\n';
      fnStr += 'var ' + fnHVarStr + ` = ${CONTEXT}.d('${node.ex}', 0, true);\n`;

      fnStr += 'if (' + fnHVarStr + ') {\n';
      fnStr += '  ' + exVarStr + ' = ' + fnHVarStr + '.value;\n';
      fnStr += '} else {\n';
      fnStr += '  ' + exVarStr + ' = ' + globalExStr + ';\n';
      fnStr += '}\n';
    }

    dataReferStr += 'var _dataRefer' + _dataReferC + ' = [\n';

    if (node.args) {
      //构建匿名参数
      tools.each(
        node.args,
        function(arg, i) {
          const valueStr = _buildProps(arg, fns, useStringLocal, level);
          dataReferStr += '  ' + valueStr + ',';
        },
        true
      );
    }

    //hash参数
    const retP = _buildParams(node, fns, counter, useStringLocal, level, tagName),
      paramsStr = retP[0],
      _paramsC = retP[1];

    dataReferStr += _buildOptions(
      configE,
      useStringLocal,
      node,
      fns,
      level,
      paramsStr !== '' ? '_params' + _paramsC : null,
      tagName,
      tagProps
    );
    dataReferStr += '\n];\n';

    //添加匿名参数
    if (paramsStr !== '') {
      dataReferStr += `${GLOBAL}.aa(_params` + _paramsC + ', _dataRefer' + _dataReferC + ');\n';
    }

    fnStr += paramsStr + dataReferStr;

    if (process.env.NODE_ENV !== 'production') {
      //如果扩展标签不存在则打印警告信息
      fnStr += `${GLOBAL}.tf(_ex${_exC}, '${node.ex}', 'ex');\n`;
    }

    //渲染
    fnStr += _buildRender(
      node,
      parent,
      2,
      retType,
      {
        _ex: _exC,
        _dataRefer: _dataReferC,
        fnH: fnHVarStr
      },
      fns,
      level,
      useStringLocal,
      node.allowNewline,
      isFirst
    );
  } else {
    //元素节点
    //节点类型和typeRefer
    const _typeC = counter._type++,
      _tagName = '_type' + _typeC;
    let _type, _typeRefer;

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
        subName = `, '${typeS[1]}'`;
      }

      typeStr = _typeRefer
        ? `${GLOBAL}.er(` + _typeRefer + `, '` + _typeL + `', ${GLOBAL}, '` + _type + `', ${CONTEXT})`
        : `${GLOBAL}.e('` + _typeL + `', ${GLOBAL}, '` + _type + `', ${CONTEXT}` + subName + ')';
    } else {
      typeStr = _typeRefer ? `${GLOBAL}.en(` + _typeRefer + `, '` + _type + `')` : `'${_type}'`;
    }
    fnStr += '\nvar _type' + _typeC + ' = ' + typeStr + ';\n';

    //节点参数
    const retP = _buildParams(node, fns, counter, useStringF, level, _tagName),
      paramsStr = retP[0],
      _paramsC = retP[1];
    fnStr += paramsStr;

    let _compParamC, _childrenC;
    if (!useStringF) {
      //组件参数
      _compParamC = counter._compParam++;
      fnStr +=
        'var _compParam' +
        _compParamC +
        ' = [_type' +
        _typeC +
        ', ' +
        (paramsStr !== '' ? '_params' + _paramsC : 'null') +
        '];\n';
    } else {
      //子节点字符串
      _childrenC = counter._children++;
      fnStr += 'var _children' + _childrenC + ` = '';\n`;
    }

    //子节点
    fnStr += _buildContent(
      node.content,
      node,
      fns,
      counter,
      !useStringF ? { _compParam: '_compParam' + _compParamC } : { _children: '_children' + _childrenC },
      useStringF && node.type === nj.noWsTag ? null : level != null ? level + 1 : level,
      useStringLocal,
      _tagName
    );

    //渲染
    fnStr += _buildRender(
      node,
      parent,
      3,
      retType,
      !useStringF
        ? { _compParam: _compParamC }
        : {
          _type: _typeC,
          _typeS: _type,
          _typeR: _typeRefer,
          _params: paramsStr !== '' ? _paramsC : null,
          _children: _childrenC,
          _selfClose: node.selfCloseTag
        },
      fns,
      level,
      useStringLocal,
      node.allowNewline,
      isFirst
    );
  }

  return fnStr;
}

function _buildContent(content, parent, fns, counter, retType, level, useStringLocal, tagName, tagProps) {
  let fnStr = '';
  if (!content) {
    return fnStr;
  }

  tools.each(
    content,
    node => {
      const { useString } = node;
      fnStr += _buildNode(
        node,
        parent,
        fns,
        counter,
        retType,
        level,
        useString != null ? useString : useStringLocal,
        fns._firstNode && level == 0,
        tagName,
        tagProps
      );

      if (fns._firstNode) {
        //输出字符串时模板第一个节点前面不加换行符
        fns._firstNode = false;
      }
    },
    true
  );

  return fnStr;
}

function _buildRender(node, parent, nodeType, retType, params, fns, level, useStringLocal, allowNewline, isFirst) {
  let retStr;
  const useStringF = fns.useString,
    useString = useStringLocal != null ? useStringLocal : useStringF,
    noLevel = level == null;

  switch (nodeType) {
    case 1: //文本节点
      retStr =
        (!useStringF || allowNewline || noLevel
          ? ''
          : isFirst
            ? parent.type !== 'nj_root'
              ? `${GLOBAL}.fl(${CONTEXT}) + `
              : ''
            : `'\\n' + `) +
        _buildLevelSpace(level, fns, allowNewline) +
        _buildLevelSpaceRt(useStringF, isFirst || noLevel) +
        params.text;
      break;
    case 2: //扩展标签
      retStr =
        '_ex' +
        params._ex +
        '.apply(' +
        (params.fnH ? params.fnH + ' ? ' + params.fnH + `.source : ${CONTEXT}` : CONTEXT) +
        ', _dataRefer' +
        params._dataRefer +
        ')';
      break;
    case 3: //元素节点
      if (!useStringF) {
        retStr = `${GLOBAL}.H(_compParam` + params._compParam + ')';
      } else {
        if ((allowNewline && allowNewline !== 'nlElem') || noLevel) {
          retStr = '';
        } else if (isFirst) {
          retStr = parent.type !== 'nj_root' ? `${GLOBAL}.fl(${CONTEXT}) + ` : '';
        } else {
          retStr = `'\\n' + `;
        }

        if (node.type !== nj.textTag && node.type !== nj.noWsTag) {
          const levelSpace = _buildLevelSpace(level, fns, allowNewline),
            content = node.content,
            hasTypeR = params._typeR,
            hasParams = params._params != null;

          retStr +=
            levelSpace +
            _buildLevelSpaceRt(useStringF, isFirst || noLevel) +
            `'<` +
            (hasTypeR ? `' + _type` + params._type : params._typeS) +
            (hasParams ? (!hasTypeR ? `'` : '') + ' + _params' + params._params : '') +
            (hasTypeR || hasParams ? ` + '` : '');
          if (!params._selfClose) {
            retStr += `>'`;
            retStr += ' + _children' + params._children + ' + ';
            retStr +=
              (!content || allowNewline || noLevel ? '' : `'\\n' + `) +
              (content ? levelSpace : '') + //如果子节点为空则不输出缩进空格和换行符
              _buildLevelSpaceRt(useStringF, noLevel) +
              `'</` +
              (hasTypeR ? `' + _type` + params._type + ` + '` : params._typeS) +
              `>'`;
          } else {
            retStr += ` />'`;
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

function _buildLevelSpace(level, fns, allowNewline) {
  let ret = '';
  if (allowNewline && allowNewline !== 'nlElem') {
    return ret;
  }

  if (fns.useString && level != null && level > 0) {
    ret += `'`;
    for (let i = 0; i < level; i++) {
      ret += '  ';
    }
    ret += `' + `;
  }
  return ret;
}

function _buildLevelSpaceRt(useString, noSpace) {
  if (useString && !noSpace) {
    return `${GLOBAL}.ls(${CONTEXT}) + `;
  }
  return '';
}

export default (astContent, ast, useString) => {
  const fns = {
    useString,
    _no: 0, //扩展标签函数计数
    _firstNode: true
  };

  _buildFn(astContent, ast, fns, fns._no, null, 0);
  return fns;
};
