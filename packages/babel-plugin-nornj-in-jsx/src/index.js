const transformEach = require('./eachTag');
const transformIf = require('./ifTag');
const transformSwitch = require('./switchTag');
const transformWith = require('./withTag');
const transformExAttr = require('./exAttr');
const astUtil = require('./util/ast');

module.exports = function (babel) {
  const nodeHandlers = {
    'if': transformIf(babel),
    each: transformEach(babel),
    'switch': transformSwitch(babel),
    'with': transformWith(babel)
  };
  const exAttrHandler = transformExAttr(babel);

  var visitor = {
    JSXElement: {
      enter(path, state) {
        var nodeName = path.node.openingElement.name.name;
        var handler = nodeHandlers[nodeName];

        if (handler) {
          path.replaceWith(handler(path.node, path.hub.file, state, astUtil.addImportNj(state)));
        }
      },
      exit(path, state) {
        if(astUtil.hasExAttr(path.node)) {
          path.replaceWith(exAttrHandler(path.node, path.hub.file, state, astUtil.addImportNj(state)));
        }
      }
    }
  };

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: visitor
  };
};
