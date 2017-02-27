import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';

//Global expression list
export const exprs = {
  'if': (value, options) => {
    if (value === 'false') {
      value = false;
    }

    let valueR, ret;
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
          tools.each(props.elseifs, (elseif, i) => {
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

  'else': options => options.subExProps['else'] = options.result,

  'elseif': (value, options) => {
    const exProps = options.subExProps;
    if (!exProps.elseifs) {
      exProps.elseifs = [];
    }
    exProps.elseifs.push({
      value,
      fn: options.result
    });
  },

  'switch': (value, options) => {
    let ret,
      props = options.props,
      l = props.elseifs.length;

    tools.each(props.elseifs, (elseif, i) => {
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

  unless: (value, options) => {
    options.useUnless = true;
    return exprs['if'](value, options);
  },

  each: (list, options) => {
    let useString = options.useString,
      ret;

    if (list) {
      if (useString) {
        ret = '';
      } else {
        ret = [];
      }

      const props = options.props;
      tools.each(list, (item, index, len) => {
        let param = {
          data: item,
          index: index,
          fallback: true
        };

        if (props && props.moreValues) {
          param.extra = {
            '@first': index === 0,
            '@last': index === len - 1,
            '@length': len
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
  prop: (name, options) => {
    let ret = options.result(), //Get parameter value
      value;

    if (ret !== undefined) {
      value = ret;
    } else { //Match to Similar to "checked" or "disabled" attribute.
      value = !options.useString ? true : name;
    }

    options.exProps[options.outputH ? tranData.fixPropName(name) : name] = value;
  },

  //Spread parameters
  spread: (props, options) => {
    tools.each(props, (v, k) => {
      options.exProps[k] = v;
    }, false, false);
  },

  'for': (start, end, options) => {
    if (end._njOpts) {
      options = end;
      end = start;
      start = 0;
    }

    let ret, useString = options.useString;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; start <= end; start++) {
      let retI = options.result({
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

  obj: options => options.props,

  list: function() {
    let args = arguments,
      last = args.length - 1,
      options = args[last];

    if(last > 0) {
      let ret = tools.arraySlice(args, 0, last);
      if(options.useString) {
        ret = ret.join('');
      }

      return ret;
    }
    else {
      return [options.result()];
    }
  },

  block: options => options.result(),

  pre: options => exprs.block(options),

  'with': function (originalData, options) {
    const props = options.props;

    return options.result({
      data: props && props.as ? {
        [props.as]: originalData
      } : originalData
    });
  },

  arg: (options) => {
    const { exProps } = options;
    if(!exProps.args) {
      exProps.args = [];
    }

    exProps.args.push(options.result());
  },
};

function _commonConfig(params) {
  let ret = {
    useString: true,
    exProps: false,
    isProp: false,
    subExProps: false,
    isSub: false,
    newContext: true
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

export const extensions = exprs;

//Expression default config
export const exprConfig = {
  'if': _commonConfig({ newContext: false }),
  'else': _commonConfig({ newContext: false, useString: false, subExProps: true, isSub: true }),
  'switch': _commonConfig({ newContext: false }),
  unless: _commonConfig({ newContext: false }),
  each: _commonConfig(),
  prop: _commonConfig({ newContext: false, exProps: true, subExProps: true, isProp: true }),
  spread: _commonConfig({ newContext: false, useString: false, exProps: true, subExProps: true, isProp: true }),
  'for': _commonConfig(),
  obj: _commonConfig({ newContext: false, useString: false }),
  'with': _commonConfig({ useString: false })
};
exprConfig.elseif = _commonConfig(exprConfig['else']);
exprConfig.list = _commonConfig(exprConfig.if);
exprConfig.block = _commonConfig(exprConfig.obj);
exprConfig.pre = _commonConfig(exprConfig.obj);
exprConfig.arg = _commonConfig(exprConfig.prop);

//Expression alias
exprs['case'] = exprs.elseif;
exprConfig['case'] = exprConfig.elseif;
exprs['default'] = exprs['else'];
exprConfig['default'] = exprConfig['else'];

export const extensionConfig = exprConfig;

//Register expression and also can batch add
export function registerExpr(name, expr, options) {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      expr: expr,
      options: options
    };
  }

  tools.each(params, function(v, name) {
    if (v) {
      const { expr, options } = v;

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

export const registerExtension = registerExpr;

tools.assign(nj, {
  exprs,
  exprConfig,
  registerExpr,
  extensions,
  extensionConfig,
  registerExtension
});