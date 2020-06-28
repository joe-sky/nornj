import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';
import { ExtensionDelegate, ExtensionDelegateMultiParams, ExtensionPrefixConfig, ExtensionOption } from '../interface';

//Global extension list
export const extensions: { [name: string]: ExtensionDelegate | ExtensionDelegateMultiParams } = {
  if: (value, options) => {
    if (value && value._njOpts) {
      options = value;
      value = options.props.condition;
    }
    if (value === 'false') {
      value = false;
    }

    let ret;
    const props = options.props;
    if (value) {
      ret = ((props && props.then) || options.children)();
    } else if (props) {
      const elseFn = props['else'];

      if (props.elseifs) {
        const l = props.elseifs.length;
        tools.each(
          props.elseifs,
          (elseif, i) => {
            if (elseif.value) {
              ret = elseif.fn();
              return false;
            } else if (i === l - 1) {
              if (elseFn) {
                ret = elseFn();
              }
            }
          },
          true
        );
      } else {
        if (elseFn) {
          ret = elseFn();
        }
      }
    }

    if (options.useString && ret == null) {
      return '';
    }

    return ret;
  },

  then: options => (options.tagProps.then = options.children),

  else: options => (options.tagProps['else'] = options.children),

  elseif: (value, options) => {
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

  switch: (value, options) => {
    if (value && value._njOpts) {
      options = value;
      value = options.props.value;
    }

    let ret;
    const props = options.props,
      elseifs = props.elseifs || [{}],
      l = elseifs.length;

    tools.each(
      elseifs,
      (elseif, i) => {
        if (value === elseif.value) {
          ret = elseif.fn();
          return false;
        } else if (i === l - 1) {
          if (props['else']) {
            ret = props['else']();
          }
        }
      },
      true
    );

    return ret;
  },

  each: (list, options) => {
    if (list && list._njOpts) {
      options = list;
      list = options.props.of;
    }

    const useString = options.useString,
      props = options.props;
    let ret;

    if (list) {
      if (useString) {
        ret = '';
      } else {
        ret = [];
      }

      const isArrayLike = tools.isArrayLike(list);
      const isArrayLoop = isArrayLike || tools.isSet(list) || tools.isWeakSet(list);

      tools.each(
        list,
        (item, index, len, lenObj) => {
          const param = {
            data: [item],
            index: isArrayLoop ? index : len,
            item,
            newParent: true
          };

          const _len = isArrayLoop ? len : lenObj;
          const extra = {
            '@first': param.index === 0,
            '@last': param.index === _len - 1
          };

          if (!isArrayLoop) {
            extra['@key'] = index;
          }
          param.data.push(extra);

          const retI = options.children(param);
          if (useString) {
            ret += retI;
          } else {
            ret.push(retI);
          }
        },
        isArrayLike
      );

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
    const ret = options.value(); //Get parameter value
    let value;

    if (ret !== undefined) {
      value = ret;
    } else {
      //Match to Similar to "checked" or "disabled" attribute.
      value = !options.useString ? true : name;
    }

    options.tagProps[options.outputH ? tranData.fixPropName(name) : name] = value;
  },

  //Spread parameters
  spread: (props, options) => {
    const { tagProps } = options;
    tools.each(
      props,
      (v, k) => {
        tagProps[k] === undefined && (options.tagProps[k] = v);
      },
      false
    );
  },

  show: options => {
    if (!options.value()) {
      const { tagProps, useString } = options;

      if (!tagProps.style) {
        tagProps.style = useString ? '' : {};
      }
      if (useString) {
        tagProps.style += (tagProps.style ? ';' : '') + 'display:none';
      } else if (tools.isArray(tagProps.style)) {
        tagProps.style.push({ display: 'none' });
      } else {
        tagProps.style.display = 'none';
      }
    }
  },

  obj: options => options.props,

  block: options => options.children(),

  with: function(originalData, options) {
    if (originalData && originalData._njOpts) {
      options = originalData;

      return options.children({
        data: [options.props]
      });
    } else {
      const { props } = options;

      return options.children({
        data: [
          props && props.as
            ? {
                [props.as]: originalData
              }
            : originalData
        ]
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

function _config(params?: ExtensionOption, extra?: ExtensionOption): ExtensionOption {
  let ret: ExtensionOption = {
    onlyGlobal: false,
    useString: false,
    newContext: true,
    isSubTag: false,
    isDirective: false,
    isBindable: false,
    useExpressionInProps: false,
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

const _defaultCfg: ExtensionOption = {
  onlyGlobal: true,
  newContext: false,
  hasName: false,
  hasTagProps: false,
  hasTmplCtx: false
};

const _defaultCfgExpInProps = _config(_defaultCfg, { useExpressionInProps: true });

//Extension default config
export const extensionConfig: { [name: string]: ExtensionOption } = {
  if: _config(_defaultCfgExpInProps),
  else: _config(_defaultCfgExpInProps, { isSubTag: true, hasTagProps: true }),
  switch: _config(_defaultCfgExpInProps, { needPrefix: ExtensionPrefixConfig.onlyLowerCase }),
  each: _config(_defaultCfgExpInProps, {
    newContext: {
      item: 'item',
      index: 'index',
      data: {
        first: ['@first', 'first'],
        last: ['@last', 'last'],
        $key: ['@key', 'key']
      }
    }
  }),
  prop: _config(_defaultCfg, { isDirective: true, needPrefix: true, hasTagProps: true }),
  obj: _config(_defaultCfg, { needPrefix: true }),
  with: _config(_defaultCfg, { newContext: { getDataFromProps: true } }),
  style: { needPrefix: true }
};
extensionConfig.then = _config(extensionConfig['else']);
extensionConfig.elseif = _config(extensionConfig['else']);
extensionConfig.spread = _config(extensionConfig.prop);
extensionConfig.block = _config(extensionConfig.obj);
extensionConfig.arg = _config(extensionConfig.prop);
extensionConfig.show = _config(extensionConfig.prop, { useExpressionInProps: true, noTagName: true, hasOutputH: true });
extensionConfig.css = _config(extensionConfig.obj);

//Extension alias
extensions['for'] = extensions.each;
extensionConfig['for'] = _config(extensionConfig.each);
extensions['case'] = extensions.elseif;
extensionConfig['case'] = _config(extensionConfig.elseif);
extensions.empty = extensions['default'] = extensions['else'];
extensionConfig.empty = _config(extensionConfig['else']);
extensionConfig['default'] = _config(extensionConfig['else']);
extensions.strProp = extensions.prop;
extensionConfig.strProp = _config(extensionConfig.prop, { useString: true });
extensions.strArg = extensions.arg;
extensionConfig.strArg = _config(extensionConfig.strProp);
extensions.pre = extensions.block;
extensionConfig.pre = _config(extensionConfig.block);

export function registerExtension<T extends ExtensionDelegate>(options: {
  [name: string]: T | { extension?: T; options?: ExtensionOption };
}): void;
export function registerExtension<T extends ExtensionDelegate>(
  name: string,
  extension: T,
  options?: ExtensionOption,
  mergeConfig?: boolean
): void;
export function registerExtension<T extends ExtensionDelegate>(
  name,
  extension?: T,
  options?: ExtensionOption,
  mergeConfig?: boolean
): void {
  let params = name;
  if (!tools.isObject(name)) {
    params = {};
    params[name] = {
      extension,
      options
    };
  }

  tools.each(
    params,
    function(v, name) {
      if (v) {
        const { extension, options }: { extension: T; options: ExtensionOption } = v;

        if (extension) {
          extensions[name] = extension;
        } else if (!mergeConfig) {
          extensions[name] = v;
        }

        if (mergeConfig) {
          if (!extensionConfig[name]) {
            extensionConfig[name] = _config();
          }
          if (tools.isObject(options)) {
            tools.assign(extensionConfig[name], options);
          } else {
            extensionConfig[name] = _config();
          }
        } else {
          extensionConfig[name] = _config(options);
        }
      }
    },
    false
  );
}

tools.assign(nj, {
  extensions,
  extensionConfig,
  registerExtension
});
