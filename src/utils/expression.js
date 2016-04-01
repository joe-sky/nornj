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

  //Unless block
  unless: function (refer, options) {
    return nj.exprs.if(!refer, options);
  },

  //Each block
  each: function (refer, options) {
    var useString = options.useString,
      ret;

    if (refer) {
      ret = [];
      tools.each(refer, function (item, index) {
        ret.push(options.result({
          loop: true,
          item: item,
          index: index
        }));
      }, false, tools.isArray(refer));

      //May return connected string
      var len = ret.length;
      if (useString) {
        if (len) {
          ret = ret.join('');
        }
        else {
          ret = '';
        }
      }
      else if (!len) {
        ret = null;
      }
    }
    else {
      ret = options.inverse();
      if (useString && ret == null) {
        ret = '';
      }
    }

    return ret;
  },

  //Param block
  param: function () {
    var args = arguments,
      len = args.length,
      options = args[len - 1],
      ret = options.result(),
      name = '',
      value;

    //Make property name by multiple parameters
    tools.each(args, function (item, i) {
      if(i < len - 1) {
        name += item;
      }
    }, false, true);

    console.log(ret);
    if (ret.length > 1) {
      value = ret.join('');
    }
    else {
      value = ret[0];
    }

    options.paramsExpr[name] = value;
  },
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