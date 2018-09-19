const astUtil = require('./util/ast');
const generate = require('./util/generate');

module.exports = function (babel) {
  const types = babel.types;

  return function (node, file, state) {
    const quasis = [];
    const expressions = [];
    const elName = node.openingElement.name.name;
    const key = astUtil.getKey(node);
    const attrs = astUtil.getAttributeMap(node);
    const children = astUtil.getChildren(types, node);
    const isSelfClosing = node.openingElement.selfClosing;
    const childrenBlocks = [];
    const subExTags = [];
    const tagName = '<#' + elName;

    children.forEach(function (childNode) {
      if (astUtil.isSubExTag(childNode)) {
        subExTags.push(childNode);
      }
      else {
        childrenBlocks.push(childNode);
      }
    });

    let lastAttrStr = generate.buildAttrs(types, tagName, attrs, quasis, expressions);
    if (!isSelfClosing) {
      const childrenExpression = astUtil.getSanitizedExpressionForContent(types, childrenBlocks, key);
      childrenExpression.isAccessor = true;

      if (subExTags.length) {
        if (childrenBlocks.length) {
          quasis.push(types.TemplateElement({
            cooked: lastAttrStr + '>'
          }));
          expressions.push(childrenExpression);
          lastAttrStr = '';
        }
        else {
          lastAttrStr += '>';
        }

        subExTags.forEach((subExTagNode, i) => {
          const subElName = subExTagNode.openingElement.name.name;
          const subAttrs = astUtil.getAttributeMap(subExTagNode);
          const subTagName = '<#' + subElName;
          lastAttrStr = generate.buildAttrs(types, subTagName, subAttrs, quasis, expressions, lastAttrStr);
          quasis.push(types.TemplateElement({
            cooked: lastAttrStr + '>'
          }));

          const subChildrenExpression = astUtil.getSanitizedExpressionForContent(
            types, astUtil.getChildren(types, subExTagNode), key
          );
          subChildrenExpression.isAccessor = true;
          expressions.push(subChildrenExpression);

          lastAttrStr = '</#' + subElName + '>';
        });

        quasis.push(types.TemplateElement({
          cooked: lastAttrStr + '</#' + elName + '>'
        }));
      }
      else {
        quasis.push(types.TemplateElement({
          cooked: lastAttrStr + '>'
        }));

        expressions.push(childrenExpression);

        quasis.push(types.TemplateElement({
          cooked: '</#' + elName + '>'
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