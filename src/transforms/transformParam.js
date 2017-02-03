'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tmplRule = nj.tmplRule;

//Get compiled parameters from a object
function compiledParams(obj) {
  var ret = tools.obj();
  tools.each(obj, function(v, k) {
    ret[k] = compiledParam(v);
  }, false, false);

  return ret;
}

//Get compiled property
var REGEX_JS_PROP = /(('[^']*')|("[^"]*")|(-?([0-9][0-9]*)(\.\d+)?)|true|false|null|undefined|([#]*)([^.[\]()]+))([^\s()]*)/;

function compiledProp(prop) {
  var ret = tools.obj();

  //If there are colons in the property,then use filter
  if (prop.indexOf('|') >= 0) {
    var filters = [],
      filtersTmp;
    filtersTmp = prop.split('|');
    prop = filtersTmp[0].trim(); //Extract property

    filtersTmp = filtersTmp.slice(1);
    tools.each(filtersTmp, function(filter) {
      var retF = _getFilterParam(filter.trim()),
        filterObj = tools.obj(),
        filterName = retF[1]; //Get filter name

      if (filterName) {
        var paramsF = retF[3]; //Get filter param

        //Multiple params are separated by commas.
        if (paramsF) {
          var params = [];
          tools.each(paramsF.split(','), function(p) {
            params[params.length] = compiledProp(p.trim());
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
    var n = 0;
    prop = prop.replace(/\.\.\//g, function() {
      n++;
      return '';
    });

    ret.parentNum = n;
  }

  //Extract the js property
  prop = REGEX_JS_PROP.exec(prop);
  var hasComputed = prop[7];
  ret.name = hasComputed ? prop[8] : prop[1];
  ret.jsProp = prop[9];

  if (!prop[8]) { //Sign the parameter is a basic type value.
    ret.isBasicType = true;
  }
  if (hasComputed) {
    ret.isComputed = true;
  }

  return ret;
}

//Get filter param
var REGEX_FILTER_PARAM = /([\w$@=+-\\*/&%?]+)(\(([^()]+)\))*/;

function _getFilterParam(obj) {
  return REGEX_FILTER_PARAM.exec(obj);
}

//Extract replace parameters
var _quots = ['\'', '"'];

function _getReplaceParam(obj, strs) {
  var pattern = tmplRule.replaceParam,
    matchArr, ret, i = 0;

  while ((matchArr = pattern.exec(obj))) {
    if (!ret) {
      ret = [];
    }

    var prop = matchArr[3],
      item = [matchArr[0], matchArr[1], null, true];

    if (i > 0) {
      item[3] = false; //Sign not contain all of placehorder
    }

    //Clear parameter at both ends of the space.
    prop = prop.trim();

    item[2] = prop;
    ret.push(item);
    i++;
  }

  return ret;
}

//Get compiled parameter
function compiledParam(value) {
  var ret = tools.obj(),
    strs = tools.isString(value) ? value.split(tmplRule.replaceSplit) : [value],
    props = null,
    isAll = false; //此处指替换符是否占满整个属性值;若无替换符时为false

  //If have placehorder
  if (strs.length > 1) {
    var params = _getReplaceParam(value, strs);
    props = [];

    tools.each(params, function(param) {
      var retP = tools.obj();
      isAll = param[3] ? param[0] === value : false; //If there are several curly braces in one property value, "isAll" must be false.
      retP.prop = compiledProp(param[2]);

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

module.exports = {
  compiledParam,
  compiledParams,
  compiledProp
};