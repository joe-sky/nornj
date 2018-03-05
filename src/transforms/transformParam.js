import nj from '../core';
import * as tools from '../utils/tools';
import '../helpers/filter';

//Get compiled property
const REGEX_JS_PROP = /('[^']*')|("[^"]*")|(-?[0-9][0-9]*(\.\d+)?)|true|false|null|undefined|Object|Array|Math|Date|JSON|(([a-zA-Z_$#@])([a-zA-Z_$@\d]*))/;
const REGEX_REPLACE_CHAR = /_njQs(\d+)_/g;
const REGEX_HAS_BRACKET = /bracket_\d+/;

function _replaceStr(prop, innerQuotes) {
  return prop.replace(REGEX_REPLACE_CHAR, (all, g1) => innerQuotes[g1]);
}

function _syntaxError(errorStr, expression, source) {
  return 'Filter or expression syntax error: ' + errorStr + ' in\n\nexpression: ' + expression + '\n\nsource: ' + source + '\n\nNornJ expression syntax specification please see the document: https://joe-sky.github.io/nornj-guide/templateSyntax/filter.html\n';
}

function _compiledProp(prop, innerBrackets, innerQuotes, source) {
  let ret = tools.obj();
  const propO = prop;

  //If there are vertical lines in the property,then use filter
  if (prop.indexOf('|') >= 0) {
    let filters = [],
      filtersTmp;
    filtersTmp = prop.split('|');
    prop = filtersTmp[0].trim(); //Extract property

    filtersTmp = filtersTmp.slice(1);
    tools.each(filtersTmp, (filter) => {
      filter = filter.trim();
      if (filter === '') {
        return;
      }

      let retF = _getFilterParam(filter),
        filterObj = tools.obj(),
        filterName = retF[0].trim(); //Get filter name

      if (filterName) {
        const paramsF = retF[1]; //Get filter param

        //Multiple params are separated by commas.
        if (paramsF != null) {
          tools.throwIf(innerBrackets[paramsF] != null, _syntaxError(_replaceStr(paramsF, innerQuotes), _replaceStr(propO, innerQuotes), source));

          let params = [];
          tools.each(innerBrackets[paramsF].split(','), p => {
            if (p !== '') {
              params[params.length] = _compiledProp(p.trim(), innerBrackets, innerQuotes, source);
            }
          }, false, true);

          filterObj.params = params;
        }

        filterObj.name = filterName;
        filters.push(filterObj);
      }
    }, false, true);

    ret.filters = filters;
  }

  //替换字符串值
  prop = _replaceStr(prop, innerQuotes);

  //Extract the parent data path
  if (prop.indexOf('../') === 0) {
    let n = 0;
    prop = prop.replace(/\.\.\//g, function() {
      n++;
      return '';
    });

    ret.parentNum = n;
  }

  //Extract the js property
  if (prop !== '') {
    const matchProp = REGEX_JS_PROP.exec(prop);
    const hasComputed = matchProp[6] === '#';
    ret.name = hasComputed ? matchProp[7] : matchProp[0];

    if (matchProp[0] !== prop) {
      if (REGEX_HAS_BRACKET.test(ret.name)) {
        tools.throwIf(0, _syntaxError('There is an extra bracket', _replaceStr(propO, innerQuotes), source));
      } else {
        tools.error(_syntaxError('The operator must have at least one space before and after', _replaceStr(propO, innerQuotes), source));
      }
    }
    if (!matchProp[5]) { //Sign the parameter is a basic type value.
      ret.isBasicType = true;
    }
    if (hasComputed) {
      ret.isComputed = true;
    }
  } else {
    ret.isEmpty = true;
  }

  return ret;
}

//Get filter param
function _getFilterParam(obj) {
  return obj.split('\'bracket_');
}

