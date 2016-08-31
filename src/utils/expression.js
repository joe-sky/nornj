'use strict';

var tools = require('./tools');

//Global expression list
var exprs = {
  'if': function (refer, useUnless) {
    if (refer === 'false') {
      refer = false;
    }

    var referR, ret;
    if (!useUnless) {
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

  unless: function (refer) {
    return exprs['if'].call(this, refer, true);
  },

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

  //Parameter
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

        //The "_njShim" property is used to distinguish whether the incoming is an normal array.
        if (value && value._njShim) {
          value = value._njShim;
        }
      }
    }
    else {  //Match to Similar to "checked" or "disabled" attribute.
      value = name;
    }

    this.paramsExpr[name] = value;
  },

  //Spread parameters
  spreadparam: function (refer) {
    if (!refer) {
      return;
    }

    var thiz = this;
    tools.each(refer, function (v, k) {
      thiz.paramsExpr[k] = v;
    }, false, false);
  },

  equal: function (value1, value2) {
    var ret;
    if (value1 == value2) {
      ret = this.result();
    }
    else {
      ret = this.inverse();
    }

    return ret;
  },

  'for': function (start, end) {
    var ret, useString = this.useString;
    if (useString) {
      ret = '';
    }
    else {
      ret = [];
    }

    if (end == null) {
      end = start;
      start = 0;
    }
    start = parseInt(start, 10);
    end = parseInt(end, 10);

    for (; start <= end; start++) {
      var retI = this.result({
        loop: true,
        item: this.data[0],
        index: start
      });

      if (useString) {
        ret += retI;
      }
      else {
        tools.listPush(ret, retI, true);
      }
    }

    return ret;
  },

  blank: function () {
    return this.result();
  }
};

//Expression alias
exprs.p = exprs.param;
exprs.spread = exprs.spreadparam;

function _commonConfig(params) {
  var ret = {
    data: false,
    parent: false,
    index: false,
    useString: true,
    paramsExpr: false,
    result: true,
    inverse: true,
    newContext: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

//Expression default config
var exprConfig = {
  'if': _commonConfig(),
  unless: _commonConfig(),
  each: _commonConfig({ newContext: true }),
  param: _commonConfig({ paramsExpr: true }),
  spreadparam: _commonConfig({ useString: false, inverse: false, paramsExpr: true }),
  equal: _commonConfig({ useString: false }),
  'for': _commonConfig({ newContext: true }),
  blank: _commonConfig({ useString: false, inverse: false })
};

//Register expression and also can batch add
function registerExpr(name, expr, options) {
  var params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      expr: expr,
      options: options
    };
  }

  tools.each(params, function (v, k) {
    var name = k.toLowerCase();
    if (v && v.expr) {
      exprs[name] = v.expr;
      if(v.options) {
        exprConfig[name] = tools.assign({}, exprConfig[name], v.options);
      }
    }
    else {
      exprs[name] = v;
    }
  }, false, false);
}

module.exports = {
  exprs: exprs,
  exprConfig: exprConfig,
  registerExpr: registerExpr
};