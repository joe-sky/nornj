const transformEach = require('./eachTag');
const transformIf = require('./ifTag');
const transformSwitch = require('./switchTag');
const transformWith = require('./withTag');
const transformExAttr = require('./exAttr');
const astUtil = require('./util/ast');

module.exports = function (babel) {
  const types = babel.types;
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
          state.file.hasNjInJSX = true;
          path.replaceWith(handler(path.node, path.hub.file, state));
        }
      },
      exit(path, state) {
        if (astUtil.hasExAttr(path.node)) {
          state.file.hasNjInJSX = true;
          path.replaceWith(exAttrHandler(path.node, path.hub.file, state));
        }
      }
    },
    Program: {
      enter(path, state) {
        state.file.hasNjInJSX = false;
      },
      exit(path, state) {
        if (!state.file.hasNjInJSX) {
          return;
        }

        path.node.body.unshift(types.importDeclaration(
          [],
          types.stringLiteral('nornj-react')
        ));
        path.node.body.unshift(types.importDeclaration(
          [types.importDefaultSpecifier(types.identifier('nj'))],
          types.stringLiteral('nornj')
        ));
      }
    }
  };

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: visitor
  };
};
