var astUtil = require('./util/ast');
var conditionalUtil = require('./util/conditional');
var errorUtil = require('./util/error');

var ELEMENTS = {
  SWITCH: 'switch',
  CASE: 'case',
  DEFAULT: 'default'
};

function getBlocks(nodes, types, errorInfos) {
  var result = {
    caseBlock: [],
    defaultBlock: []
  };

  nodes.forEach(function (node, i) {
    errorInfos.node = node;
    if (astUtil.isTag(node, ELEMENTS.DEFAULT)) {
      errorInfos.element = ELEMENTS.DEFAULT;
      if(result.defaultBlock.length){
        errorUtil.throwSwitchWithMultipleDefault(errorInfos);
      }
      if(i < nodes.length-1){
        errorUtil.throwSwitchDefaultNotLast(errorInfos);
      }
      result.defaultBlock = astUtil.getChildren(types, node);
    }
    else if (astUtil.isTag(node, ELEMENTS.CASE)) {
      errorInfos.element = ELEMENTS.CASE;
      result.caseBlock.push({
        condition: conditionalUtil.getConditionExpression(node, errorInfos, 'value'),
        block: astUtil.getChildren(types, node)
      });
    }
    else {
      errorInfos.element = ELEMENTS.SWITCH;
      errorUtil.throwSwitchWithWrongChildren(errorInfos);
    }
  });

  return result;
}

function buildCondition(types, condition, expressions, tagStart = '<#switch {{') {
  let ret = [],
    tagEnd = '}}>';

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

module.exports = function switchStatement(babel) {
  var types = babel.types;

  return function (node, file) {
    var caseBlock;
    var defaultBlock;
    var errorInfos = { node: node, file: file, element: ELEMENTS.SWITCH };
    var condition = conditionalUtil.getConditionExpression(node, errorInfos, 'value');
    var key = astUtil.getKey(node);
    var children = astUtil.getChildren(types, node);
    var blocks = getBlocks(children, babel.types, errorInfos);
    const subBlocksLength = blocks.caseBlock.length + blocks.defaultBlock.length;

    if(!blocks.caseBlock.length){
      errorInfos.node = node;
      errorUtil.throwSwitchWithoutCase(errorInfos);
    }

    defaultBlock = astUtil.getSanitizedExpressionForContent(types, blocks.defaultBlock, key);
    caseBlock = blocks.caseBlock.map(b => astUtil.getSanitizedExpressionForContent(types, b.block, key));

    const quasis = [];
    const expressions = [];
    const tags = buildCondition(types, condition, expressions);

    quasis.push(
      types.TemplateElement({
        raw: '<#switch {{',
        cooked: '<#switch {{'
      })
    );

    if (blocks.caseBlock.length) {
      blocks.caseBlock.forEach((block, i) => {
        if (i == 0) {
          const tags = buildCondition(types, block.condition, expressions, '}}><#case {{');
          tags.forEach(tag => quasis.push(types.TemplateElement({
            raw: tag,
            cooked: tag
          })));

          if (blocks.caseBlock.length == 1) {
            const endTag = (i == subBlocksLength - 1)
              ? '</#case></#switch>'
              : (blocks.defaultBlock.length ? '</#case><#default>' : '</#case>');
            quasis.push(
              types.TemplateElement({
                raw: endTag,
                cooked: endTag
              })
            );
          }
        }
        else {
          const tags = buildCondition(types, block.condition, expressions, '</#case><#case {{');
          tags.forEach(tag => quasis.push(types.TemplateElement({
            raw: tag,
            cooked: tag
          })));

          if (i == blocks.caseBlock.length - 1) {
            const endTag = (i == subBlocksLength - 1)
              ? '</#case></#switch>'
              : (blocks.defaultBlock.length ? '</#case><#default>' : '</#case>');
            quasis.push(
              types.TemplateElement({
                raw: endTag,
                cooked: endTag
              })
            );
          }
        }

        expressions.push(caseBlock[i]);
      });
    }

    if (blocks.defaultBlock.length) {
      if (blocks.caseBlock.length == 0) {
        quasis.push(
          types.TemplateElement({
            raw: '}}><#default>',
            cooked: '}}><#default>'
          })
        );
      }
      quasis.push(
        types.TemplateElement({
          raw: '</#default></#switch>',
          cooked: '</#default></#switch>'
        })
      );
    }

    if (subBlocksLength == 0) {
      quasis.push(types.TemplateElement({
        raw: '</#switch>',
        cooked: '</#switch>'
      }));
    }

    if (blocks.defaultBlock.length) {
      expressions.push(defaultBlock);
    }
    
    return types.CallExpression(
      types.TaggedTemplateExpression(
        types.Identifier('nj'),
        types.TemplateLiteral(quasis, expressions)
      )
      , []);
  };
};
