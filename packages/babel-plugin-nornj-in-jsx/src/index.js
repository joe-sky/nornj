var transformEach = require('./eachTag');
var transformIf = require('./ifTag');
//var transformChoose = require('./chooseStatement');
//var transformWith = require('./withStatement');

module.exports = function jcsPlugin(babel) {
  var nodeHandlers = {
    each: transformEach(babel),
    'if': transformIf(babel)
    //Choose: transformChoose(babel),
    //With: transformWith(babel)
  };

  var visitor = {
    JSXElement: function(path) {
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
