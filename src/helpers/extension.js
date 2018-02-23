import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';

//Global extension list
export const extensions = {
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
    return extensions['if'](value, options);
  },

  each: (list, options) => {
    let useString = options.useString,
      props = options.props,
      ret;

    if (list) {
      if (useString) {
        ret = '';
      } else {
        ret = [];
      }

      const isArrayLike = tools.isArrayLike(list);
      tools.each(list, (item, index, len, lenObj) => {
        let param = {
          data: item,
          index: isArrayLike ? index : len,
          fallback: true
        };

        if (props && props.moreValues) {
          const _len = isArrayLike ? len : lenObj;
          param.extra = {
            '@first': param.index === 0,
            '@last': param.index === _len - 1,
            '@length': _len
          };
        }
        if (!isArrayLike) {
          if (!param.extra) {
            param.extra = {};
          }
          param.extra['@key'] = index;
        }

        let retI = options.result(param);
        if (useString) {
          ret += retI;
        } else {
          ret.push(retI);
        }
      }, false, isArrayLike);

      //Return null when not use string and result is empty.
      if (!useString && !ret.length) {
        ret = null;
      }

      if ((!ret || !ret.length) && props && props['else']) {
        ret = props['else']();
      }
    } else {
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

  show: options => {
    if (!options.result()) {
      options.exProps.style = options.useString ? 'display:none' : { display: 'none' };
    }
  },

  'for': (start, end, options) => {
    if (end._njOpts) {
      options = end;
      end = start;
      start = 0;
    }

    let ret, useString = options.useString,
      props = options.props,
      loopLast = props && props.loopLast;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; start <= end; start++) {
      if (!loopLast && start === end) {
        break;
      }

      let retI = options.result({
        index: start,
        fallback: true
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

    if (last > 0) {
      let ret = tools.arraySlice(args, 0, last);
      if (options.useString) {
        ret = ret.join('');
      }

      return ret;
    } else {
      return [options.result()];
    }
  },

  fn: options => {
    const { props } = options;

    return function() {
      let params;
      if (props) {
        params = {};

        const paramNames = Object.keys(props);
        paramNames.forEach((v, i) => params[paramNames[i]] = arguments[i]);
      }

      return options.result({ data: params });
    };
  },

  block: options => options.result(),

  pre: options => extensions.block(options),

  'with': function(originalData, options) {
    const { props } = options;

    return options.result({
      data: props && props.as ? {
        [props.as]: originalData
      } : originalData
    });
  },

  arg: options => {
    const { exProps } = options;
    if (!exProps.args) {
      exProps.args = [];
    }

    exProps.args.push(options.result());
  },

  once: options => {
    const { props } = options;
    let cacheObj = options.context.root || options.context,
      cacheKey = '_njOnceCache_' + (props && props.cacheKey != null ? props.cacheKey : options._njFnsNo),
      cache = cacheObj[cacheKey];

    if (cache === undefined) {
      cache = cacheObj[cacheKey] = options.result();
    }
    return cache;
  }
};

function _config(params) {
  let ret = {
    onlyGlobal: false,
    useString: false,
    newContext: true,
    exProps: false,
    isProp: false,
    subExProps: false,
    isSub: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  return ret;
}

const _defaultCfg = { onlyGlobal: true, newContext: false };

//Extension default config
export const extensionConfig = {
  'if': _config(_defaultCfg),
  'else': _config({ onlyGlobal: true, newContext: false, subExProps: true, isSub: true }),
  'switch': _config(_defaultCfg),
  unless: _config(_defaultCfg),
  each: _config({ onlyGlobal: true }),
  prop: _config({ onlyGlobal: true, newContext: false, exProps: true, subExProps: true, isProp: true }),
  spread: _config({ onlyGlobal: true, newContext: false, exProps: true, subExProps: true, isProp: true }),
  obj: _config({ onlyGlobal: true, newContext: false }),
  list: _config(_defaultCfg),
  fn: _config({ onlyGlobal: true }),
  'with': _config({ onlyGlobal: true })
};
extensionConfig.elseif = _config(extensionConfig['else']);
extensionConfig['for'] = _config(extensionConfig.each);
extensionConfig.block = _config(extensionConfig.obj);
extensionConfig.pre = _config(extensionConfig.obj);
extensionConfig.arg = _config(extensionConfig.prop);
extensionConfig.once = _config(extensionConfig.obj);
extensionConfig.show = _config(extensionConfig.prop);

//Extension alias
extensions['case'] = extensions.elseif;
extensionConfig['case'] = extensionConfig.elseif;
extensions['empty'] = extensions['default'] = extensions['else'];
extensionConfig['empty'] = extensionConfig['default'] = extensionConfig['else'];
extensions.strProp = extensions.prop;
extensionConfig.strProp = tools.assign(_config(extensionConfig.prop), { useString: true });
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);

//Register extension and also can batch add
export function registerExtension(name, extension, options) {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      extension,
      options
    };
  }

  tools.each(params, function(v, name) {
    if (v) {
      const { extension, options } = v;

      if (extension) {
        extensions[name] = extension;
      } else {
        extensions[name] = v;
      }
      extensionConfig[name] = _config(options);
    }
  }, false, false);
}

tools.assign(nj, {
  extensions,
  extensionConfig,
  registerExtension
});