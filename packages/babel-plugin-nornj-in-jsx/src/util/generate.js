const nj = require('nornj').default;
const njUtils = require('nornj/tools/utils');

function buildCondition(types, condition, expressions, tagStart = '<#if {{', hasMustache) {
  let ret = [],
    tagEnd = '}}>';

  if (types.isTemplateLiteral(condition)) {
    let hasExp = false;
    condition.quasis.forEach((q, i) => {
      if (i == 0) {
        tagStart += q.value.cooked;
      }
      else if (i == condition.quasis.length - 1) {
        tagEnd = q.value.cooked + tagEnd;
      }
      else {
        ret.push(q.value.cooked);
      }

      if (i < condition.quasis.length - 1) {
        hasExp = true;
        !hasMustache && (condition.expressions[i].noMustache = true);
        expressions.push(condition.expressions[i]);
      }
    });

    if (hasExp) {
      ret = [tagStart, ...ret, tagEnd];
    }
    else {
      ret = [tagStart + tagEnd];
    }
  }
  else {
    ret = [tagStart, tagEnd];
    !hasMustache && (condition.noMustache = true);
    expressions.push(condition);
  }

  return ret;
}

function buildAttrs(types, tagName, attrs, quasis, expressions, lastAttrStr, newContextData) {
  const attrNames = Object.keys(attrs);
  const exTagConfig = nj.extensionConfig[tagName];
  const newContext = exTagConfig && exTagConfig.newContext;
  const isCtxObject = nj.isObject(newContext);
  const getDatasFromProp = newContext.getDatasFromProp;
  let datasFromPropExcept = getDatasFromProp && getDatasFromProp.except;
  if (isCtxObject) {
    Object.keys(newContext).forEach(k => {
      if (k !== 'getDatasFromProp') {
        newContextData[k] = newContext[k];
      }
    });

    if (getDatasFromProp && !newContextData.datas) {
      newContextData.datas = {};
    }
  }

  if (attrNames.length) {
    attrNames.forEach((attrName, i) => {
      const attr = attrs[attrName];

      if (attr.type != 'JSXSpreadAttribute') {
        let attrStr = lastAttrStr + (i == 0 ? '<#' + tagName : '') + ' ' + attrName + '=';
        let isGetDatasFromProp = false;
        if (getDatasFromProp) {
          isGetDatasFromProp = !datasFromPropExcept
            ? true
            : datasFromPropExcept.indexOf(attrName) < 0;
        }

        if (isCtxObject && isGetDatasFromProp) {
          newContextData.datas[attrName] = [attrName, attrName];
        }
        if (isCtxObject && !isGetDatasFromProp && newContext[attrName] != null) {
          newContextData[attrName] = attr.value.value;
          lastAttrStr += (i == 0 ? '<#' + tagName : '');
        }
        else if (isCtxObject && !isGetDatasFromProp && newContext.datas && newContext.datas[attrName] != null) {
          newContextData.datas[attrName] = [newContextData.datas[attrName][0], attr.value.value];
          lastAttrStr += (i == 0 ? '<#' + tagName : '');
        }
        else if (!attr.value) {
          lastAttrStr = attrStr.substr(0, attrStr.length - 1);
        }
        else if (attr.value.type == 'JSXExpressionContainer') {
          const expr = attr.value.expression;

          if (types.isTemplateLiteral(expr)) {
            if (expr.quasis.length === 1) {
              lastAttrStr = attrStr + '"{{' + expr.quasis[0].value.cooked + '}}"';
            }
            else {
              expr.quasis.forEach((q, i) => {
                if (i == 0) {
                  attrStr += '"{{' + q.value.cooked;
                  quasis.push(types.TemplateElement({
                    cooked: attrStr
                  }));
                }
                else if (i == expr.quasis.length - 1) {
                  lastAttrStr = q.value.cooked + '}}"';
                }
                else {
                  quasis.push(types.TemplateElement({
                    cooked: q.value.cooked
                  }));
                }

                if (i < expr.quasis.length - 1) {
                  expr.expressions[i].noMustache = true;
                  expressions.push(expr.expressions[i]);
                }
              });
            }
          }
          else {
            quasis.push(types.TemplateElement({
              cooked: attrStr
            }));
            expressions.push(expr);
            lastAttrStr = '';
          }
        }
        else {
          quasis.push(types.TemplateElement({
            cooked: attrStr
          }));
          expressions.push(attr.value);
          lastAttrStr = '';
        }
      }
      else {
        quasis.push(types.TemplateElement({
          cooked: ' '
        }));
        attr.argument.isSpread = true;
        expressions.push(attr.argument);
        lastAttrStr = '';
      }
    });
  }
  else {
    lastAttrStr += '<#' + tagName;
  }

  return lastAttrStr;
}

