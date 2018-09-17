const astUtil = require('./util/ast');
const conditionalUtil = require('./util/conditional');
const generate = require('./util/generate');

module.exports = function (babel) {
  const types = babel.types;

  return function (node, file, state) {
    const quasis = [];
    const expressions = [];
    const key = astUtil.getKey(node);
    const attrs = astUtil.getAttributeMap(node);
    const children = astUtil.getChildren(types, node);

    children.forEach(function (childNode) {
      if (astUtil.isSubExTag(childNode.openingElement.name.name)) {
        const subAttrs = astUtil.getAttributeMap(childNode);
        // result.elseifBlock.push({
        //   condition: conditionalUtil.getConditionExpression(node, errorInfos),
        //   block: astUtil.getChildren(types, node)
        // });
      }
      else {
        // result.ifBlock.push(node);
      }
    });

    // const tags = generate.buildCondition(types, condition, expressions);
    // tags.forEach(tag => quasis.push(types.TemplateElement({
    //   raw: tag,
    //   cooked: tag
    // })));

    //return generate.createRenderTmpl(babel, quasis, expressions, state.opts);
  };
};