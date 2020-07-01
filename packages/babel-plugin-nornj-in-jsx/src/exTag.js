const nj = require('nornj/dist/nornj.common').default;
const astUtil = require('./util/ast');
const generate = require('./util/generate');
const utils = require('./util/utils');

module.exports = function(babel) {
  const types = babel.types;

  return function(node, path, state) {
    const quasis = [];
    const expressions = [];
    let elName = node.openingElement.name.name;
    if (astUtil.hasExPrefix(elName)) {
      elName = elName.substr(2);
    }
    elName = nj.lowerFirst(elName);
    const key = astUtil.getKey(node);
    const attrs = astUtil.getAttributeMap(node);
    const children = astUtil.getChildren(types, node);
    const isSelfClosing = node.openingElement.selfClosing;
    const childrenBlocks = [];
    const subExTags = [];

    children.forEach(function(childNode) {
      if (astUtil.isSubExTag(childNode)) {
        subExTags.push(childNode);
      } else {
        childrenBlocks.push(childNode);
      }
    });

    const newContextData = {};
    let lastAttrStr = generate.buildAttrs(types, elName, attrs, quasis, expressions, '', newContextData);
    if (!isSelfClosing) {
      const childrenExpression = astUtil.getSanitizedExpressionForContent(types, childrenBlocks, key);
      childrenExpression.isAccessor = true;
      childrenExpression.newContextData = newContextData;

      if (subExTags.length) {
        if (childrenBlocks.length) {
          quasis.push(
            types.TemplateElement({
              raw: '',
              cooked: lastAttrStr + '>'
            })
          );
          expressions.push(childrenExpression);
          lastAttrStr = '';
        } else {
          lastAttrStr += '>';
        }

        subExTags.forEach((subExTagNode, i) => {
          let subElName = subExTagNode.openingElement.name.name;
          if (astUtil.hasExPrefix(subElName)) {
            subElName = subElName.substr(2);
          }
          subElName = nj.lowerFirst(subElName);
          const subAttrs = astUtil.getAttributeMap(subExTagNode);
          const subNewContextData = {};
          lastAttrStr = generate.buildAttrs(
            types,
            subElName,
            subAttrs,
            quasis,
            expressions,
            lastAttrStr,
            subNewContextData
          );
          quasis.push(
            types.TemplateElement({
              raw: '',
              cooked: lastAttrStr + '>'
            })
          );

          const subChildrenExpression = astUtil.getSanitizedExpressionForContent(
            types,
            astUtil.getChildren(types, subExTagNode),
            key
          );
          subChildrenExpression.isAccessor = true;
          subChildrenExpression.newContextData = subNewContextData;
          expressions.push(subChildrenExpression);

          lastAttrStr = '</n-' + subElName + '>';
        });

        quasis.push(
          types.TemplateElement({
            raw: '',
            cooked: lastAttrStr + '</n-' + elName + '>'
          })
        );
      } else {
        quasis.push(
          types.TemplateElement({
            raw: '',
            cooked: lastAttrStr + '>'
          })
        );

        expressions.push(childrenExpression);

        quasis.push(
          types.TemplateElement({
            raw: '',
            cooked: '</n-' + elName + '>'
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

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts, path, 'tag');
  };
};
