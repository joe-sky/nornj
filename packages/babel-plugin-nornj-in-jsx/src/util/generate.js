const { default: nj, expression: n } = require('nornj');
const njUtils = require('nornj/tools/utils');
const { locInfo } = require('./utils');

function buildAttrs(types, tagName, attrs, quasis, expressions, lastAttrStr, newContextData) {
  const attrNames = Object.keys(attrs);
  const exTagConfig = nj.extensionConfig[tagName] || {};
  const newContext = exTagConfig.newContext;
  const isCtxObject = nj.isObject(newContext);
  const getDataFromProps = newContext && newContext.getDataFromProps;
  const dataFromPropsExcept = getDataFromProps && getDataFromProps.except;
  if (isCtxObject) {
    Object.keys(newContext).forEach(k => {
      if (k !== 'getDataFromProps') {
        newContextData[k] = newContext[k];
      }
    });

    if (getDataFromProps && !newContextData.data) {
      newContextData.data = {};
    }
  }

  if (attrNames.length) {
    attrNames.forEach((attrName, i) => {
      const attr = attrs[attrName];
      let attrStr = lastAttrStr + (i == 0 ? '<n-' + tagName : '');

      if (attr.type != 'JSXSpreadAttribute') {
        attrStr = attrStr + ' ' + attrName + '=';
        let isGetDataFromProps = false;
        if (getDataFromProps) {
          isGetDataFromProps = !dataFromPropsExcept ? true : dataFromPropsExcept.indexOf(attrName) < 0;
        }

        if (isCtxObject && isGetDataFromProps) {
          newContextData.data[attrName] = [attrName, attrName];
        }
        if (isCtxObject && !isGetDataFromProps && newContext[attrName] != null) {
          newContextData[attrName] = attr.value.value;
          lastAttrStr += i == 0 ? '<n-' + tagName : '';
        } else if (isCtxObject && !isGetDataFromProps && newContext.data && newContext.data[attrName] != null) {
          const attrDatas = newContextData.data[attrName];
          newContextData.data[attrName] = [Array.isArray(attrDatas) ? attrDatas[0] : attrDatas, attr.value.value];
          lastAttrStr += i == 0 ? '<n-' + tagName : '';
        } else if (!attr.value) {
          lastAttrStr = attrStr.substr(0, attrStr.length - 1);
        } else if (attr.value.type == 'JSXExpressionContainer') {
          const expr = attr.value.expression;

          if (types.isTemplateLiteral(expr) && !(exTagConfig.useExpressionInProps === false)) {
            if (expr.quasis.length === 1) {
              lastAttrStr = attrStr + '"{{' + expr.quasis[0].value.cooked + '}}"';
            } else {
              expr.quasis.forEach((q, i) => {
                if (i == 0) {
                  attrStr += '"{{' + q.value.cooked;
                  quasis.push(
                    types.TemplateElement({
                      raw: attrStr,
                      cooked: attrStr
                    })
                  );
                } else if (i == expr.quasis.length - 1) {
                  lastAttrStr = q.value.cooked + '}}"';
                } else {
                  quasis.push(
                    types.TemplateElement({
                      raw: q.value.cooked,
                      cooked: q.value.cooked
                    })
                  );
                }

                if (i < expr.quasis.length - 1) {
                  expr.expressions[i].noExpression = true;
                  expressions.push(expr.expressions[i]);
                }
              });
            }
          } else {
            quasis.push(
              types.TemplateElement({
                raw: attrStr,
                cooked: attrStr
              })
            );
            expressions.push(expr);
            lastAttrStr = '';
          }
        } else {
          quasis.push(
            types.TemplateElement({
              raw: attrStr,
              cooked: attrStr
            })
          );
          expressions.push(attr.value);
          lastAttrStr = '';
        }
      } else {
        quasis.push(
          types.TemplateElement({
            raw: attrStr + ' ',
            cooked: attrStr + ' '
          })
        );
        attr.argument.isSpread = true;
        expressions.push(attr.argument);
        lastAttrStr = '';
      }
    });
  } else {
    lastAttrStr += '<n-' + tagName;
  }

  return lastAttrStr;
}

