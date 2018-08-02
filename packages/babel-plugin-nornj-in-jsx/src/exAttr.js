const astUtil = require('./util/ast');
const generate = require('./util/generate');

module.exports = function (babel) {
  const types = babel.types;

  return function (node, file, state) {
    const quasis = [];
    const expressions = [];
    const elName = node.openingElement.name.name;
    const attrs = astUtil.getAttributeMap(node);
    const children = astUtil.getChildren(types, node);
    const isSelfClosing = node.openingElement.selfClosing;
    const childrenExpression = !isSelfClosing && astUtil.getSanitizedExpressionForContent(types, children);
    const isComponent = astUtil.REGEX_CAPITALIZE.test(elName);
    let tagName = '<';

    if (!isComponent) {
      tagName += elName;
    }
    else {
      quasis.push(types.TemplateElement({
        cooked: tagName
      }));
      expressions.push(types.identifier(elName));
    }

    Object.keys(attrs).forEach((attrName, i) => {
      const attr = attrs[attrName];

      if (attr.type != 'JSXSpreadAttribute') {
        quasis.push(types.TemplateElement({
          cooked: (i == 0 ? (!isComponent ? tagName : '') : '') + ' ' + (astUtil.isExAttr(attrName)
            ? astUtil.transformExAttr(attrName)
            : attrName) + '='
        }));
        expressions.push(attr.value.type == 'JSXExpressionContainer'
          ? attr.value.expression
          : attr.value);
      }
      else {
        quasis.push(types.TemplateElement({
          cooked: ' '
        }));
        attr.argument.isSpread = true;
        expressions.push(attr.argument);
      }
    });

    if (!isSelfClosing) {
      quasis.push(types.TemplateElement({
        cooked: '>'
      }));

      expressions.push(childrenExpression);

      if (!isComponent) {
        quasis.push(types.TemplateElement({
          cooked: '</' + elName + '>'
        }));
      }
      else {
        quasis.push(types.TemplateElement({
          cooked: '</'
        }));
        expressions.push(types.identifier(elName));
        quasis.push(types.TemplateElement({
          cooked: '>'
        }));
      }
    }
    else {
      quasis.push(types.TemplateElement({
        cooked: '/>'
      }));
    }

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts);
  };
};