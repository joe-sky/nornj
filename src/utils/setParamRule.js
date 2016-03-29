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

module.exports = function (openRule, closeRule) {
  if (!openRule) {
    openRule = '{';
  }
  if (!closeRule) {
    closeRule = '}';
  }

  var allRules = _clearRepeat(openRule + closeRule),
    firstChar = openRule.charAt(0),
    otherChars = allRules.substr(1);

  //Reset the regexs to global list
  tools.assign(nj.paramRule, {
    openRule: openRule,
    closeRule: closeRule,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + '][-a-z0-9_:.' + otherChars + ']*)[^>]*>$', 'i'),
    openTag: _createRegExp('^[a-z' + firstChar + '][-a-z0-9_:.' + otherChars + ']*', 'i'),
    insideBraceParam: _createRegExp(openRule + '([^\"\'' + allRules + ']+)' + closeRule, 'i'),
    replaceSplit: _createRegExp('(?:' + openRule + '){1,2}[^\"\'' + allRules + ']+(?:' + closeRule + '){1,2}'),
    replaceParam: function() {
      return _createRegExp('((' + openRule + '){1,2})([^\"\'' + allRules + ']+)(' + closeRule + '){1,2}', 'g');
    },
    checkElem: function() {
      return _createRegExp('([^>]*)(<([a-z' + firstChar + '\/$][-a-z0-9_:.' + allRules + '$]*)[^>]*>)([^<]*)', 'ig');
    }
  });
};