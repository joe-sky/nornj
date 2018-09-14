const astUtil = require('./util/ast');
const errorUtil = require('./util/error');
const generate = require('./util/generate');

const ELEMENTS = {
  EACH: 'each'
};
const ATTRIBUTES = {
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

module.exports = function (babel) {
  var types = babel.types;

  return function (node, file, state) {
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
    const tags = generate.buildCondition(types, attributes[ATTRIBUTES.OF].value.expression, expressions, '<#each {{');
    tags.forEach(tag => quasis.push(types.TemplateElement({
      raw: tag,
      cooked: tag
    })));

    const expr = types.ArrowFunctionExpression(
      [types.objectPattern(mapParams)],
      types.blockStatement([types.returnStatement(returnExpression)])
    );
    expr.isAccessor = true;
    expressions.push(expr);

    quasis.push(types.TemplateElement({
      raw: ' </#each>',
      cooked: ' </#each>'
    }));

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts);
  };
};