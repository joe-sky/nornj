'use strict';

const tools = require('../utils/tools');

//Global expression list
const exprs = {
  'if': function(value, options) {
    if (value === 'false') {
      value = false;
    }

    var valueR, ret;
    if (!options.useUnless) {
      valueR = !!value;
    } else {
      valueR = !!!value;
    }
    if (valueR) {
      ret = options.result();
    } else {
      let props = options.props;
      if (props) {
        let elseFn = props['else'];

        if (props.elseifs) {
          let l = props.elseifs.length;
          tools.each(props.elseifs, function(elseif, i) {
            if (!!elseif.value) {
              ret = elseif.fn();
              return false;
            } else if (i === l - 1) {
              if (elseFn) {
                ret = elseFn();
              }
            }
          }, false, true);
        } else {
          if (elseFn) {
            ret = elseFn();
          }
        }
      }
    }

    if (options.useString && ret == null) {
      return '';
    }

    return ret;
  },

  'else': (options) => options.exprProps['else'] = options.result,

  'elseif': (value, options) => {
    const exprProps = options.exprProps;
    if (!exprProps.elseifs) {
      exprProps.elseifs = [];
    }
    exprProps.elseifs.push({
      value,
      fn: options.result
    });
  },

  'switch': function(value, options) {
    var ret,
      props = options.props,
      l = props.elseifs.length;

    tools.each(props.elseifs, function(elseif, i) {
      if (value === elseif.value) {
        ret = elseif.fn();
        return false;
      } else if (i === l - 1) {
        if (props['else']) {
          ret = props['else']();
        }
      }
    }, false, true);

    return ret;
  },

  unless: function(value, options) {
    options.useUnless = true;
    return exprs['if'].call(this, value, options);
  },

  each: function(list, options) {
    var useString = options.useString,
      ret;

    if (list) {
      if (useString) {
        ret = '';
      } else {
        ret = [];
      }

      const props = options.props;
      tools.each(list, function(item, index, len) {
        let param = {
          data: item,
          index: index,
          fallback: true
        };

        if (props && props.moreValues) {
          param.extra = {
            ['@first']: index === 0,
            ['@last']: index === len - 1,
            ['@length']: len
          };
        }

        let retI = options.result(param);
        if (useString) {
          ret += retI;
        } else {
          ret.push(retI);
        }
      }, false, tools.isArrayLike(list));

      //Return null when not use string and result is empty.
      if (!useString && !ret.length) {
        ret = null;
      }
    } else {
      let props = options.props;
      if (props && props['else']) {
        ret = props['else']();
      }
      if (useString && ret == null) {
        ret = '';
      }
    }

    return ret;
  },

  //Parameter
  prop: function(name, options) {
    var ret = options.result(), //Get parameter value
      value;

    if (ret !== undefined) {
      value = ret;
    } else { //Match to Similar to "checked" or "disabled" attribute.
      value = !options.useString ? true : name;
    }

    options.exprProps[name] = value;
  },

  //Spread parameters
  spread: function(props, options) {
    tools.each(props, function(v, k) {
      options.exprProps[k] = v;
    }, false, false);
  },

  'for': function(start, end, options) {
    if (end._njOpts) {
      options = end;
      end = start;
      start = 0;
    }

    var ret, useString = options.useString;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; start <= end; start++) {
      var retI = options.result({
        index: start
      });

      if (useString) {
        ret += retI;
      } else {
        ret.push(retI);
      }
    }

    return ret;
  },

  obj: function(options) {
    return options.props;
  },

  block: function(options) {
    return options.result();
  }
};

function _commonConfig(params) {
  var ret = {
    useString: true,
    exprProps: false,
    newContext: true
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

//Expression default config
var exprConfig = {
  'if': _commonConfig({ newContext: false }),
  'else': _commonConfig({ newContext: false, useString: false, exprProps: true }),
  'switch': _commonConfig({ newContext: false }),
  unless: _commonConfig({ newContext: false }),
  each: _commonConfig(),
  prop: _commonConfig({ newContext: false, exprProps: true }),
  spread: _commonConfig({ newContext: false, useString: false, exprProps: true }),
  'for': _commonConfig(),
  obj: _commonConfig({ newContext: false, useString: false })
};
exprConfig.elseif = _commonConfig(exprConfig['else']);
exprConfig.blank = _commonConfig(exprConfig.obj);

//Expression alias
exprs['case'] = exprs.elseif;
exprConfig['case'] = exprConfig.elseif;
exprs['default'] = exprs['else'];
exprConfig['default'] = exprConfig['else'];

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

  tools.each(params, function(v, name) {
    if (v) {
      var expr = v.expr,
        options = v.options;

      if (expr || options) {
        if (expr) {
          exprs[name] = expr;
        }
        if (options) {
          exprConfig[name] = _commonConfig(options);
        }
      } else {
        exprs[name] = v;
      }
    }
  }, false, false);
}

module.exports = {
  exprs,
  exprConfig,
  registerExpr
};