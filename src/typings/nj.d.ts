/**
 * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
 * 
 * `nj'<html>Hello World!</html>'()`
 */
export namespace NornJ {
  /**
   * React(or other such as Preact) components.
   */
  export type Component = React.ElementType;

  /**
   * Properties of React(or other such as Preact) components.
   */
  export interface ComponentProps {
    [name: string]: any;
  }

  export interface HelperDelegate<T> {
    (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, options?: T): any;
  }

  export interface FilterDelegateOption {
    _njOpts: number,
    useString?: boolean,
    global?: object,
    context?: object,
    outputH?: boolean,
    level?: number
  }

  export type FilterDelegate = HelperDelegate<FilterDelegateOption>;

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

  export const filters: { [name: string]: FilterDelegate };

  export const filterConfig: { [name: string]: FilterOption };

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  export function registerFilter(name: string, filter: FilterDelegate, options?: FilterOption, mergeConfig?: boolean): void;

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  export function registerFilter(options: object): void;

  export interface ExtensionDelegateOption extends FilterDelegateOption {
    name?: string;
    tagName?: Component;
    setTagName?(c: Component): void;
    tagProps?: ComponentProps;
    props?: ComponentProps;
    value?: Function;
    children?: Function;
  }

  export type ExtensionDelegate = HelperDelegate<ExtensionDelegateOption>;

  export interface ExtensionOption {
    onlyGlobal: boolean;
    useString: boolean;
    newContext: boolean;
    isSubTag: boolean;
    isDirective: boolean;
    isBindable: boolean;
    useExpressionInProps: boolean;
    hasName: boolean;
    noTagName: boolean;
    hasTagProps: boolean;
    hasTmplCtx: boolean;
    hasOutputH: boolean;
    [key: string]: any;
  }

  export const extensions: { [name: string]: ExtensionDelegate };

  export const extensionConfig: { [name: string]: ExtensionOption };

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  export function registerExtension(name: string, extension: ExtensionDelegate, options?: ExtensionOption, mergeConfig?: boolean): void;

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  export function registerExtension(options: object): void;

  export const components: { [name: string]: Component };

  export const componentConfig: object;

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  export function registerComponent(name: string, component: Component, options?: object): Component | Component[];

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  export function registerComponent(options: object): Component | Component[];

  /**
   * `nj.taggedTmpl`, NornJ tagged templates syntax `njs`.
   */
  export function taggedTmpl(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  export function taggedTmplH(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.template`, NornJ tagged templates syntax `t`.
   */
  export function template(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.expression`, NornJ tagged templates syntax `n`.
   */
  export function expression(strs: TemplateStringsArray, ...args: any);

  /**
   * `nj.css`, NornJ tagged templates syntax `s`.
   */
  export function css(strs: TemplateStringsArray, ...args: any);
}

declare module 'nornj/dist/nornj.common' {
  export = NornJ;
  export default NornJ;
}

declare module 'nornj/lib/*';