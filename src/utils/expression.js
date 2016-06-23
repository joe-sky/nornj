'use strict';

var nj = require('../core'),
  tools = require('./tools');

//Global expression list
nj.exprs = {
  //If block
  'if': function (refer, useUnless) {
    if (refer === 'false') {
      refer = false;
    }

    var referR, ret;
    if(!useUnless) {
      referR = !!refer;
    }
    else {
      referR = !!!refer;
    }
    if (referR) {
      ret = this.result();
    }
    else {
      ret = this.inverse();
    }

    if (this.useString && ret == null) {
      return '';
    }

    return ret;
  },

  //Unless block
  unless: function (refer) {
    return nj.exprs['if'].call(this, refer, true);
  },

  //Each block
  each: function (refer) {
    var thiz = this,
      useString = thiz.useString,
      ret;

    if (refer) {
      if (useString) {
        ret = '';
      }
      else {
        ret = [];
      }

      tools.each(refer, function (item, index) {
        var retI = thiz.result({
          loop: true,
          item: item,
          index: index
        });

        if (useString) {
          ret += retI;
        }
        else {
          tools.listPush(ret, retI, true);
        }
      }, false, tools.isArray(refer));

      //Return null when not use string and result is empty.
      if (!useString && !ret.length) {
        ret = null;
      }
    }
    else {
      ret = thiz.inverse();
      if (useString && ret == null) {
        ret = '';
      }
    }

    return ret;
  },

  //Parameter block
  param: function () {
    var ret = this.result(),  //Get parameter value
      name = '',
      value;

    //Make property name by multiple parameters
    tools.each(arguments, function (item, i) {
      name += item;
    }, false, true);

    //If the value length greater than 1, it need to be connected to a whole string.
    if (ret != null) {
      if (ret.length > 1) {
        value = '';
        tools.each(ret, function (item) {
          value += item;
        }, false, true);
      }
      else {
        value = ret[0];
      }
    }
    else {  //Match to Similar to "checked" or "disabled" attribute.
      value = name;
    }

    this.paramsExpr[name] = value;
  },

  //Spread parameters block
  spreadparam: function (refer) {
    if (!refer) {
      return;
    }

    var thiz = this;
    tools.each(refer, function (v, k) {
      thiz.paramsExpr[k] = v;
    }, false, false);
  },

  //Equal block
  equal: function (value1, value2) {
    var ret;
    if (value1 == value2) {
      ret = this.result();
    }
    else {
      ret = this.inverse();
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