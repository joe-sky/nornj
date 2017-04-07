import nj from '../core';
import * as tools from '../utils/tools';

//Get compiled property
const REGEX_JS_PROP = /(('[^']*')|("[^"]*")|(-?([0-9][0-9]*)(\.\d+)?)|true|false|null|undefined|Object|Array|Math|Date|JSON|([#]*)([^.[\]()]+))([^\s()]*)/;

function _compiledProp(prop, innerBrackets) {
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
        filterName = retF[0]; //Get filter name

      if (filterName) {
        const paramsF = retF[1]; //Get filter param

        //Multiple params are separated by commas.
        if (paramsF != null) {
          let params = [];
          tools.each(innerBrackets[paramsF].split(','), p => {
            if (p !== '') {
              params[params.length] = _compiledProp(p.trim(), innerBrackets);
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
const _quots = ['\'', '"'];
const SP_FILTER_LOOKUP = {
  '||(': 'or('
};
const REGEX_SP_FILTER = /[\s]+((\|\|)\()/g;
const REGEX_FIX_FILTER = /(\|)?[\s]+([^\s]+\()/g;

function _getReplaceParam(obj, tmplRule) {
  let pattern = tmplRule.replaceParam,
    matchArr, ret, i = 0;

  while ((matchArr = pattern.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    let prop = matchArr[2],
      item = [matchArr[0], matchArr[1], null, true];

    if (i > 0) {
      item[3] = false; //Sign not contain all of placehorder
    }

    //替换特殊过滤器名称并且为简化过滤器补全"|"符
    prop = prop.replace(REGEX_SP_FILTER, (all, match) => ' ' + SP_FILTER_LOOKUP[match])
      .replace(REGEX_FIX_FILTER, (all, s1, s2) => s1 ? all : '|' + s2);

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
    strs = strs.map(str => str.replace(/\n/g, '_njNl_').replace(/\r/g, ''));
  }

  //If have placehorder
  if (strs.length > 1) {
    const params = _getReplaceParam(value, tmplRule);
    props = [];

    tools.each(params, param => {
      let retP = tools.obj(),
        innerBrackets = [];

      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      const prop = _replaceInnerBrackets(param[2], 0, innerBrackets);
      retP.prop = _compiledProp(prop, innerBrackets);

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