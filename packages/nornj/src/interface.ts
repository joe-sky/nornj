export type ElementType<P = any> =
  | {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never;
    }[keyof JSX.IntrinsicElements]
  | React.ComponentType<P>;

/**
 * React(or other such as Preact) components.
 */
export type Component = string | ElementType;

/**
 * Properties of React(or other such as Preact) components.
 */
export interface ComponentProps {
  [name: string]: any;
}

export interface ComponentOption {
  hasEventObject?: boolean;
  targetPropName?: string;
  valuePropName?: string;
  getValueFromEvent?: Function;
  changeEventName?: string;
  needToJS?: boolean;
  [key: string]: any;
}

export interface ComponentOptionFunc {
  (...args: any[]): ComponentOption;
}

export namespace Template {
  export interface Global {
    tmplKey: string;
    [key: string]: any;
  }

  export interface Data {
    components?: Component | Component[];
    [key: string]: any;
  }

  /**
   * React(or other such as Preact) component instance.
   */
  export interface ContextThis {
    [key: string]: any;
  }

  export interface Context {
    $this: ContextThis;
    data: Data[] | any[];
    getData: typeof import('../src/transforms/transformData').getData;
    parent: Context;
    index: number;
    item: any;
    [key: string]: any;
  }

  export interface ChildrenParams {
    data?: Data[] | any[];
    index?: number;
    item?: any;
    newParent?: boolean;
    [key: string]: any;
  }

  export interface RenderChildren {
    (params?: ChildrenParams): JSX.Element | any;
  }
}

export interface FilterDelegateOption {
  _njOpts: number;
  useString?: boolean;
  global?: Template.Global;
  context?: Template.Context;
  outputH?: boolean;
  level?: number;
}

export interface FilterDelegate {
  (...args: any[]): any;
}

export interface FilterOption {
  onlyGlobal?: boolean;
  hasOptions?: boolean;
  isOperator?: boolean;
  hasLevel?: boolean;
  hasTmplCtx?: boolean;
  alias?: string;
  symbol?: string;
  placeholder?: string;
  [key: string]: any;
}

export interface ExtensionDelegateOption extends FilterDelegateOption {
  name?: string;
  tagName?: Component;
  setTagName?(tagName: Component): void;
  tagProps?: ComponentProps;
  props?: ComponentProps;
  children?: Template.RenderChildren;
  value?: Template.RenderChildren;
}

export interface ExtensionDelegate {
  (options?: ExtensionDelegateOption): any;
}

export interface ExtensionDelegateMultiParams extends FilterDelegate {}

export enum SwitchPrefixConfig {
  OnlyLowerCase = 'onlyLowerCase',
  OnlyUpperCase = 'onlyUpperCase'
}

export interface ExtensionOption {
  onlyGlobal?: boolean;
  useString?: boolean;
  newContext?: boolean | object;
  isSubTag?: boolean;
  isDirective?: boolean;
  isBindable?: boolean;
  useExpressionInProps?: boolean;
  hasName?: boolean;
  noTagName?: boolean;
  hasTagProps?: boolean;
  hasTmplCtx?: boolean;
  hasOutputH?: boolean;
  needPrefix?: boolean | SwitchPrefixConfig;
  [key: string]: any;
}

export interface ConfigOption {
  delimiters?: object;
  includeParser?: Function;
  createElement?: Function;
  outputH?: boolean;
  textMode?: boolean;
  noWsMode?: boolean;
  fixTagName?: boolean;
}

export interface Export {
  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  (strs: TemplateStringsArray, ...args: any[]): any;

  components?: typeof import('../src/helpers/component').components;

  componentConfig?: typeof import('../src/helpers/component').componentConfig;

  /**
   * `nj.registerComponent`, support to register single or batch components to the NornJ.
   */
  registerComponent?: typeof import('../src/helpers/component').registerComponent;

  getComponentConfig?: typeof import('../src/helpers/component').getComponentConfig;

  copyComponentConfig?: typeof import('../src/helpers/component').copyComponentConfig;

  filters?: typeof import('../src/helpers/filter').filters;

  filterConfig?: typeof import('../src/helpers/filter').filterConfig;

  /**
   * `nj.registerFilter`, support to register single or batch filters and expressions to the NornJ.
   */
  registerFilter?: typeof import('../src/helpers/filter').registerFilter;

  extensions?: typeof import('../src/helpers/extension').extensions;

  extensionConfig?: typeof import('../src/helpers/extension').extensionConfig;

  /**
   * `nj.registerExtension`, support to register single or batch tags and directives to the NornJ.
   */
  registerExtension?: typeof import('../src/helpers/extension').registerExtension;

  /**
   * `nj.taggedTmpl`, NornJ tagged templates syntax `njs`.
   */
  taggedTmpl?(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.htmlString`, NornJ tagged templates syntax `njs`.
   */
  htmlString?(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  taggedTmplH?(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  html?(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.template`, NornJ tagged templates syntax `t`.
   */
  template?(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.expression`, NornJ tagged templates syntax `n`.
   */
  expression?(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.css`, NornJ tagged templates syntax `s`.
   */
  css?(strs: TemplateStringsArray, ...args: any[]);

  compile?: typeof import('../src/compiler/compile').compile;

  compileH?: typeof import('../src/compiler/compile').compileH;

  precompile?: typeof import('../src/compiler/compile').precompile;

  render?: typeof import('../src/compiler/compile').render;

  renderH?: typeof import('../src/compiler/compile').renderH;

  buildRender?: typeof import('../src/compiler/compile').buildRender;

  buildRenderH?: typeof import('../src/compiler/compile').buildRenderH;

  arrayPush?: typeof import('../src/utils/tools').arrayPush;

  arraySlice?: typeof import('../src/utils/tools').arraySlice;

  isObject?: typeof import('../src/utils/tools').isObject;

  isNumber?: typeof import('../src/utils/tools').isNumber;

  isString?: typeof import('../src/utils/tools').isString;

  isArrayLike?: typeof import('../src/utils/tools').isArrayLike;

  each?: typeof import('../src/utils/tools').each;

  noop?: typeof import('../src/utils/tools').noop;

  assign?: typeof import('../src/utils/tools').assign;

  upperFirst?: typeof import('../src/utils/tools').upperFirst;

  lowerFirst?: typeof import('../src/utils/tools').lowerFirst;

  capitalize?: typeof import('../src/utils/tools').capitalize;

  config?: typeof import('../src/config').config;

  includeParser?: Function;

  createElement?: Function;

  createRegexOperators?: Function;

  createFilterAlias?: Function;

  preAsts: { [name: string]: any };

  asts: { [name: string]: any };

  templates: { [name: string]: any };

  errorTitle: string;

  tmplRule: { [name: string]: any };

  textTag: string;

  noWsTag: string;

  outputH: boolean;

  textMode: boolean;

  noWsMode: boolean;

  fixTagName: boolean;

  escape?: typeof import('../src/utils/escape').escape;

  unescape?: typeof import('../src/utils/escape').unescape;

  global: { [name: string]: any };

  default?: Export;
}