//Extract replace parameters
const REGEX_LT_GT = /_nj(L|G)t_/g;
const LT_GT_LOOKUP = {
  '_njLt_': '<',
  '_njGt_': '>'
};
const REGEX_QUOTE = /"[^"]*"|'[^']*'/g;
const SP_FILTER_LOOKUP = {
  '||': 'or',
  '..<': 'rLt'
};
const REGEX_SP_FILTER = /[\s]+((\|\||\.\.<)[\s]*)/g;
const FN_FILTER_LOOKUP = {
  ')': ')_(',
  ']': ']_('
};
const REGEX_FN_FILTER = /(\)|\]|\.([^\s'"._#()|]+))[\s]*\(/g;
const REGEX_SPACE_S_FILTER = /([(,|])[\s]+/g;
const REGEX_PROP_FILTER = /\.([a-zA-Z_$#@][a-zA-Z_$@\d]*)/g;
const REGEX_ARRPROP_FILTER = /([^\s([,])(\[)/g;
const ARR_OBJ_FILTER_LOOKUP = {
  '[': 'list(',
  ']': ')',
  '{': 'obj(',
  '}': ')'
};
const REGEX_ARR_OBJ_FILTER = /\[|\]|\{|\}/g;
const REGEX_OBJKEY_FILTER = /([^\s:,'"()|]+):/g;

function _getProp(matchArr, innerQuotes, i) {
  let prop = matchArr[2].trim(),
    item = [matchArr[0], matchArr[1], null, true],
    innerArrProp = [];

  if (i > 0) {
    item[3] = false; //Sign not contain all of placehorder
  }

  //替换特殊过滤器名称并且为简化过滤器补全"|"符
  prop = prop.replace(REGEX_LT_GT, match => LT_GT_LOOKUP[match])
    .replace(REGEX_QUOTE, match => {
      innerQuotes.push(match);
      return '_njQs' + (innerQuotes.length - 1) + '_';
    })
    .replace(REGEX_PROP_FILTER, (all, g1) => {
      const startWithHash = g1[0] === '#';
      if (startWithHash) {
        g1 = g1.substr(1);
      }

      const lastCharIndex = g1.length - 1,
        endWithUnderline = lastCharIndex > 0 && g1[lastCharIndex] === '_';
      return (startWithHash ? '#' : '.') + '(\'' + (endWithUnderline ? g1.substr(0, lastCharIndex) : g1) + '\')' + (endWithUnderline ? '_' : '');
    })
    .replace(REGEX_ARRPROP_FILTER, (all, g1, g2) => g1 + '.(')
    .replace(REGEX_ARR_OBJ_FILTER, match => ARR_OBJ_FILTER_LOOKUP[match])
    .replace(REGEX_OBJKEY_FILTER, (all, g1) => ' \'' + g1 + '\' : ')
    .replace(REGEX_SP_FILTER, (all, g1, match) => ' ' + SP_FILTER_LOOKUP[match] + ' ')
    .replace(REGEX_SPACE_S_FILTER, (all, match) => match)
    .replace(REGEX_FN_FILTER, (all, match, g1) => !g1 ? FN_FILTER_LOOKUP[match] : '.(\'' + g1 + '\')_(');

  item[2] = prop.trim();
  return item;
}

function _getReplaceParam(obj, tmplRule, innerQuotes, hasColon) {
  let pattern = tmplRule.replaceParam,
    matchArr, ret, i = 0;

  if (!hasColon) {
    while ((matchArr = pattern.exec(obj))) {
      if (!ret) {
        ret = [];
      }

      const startRuleR = matchArr[2];
      ret.push(_getProp([matchArr[0], startRuleR ? startRuleR : matchArr[5], startRuleR ? matchArr[3] : matchArr[6]], innerQuotes, i));
      i++;
    }
  } else {
    matchArr = [obj, tmplRule.startRule, obj];
    ret = [_getProp(matchArr, innerQuotes, i)];
  }

  return ret;
}

const REGEX_INNER_BRACKET = /\(([^()]*)\)/g;
const REGEX_FIX_OPERATOR = /[\s]+([^\s(),|"']+)[\s]+((-?[0-9][0-9]*(\.\d+)?|[^\s,|']+)('bracket_\d+)?([._#]'bracket_\d+)*)/g;
const REGEX_SPACE_FILTER = /[(,]/g;
const REGEX_FIX_FILTER = /(\|)?(((\.+|_|#+)'bracket_)|[\s]+([^\s._#|]+[\s]*'bracket_))/g;

function _fixOperator(prop, innerBrackets) {
  return _fixFilter(prop.replace(REGEX_FIX_OPERATOR, function() {
    const args = arguments;
    innerBrackets.push(_fixFilter(args[2]));
    return ' ' + args[1] + '\'bracket_' + (innerBrackets.length - 1);
  }));
}

function _fixFilter(prop) {
  return (' ' + prop).replace(REGEX_SPACE_FILTER, all => all + ' ')
    .replace(REGEX_FIX_FILTER, (all, g1, g2, g3, g4, g5) => g1 ? all : ' | ' + (g3 ? g3 : g5)).trim();
}

function _replaceInnerBrackets(prop, innerBrackets) {
  let propR = prop.replace(REGEX_INNER_BRACKET, (all, s1) => {
    innerBrackets.push(_fixOperator(s1, innerBrackets));
    return '\'bracket_' + (innerBrackets.length - 1);
  });

  if (propR !== prop) {
    return _replaceInnerBrackets(propR, innerBrackets);
  } else {
    return _fixOperator(propR, innerBrackets);
  }
}

//Get compiled parameter
export function compiledParam(value, tmplRule, hasColon) {
  let ret = tools.obj(),
    isStr = tools.isString(value),
    strs = isStr ? (!hasColon ? value.split(tmplRule.replaceSplit) : ['', '']) : [value],
    props = null,
    isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

  if (isStr) { //替换插值变量以外的文本中的换行符
    strs = strs.map(str => str.replace(/\n/g, '_njNl_').replace(/\r/g, ''));
  }

  //If have placehorder
  if (strs.length > 1) {
    const innerQuotes = [];
    const params = _getReplaceParam(value, tmplRule, innerQuotes, hasColon);
    props = [];

    tools.each(params, param => {
      let retP = tools.obj(),
        innerBrackets = [];

      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      const prop = _replaceInnerBrackets(param[2], innerBrackets);
      retP.prop = _compiledProp(prop, innerBrackets, innerQuotes, value);

      //To determine whether it is necessary to escape
      retP.escape = param[1] !== tmplRule.firstChar + tmplRule.startRule;
      props.push(retP);
    }, false, true);
  }

  ret.props = props;
  ret.strs = strs;
  ret.isAll = isAll;

  return ret;
}