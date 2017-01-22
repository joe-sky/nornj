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
    char = str[i];
    if (ret.indexOf(char) < 0) {
      ret += char;
    }
  }

  return ret;
}

module.exports = function (startRule, endRule, exprRule, propRule, templateRule) {
  if(tools.isObject(startRule)){
    var params = startRule;
    startRule = params.start;
    endRule = params.end;
    exprRule = params.expr;
    propRule = params.prop;
    templateRule = params.template;
  }
  if (!startRule) {
    startRule = '{';
  }
  if (!endRule) {
    endRule = '}';
  }
  if (!exprRule) {
    exprRule = '#';
  }
  if (!propRule) {
    propRule = '@';
  }
  if (!templateRule) {
    templateRule = 'template';
  }

  var allRules = _clearRepeat(startRule + endRule),
    firstChar = startRule[0],
    otherChars = allRules.substr(1),
    spChars = '#$@',
    exprRules = _clearRepeat(exprRule + spChars),
    escapeExprRule = exprRule.replace(/\$/g, '\\$');

  //Reset the regexs to global list
  tools.assign(nj.tmplRule, {
    startRule,
    endRule,
    exprRule,
    propRule,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + exprRules + '][-a-z0-9_|./' + otherChars + ']*)[^>]*>$', 'i'),
    openTagParams: _createRegExp('[\\s]+(((' + startRule + '){1,2}([^' + allRules + ']+)(' + endRule + '){1,2})|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
    insideBraceParam: _createRegExp('(' + startRule + '){1,2}([^' + allRules + ']+)(' + endRule + '){1,2}', 'i'),
    spreadProp: _createRegExp('[\\s]+(' + startRule + '){1,2}[\\s]*(\\.\\.\\.[^' + allRules + ']+)(' + endRule + '){1,2}', 'g'),
    replaceSplit: _createRegExp('(?:' + startRule + '){1,2}[^' + allRules + ']+(?:' + endRule + '){1,2}'),
    replaceParam: function() {
      return _createRegExp('((' + startRule + '){1,2})([^' + allRules + ']+)(' + endRule + '){1,2}', 'g');
    },
    checkElem: function() {
      return _createRegExp('([^>]*)(<([a-z' + firstChar + '/' + exprRules + '!][-a-z0-9_|.' + allRules + exprRules + ']*)([^>]*)>)([^<]*)', 'ig');
    },
    expr: _createRegExp('^' + escapeExprRule + '([^\\s]+)', 'i'),
    include: function() {
      return _createRegExp('<' + escapeExprRule + 'include([^>]*)>', 'ig');
    },
    template: templateRule
  });
};