function _mustachePrefix(expr) {
  if (expr.isAccessor) {
    return '#';
  }
  else if (expr.isSpread) {
    return '...';
  }
  else {
    return '';
  }
}

function getElName(types, expr) {
  if (types.isJSXMemberExpression(expr)) {
    return types.memberExpression(getElName(types, expr.object), getElName(types, expr.property));
  }
  else {
    return types.identifier(expr.name);
  }
}

function getExAttrExpression(types, expr) {
  if (types.isBinaryExpression(expr)) {
    return [...getExAttrExpression(types, expr.left), ...getExAttrExpression(types, expr.right)];
  }
  else {
    return [expr.loc ? expr : expr.value];
  }
}

const CTX_DATAS = 'datas';
const CTX_DATA = 'data';
const CTX_GET_DATA = 'getData';

function createRenderTmpl(babel, quasis, expressions, opts, taggedTmplConfig) {
  const types = babel.types;

  let tmplStr = '';
  if (!taggedTmplConfig) {
    let paramCount = 0;
    quasis.forEach((q, i) => {
      tmplStr += q.value.cooked;
      if (i < quasis.length - 1) {
        const expr = expressions[i];
        tmplStr += (expr.noMustache ? '' : '{{')
          + _mustachePrefix(expr) + '_njParam' + paramCount
          + (expr.noMustache ? '' : '}}');
        paramCount++;
      }
    });
  }
  else {
    tmplStr = Object.assign({ quasis: quasis.map(q => q.value.cooked) }, taggedTmplConfig);
  }

  const tmplObj = _buildTmplFns(nj.precompile(
    tmplStr,
    opts.outputH != null ? opts.outputH : true,
    nj.createTmplRule(opts.delimiters != null ? opts.delimiters : {
      start: '{',
      end: '}',
      comment: ''
    })),
    njUtils.uniqueKey(tmplStr));

  // const tmplParams = expressions.map((e, i) => {
  //   let block;
  //   if (e.isAccessor) {
  //     const arrowFnParams = [];
  //     const newCtxDatakeys = Object.keys(e.newContextData);
  //     let newDatas;
  //     if (newCtxDatakeys.length) {
  //       const properties = newCtxDatakeys.map(k => {
  //         if (k !== CTX_DATAS) {
  //           return types.objectProperty(types.Identifier(k), types.Identifier(e.newContextData[k]));
  //         }
  //         else {
  //           newDatas = e.newContextData[k];
  //           return types.objectProperty(types.Identifier(CTX_GET_DATA), types.Identifier(CTX_GET_DATA));
  //         }
  //       });

  //       if (newDatas) {
  //         properties.push(types.objectProperty(types.Identifier(CTX_DATA), types.Identifier(CTX_DATA)));
  //       }
  //       arrowFnParams.push(types.objectPattern(properties));
  //     }

  //     const arrowFnContent = [];
  //     if (newDatas) {
  //       const declarations = [];
  //       Object.keys(newDatas).forEach(k => {
  //         declarations.push(types.variableDeclarator(
  //           types.Identifier(newDatas[k][1]),
  //           types.callExpression(types.Identifier(CTX_GET_DATA), [types.stringLiteral(newDatas[k][0]), types.Identifier(CTX_DATA)])
  //         ));
  //       });

  //       arrowFnContent.push(types.variableDeclaration('const', declarations));
  //     }
  //     arrowFnContent.push(types.returnStatement(e));

  //     block = types.ArrowFunctionExpression(
  //       arrowFnParams,
  //       types.blockStatement(arrowFnContent)
  //     );
  //   }
  //   else {
  //     block = e;
  //   }

  //   return types.objectProperty(
  //     types.identifier('_njParam' + i),
  //     block
  //   );
  // });
  const tmplParams = expressions.map((e, i) => types.objectProperty(
    types.identifier('_njParam' + i), e
  ));
  if (tmplParams.length) {
    tmplParams.push(types.objectProperty(types.identifier('_njParam'), types.booleanLiteral(true)));
  }

  const renderFnParams = [types.identifier(tmplObj)];
  if (tmplParams.length) {
    renderFnParams.push(types.objectExpression(tmplParams));
  }
  renderFnParams.push(types.thisExpression());

  return types.CallExpression(
    types.memberExpression(
      types.identifier('nj'),
      types.identifier('renderH')
    ), renderFnParams
  );
}

function _buildTmplFns(fns, tmplKey) {
  let ret = '{\n';
  ret += '  _njTmplKey: ' + tmplKey + ',\n';

  nj.each(fns, (v, k, i, l) => {
    if (k.indexOf('_') != 0) {
      ret += '  ' + k + ': ' + v.toString() + (i < l - 1 ? ',' : '') + '\n';
    }
  });

  return ret + '}';
}

module.exports = {
  buildCondition,
  buildAttrs,
  getElName,
  getExAttrExpression,
  createRenderTmpl
};