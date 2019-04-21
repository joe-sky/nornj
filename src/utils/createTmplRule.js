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

function _replace$(str) {
  return str.replace(/\$/g, '\\$');
}

function _replaceMinus(str) {
  return str.replace(/\-/g, '\\-');
}

export default function createTmplRule(rules = {}, isGlobal) {
  let {
    startRule = '{{',
    endRule = '}}',
    extensionRule = '#',
    propRule = '@',
    strPropRule = '@',
    templateRule = 'template',
    tagSpRule = '#$@',
    commentRule = '#'
  } = nj.tmplRule;

  let {
    start,
    end,
    extension,
    prop,
    strProp,
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
  if (extension) {
    extensionRule = extension;
  }
  if (prop) {
    propRule = prop;
  }
  if (strProp) {
    strPropRule = strProp;
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

  const firstChar = startRule[0],
    lastChar = endRule[endRule.length - 1],
    allRules = firstChar + lastChar,
    extensionRules = _replaceMinus(_clearRepeat(extensionRule + propRule + strPropRule + tagSpRule)),
    escapeExtensionRule = _replace$(extensionRule),
    escapePropRule = _replace$(propRule),
    escapeStrPropRule = _replace$(strPropRule),
    startRuleR = firstChar + startRule,
    endRuleR = endRule + lastChar,
    varContent = '[\\s\\S]+?',
    varContentS = '\\.\\.\\.' + varContent,
    braceParamStr = startRuleR + varContent + endRuleR + '|' + startRule + varContent + endRule;

  const tmplRules = {
    startRule,
    endRule,
    extensionRule,
    propRule,
    strPropRule,
    templateRule,
    tagSpRule,
    commentRule,
    firstChar,
    lastChar,
    braceParamStr,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + extensionRules + '][^\\s>]*)[^>]*>$', 'i'),
    openTagParams: _createRegExp('[\\s]+(((' + startRuleR + '(' + varContent + ')' + endRuleR + ')|(' + startRule + '(' + varContent + ')' + endRule + '))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
    directives: _createRegExp('[\\s]+(((' + startRuleR + '(' + varContent + ')' + endRuleR + ')|(' + startRule + '(' + varContent + ')' + endRule + '))|((:?)(' + escapeExtensionRule + '|n-)?([^\\s=>]+)))(=((\'[^\']+\')|("[^"]+")|([^"\'\\s>]+)))?', 'g'),
    braceParam: _createRegExp(braceParamStr, 'i'),
    braceParamG: _createRegExp(braceParamStr, 'ig'),
    spreadProp: _createRegExp('[\\s]+(' + startRuleR + '[\\s]*(' + varContentS + ')' + endRuleR + ')|(' + startRule + '[\\s]*(' + varContentS + ')' + endRule + ')', 'g'),
    replaceSplit: _createRegExp(braceParamStr),
    replaceParam: _createRegExp('((' + startRuleR + ')(' + varContent + ')' + endRuleR + ')|((' + startRule + ')(' + varContent + ')' + endRule + ')', 'g'),
    checkElem: _createRegExp('([^<>]+)|(<([a-z/!' + firstChar + extensionRules + '][^\\s<>]*)([^<>]*)>|<)([^<]*)', 'ig'),
    extension: _createRegExp('^' + escapeExtensionRule + '([^\\s]+)', 'i'),
    exAll: _createRegExp('^([/]?)(' + escapeExtensionRule + '|' + escapeStrPropRule + escapePropRule + '|' + escapePropRule + ')([^\\s]+)', 'i'),
    include: _createRegExp('<' + escapeExtensionRule + 'include([^>]*)>', 'ig'),
    incompleteStart: _createRegExp(startRule + '((?!' + endRule + ')[\\s\\S])*$'),
    incompleteStartR: _createRegExp(startRuleR + '((?!' + endRuleR + ')[\\s\\S])*$'),
    incompleteEnd: _createRegExp('^[\\s\\S]*?' + endRule),
    incompleteEndR: _createRegExp('^[\\s\\S]*?' + endRuleR)
  };

  if (isGlobal) { //Reset the regexs to global list
    tools.assign(nj.tmplRule, tmplRules);
  } else {
    return tmplRules;
  }
};

//Set global template rules
createTmplRule({}, true);