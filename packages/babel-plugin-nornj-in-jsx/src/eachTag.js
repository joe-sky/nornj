var astUtil = require('./util/ast');
var errorUtil = require('./util/error');

var ELEMENTS = {
  EACH: 'each'
};
var ATTRIBUTES = {
  ITEM: 'item',
  OF: 'of',
  INDEX: 'index'
};

function addMapParam(types, params, attributes, attributeKey) {
  var attribute = attributes[attributeKey];
  if (attribute && attribute.value) {
    params.push(types.objectProperty(types.Identifier(attributeKey), types.Identifier(attribute.value.value)));
  }
  else {
    params.push(types.objectProperty(types.Identifier(attributeKey), types.Identifier(attributeKey)));
  }
}

function checkForString(attributes, name, errorInfos) {
  if (attributes[name] && !astUtil.isStringLiteral(attributes[name])) {
    errorUtil.throwNotStringType(name, errorInfos);
  }
}

function checkForExpression(attributes, name, errorInfos) {
  if (attributes[name] && !astUtil.isExpressionContainer(attributes[name])) {
    errorUtil.throwNotExpressionType(name, errorInfos);
  }
}

function buildCondition(types, condition, expressions, tagStart = '<#each {{ ') {
  let ret = [],
    tagEnd = '}}> #';

  if (types.isTemplateLiteral(condition)) {
    let hasExp = false;
    condition.quasis.forEach((q, i) => {
      if (i == 0) {
        tagStart += q.value.cooked;
      }
      else if (i == condition.quasis.length - 1) {
        tagEnd = q.value.cooked + tagEnd;
      }
      else {
        ret.push(q.value.cooked);
      }

      if (i < condition.quasis.length - 1) {
        hasExp = true;
        expressions.push(condition.expressions[i]);
      }
    });

    if (hasExp) {
      ret = [tagStart, ...ret, tagEnd];
    }
    else {
      ret = [tagStart + tagEnd];
    }
  }
  else {
    ret = [tagStart, tagEnd];
    expressions.push(condition);
  }

  return ret;
}

module.exports = function (babel) {
  var types = babel.types;

  return function (node, file) {
    var mapParams = [];
    var errorInfos = { node: node, file: file, element: ELEMENTS.EACH };
    var attributes = astUtil.getAttributeMap(node);
    var children = astUtil.getChildren(types, node);
    var returnExpression = astUtil.getSanitizedExpressionForContent(types, children);

    // required attribute
    if (!attributes[ATTRIBUTES.OF]) {
      errorUtil.throwNoAttribute(ATTRIBUTES.OF, errorInfos);
    }
    // check for correct data types, as far as possible
    checkForExpression(attributes, ATTRIBUTES.OF, errorInfos);
    checkForString(attributes, ATTRIBUTES.ITEM, errorInfos);
    checkForString(attributes, ATTRIBUTES.INDEX, errorInfos);

    // simply return without any child nodes
    if (!children.length) {
      return returnExpression;
    }

    addMapParam(types, mapParams, attributes, ATTRIBUTES.ITEM);
    addMapParam(types, mapParams, attributes, ATTRIBUTES.INDEX);

    const quasis = [];
    const expressions = [];
    const tags = buildCondition(types, attributes[ATTRIBUTES.OF].value.expression, expressions);
    tags.forEach(tag => quasis.push(types.TemplateElement({
      raw: tag,
      cooked: tag
    })));

    expressions.push(types.ArrowFunctionExpression(
      [types.objectPattern(mapParams, [])],
      types.blockStatement([types.returnStatement(returnExpression)])
    ));

    quasis.push(types.TemplateElement({
      raw: ' </#each>',
      cooked: ' </#each>'
    }));

    return types.CallExpression(
      types.TaggedTemplateExpression(
        types.Identifier('nj'),
        types.TemplateLiteral(quasis, expressions)
      )
      , []);
  };
};
