import nj from '../core';
import * as tools from './tools';

function _createRegExp(reg, mode) {
  return new RegExp(reg, mode);
}

//Clear the repeated characters
function _clearRepeat(str) {
  let ret = '',
    i = 0,
    l = str.length,
    char;

  for (; i < l; i++) {
    char = str[i];
    if (ret.indexOf(char) < 0) {
      ret += char;
    }
  }

  return ret;
}

export default function setTmplRule(rules = {}) {
  let {
    startRule = '{{',
    endRule = '}}',
    exprRule = '#',
    propRule = '@',
    templateRule = 'template',
    tagSpRule = '#$@',
    commentRule = '#'
  } = nj.tmplRule;

  let {
    start,
    end,
    expr,
    prop,
    template,
    tagSp,
    comment
  } = rules;

  if (start) {
    startRule = start;
  }
  if (end) {
    endRule = end;
  }
  if (expr) {
    exprRule = expr;
  }
  if (prop) {
    propRule = prop;
  }
  if (template) {
    templateRule = template;
  }
  if (tagSp) {
    tagSpRule = tagSp;
  }
  if (comment != null) {
    commentRule = comment;
  }

  const allRules = _clearRepeat(startRule + endRule),
    firstChar = startRule[0],
    lastChar = endRule[endRule.length - 1],
    exprRules = _clearRepeat(exprRule + propRule + tagSpRule),
    escapeExprRule = exprRule.replace(/\$/g, '\\$');

  //Reset the regexs to global list
  tools.assign(nj.tmplRule, {
    startRule,
    endRule,
    exprRule,
    propRule,
    templateRule,
    tagSpRule,
    commentRule,
    firstChar,
    lastChar,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + exprRules + '][^\\s>]*)[^>]*>$', 'i'),
    openTagParams: _createRegExp('[\\s]+((([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
    insideBraceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'i'),
    spreadProp: _createRegExp('[\\s]+([' + firstChar + ']?' + startRule + ')[\\s]*(\\.\\.\\.[^' + allRules + ']+)(' + endRule + '[' + lastChar + ']?)', 'g'),
    replaceSplit: _createRegExp('(?:[' + firstChar + ']?' + startRule + ')[^' + allRules + ']+(?:' + endRule + '[' + lastChar + ']?)'),
    replaceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')([^' + allRules + ']+)' + endRule + '[' + lastChar + ']?', 'g'),
    checkElem: _createRegExp('([^<>]+)|(<([a-z/!' + firstChar + exprRules + '][^\\s>]*)([^>]*)>)([^<]*)', 'ig'),
    expr: _createRegExp('^' + escapeExprRule + '([^\\s]+)', 'i'),
    include: _createRegExp('<' + escapeExprRule + 'include([^>]*)>', 'ig'),
    newlineSplit: _createRegExp('\\n(?![^' + firstChar + lastChar + ']*' + lastChar + ')', 'g'),
  });
};

//Set default template rules
setTmplRule();