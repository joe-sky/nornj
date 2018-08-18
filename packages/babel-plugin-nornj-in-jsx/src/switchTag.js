const astUtil = require('./util/ast');
const conditionalUtil = require('./util/conditional');
const errorUtil = require('./util/error');
const generate = require('./util/generate');

const ELEMENTS = {
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
      if (result.defaultBlock.length) {
        errorUtil.throwSwitchWithMultipleDefault(errorInfos);
      }
      if (i < nodes.length - 1) {
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

module.exports = function (babel) {
  var types = babel.types;

  return function (node, file, state) {
    var caseBlock;
    var defaultBlock;
    var errorInfos = { node: node, file: file, element: ELEMENTS.SWITCH };
    var condition = conditionalUtil.getConditionExpression(node, errorInfos, 'value');
    var key = astUtil.getKey(node);
    var children = astUtil.getChildren(types, node);
    var blocks = getBlocks(children, babel.types, errorInfos);
    const subBlocksLength = blocks.caseBlock.length + blocks.defaultBlock.length;

    if (!blocks.caseBlock.length) {
      errorInfos.node = node;
      errorUtil.throwSwitchWithoutCase(errorInfos);
    }

    defaultBlock = astUtil.getSanitizedExpressionForContent(types, blocks.defaultBlock, key);
    caseBlock = blocks.caseBlock.map(b => astUtil.getSanitizedExpressionForContent(types, b.block, key));

    const quasis = [];
    const expressions = [];
    const tags = generate.buildCondition(types, condition, expressions, '<#switch {{', true);

    quasis.push(
      types.TemplateElement({
        raw: '<#switch ',
        cooked: '<#switch '
      })
    );

    if (blocks.caseBlock.length) {
      blocks.caseBlock.forEach((block, i) => {
        if (i == 0) {
          const tags = generate.buildCondition(types, block.condition, expressions, '><#case {{');
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
          const tags = generate.buildCondition(types, block.condition, expressions, '</#case><#case {{');
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
            raw: '><#default>',
            cooked: '><#default>'
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

    return generate.createRenderTmpl(babel, quasis, expressions, state.opts);
  };
};