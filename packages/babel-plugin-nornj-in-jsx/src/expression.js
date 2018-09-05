const nj = require('nornj').default;
const astUtil = require('./util/ast');
const generate = require('./util/generate');

module.exports = function (babel) {
  const types = babel.types;

  return function (node, file, state) {
    const { quasis, expressions } = node.quasi;
    return generate.createRenderTmpl(babel, quasis, expressions, state.opts, { isExpresson: true });
  };
};