const astUtil = require('./ast');
const errorUtil = require('./error');

const ATTRIBUTES = {
  CONDITION: 'condition'
};

exports.getConditionExpression = function(node, errorInfos, attrName) {
  let name = attrName || ATTRIBUTES.CONDITION;
  let condition = astUtil.getAttributeMap(node)[name];

  if (!condition) {
    errorUtil.throwNoAttribute(name, errorInfos);
  }
  if (!astUtil.isExpressionContainer(condition)) {
    errorUtil.throwNotExpressionType(name, errorInfos);
  }

  return astUtil.getExpression(condition);
};
