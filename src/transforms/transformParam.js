'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tmplRule = nj.tmplRule;

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

  //Extract the dot data path to the 'prop' filter.
  if (!isString && prop.indexOf('.') > -1) {
    prop = prop.replace(/\.([^\s.|\/]+)/g, '|prop($1)');
  }

  //If there are colons in the property,then use filter
  if (prop.indexOf('|') >= 0) {
    var filters = [],
      filtersTmp;
    filtersTmp = prop.split('|');
    prop = filtersTmp[0].trim();  //Extract property

    filtersTmp = filtersTmp.slice(1);
    tools.each(filtersTmp, function (filter) {
      var retF = _getFilterParam(filter.trim()),
        filterObj = tools.lightObj(),
        filterName = retF[1];  //Get filter name

      if (filterName) {
        var paramsF = retF[3];  //Get filter param

        //Multiple params are separated by commas.
        if (paramsF) {
          var params = [];
          tools.each(paramsF.split(','), function (p) {
            params[params.length] = tools.clearQuot(p).trim();
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

//Extract replace parameters
var _quots = ['\'', '"'];
function _getReplaceParam(obj, strs) {
  var pattern = tmplRule.replaceParam(),
    matchArr, ret, i = 0;

  while ((matchArr = pattern.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    var prop = matchArr[3],
      item = [matchArr[0], matchArr[1], null, false, true];

    if (i > 0) {
      item[4] = false;  //Sign not contain all of placehorder
    }

    //Clear parameter at both ends of the space.
    prop = prop.trim();

    //If parameter has quotation marks, this's a pure string parameter.
    if (_quots.indexOf(prop[0]) > -1) {
      prop = tools.clearQuot(prop);  //TODO 此处也会去除过滤器参数的引号
      item[3] = true;
    }

    item[2] = prop;
    ret.push(item);
    i++;
  }

  return ret;
}

//Get compiled parameter
function compiledParam(value) {
  var ret = tools.lightObj(),
    strs = tools.isString(value) ? value.split(tmplRule.replaceSplit) : [value],
    props = null,
    isAll = false;  //此处指替换符是否占满整个属性值;若无替换符时为false

  //If have placehorder
  if (strs.length > 1) {
    var params = _getReplaceParam(value, strs);
    props = [];

    tools.each(params, function (param) {
      var retP = tools.lightObj();
      isAll = param[4] ? param[0] === value : false;  //If there are several curly braces, "isAll" must be false.
      retP.prop = compiledProp(param[2], param[3]);

      //If parameter's open rules are several,then it need escape.
      retP.escape = param[1].split(tmplRule.startRule).length < 3;
      props.push(retP);
    }, false, true);
  }

  ret.props = props;
  ret.strs = strs;
  ret.isAll = isAll;

  //标记为模板函数替换变量
  if (isAll) {
    var prop = props[0].prop;
    if (prop.name.indexOf('!#') === 0) {
      prop.name = prop.name.substr(2);
      ret.isTmplPlace = true;
    }
  }

  return ret;
}

module.exports = {
  compiledParam: compiledParam,
  compiledParams: compiledParams,
  compiledProp: compiledProp
};