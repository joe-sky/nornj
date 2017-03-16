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

  block: options => options.result(),

  pre: options => extensions.block(options),

  'with': function(originalData, options) {
    const props = options.props;

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
    let cacheObj;
    if (props && props.cacheTo != null) {
      cacheObj = props.cacheTo;
    } else {
      cacheObj = options.global;
    }

    let cacheKey = '_njOnceCache_' + options._njFnsNo,
      cache = cacheObj[cacheKey],
      useCache;

    if (props && (props.reset !== undefined || props.resetList !== undefined)) {
      let { reset, resetList } = props;
      let cacheValKey = cacheKey + 'V';
      useCache = true;

      if (reset !== undefined) {
        resetList = [reset];
      }
      resetList.forEach((r, i) => {
        let key = cacheValKey + i,
          cacheVal = cacheObj[key];

        if (cacheVal !== r) {
          useCache = false;
          cacheObj[key] = r;
        }
      });
    } else {
      useCache = cache !== undefined;
    }

    if (!useCache) {
      cache = cacheObj[cacheKey] = options.result();
    }
    return cache;
  }
};

function _eConfig(params) {
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

//Expression default config
export const extensionConfig = {
  'if': _eConfig({ newContext: false }),
  'else': _eConfig({ newContext: false, useString: false, subExProps: true, isSub: true }),
  'switch': _eConfig({ newContext: false }),
  unless: _eConfig({ newContext: false }),
  each: _eConfig(),
  prop: _eConfig({ newContext: false, exProps: true, subExProps: true, isProp: true }),
  spread: _eConfig({ newContext: false, useString: false, exProps: true, subExProps: true, isProp: true }),
  'for': _eConfig(),
  obj: _eConfig({ newContext: false, useString: false }),
  'with': _eConfig({ useString: false })
};
extensionConfig.elseif = _eConfig(extensionConfig['else']);
extensionConfig.list = _eConfig(extensionConfig.if);
extensionConfig.block = _eConfig(extensionConfig.obj);
extensionConfig.pre = _eConfig(extensionConfig.obj);
extensionConfig.arg = _eConfig(extensionConfig.prop);
extensionConfig.once = _eConfig(extensionConfig.obj);

//Expression alias
extensions['case'] = extensions.elseif;
extensionConfig['case'] = extensionConfig.elseif;
extensions['default'] = extensions['else'];
extensionConfig['default'] = extensionConfig['else'];

//Register expression and also can batch add
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
      extensionConfig[name] = _eConfig(options);
    }
  }, false, false);
}

tools.assign(nj, {
  extensions,
  extensionConfig,
  registerExtension
});