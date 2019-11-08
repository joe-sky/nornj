import nj from '../core';
import * as tools from './tools';

function _createRegExp(reg, mode?) {
  return new RegExp(reg, mode);
}

//Clear the repeated characters
function _clearRepeat(str) {
  let ret = '',
    i = 0,
    char;
  const l = str.length;

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
  return str.replace(/-/g, '\\-');
}

function _replaceMulti(str) {
  return str.replace(/\*/g, '\\*');
}

export function createTmplRule(rules: any = {}, isGlobal?) {
  let {
    startRule = '{{',
    endRule = '}}',
    extensionRule = 'n-',
    propRule = 'p-',
    strPropRule = 's',
    templateRule = 'template',
    tagSpRule = '#$@',
    commentRule = '-'
  } = nj.tmplRule;

  const { start, end, extension, prop, strProp, template, tagSp, comment, rawStart, rawEnd } = rules;

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

  const firstChar = rawStart != null ? rawStart : startRule[0],
    lastChar = rawEnd != null ? rawEnd : endRule[endRule.length - 1],
    allRules = firstChar + lastChar,
    extensionRules = _replaceMinus(_clearRepeat(extensionRule + propRule + strPropRule + tagSpRule)),
    escapeExtensionRule = _replace$(extensionRule),
    escapePropRule = _replace$(propRule),
    escapeStrPropRule = _replace$(strPropRule),
    startRuleR = firstChar + startRule,
    endRuleR = endRule + lastChar,
    varContent = '[\\s\\S]+?',
    varContentS = '\\.\\.\\.' + varContent,
    braceParamStr = _replaceMulti(startRuleR + varContent + endRuleR + '|' + startRule + varContent + endRule),
    escapeStartRule = _replaceMulti(startRule),
    escapeEndRule = _replaceMulti(endRule),
    escapeStartRuleR = _replaceMulti(startRuleR),
    escapeEndRuleR = _replaceMulti(endRuleR);

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
    openTagParams: _createRegExp(
      '[\\s]+(((' +
        escapeStartRuleR +
        '(' +
        varContent +
        ')' +
        escapeEndRuleR +
        ')|(' +
        escapeStartRule +
        '(' +
        varContent +
        ')' +
        escapeEndRule +
        '))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?',
      'g'
    ),
    directives: _createRegExp(
      '[\\s]+(((' +
        escapeStartRuleR +
        '(' +
        varContent +
        ')' +
        escapeEndRuleR +
        ')|(' +
        escapeStartRule +
        '(' +
        varContent +
        ')' +
        escapeEndRule +
        '))|((:?)(' +
        escapeExtensionRule +
        ')?([^\\s=>]+)))(=((\'[^\']+\')|("[^"]+")|([^"\'\\s>]+)))?',
      'g'
    ),
    braceParam: _createRegExp(braceParamStr, 'i'),
    braceParamG: _createRegExp(braceParamStr, 'ig'),
    spreadProp: _createRegExp(
      '[\\s]+(' +
        escapeStartRuleR +
        '[\\s]*(' +
        varContentS +
        ')' +
        escapeEndRuleR +
        ')|(' +
        escapeStartRule +
        '[\\s]*(' +
        varContentS +
        ')' +
        escapeEndRule +
        ')',
      'g'
    ),
    replaceSplit: _createRegExp(braceParamStr),
    replaceParam: _createRegExp(
      '((' +
        escapeStartRuleR +
        ')(' +
        varContent +
        ')' +
        escapeEndRuleR +
        ')|((' +
        escapeStartRule +
        ')(' +
        varContent +
        ')' +
        escapeEndRule +
        ')',
      'g'
    ),
    checkElem: _createRegExp(
      '([^<>]+)|(<([a-z/!' + firstChar + extensionRules + '][^\\s<>]*)([^<>]*)>|<)([^<]*)',
      'ig'
    ),
    extension: _createRegExp('^' + escapeExtensionRule + '([^\\s]+)', 'i'),
    exAll: _createRegExp(
      '^([/]?)(' + escapeExtensionRule + '|' + escapeStrPropRule + escapePropRule + '|' + escapePropRule + ')([^\\s]+)',
      'i'
    ),
    include: _createRegExp('<' + escapeExtensionRule + 'include([^>]*)>', 'ig'),
    incompleteStart: _createRegExp(startRule + '((?!' + escapeEndRule + ')[\\s\\S])*$'),
    incompleteStartR: _createRegExp(escapeStartRuleR + '((?!' + escapeEndRuleR + ')[\\s\\S])*$'),
    incompleteEnd: _createRegExp('^[\\s\\S]*?' + escapeEndRule),
    incompleteEndR: _createRegExp('^[\\s\\S]*?' + escapeEndRuleR)
  };

  if (isGlobal) {
    //Reset the regexs to global list
    tools.assign(nj.tmplRule, tmplRules);
  } else {
    return tmplRules;
  }
}

//Set global template rules
createTmplRule({}, true);

tools.assign(nj, {
  createTmplRule
});
