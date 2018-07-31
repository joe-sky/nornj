const astUtil = require('./util/ast');
const conditionalUtil = require('./util/conditional');
const generate = require('./util/generate');

module.exports = function (babel) {
  const types = babel.types;

  return function (node, file, state, globalNj) {
    const quasis = [];
    const expressions = [];
    const elName = node.openingElement.name.name;
    const attrs = astUtil.getAttributeMap(node);
    const children = astUtil.getChildren(types, node);
    const childrenExpression = astUtil.getSanitizedExpressionForContent(types, children);
    let tagName = '<';

    if (!astUtil.REGEX_CAPITALIZE.test(elName)) {
      tagName += elName;
    }

    Object.keys(attrs).forEach((attrName, i) => {
      const attr = attrs[attrName];
      quasis.push(types.TemplateElement({
        cooked: (i == 0 ? tagName : '') + ' ' + (astUtil.isExAttr(attrName)
          ? astUtil.transformExAttr(attrName)
          : attrName) + '='
      }));

      expressions.push(attr.value.type == 'JSXExpressionContainer'
        ? attr.value.expression
        : attr.value);
    });

    quasis.push(types.TemplateElement({
      cooked: '>'
    }));

    expressions.push(childrenExpression);

    quasis.push(types.TemplateElement({
      cooked: '</' + elName + '>'
    }));

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts, globalNj);
  };
};