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
          }, true);
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

  'else': options => options.tagProps['else'] = options.children,

  'elseif': (value, options) => {
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition || options.props.value;
    }

    const { tagProps } = options;
    if (!tagProps.elseifs) {
      tagProps.elseifs = [];
    }
    tagProps.elseifs.push({
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
    }, true);

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
      }, isArrayLike);

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
    let ret = options.value(), //Get parameter value
      value;

    if (ret !== undefined) {
      value = ret;
    } else { //Match to Similar to "checked" or "disabled" attribute.
      value = !options.useString ? true : name;
    }

    options.tagProps[options.outputH ? tranData.fixPropName(name) : name] = value;
  },

  //Spread parameters
  spread: (props, options) => {
    const { tagProps } = options;
    tools.each(props, (v, k) => {
      tagProps[k] === undefined && (options.tagProps[k] = v);
    }, false);
  },

  show: options => {
    if (!options.value()) {
      const {
        tagProps,
        useString
      } = options;

      if (!tagProps.style) {
        tagProps.style = useString ? '' : {};
      }
      if (useString) {
        tagProps.style += (tagProps.style ? ';' : '') + 'display:none';
      }
      else if (tools.isArray(tagProps.style)) {
        tagProps.style.push({ display: 'none' });
      }
      else {
        tagProps.style.display = 'none';
      }
    }
  },

  obj: options => options.props,

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
    const { tagProps } = options;
    if (!tagProps.args) {
      tagProps.args = [];
    }

    tagProps.args.push(options.value());
  },

  css: options => options.props.style
};

function _config(params, extra) {
  let ret = {
    onlyGlobal: false,
    useString: false,
    newContext: true,
    isSubTag: false,
    isDirective: false,
    addSet: false,
    useExpressionInJsx: 'onlyTemplateLiteral',
    hasName: true,
    noTagName: false,
    hasTagProps: true,
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

const _defaultCfg = { onlyGlobal: true, newContext: false, hasName: false, hasTagProps: false, hasTmplCtx: false };

//Extension default config
export const extensionConfig = {
  'if': _config(_defaultCfg),
  'else': _config(_defaultCfg, { isSubTag: true, hasTagProps: true }),
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
  prop: _config(_defaultCfg, { isDirective: true, needPrefix: true, hasTagProps: true }),
  obj: _config(_defaultCfg, { needPrefix: true }),
  'with': _config(_defaultCfg, { newContext: { getDatasFromProp: true } }),
  style: { useExpressionInJsx: false, needPrefix: true }
};
extensionConfig.elseif = _config(extensionConfig['else']);
extensionConfig.spread = _config(extensionConfig.prop);
extensionConfig.block = _config(extensionConfig.obj);
extensionConfig.arg = _config(extensionConfig.prop);
extensionConfig.show = _config(extensionConfig.prop, { noTagName: true, hasOutputH: true });
extensionConfig.css = _config(extensionConfig.obj);

//Extension alias
extensions['for'] = extensions.each;
extensionConfig['for'] = _config(extensionConfig.each);
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
  }, false);
}

tools.assign(nj, {
  extensions,
  extensionConfig,
  registerExtension
});