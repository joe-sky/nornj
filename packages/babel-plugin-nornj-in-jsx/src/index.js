var transformEach = require('./eachTag');
var transformIf = require('./ifTag');
var transformSwitch = require('./switchTag');
var transformWith = require('./withTag');

module.exports = function (babel) {
  var nodeHandlers = {
    'if': transformIf(babel),
    each: transformEach(babel),
    'switch': transformSwitch(babel),
    'with': transformWith(babel)
  };

  var visitor = {
    JSXElement: function (path) {
      var nodeName = path.node.openingElement.name.name;
      var handler = nodeHandlers[nodeName];

      if (handler) {
        path.replaceWith(handler(path.node, path.hub.file));
      }
    }
  };

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: visitor
  };
};
