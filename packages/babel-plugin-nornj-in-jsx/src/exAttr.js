const nj = require('nornj').default;
const astUtil = require('./util/ast');
const generate = require('./util/generate');

module.exports = function (babel) {
  const types = babel.types;

  return function (node, file, state) {
    const quasis = [];
    const expressions = [];
    const isJSXMemberExpression = types.isJSXMemberExpression(node.openingElement.name);
    let elName = node.openingElement.name.name;
    const key = astUtil.getKey(node);
    const attrs = astUtil.getAttributeMap(node);
    const children = astUtil.getChildren(types, node);
    const isSelfClosing = node.openingElement.selfClosing;
    const childrenExpression = !isSelfClosing && astUtil.getSanitizedExpressionForContent(types, children, key);
    const isComponent = !isJSXMemberExpression ? astUtil.REGEX_CAPITALIZE.test(elName) : true;
    let tagName = '<';

    if (!isComponent) {
      tagName += elName;
    }
    else {
      quasis.push(types.TemplateElement({
        cooked: tagName
      }));

      if (isJSXMemberExpression) {
        elName = generate.getElName(types, node.openingElement.name);
      }
      else {
        elName = types.identifier(elName);
      }
      expressions.push(elName);
    }

    let lastAttrStr = '';
    function _buildFromNjExp(exAttrExpressions, attrStr) {
      if (!nj.isString(exAttrExpressions[0])) {
        exAttrExpressions.unshift('');
      }
      if (!nj.isString(exAttrExpressions[exAttrExpressions.length - 1])) {
        exAttrExpressions.push('');
      }

      exAttrExpressions.forEach((e, i) => {
        if (i == 0) {
          quasis.push(types.TemplateElement({
            cooked: attrStr + '"{{' + e
          }));
        }
        else if (i == exAttrExpressions.length - 1) {
          lastAttrStr = e + '}}"';
        }
        else {
          if (nj.isString(e)) {
            quasis.push(types.TemplateElement({
              cooked: e
            }));
          }
          else {
            e.noMustache = true;
            expressions.push(e);
          }
        }
      });
    }

    Object.keys(attrs).forEach((attrName, i) => {
      const attr = attrs[attrName];

      if (attr.type != 'JSXSpreadAttribute') {
        const isExAttr = astUtil.isExAttr(attrName);
        const _attrName = isExAttr ? astUtil.transformExAttr(attrName) : attrName;
        const attrStr = lastAttrStr + (i == 0 ? (!isComponent ? tagName : '') : '') + ' ' + _attrName + '=';
        let exAttrConfig = isExAttr ? nj.extensionConfig[_attrName != 'style'
          ? _attrName.substr(1).replace(astUtil.REGEX_EX_ATTR, (all, name) => name)
          : _attrName] : {};
        !exAttrConfig && (exAttrConfig = {});

        if (!attr.value) {
          lastAttrStr = attrStr.substr(0, attrStr.length - 1);
        }
        else if (attr.value.type == 'JSXExpressionContainer') {
          const expr = attr.value.expression;
          const cannotUseExpression = exAttrConfig.useExpressionInJsx === false;

          if (isExAttr && !cannotUseExpression && types.isStringLiteral(expr)) {
            lastAttrStr = attrStr + '"{{' + expr.value + '}}"';
          }
          //babel 6
          else if (isExAttr && !cannotUseExpression && types.isBinaryExpression(expr) && expr.operator === '+') {
            const exAttrExpressions = generate.getExAttrExpression(types, expr);
            _buildFromNjExp(exAttrExpressions, attrStr);
          }
          //babel 7
          else if (isExAttr && !cannotUseExpression && types.isCallExpression(expr)
            && expr.callee.object.value === '' && expr.callee.property.name === 'concat') {
            const exAttrExpressions = expr.arguments.map(e => {
              if (types.isStringLiteral(e)) {
                return e.value;
              }
              return e;
            });
            _buildFromNjExp(exAttrExpressions, attrStr);
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
          if (exAttrConfig.useExpressionInJsx === true) {
            lastAttrStr = attrStr + '"{{' + attr.value.value + '}}"';
          }
          else {
            quasis.push(types.TemplateElement({
              cooked: attrStr
            }));
            expressions.push(attr.value);
            lastAttrStr = '';
          }
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

    if (!isSelfClosing) {
      quasis.push(types.TemplateElement({
        cooked: lastAttrStr + '>'
      }));

      expressions.push(childrenExpression);

      if (!isComponent) {
        quasis.push(types.TemplateElement({
          cooked: '</' + elName + '>'
        }));
      }
      else {
        const closeTagPrefix = types.TemplateElement({
          cooked: '</'
        });
        closeTagPrefix.isCloseTagPrefix = true;
        quasis.push(closeTagPrefix);
        expressions.push(elName);
        quasis.push(types.TemplateElement({
          cooked: '>'
        }));
      }
    }
    else {
      quasis.push(types.TemplateElement({
        cooked: lastAttrStr + ' />'
      }));
    }

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts);
  };
};