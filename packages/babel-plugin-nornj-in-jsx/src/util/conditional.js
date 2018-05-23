var astUtil = require('./ast');
var errorUtil = require('./error');


var ATTRIBUTES = {
  CONDITION: 'condition'
};

exports.getConditionExpression = function(node, errorInfos, attrName) {
  let name = attrName || ATTRIBUTES.CONDITION;
  var condition = astUtil.getAttributeMap(node)[name];

  if (!condition) {
    errorUtil.throwNoAttribute(name, errorInfos);
  }
  if (!astUtil.isExpressionContainer(condition)) {
    errorUtil.throwNotExpressionType(name, errorInfos);
  }

  return astUtil.getExpression(condition);
};
