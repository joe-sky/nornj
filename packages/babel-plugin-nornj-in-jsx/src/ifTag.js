const nj = require('nornj').default;
const njUtils = require('nornj/tools/utils');
const precompile = require('./util/precompile');
const astUtil = require('./util/ast');
const conditionalUtil = require('./util/conditional');

const ELEMENTS = {
  IF: 'if',
  ELSE: 'else',
  ELSEIF: 'elseif'
};

function getBlocks(nodes, types, errorInfos) {
  var result = {
    ifBlock: [],
    elseBlock: [],
    elseifBlock: []
  };

  let ifFinished = false;
  nodes.forEach(function (node) {
    if (astUtil.isTag(node, ELEMENTS.ELSE)) {
      ifFinished = true;
      result.elseBlock = astUtil.getChildren(types, node);
    }
    else if (astUtil.isTag(node, ELEMENTS.ELSEIF)) {
      ifFinished = true;
      result.elseifBlock.push({
        condition: conditionalUtil.getConditionExpression(node, errorInfos),
        block: astUtil.getChildren(types, node)
      });
    }
    else if (!ifFinished) {
      result.ifBlock.push(node);
    }
  });

  return result;
}

function buildCondition(types, condition, expressions, tagStart = '<#if ') {
  let ret = [],
    tagEnd = '>';

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
    var ifBlock;
    var elseBlock;
    var elseifBlock;
    var errorInfos = { node: node, file: file, element: ELEMENTS.IF };
    var condition = conditionalUtil.getConditionExpression(node, errorInfos);
    var key = astUtil.getKey(node);
    var children = astUtil.getChildren(types, node);
    var blocks = getBlocks(children, babel.types, errorInfos);
    const subBlocksLength = blocks.elseifBlock.length + blocks.elseBlock.length;

    ifBlock = astUtil.getSanitizedExpressionForContent(types, blocks.ifBlock, key);
    elseBlock = astUtil.getSanitizedExpressionForContent(types, blocks.elseBlock, key);
    elseifBlock = blocks.elseifBlock.map(b => astUtil.getSanitizedExpressionForContent(types, b.block, key));

    const quasis = [];
    const expressions = [];
    const tags = buildCondition(types, condition, expressions);
    tags.forEach(tag => quasis.push(types.TemplateElement({
      raw: tag,
      cooked: tag
    })));

    expressions.push(ifBlock);

    if (blocks.elseifBlock.length) {
      blocks.elseifBlock.forEach((block, i) => {
        if (i == 0) {
          const tags = buildCondition(types, block.condition, expressions, '<#elseif ');
          tags.forEach(tag => quasis.push(types.TemplateElement({
            raw: tag,
            cooked: tag
          })));

          if (blocks.elseifBlock.length == 1) {
            const endTag = (i == subBlocksLength - 1)
              ? '</#elseif></#if>'
              : (blocks.elseBlock.length ? '</#elseif><#else>' : '</#elseif>');
            quasis.push(
              types.TemplateElement({
                raw: endTag,
                cooked: endTag
              })
            );
          }
        }
        else {
          const tags = buildCondition(types, block.condition, expressions, '</#elseif><#elseif ');
          tags.forEach(tag => quasis.push(types.TemplateElement({
            raw: tag,
            cooked: tag
          })));

          if (i == blocks.elseifBlock.length - 1) {
            const endTag = (i == subBlocksLength - 1)
              ? '</#elseif></#if>'
              : (blocks.elseBlock.length ? '</#elseif><#else>' : '</#elseif>');
            quasis.push(
              types.TemplateElement({
                raw: endTag,
                cooked: endTag
              })
            );
          }
        }

        expressions.push(elseifBlock[i]);
      });
    }

    if (blocks.elseBlock.length) {
      if (blocks.elseifBlock.length == 0) {
        quasis.push(
          types.TemplateElement({
            raw: '<#else>',
            cooked: '<#else>'
          })
        );
      }
      quasis.push(
        types.TemplateElement({
          raw: '</#else></#if>',
          cooked: '</#else></#if>'
        })
      );
    }

    if (subBlocksLength == 0) {
      quasis.push(types.TemplateElement({
        raw: '</#if>',
        cooked: '</#if>'
      }));
    }

    if (blocks.elseBlock.length) {
      expressions.push(elseBlock);
    }

    let tmplStr = '',
      paramCount = 0;
    quasis.forEach((q, i) => {
      tmplStr += q.value.cooked;
      if (i < quasis.length - 1) {
        tmplStr += '{{_nj_param' + paramCount + '}}';
        paramCount++;
      }
    });

    const tmplKey = njUtils.uniqueKey(tmplStr);
    const tmplObj = precompile.buildTmplFns(nj.precompile(tmplStr, true, nj.createTmplRule({
      start: '{',
      end: '}',
      comment: ''
    })), tmplKey);
    const tmplParams = expressions.map((e, i) => types.objectProperty(types.identifier('_nj_param' + i), e));

    return types.CallExpression(
      types.memberExpression(types.identifier('nj'), types.identifier('renderH'))
      , [
        types.identifier(tmplObj),
        types.objectExpression(tmplParams)
      ]);
  };
};
