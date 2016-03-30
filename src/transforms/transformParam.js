'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  paramRule = nj.paramRule;

//Get compiled parameters from a object
function compiledParams(obj) {
  var ret = tools.lightObj();
  tools.each(obj, function (v, k) {
    ret[k] = compiledParam(v);
  }, false, false);

  return ret;
}

//Get compiled property
function compiledProp(prop, isString) {
  var ret = tools.lightObj();

  //If there are colons in the property,then use filter
  if (prop.indexOf(':') >= 0) {
    var filters = [],
      filtersTmp;
    filtersTmp = prop.split(':');
    prop = filtersTmp[0].trim();  //Extract property

    filtersTmp = filtersTmp.slice(1);
    tools.each(filtersTmp, function (filter) {
      var retF = _getFilterParam(filter.trim()),
        filterObj = tools.lightObj(),
        filterName = retF[1].toLowerCase();  //Get filter name

      if (filterName) {
        var paramsF = retF[3];  //Get filter param

        //Multiple params are separated by commas.
        if (paramsF) {
          var params = [];
          tools.each(paramsF.split(','), function (p) {
            params[params.length] = p.trim();
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
  if (!isString && prop.indexOf('../') > -1) {
    var n = 0;
    prop = prop.replace(/\.\.\//g, function () {
      n++;
      return '';
    });

    ret.parentNum = n;
  }

  ret.name = prop;
  if (isString) {  //Sign the parameter is a pure string.
    ret.isStr = true;
  }

  return ret;
}

//Get filter param
var REGEX_FILTER_PARAM = /([\w$]+)(\(([^()]+)\))*/;
function _getFilterParam(obj) {
  return REGEX_FILTER_PARAM.exec(obj);
}

//提取替换参数
var _quots = ['\'', '"'];
function _getReplaceParam(obj) {
  var pattern = paramRule.replaceParam(),
    patternP = /[^\s:]+([\s]?:[\s]?[^\s\(\)]+(\([\s\S]+\))?){0,}/g,
    matchArr, ret, prop;

  while ((matchArr = pattern.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    var item = [matchArr[0], matchArr[1], matchArr[3], false];
    prop = item[2];
    if (prop != null) {
      //Clear parameter at both ends of the space.
      prop = prop.trim();

      //If parameter has quotation marks,this's a pure string parameter.
      if (_quots.indexOf(prop.charAt(0)) > -1) {
        prop = tools.clearQuot(prop);
        item[3] = true;
      }

      item[2] = prop;
    }

    ret.push(item);
  }

  return ret;
}

//Get compiled parameter
function compiledParam(value) {
  var ret = tools.lightObj(),
    strs = tools.isString(value) ? value.split(paramRule.replaceSplit) : [value],
    props = null,
    isAll = false;

  //If have placehorder
  if (strs.length > 1) {
    var params = _getReplaceParam(value);
    props = [];

    tools.each(params, function (param) {
      var retP = tools.lightObj();
      isAll = param[0] === value;
      retP.prop = compiledProp(param[2], param[3]);

      //If parameter's open rules are several,then it need escape.
      retP.escape = param[1].split(paramRule.openRule).length < 3;
      props.push(retP);
    }, false, true);
  }

  ret.props = props;
  ret.strs = strs;
  ret.isAll = isAll;
  return ret;
}

module.exports = {
  compiledParam: compiledParam,
  compiledParams: compiledParams,
  compiledProp: compiledProp
};