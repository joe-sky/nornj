const nj = require('nornj/dist/nornj.common').default;
const njUtils = require('nornj/tools/utils');
const { locInfo } = require('./utils');

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
        let attrStr = lastAttrStr + (i == 0 ? '<n-' + tagName : '') + ' ' + attrName + '=';
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
          lastAttrStr += (i == 0 ? '<n-' + tagName : '');
        }
        else if (isCtxObject && !isGetDatasFromProp && newContext.datas && newContext.datas[attrName] != null) {
          newContextData.datas[attrName] = [newContextData.datas[attrName][0], attr.value.value];
          lastAttrStr += (i == 0 ? '<n-' + tagName : '');
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
                  expr.expressions[i].noExpression = true;
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
    lastAttrStr += '<n-' + tagName;
  }

  return lastAttrStr;
}

function _expressionPrefix(expr) {
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

function getDirectiveExpression(types, expr) {
  if (types.isBinaryExpression(expr)) {
    return [...getDirectiveExpression(types, expr.left), ...getDirectiveExpression(types, expr.right)];
  }
  else {
    return [expr.loc ? expr : expr.value];
  }
}

const CTX_DATAS = 'datas';
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
      tmplStr += (expr.noExpression ? '' : '{{')
        + _expressionPrefix(expr) + '_njParam' + paramCount
        + (expr.noExpression ? '' : '}}');
      paramCount++;
    }
  });

  const tmplKey = `${njUtils.uniqueKey(tmplStr)}_${locInfo(path)}`;
  if (taggedName) {
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

  const tmplObj = _buildTmplFns(nj.precompile(
    tmplStr,
    !isTmplFnS ? (opts.outputH != null ? opts.outputH : true) : false,
    nj.createTmplRule(opts.delimiters != null ? opts.delimiters : {
      start: '{',
      end: '}',
      comment: ''
    })),
    tmplKey);

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
          if (k !== CTX_DATAS) {
            return types.objectProperty(types.Identifier(k), types.Identifier(e.newContextData[k]));
          }
          else {
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
          declarations.push(types.variableDeclarator(
            types.Identifier(newDatas[k][1]),
            types.callExpression(types.Identifier(CTX_GET_DATA), [types.stringLiteral(newDatas[k][0]), types.Identifier(CTX_DATA)])
          ));
        });

        declarations.length && arrowFnContent.push(types.variableDeclaration('const', declarations));
      }
      arrowFnContent.push(types.returnStatement(e));

      block = types.ArrowFunctionExpression(
        arrowFnParams,
        types.blockStatement(arrowFnContent)
      );
    }
    else {
      block = e;
    }

    tmplParams.push(types.objectProperty(
      types.identifier('_njParam' + i),
      block
    ));
  });

  const renderFnParams = [types.identifier(tmplObj)];
  if (tmplParams.length) {
    renderFnParams.push(types.objectExpression(tmplParams));
  }
  if (!isTmplFn) {
    renderFnParams.push(path.scope.hasBinding('props') ? types.identifier('props') :
      types.conditionalExpression(types.thisExpression(), types.memberExpression(
        types.thisExpression(),
        types.identifier('props')
      ), types.nullLiteral()), types.thisExpression());
  }

  return types.CallExpression(
    types.memberExpression(
      types.identifier('nj'),
      types.identifier(!isTmplFn ? 'renderH' : (taggedName === 'njs' ? 'buildRender' : 'buildRenderH'))
    ), renderFnParams
  );
}

function _buildTmplFns(fns, tmplKey) {
  let ret = '{\n';
  ret += '  _njTmplKey: \'' + tmplKey + '\',\n';

  nj.each(fns, (v, k, i, l) => {
    if (k.indexOf('_') != 0) {
      ret += '  ' + k + ': ' + v.toString() + (i < l - 1 ? ',' : '') + '\n';
    }
  });

  return ret + '}';
}

module.exports = {
  buildAttrs,
  getElName,
  getDirectiveExpression,
  createRenderTmpl
};