const nj = require('nornj').default;
const njUtils = require('nornj/tools/utils');

function buildCondition(types, condition, expressions, tagStart = '<#if {{', hasMustache) {
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
        !hasMustache && (condition.expressions[i].noMustache = true);
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
    !hasMustache && (condition.noMustache = true);
    expressions.push(condition);
  }

  return ret;
}

function _mustachePrefix(expr) {
  if (expr.isAccessor) {
    return '#';
  }
  else if (expr.isSpread) {
    return '...';
  }
  else {
    return '';
  }
}

function getElName(types, expr) {
  if (types.isJSXMemberExpression(expr)) {
    return types.memberExpression(getElName(types, expr.object), getElName(types, expr.property));
  }
  else {
    return types.identifier(expr.name);
  }
}

function getExAttrExpression(types, expr) {
  if (types.isBinaryExpression(expr)) {
    return [...getExAttrExpression(types, expr.left), ...getExAttrExpression(types, expr.right)];
  }
  else {
    return [expr.loc ? expr : expr.value];
  }
}

function createRenderTmpl(babel, quasis, expressions, opts, taggedTmplConfig) {
  const types = babel.types;
  _setTmplConfig(opts);

  let tmplStr = '';
  if (!taggedTmplConfig) {
    let paramCount = 0;
    quasis.forEach((q, i) => {
      tmplStr += q.value.cooked;
      if (i < quasis.length - 1) {
        const expr = expressions[i];
        tmplStr += (expr.noMustache ? '' : '{{')
          + _mustachePrefix(expr) + '_njParam' + paramCount
          + (expr.noMustache ? '' : '}}');
        paramCount++;
      }
    });
  }
  else {
    tmplStr = Object.assign({ quasis: quasis.map(q => q.value.cooked) }, taggedTmplConfig);
  }

  const tmplObj = _buildTmplFns(nj.precompile(
    tmplStr,
    opts.outputH != null ? opts.outputH : true,
    nj.createTmplRule(opts.delimiters != null ? opts.delimiters : {
      start: '{',
      end: '}',
      comment: ''
    })),
    njUtils.uniqueKey(tmplStr));

  const tmplParams = expressions.map((e, i) => types.objectProperty(types.identifier('_njParam' + i), e));
  if (tmplParams.length) {
    tmplParams.push(types.objectProperty(types.identifier('_njParam'), types.booleanLiteral(true)));
  }

  const renderFnParams = [types.identifier(tmplObj)];
  if (tmplParams.length) {
    renderFnParams.push(types.objectExpression(tmplParams));
  }
  renderFnParams.push(types.thisExpression());

  return types.CallExpression(
    types.memberExpression(
      types.identifier('nj'),
      types.identifier('renderH')
    ), renderFnParams
  );
}

function _buildTmplFns(fns, tmplKey) {
  let ret = '{\n';
  ret += '  _njTmplKey: ' + tmplKey + ',\n';

  nj.each(fns, (v, k, i, l) => {
    if (k.indexOf('_') != 0) {
      ret += '  ' + k + ': ' + v.toString() + (i < l - 1 ? ',' : '') + '\n';
    }
  });

  return ret + '}';
}

function _setTmplConfig(opts) {
  if (opts.extensionConfig) {
    let extensionConfig = {},
      extensionConfigs = opts.extensionConfig;
    if (!Array.isArray(extensionConfigs)) {
      extensionConfigs = [extensionConfigs];
    }

    nj.each(extensionConfigs, exConfig => {
      nj.each(exConfig, (v, k) => {
        extensionConfig[k] = {
          options: v
        };
      });
    });
    nj.registerExtension(extensionConfig);
  }
  if (opts.filterConfig) {
    let filterConfig = {},
      filterConfigs = opts.filterConfig;
    if (!Array.isArray(filterConfigs)) {
      filterConfigs = [filterConfigs];
    }

    nj.each(filterConfigs, fConfig => {
      nj.each(fConfig, (v, k) => {
        filterConfig[k] = {
          options: v
        };
      });
    });
    nj.registerFilter(filterConfig);
  }
}

module.exports = {
  buildCondition,
  getElName,
  getExAttrExpression,
  createRenderTmpl
};