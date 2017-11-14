import nj from '../core';
import * as tools from '../utils/tools';
import '../helpers/filter';

//Get compiled property
const REGEX_JS_PROP = new RegExp(nj.regexJsBase + '([^\\s()]*)');
const REGEX_REPLACE_CHAR = /_njQs(\d)\$/g;

function _compiledProp(prop, innerBrackets, innerQuotes) {
  let ret = tools.obj();

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
          let params = [];
          tools.each(innerBrackets[paramsF].split(','), p => {
            if (p !== '') {
              params[params.length] = _compiledProp(p.trim(), innerBrackets, innerQuotes);
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
  prop = prop.replace(REGEX_REPLACE_CHAR, (all, g1) => innerQuotes[g1]);

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
    prop = REGEX_JS_PROP.exec(prop);
    const hasComputed = prop[7];
    ret.name = hasComputed ? prop[8] : prop[1];
    ret.jsProp = prop[9];

    if (!prop[8]) { //Sign the parameter is a basic type value.
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
  return obj.split('_njBracket_');
}

//Extract replace parameters
const REGEX_LT_GT = /_nj(L|G)t\$/g;
const LT_GT_LOOKUP = {
  '_njLt$': '<',
  '_njGt$': '>'
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
const REGEX_SPACE_FILTER = /[(,]/g;
const REGEX_FIX_FILTER = /(\|)?(([._#]+\()|[\s]+([^\s._#|]+[\s]*\())/g;

function _getReplaceParam(obj, tmplRule, innerQuotes) {
  let pattern = tmplRule.replaceParam,
    matchArr, ret, i = 0;

  while ((matchArr = pattern.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    let prop = ' ' + matchArr[2],
      item = [matchArr[0], matchArr[1], null, true];

    if (i > 0) {
      item[3] = false; //Sign not contain all of placehorder
    }

    //替换特殊过滤器名称并且为简化过滤器补全"|"符
    prop = prop.replace(REGEX_LT_GT, match => LT_GT_LOOKUP[match])
      .replace(REGEX_QUOTE, match => {
        innerQuotes.push(match);
        return '_njQs' + (innerQuotes.length - 1) + '$';
      })
      .replace(REGEX_SP_FILTER, (all, g1, match) => ' ' + SP_FILTER_LOOKUP[match] + ' ')
      .replace(nj.regexTransOpts, function() {
        const args = arguments;
        return ' ' + args[1] + '(' + args[2] + (args[10] != null ? args[10] : '') + ')';
      })
      .replace(REGEX_FN_FILTER, (all, match, g1) => !g1 ? FN_FILTER_LOOKUP[match] : '.(\'' + g1 + '\')_(')
      .replace(REGEX_SPACE_FILTER, all => all + ' ')
      .replace(REGEX_FIX_FILTER, (all, g1, g2, g3, g4) => {
        return (g1 ? all : ' | ' + (g3 ? g3 : g4));
      });
      
    item[2] = prop.trim();
    ret.push(item);
    i++;
  }

  return ret;
}

const REGEX_INNER_BRACKET = /\(([^()]*)\)/g;

function _replaceInnerBrackets(prop, counter, innerBrackets) {
  let propR = prop.replace(REGEX_INNER_BRACKET, (all, s1) => {
    innerBrackets.push(s1);
    return '_njBracket_' + counter++;
  });

  if (propR !== prop) {
    return _replaceInnerBrackets(propR, counter, innerBrackets);
  } else {
    return propR;
  }
}

//Get compiled parameter
export function compiledParam(value, tmplRule) {
  let ret = tools.obj(),
    isStr = tools.isString(value),
    strs = isStr ? value.split(tmplRule.replaceSplit) : [value],
    props = null,
    isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

  if (isStr) { //替换插值变量以外的文本中的换行符
    strs = strs.map(str => str.replace(/\n/g, '_njNl$').replace(/\r/g, ''));
  }

  //If have placehorder
  if (strs.length > 1) {
    const innerQuotes = [];
    const params = _getReplaceParam(value, tmplRule, innerQuotes);
    props = [];

    tools.each(params, param => {
      let retP = tools.obj(),
        innerBrackets = [];

      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      const prop = _replaceInnerBrackets(param[2], 0, innerBrackets);
      retP.prop = _compiledProp(prop, innerBrackets, innerQuotes);

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