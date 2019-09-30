/**
 * React(or other such as Preact) components.
 */
export interface NornJComponent { }

/**
 * NornJ filter options.
 */
export interface FilterOption {
  onlyGlobal: boolean;
  hasOptions: boolean;
  isOperator: boolean;
  hasLevel: boolean;
  hasTmplCtx: boolean;
  alias: string;
  symbol: string;
  placeholder: string;
  [key: string]: any;
}

/**
 * NornJ filter configs.
 */
export interface FilterConfig {
  [key: string]: FilterOption;
}

/**
 * NornJ template engine.
 */
export interface NornJ {
  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  registerComponent(name: string, component: NornJComponent, options?: object): NornJComponent | NornJComponent[];

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  registerComponent(options: object): NornJComponent | NornJComponent[];

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  registerFilter(name: string, filter: Function, options?: FilterOption, mergeConfig?: boolean): void;

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  registerFilter(options: object): void;

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  registerExtension(name: string, extension: Function, options?: object, mergeConfig?: boolean): void;

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  registerExtension(options: object): void;

  /**
   * `nj.taggedTmpl`, NornJ tagged templates syntax `njs`.
   */
  taggedTmpl(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  taggedTmplH(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.template`, NornJ tagged templates syntax `t`.
   */
  template(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.expression`, NornJ tagged templates syntax `n`.
   */
  expression(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.css`, NornJ tagged templates syntax `s`.
   */
  css(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.components`.
   */
  components: object;

  /**
   * `nj.componentConfig`.
   */
  componentConfig: object;

  /**
   * `nj.filters`.
   */
  filters: object;

  /**
   * `nj.filterConfig`.
   */
  filterConfig: FilterConfig;

  /**
   * `nj.extensions`.
   */
  extensions: object;

  /**
   * `nj.extensionConfig`.
   */
  extensionConfig: object;
}
