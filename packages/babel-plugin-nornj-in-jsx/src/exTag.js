const astUtil = require('./util/ast');
const conditionalUtil = require('./util/conditional');
const generate = require('./util/generate');

module.exports = function (babel) {
  var types = babel.types;

  return function (node, file, state) {
    const children = astUtil.getChildren(types, node);
    console.log(astUtil.getChildren(types, children[0]));
    const quasis = [];
    const expressions = [];
    // const tags = generate.buildCondition(types, condition, expressions);
    // tags.forEach(tag => quasis.push(types.TemplateElement({
    //   raw: tag,
    //   cooked: tag
    // })));

    //return generate.createRenderTmpl(babel, quasis, expressions, state.opts);
  };
};