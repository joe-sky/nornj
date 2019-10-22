/**
 * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
 * 
 * `nj'<html>Hello World!</html>'()`
 */
declare namespace NornJ {
  /**
   * React(or other such as Preact) components.
   */
  export type Component = string | React.ElementType;

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
    changeEventName?: string;
    needToJS?: boolean;
    [key: string]: any;
  }

  export const components: { [name: string]: Component };

  export const componentConfig: { [name: string]: ComponentOption };

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  export function registerComponent(name: string, component: Component, options?: ComponentOption): Component | Component[];

  /**
   * `nj.registerComponent`, register component to NornJ.
   */
  export function registerComponent(options: { [name: string]: Component | { component?: Component, options?: ComponentOption } }): Component | Component[];

  export function getComponentConfig(name: string): ComponentOption;

  export function copyComponentConfig(component: Component, from: Component): Component;

  export namespace Template {
    interface Global {
      tmplKey: string;
      [key: string]: any;
    }

    interface Data {
      components?: Component | Component[];
      [key: string]: any;
    }

    interface Context {
      /**
       * React(or other such as Preact) component instance.
       */
      $this: {
        [key: string]: any;
      };

      data: Data[] | any[];
      parent: Context;
      index: number;
      item: any;
      [key: string]: any;
    }

    interface ChildrenParams {
      data?: Data[] | any[];
      index?: number;
      item?: any;
      newParent?: boolean;
      [key: string]: any;
    }

    interface RenderChildren {
      (params?: ChildrenParams): string | JSX.Element;
    }
  }

  export interface FilterDelegateOption {
    _njOpts: number,
    useString?: boolean,
    global?: Template.Global,
    context?: Template.Context,
    outputH?: boolean,
    level?: number
  }

  export interface FilterDelegate {
    (...args?: any[]): any;
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

  export const filters: { [name: string]: FilterDelegate };

  export const filterConfig: { [name: string]: FilterOption };

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  export function registerFilter(name: string, filter: FilterDelegate, options?: FilterOption, mergeConfig?: boolean): void;

  /**
   * `nj.registerFilter`, register filter and expression to NornJ.
   */
  export function registerFilter(options: { [name: string]: FilterDelegate | { filter?: FilterDelegate, options?: FilterOption } }): void;

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

  export interface ExtensionDelegateMultiParams extends FilterDelegate { }

  export interface ExtensionOption {
    onlyGlobal?: boolean;
    useString?: boolean;
    newContext?: boolean;
    isSubTag?: boolean;
    isDirective?: boolean;
    isBindable?: boolean;
    useExpressionInProps?: boolean;
    hasName?: boolean;
    noTagName?: boolean;
    hasTagProps?: boolean;
    hasTmplCtx?: boolean;
    hasOutputH?: boolean;
    [key: string]: any;
  }

  export const extensions: { [name: string]: ExtensionDelegate | ExtensionDelegateMultiParams };

  export const extensionConfig: { [name: string]: ExtensionOption };

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  export function registerExtension<T extends ExtensionDelegate>(name: string, extension: T, options?: ExtensionOption, mergeConfig?: boolean): void;

  /**
   * `nj.registerExtension`, register tag and directive to NornJ.
   */
  export function registerExtension<T extends ExtensionDelegate>(options: { [name: string]: T | { extension?: T, options?: ExtensionOption } }): void;

  /**
   * `nj.taggedTmpl`, NornJ tagged templates syntax `njs`.
   */
  export function taggedTmpl(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
   */
  export function taggedTmplH(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.template`, NornJ tagged templates syntax `t`.
   */
  export function template(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.expression`, NornJ tagged templates syntax `n`.
   */
  export function expression(strs: TemplateStringsArray, ...args: any[]);

  /**
   * `nj.css`, NornJ tagged templates syntax `s`.
   */
  export function css(strs: TemplateStringsArray, ...args: any[]);
}

declare module 'nornj' {
  export = NornJ;
  export default NornJ;
}

declare module 'nornj/dist/nornj.common' {
  export = NornJ;
  export default NornJ;
}

declare module 'nornj/lib/*';