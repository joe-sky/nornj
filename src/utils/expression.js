'use strict';

var nj = require('../core'),
  tools = require('./tools');

//Global expression list
nj.exprs = {
  //If block
  'if': function (refer, options) {
    if (!!refer) {
      return options.result();
    }
    else {
      return options.inverse();
    }
  },

  //Each block
  each: function (refer, options) {
    var ret = [];

    if (refer) {
      tools.each(refer, function (item, index) {
        var _parent = tools.lightObj();  //Create a parent data object
        _parent.data = item;
        _parent.parent = parent;
        _parent.index = index;

        ret.push(options.result(item, _parent));
      }, false, tools.isArray(refer));
    }
    else {
      ret = options.inverse();
    }

    return ret;
  }
};

//Register expression and also can batch add
function registerExpr(name, expr) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = expr;
  }

  tools.each(params, function (v, k) {
    nj.exprs[k.toLowerCase()] = v;
  }, false, false);
}

module.exports = {
  registerExpr: registerExpr
};