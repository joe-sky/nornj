import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';

//Global extension list
export const extensions = {
  'if': (value, options) => {
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition;
    }
    if (value === 'false') {
      value = false;
    }

    let ret;
    if (!!value) {
      ret = options.children();
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

  'else': options => options.subExProps['else'] = options.children,

  'elseif': (value, options) => {
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition || options.props.value;
    }

    const exProps = options.subExProps;
    if (!exProps.elseifs) {
      exProps.elseifs = [];
    }
    exProps.elseifs.push({
      value,
      fn: options.children
    });
  },

  'switch': (value, options) => {
    if (value && value._njOpts) {
      options = value;
      value = options.props.value;
    }

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

  each: (list, options) => {
    if (list && list._njOpts) {
      options = list;
      list = options.props.of;
    }

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
          data: [item],
          index: isArrayLike ? index : len,
          item,
          fallback: true
        };

        let extra;
        const _len = isArrayLike ? len : lenObj;
        extra = {
          '@first': param.index === 0,
          '@last': param.index === _len - 1
        };

        if (!isArrayLike) {
          if (!extra) {
            extra = {};
          }
          extra['@key'] = index;
        }
        if (extra) {
          param.data.push(extra);
        }

        let retI = options.children(param);
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
    let ret = options.children(), //Get parameter value
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
    if (!options.value()) {
      const {
        attrs,
        useString
      } = options;

      if (!attrs.style) {
        attrs.style = useString ? '' : {};
      }
      if (useString) {
        attrs.style += (attrs.style ? ';' : '') + 'display:none';
      }
      else if (tools.isArray(attrs.style)) {
        attrs.style.push({ display: 'none' });
      }
      else {
        attrs.style.display = 'none';
      }
    }
  },

  'for': (i, to, options) => {
    let step = 1;
    let indexKey;

    if (i && i._njOpts) {
      options = i;
      const { props } = options;
      Object.keys(props).forEach(prop => {
        const value = props[prop];
        if (prop === 'to') {
          to = value;
        }
        else if (prop === 'step') {
          step = value;
        }
        else {
          i = value;
          indexKey = prop;
        }
      });
    }
    else if (options.props) {
      step = options.props.step || 1;
    }

    let ret, useString = options.useString;
    if (useString) {
      ret = '';
    } else {
      ret = [];
    }

    for (; i <= to; i += step) {
      let retI = options.children({
        data: indexKey ? [{ [indexKey]: i }] : null,
        index: i,
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

  list: function () {
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
      return [options.children()];
    }
  },

  fn: options => {
    const { props } = options;

    return function () {
      let params;
      if (props) {
        params = {};

        const paramNames = Object.keys(props);
        paramNames.forEach((v, i) => params[paramNames[i]] = arguments[i]);
      }

      return options.children({ data: [params] });
    };
  },

  block: options => options.children(),

  'with': function (originalData, options) {
    if (originalData && originalData._njOpts) {
      options = originalData;

      return options.children({
        data: [options.props]
      });
    }
    else {
      const { props } = options;

      return options.children({
        data: [props && props.as ? {
          [props.as]: originalData
        } : originalData]
      });
    }
  },

  arg: options => {
    const { exProps } = options;
    if (!exProps.args) {
      exProps.args = [];
    }

    exProps.args.push(options.children());
  },

  css: options => options.props.style
};

function _config(params, extra) {
  let ret = {
    onlyGlobal: false,
    useString: false,
    newContext: true,
    exProps: false,
    isProp: false,
    subExProps: false,
    isSub: false,
    addSet: false,
    useExpressionInJsx: 'onlyTemplateLiteral',
    hasName: true,
    noTagName: false,
    hasAttrs: true,
    hasTmplCtx: true,
    hasOutputH: false
  };

  if (params) {
    ret = tools.assign(ret, params);
  }
  if (extra) {
    ret = tools.assign(ret, extra);
  }
  return ret;
}

const _defaultCfg = { onlyGlobal: true, newContext: false, hasName: false, hasAttrs: false, hasTmplCtx: false };

//Extension default config
export const extensionConfig = {
  'if': _config(_defaultCfg),
  'else': _config(_defaultCfg, { subExProps: true, isSub: true }),
  'switch': _config(_defaultCfg, { needPrefix: 'onlyUpperCase' }),
  each: _config(_defaultCfg, {
    newContext: {
      item: 'item',
      index: 'index',
      datas: {
        first: ['@first', 'first'],
        last: ['@last', 'last']
      }
    }
  }),
  'for': _config(_defaultCfg, {
    newContext: {
      index: 'index',
      getDatasFromProp: { except: ['to', 'step', 'index'] }
    }
  }),
  prop: _config(_defaultCfg, { exProps: true, subExProps: true, isProp: true, needPrefix: true }),
  obj: _config(_defaultCfg, { needPrefix: true }),
  fn: _config(_defaultCfg, { newContext: true, needPrefix: true }),
  'with': _config(_defaultCfg, { newContext: { getDatasFromProp: true } }),
  style: { useExpressionInJsx: false, needPrefix: true }
};
extensionConfig.elseif = _config(extensionConfig['else']);
extensionConfig.spread = _config(extensionConfig.prop);
extensionConfig.list = _config(extensionConfig.obj);
extensionConfig.block = _config(extensionConfig.obj);
extensionConfig.pre = _config(extensionConfig.obj);
extensionConfig.arg = _config(extensionConfig.prop);
extensionConfig.show = _config(extensionConfig.prop, { isDirective: true, noTagName: true, hasAttrs: true, hasOutputH: true });
extensionConfig.css = _config(extensionConfig.obj);

//Extension alias
extensions['case'] = extensions.elseif;
extensionConfig['case'] = extensionConfig.elseif;
extensions['empty'] = extensions['default'] = extensions['else'];
extensionConfig['empty'] = extensionConfig['default'] = extensionConfig['else'];
extensions.strProp = extensions.prop;
extensionConfig.strProp = _config(extensionConfig.prop, { useString: true });
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);
extensions.pre = extensions.block;
extensionConfig.pre = extensionConfig.block;

//Register extension and also can batch add
export function registerExtension(name, extension, options, mergeConfig) {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      extension,
      options
    };
  }

  tools.each(params, function (v, name) {
    if (v) {
      const { extension, options } = v;

      if (extension) {
        extensions[name] = extension;
      } else if (!mergeConfig) {
        extensions[name] = v;
      }

      if (mergeConfig) {
        if (!extensionConfig[name]) {
          extensionConfig[name] = _config();
        }
        tools.assign(extensionConfig[name], options);
      }
      else {
        extensionConfig[name] = _config(options);
      }
    }
  }, false, false);
}

tools.assign(nj, {
  extensions,
  extensionConfig,
  registerExtension
});