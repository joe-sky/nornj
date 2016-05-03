'use strict';

var nj = require('../core'),
  tools = require('./tools');

function _createRegExp(reg, mode) {
  return new RegExp(reg, mode);
}

//Clear the repeated characters
function _clearRepeat(str) {
  var ret = '',
    i = 0,
    l = str.length,
    char;

  for (; i < l; i++) {
    char = str.charAt(i);
    if (ret.indexOf(char) < 0) {
      ret += char;
    }
  }

  return ret;
}

module.exports = function (beginRule, endRule, exprRule) {
  if (!beginRule) {
    beginRule = '{';
  }
  if (!endRule) {
    endRule = '}';
  }
  if (!exprRule) {
    exprRule = '$';
  }

  var allRules = _clearRepeat(beginRule + endRule),
    firstChar = beginRule.charAt(0),
    otherChars = allRules.substr(1),
    exprRules = _clearRepeat(exprRule),
    escapeExprRule = exprRule.replace(/\$/g, '\\$');

  //Reset the regexs to global list
  tools.assign(nj.tmplRule, {
    beginRule: beginRule,
    endRule: endRule,
    exprRule: exprRule,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + '][-a-z0-9_:.\/' + otherChars + ']*)[^>]*>$', 'i'),
    openTag: _createRegExp('^[a-z' + firstChar + '][-a-z0-9_:.\/' + otherChars + ']*', 'i'),
    insideBraceParam: _createRegExp(beginRule + '([^' + allRules + ']+)' + endRule, 'i'),
    replaceSplit: _createRegExp('(?:' + beginRule + '){1,2}[^' + allRules + ']+(?:' + endRule + '){1,2}'),
    replaceParam: function() {
      return _createRegExp('((' + beginRule + '){1,2})([^' + allRules + ']+)(' + endRule + '){1,2}', 'g');
    },
    checkElem: function() {
      return _createRegExp('([^>]*)(<([a-z' + firstChar + '\/' + exprRules + '][-a-z0-9_:.' + allRules + exprRules + ']*)[^>]*>)([^<]*)', 'ig');
    },
    expr: _createRegExp('^' + escapeExprRule + '([^\\s]+)', 'i')
  });
};