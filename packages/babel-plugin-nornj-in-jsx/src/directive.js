const nj = require('nornj/dist/nornj.common').default;
const astUtil = require('./util/ast');
const generate = require('./util/generate');

module.exports = function(babel) {
  const types = babel.types;

  return function(node, path, state) {
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
    } else {
      quasis.push(
        types.TemplateElement({
          raw: '',
          cooked: tagName
        })
      );

      if (isJSXMemberExpression) {
        elName = generate.getElName(types, node.openingElement.name);
      } else {
        elName = types.identifier(elName);
      }
      expressions.push(elName);
    }

    let lastAttrStr = '';
    function _buildFromNjExp(directiveExpressions, attrStr) {
      if (!nj.isString(directiveExpressions[0])) {
        directiveExpressions.unshift('');
      }
      if (!nj.isString(directiveExpressions[directiveExpressions.length - 1])) {
        directiveExpressions.push('');
      }

      directiveExpressions.forEach((e, i) => {
        if (i == 0) {
          quasis.push(
            types.TemplateElement({
              raw: '',
              cooked: attrStr + '"{{' + e
            })
          );
        } else if (i == directiveExpressions.length - 1) {
          lastAttrStr = e + '}}"';
        } else {
          if (nj.isString(e)) {
            quasis.push(
              types.TemplateElement({
                raw: '',
                cooked: e
              })
            );
          } else {
            e.noExpression = true;
            expressions.push(e);
          }
        }
      });
    }

    Object.keys(attrs).forEach((attrName, i) => {
      const attr = attrs[attrName];

      if (attr.type != 'JSXSpreadAttribute') {
        const isDirective = astUtil.isDirective(attrName);
        const _attrName = isDirective ? astUtil.transformDirective(attrName) : attrName;
        const attrStr = lastAttrStr + (i == 0 ? (!isComponent ? tagName : '') : '') + ' ' + _attrName + '=';
        let directiveConfig = isDirective
          ? nj.extensionConfig[
            _attrName != 'style' ? _attrName.substr(2).replace(astUtil.REGEX_EX_ATTR, (all, name) => name) : _attrName
          ]
          : {};
        !directiveConfig && (directiveConfig = {});

        if (!attr.value) {
          lastAttrStr = attrStr.substr(0, attrStr.length - 1);
        } else if (attr.value.type == 'JSXExpressionContainer') {
          const expr = attr.value.expression;
          const cannotUseExpression = directiveConfig.useExpressionInProps === false;

          //Template literal case 1: `123 + abc`
          if (isDirective && !cannotUseExpression && types.isStringLiteral(expr) && !expr.extra) {
            lastAttrStr = attrStr + '"{{' + expr.value + '}}"';
          }
          //Template literal case 2: `123 + abc + ${def}`
          else if (
            isDirective &&
            !cannotUseExpression &&
            types.isCallExpression(expr) &&
            types.isStringLiteral(expr.callee.object) &&
            expr.callee.property.name === 'concat'
          ) {
            const directiveExpressions = expr.arguments.map(e => {
              if (types.isStringLiteral(e) && !e.extra) {
                return e.value;
              }
              return e;
            });
            if (expr.callee.object.value !== '') {
              directiveExpressions.unshift(!expr.callee.object.extra ? expr.callee.object.value : expr.callee.object);
            }

            _buildFromNjExp(directiveExpressions, attrStr);
          } else if (
            isDirective &&
            !cannotUseExpression &&
            directiveConfig.isBindable &&
            types.isMemberExpression(expr)
          ) {
            const directiveMemberExpressions = generate.getDirectiveMemberExpression(types, expr);
            quasis.push(
              types.TemplateElement({
                raw: '',
                cooked: attrStr + '"{{'
              })
            );

            const exprFirst = directiveMemberExpressions[0];
            exprFirst.noExpression = true;
            expressions.push(exprFirst);
            lastAttrStr =
              '.' +
              directiveMemberExpressions
                .slice(1)
                .map(e => e.name)
                .join('.') +
              '}}"';
          } else {
            quasis.push(
              types.TemplateElement({
                raw: '',
                cooked: attrStr
              })
            );
            expressions.push(expr);
            lastAttrStr = '';
          }
        } else {
          quasis.push(
            types.TemplateElement({
              raw: '',
              cooked: attrStr
            })
          );
          expressions.push(attr.value);
          lastAttrStr = '';
        }
      } else {
        quasis.push(
          types.TemplateElement({
            raw: '',
            cooked: ' '
          })
        );
        attr.argument.isSpread = true;
        expressions.push(attr.argument);
        lastAttrStr = '';
      }
    });

    if (!isSelfClosing) {
      quasis.push(
        types.TemplateElement({
          raw: '',
          cooked: lastAttrStr + '>'
        })
      );

      expressions.push(childrenExpression);

      if (!isComponent) {
        quasis.push(
          types.TemplateElement({
            raw: '',
            cooked: '</' + elName + '>'
          })
        );
      } else {
        const closeTagPrefix = types.TemplateElement({
          raw: '',
          cooked: '</'
        });
        closeTagPrefix.isCloseTagPrefix = true;
        quasis.push(closeTagPrefix);
        expressions.push(elName);
        quasis.push(
          types.TemplateElement({
            raw: '',
            cooked: '>'
          })
        );
      }
    } else {
      quasis.push(
        types.TemplateElement({
          raw: '',
          cooked: lastAttrStr + ' />'
        })
      );
    }

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts, path, 'directive');
  };
};
