'use strict';

var nj = require('../core'),
  tools = require('./tools');

//Global expression list
nj.exprs = {
  //If block
  'if': function (refer, options) {
    var ret;
    if (!!refer) {
      ret = options.result();
    }
    else {
      ret = options.inverse();
    }

    if(options.useString && ret == null) {
      return '';
    }

    return ret;
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
      if(useString) {
        ret = '';
      }
      else {
        ret = [];
      }
      
      tools.each(refer, function (item, index) {
        var retI = options.result({
          loop: true,
          item: item,
          index: index
        });

        if(useString) {
          ret += retI;
        }
        else {
          ret[ret.length] = retI;
        }
      }, false, tools.isArray(refer));

      //Return null when not use string and result is empty.
      if(!useString && !ret.length) {
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
      ret = tools.flatten(options.result()),  //Get parameter value and flatten it.
      name = '',
      value;

    //Make property name by multiple parameters
    tools.each(args, function (item, i) {
      if(i < len - 1) {
        name += item;
      }
    }, false, true);

    //If the value length greater than 1, it need to be connected to a whole string.
    if (ret.length > 1) {
      value = '';
      tools.each(ret, function(item) {
        value += item;
      }, false, true);
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