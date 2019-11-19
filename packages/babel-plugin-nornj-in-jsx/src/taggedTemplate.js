const nj = require('nornj').default;
const astUtil = require('./util/ast');
const generate = require('./util/generate');

module.exports = function(babel) {
  const types = babel.types;

  return function(node, path, state, taggedName) {
    const { quasis, expressions } = node.quasi;
    return generate.createRenderTmpl(babel, quasis, expressions, state.opts, path, taggedName);
  };
};
