'use strict';

var tools = require('./tools');

//Get compiled parameters from a object
function compiledParams(obj) {
  var ret = tools.lightObj();
  tools.each(obj, function (v, k) {
    ret[k] = compiledParam(v);
  }, false, false);

  return ret;
}

//Get compiled property
function compiledProp(prop) {
  var ret = tools.lightObj();

  //If there are colons in the property,then use filter
  if (prop.indexOf(':') >= 0) {
    var filters = [],
      filtersTmp;
    filtersTmp = prop.split(':');
    prop = filtersTmp[0];  //Extract property

    filtersTmp = filtersTmp.slice(1);
    tools.each(filtersTmp, function (filter) {
      var retF = _getFilterParam(filter),
        filterObj = tools.lightObj(),
        filterName = retF[1].toLowerCase();  //Get filter name

      if (filterName) {
        var paramsF = retF[3];  //Get filter param

        //Multiple params are separated by commas.
        if (paramsF) {
          var params = [];
          tools.each(paramsF.split(','), function (p) {
            params[params.length] = p;
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
  if (prop.indexOf('../') > -1) {
    var n = 0;
    prop = prop.replace(/\.\.\//g, function () {
      n++;
      return '';
    });

    ret.parentNum = n;
  }

  ret.name = prop;
  return ret;
}

//Get filter param
var REGEX_FILTER_PARAM = /([\w$]+)(\(([^()]+)\))*/;
function _getFilterParam(obj) {
  return REGEX_FILTER_PARAM.exec(obj);
}

//提取替换参数
var REGEX_REPLACE_PARAM = /({{1,2})([^"'\s{}]+)}{1,2}/g;
function _getReplaceParam(obj) {
  var matchArr,
    ret;

  while ((matchArr = REGEX_REPLACE_PARAM.exec(obj))) {
    if (!ret) {
      ret = [];
    }
    ret.push(matchArr);
  }

  return ret;
}

//Get compiled parameter
var REGEX_REPLACE_SPLIT = /{{1,2}[^"'\s{}]+}{1,2}/g;
function compiledParam(value) {
  var ret = tools.lightObj(),
    strs = tools.isString(value) ? value.split(REGEX_REPLACE_SPLIT) : [value],
    props = null,
    isAll = false;

  //If have placehorder
  if (strs.length > 1) {
    var params = _getReplaceParam(value);
    props = [];

    tools.each(params, function (param) {
      var retP = tools.lightObj();
      isAll = param[0] === value;

      retP.prop = compiledProp(param[2]);
      retP.escape = param[1].length < 2;
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