function _expressionPrefix(expr) {
  if (expr.isAccessor) {
    return '#';
  } else if (expr.isSpread) {
    return '...';
  } else {
    return '';
  }
}

function getElName(types, expr) {
  if (types.isJSXMemberExpression(expr)) {
    return types.memberExpression(getElName(types, expr.object), getElName(types, expr.property));
  } else {
    return types.identifier(expr.name);
  }
}

function getDirectiveExpression(types, expr) {
  if (types.isBinaryExpression(expr)) {
    return [...getDirectiveExpression(types, expr.left), ...getDirectiveExpression(types, expr.right)];
  } else {
    return [expr.loc ? expr : expr.value];
  }
}

function getDirectiveMemberExpression(types, expr) {
  if (types.isMemberExpression(expr)) {
    return [...getDirectiveMemberExpression(types, expr.object), ...getDirectiveMemberExpression(types, expr.property)];
  } else {
    return [expr];
  }
}

const CTX_DATA = 'data';
const CTX_GET_DATA = 'getData';

function createRenderTmpl(babel, quasis, expressions, opts, path, taggedName) {
  const types = babel.types;
  const isTmplFnS = taggedName === 'njs';
  const isTmplFn = taggedName === 'nj' || taggedName === 'html' || isTmplFnS;

  let tmplStr = '';
  let paramCount = 0;
  quasis.forEach((q, i) => {
    tmplStr += q.value.cooked;
    if (i < quasis.length - 1) {
      const expr = expressions[i];
      tmplStr +=
        (expr.noExpression ? '' : '{{') +
        _expressionPrefix(expr) +
        '_njParam' +
        paramCount +
        (expr.noExpression ? '' : '}}');
      paramCount++;
    }
  });

  const tmplKey = `${njUtils.uniqueKey(tmplStr)}_${locInfo(path)}`;
  if (taggedName && !['tag', 'directive'].includes(taggedName)) {
    let taggedTmplConfig = {};
    switch (taggedName) {
      case 'n':
        taggedTmplConfig = { isExpression: true };
        break;
      case 's':
        taggedTmplConfig = { isCss: true };
        break;
    }

    tmplStr = Object.assign({ quasis: quasis.map(q => q.value.cooked) }, taggedTmplConfig);
  }

  const hasAst = ['tag', 'directive', 'n'].includes(taggedName);
  let tmplFns, tmplAst;
  tmplFns = nj.precompile(
    tmplStr,
    !isTmplFnS ? (opts.outputH != null ? opts.outputH : true) : false,
    nj.createTmplRule(
      opts.delimiters != null
        ? opts.delimiters
        : !isTmplFnS
        ? {
            start: '{',
            end: '}',
            comment: ''
          }
        : {}
    ),
    hasAst
  );
  if (hasAst) {
    tmplAst = tmplFns.ast;
    tmplFns = tmplFns.fns;
  }

  const paramIdentifiers = new Set();
  if (tmplAst) {
    switch (taggedName) {
      case 'tag':
        tmplAst.content[0] &&
          nj.each(tmplAst.content[0].params, attr => {
            attr.props && _getExpressionParams([attr.props[0].prop], paramIdentifiers);
          });
        break;
      case 'directive':
        tmplAst.content[0].paramsEx &&
          nj.each(tmplAst.content[0].paramsEx.content, attr => {
            attr.content && _getExpressionParams([attr.content[0].content[0].props[0].prop], paramIdentifiers);
          });
        break;
      default:
        _getExpressionParams([tmplAst.content[0].content[0].props[0].prop], paramIdentifiers);
        break;
    }
  }

  const tmplObj = _buildTmplFns(tmplFns, tmplKey);
  const tmplParams = [];
  expressions.forEach((e, i) => {
    if (quasis[i].isCloseTagPrefix) {
      return;
    }

    let block;
    if (e.isAccessor) {
      const arrowFnParams = [];
      const newCtxDatakeys = Object.keys(e.newContextData);
      let newDatas;
      if (newCtxDatakeys.length) {
        const properties = newCtxDatakeys.map(k => {
          if (k !== CTX_DATA) {
            return types.objectProperty(types.Identifier(k), types.Identifier(e.newContextData[k]));
          } else {
            newDatas = e.newContextData[k];
            return types.objectProperty(types.Identifier(CTX_GET_DATA), types.Identifier(CTX_GET_DATA));
          }
        });

        if (newDatas) {
          properties.push(types.objectProperty(types.Identifier(CTX_DATA), types.Identifier(CTX_DATA)));
        }
        arrowFnParams.push(types.objectPattern(properties));
      }

      const arrowFnContent = [];
      if (newDatas) {
        const declarations = [];
        Object.keys(newDatas).forEach(k => {
          let varName, dataName;
          if (Array.isArray(newDatas[k])) {
            varName = newDatas[k][1];
            dataName = newDatas[k][0];
          } else {
            dataName = varName = newDatas[k];
          }

          declarations.push(
            types.variableDeclarator(
              types.Identifier(varName),
              types.callExpression(types.Identifier(CTX_GET_DATA), [
                types.stringLiteral(dataName),
                types.Identifier(CTX_DATA)
              ])
            )
          );
        });

        declarations.length && arrowFnContent.push(types.variableDeclaration('const', declarations));
      }
      arrowFnContent.push(types.returnStatement(e));

      block = types.ArrowFunctionExpression(arrowFnParams, types.blockStatement(arrowFnContent));
    } else {
      block = e;
    }

    tmplParams.push(types.objectProperty(types.identifier('_njParam' + i), block));
  });

  if (paramIdentifiers.size) {
    paramIdentifiers.forEach(paramIdentifier => {
      if (path.scope.hasBinding(paramIdentifier)) {
        tmplParams.push(types.objectProperty(types.identifier(paramIdentifier), types.identifier(paramIdentifier)));
      }
    });
  }

  const renderFnParams = [types.identifier(tmplObj)];
  if (tmplParams.length) {
    renderFnParams.push(types.objectExpression(tmplParams));
  }
  if (!isTmplFn) {
    renderFnParams.push(types.thisExpression());
  }

  return types.CallExpression(
    types.memberExpression(
      types.identifier('nj'),
      types.identifier(!isTmplFn ? 'renderH' : taggedName === 'njs' ? 'buildRender' : 'buildRenderH')
    ),
    renderFnParams
  );
}

function _buildTmplFns(fns, tmplKey) {
  let ret = '{\n';
  ret += `  _njTmplKey: '${tmplKey}',\n`;

  nj.each(fns, (v, k, i, l) => {
    if (k.indexOf('_') != 0) {
      ret += '  ' + k + ': ' + v.toString() + (i < l - 1 ? ',' : '') + '\n';
    }
  });

  return ret + '}';
}

function _getExpressionParams(paramsAst, paramIdentifiers) {
  paramsAst.forEach(pAst => {
    if (
      !pAst.isBasicType &&
      pAst.name !== 'this' &&
      !(pAst.name && pAst.name.startsWith('_njParam')) /* && !n`${pAst}.name.startsWith('_njParam')` */
    ) {
      paramIdentifiers.add(pAst.name);
    }
    if (pAst.filters) {
      pAst.filters.forEach(filter => {
        if (filter.params) {
          _getExpressionParams(filter.params, paramIdentifiers);
        }
      });
    }
  });
}

module.exports = {
  buildAttrs,
  getElName,
  getDirectiveExpression,
  getDirectiveMemberExpression,
  createRenderTmpl
};
