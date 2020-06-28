/*!
 * NornJ template engine v5.2.0-rc.6
 * (c) Joe_Sky
 * Released under the MIT License.
 */
declare function escape(str: any): any;
declare function unescape(str: any): any;

declare function config(configs: ConfigOption): void;

declare const isNumber: (obj: any) => boolean;
declare const isString: (obj: any) => boolean;
declare function arrayPush(arr1: any, arr2: any): number;
declare function arraySlice(arrLike?: any, start?: number, end?: number): any[];
declare function isObject(obj: any): boolean;
declare function isArrayLike(obj: any): boolean;
declare function each(obj: any, func: Function, isArr?: boolean): void;
declare function noop(): void;
declare const assign: {
    <T, U>(target: T, source: U): T & U;
    <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
declare function upperFirst(str: string): string;
declare function lowerFirst(str: string): string;
declare function capitalize(str: string): string;

declare const compile: (tmpl: any, tmplKey: any, fileName?: string, delimiters?: object, tmplRule?: object) => any;
declare const compileH: (tmpl: any, tmplKey: any, fileName?: string, delimiters?: object, tmplRule?: object) => any;
declare function precompile(tmpl: any, outputH?: boolean, tmplRule?: object, hasAst?: boolean): {
    useString: any;
    _no: number;
    _firstNode: boolean;
} | {
    fns: {
        useString: any;
        _no: number;
        _firstNode: boolean;
    };
    ast: any;
};
declare const render: (tmpl: any, options: any) => any;
declare const renderH: (tmpl: any, options: any) => any;
declare const buildRender: (tmpl: any, params: any) => any;
declare const buildRenderH: (tmpl: any, params: any) => any;

declare const extensions: {
    [name: string]: ExtensionDelegate | ExtensionDelegateMultiParams;
};
declare const extensionConfig: {
    [name: string]: ExtensionOption;
};
declare function registerExtension<T extends ExtensionDelegate>(options: {
    [name: string]: T | {
        extension?: T;
        options?: ExtensionOption;
    };
}): void;
declare function registerExtension<T extends ExtensionDelegate>(name: string, extension: T, options?: ExtensionOption, mergeConfig?: boolean): void;

declare const filters: {
    [name: string]: FilterDelegate;
};
declare const filterConfig: {
    [name: string]: FilterOption;
};
declare function registerFilter(options: {
    [name: string]: FilterDelegate | {
        filter?: FilterDelegate;
        options?: FilterOption;
    };
}): void;
declare function registerFilter(name: string, filter: FilterDelegate, options?: FilterOption, mergeConfig?: boolean): void;

declare type ComponentOptionOrFunc = ComponentOption | ComponentOptionFunc;
declare const components: {
    [name: string]: Component;
};
declare const componentConfig: Map<Component, ComponentOptionOrFunc>;
declare function registerComponent(options: {
    [name: string]: Component | {
        component?: Component;
        options?: ComponentOptionOrFunc;
    };
}): Component | Component[];
declare function registerComponent(name: string, component: Component, options?: ComponentOptionOrFunc): Component | Component[];
declare function getComponentConfig(name: Component): ComponentOptionOrFunc;
declare function copyComponentConfig(component: Component, from: Component): Component;

declare function getData(this: Template.Context | void, prop: any, data: any, hasSource?: any): any;

declare type ElementType<P = any> = {
    [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never;
}[keyof JSX.IntrinsicElements] | React.ComponentType<P>;
/**
 * React(or other such as Preact) components.
 */
declare type Component = string | ElementType;
/**
 * Properties of React(or other such as Preact) components.
 */
interface ComponentProps {
    [name: string]: any;
}
interface ComponentOption {
    hasEventObject?: boolean;
    targetPropName?: string;
    valuePropName?: string;
    getValueFromEvent?: Function;
    changeEventName?: string;
    needToJS?: boolean;
    [key: string]: any;
}
interface ComponentOptionFunc {
    (...args: any[]): ComponentOption;
}
declare namespace Template {
    interface Global {
        tmplKey: string;
        [key: string]: any;
    }
    interface Data {
        components?: Component | Component[];
        [key: string]: any;
    }
    /**
     * React(or other such as Preact) component instance.
     */
    interface ContextThis {
        [key: string]: any;
    }
    interface Context {
        $this: ContextThis;
        data: Data[] | any[];
        getData: typeof getData;
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
        (params?: ChildrenParams): JSX.Element | any;
    }
}
interface FilterDelegateOption {
    _njOpts: number;
    useString?: boolean;
    global?: Template.Global;
    context?: Template.Context;
    outputH?: boolean;
    level?: number;
}
interface FilterDelegate {
    (...args: any[]): any;
}
interface FilterOption {
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
interface ExtensionDelegateOption extends FilterDelegateOption {
    name?: string;
    tagName?: Component;
    setTagName?(tagName: Component): void;
    tagProps?: ComponentProps;
    props?: ComponentProps;
    children?: Template.RenderChildren;
    value?: Template.RenderChildren;
}
interface ExtensionDelegate {
    (options?: ExtensionDelegateOption): any;
}
interface ExtensionDelegateMultiParams extends FilterDelegate {
}
declare enum ExtensionPrefixConfig {
    onlyLowerCase = "onlyLowerCase",
    onlyUpperCase = "onlyUpperCase",
    free = "free"
}
interface ExtensionOption {
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
    needPrefix?: boolean | keyof typeof ExtensionPrefixConfig;
    [key: string]: any;
}
interface ConfigOption {
    delimiters?: object;
    includeParser?: Function;
    createElement?: Function;
    outputH?: boolean;
    textMode?: boolean;
    noWsMode?: boolean;
    fixTagName?: boolean;
}
interface Export {
    /**
     * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
     */
    (strs: TemplateStringsArray, ...args: any[]): any;
    components?: typeof components;
    componentConfig?: typeof componentConfig;
    /**
     * `nj.registerComponent`, support to register single or batch components to the NornJ.
     */
    registerComponent?: typeof registerComponent;
    getComponentConfig?: typeof getComponentConfig;
    copyComponentConfig?: typeof copyComponentConfig;
    filters?: typeof filters;
    filterConfig?: typeof filterConfig;
    /**
     * `nj.registerFilter`, support to register single or batch filters and expressions to the NornJ.
     */
    registerFilter?: typeof registerFilter;
    extensions?: typeof extensions;
    extensionConfig?: typeof extensionConfig;
    /**
     * `nj.registerExtension`, support to register single or batch tags and directives to the NornJ.
     */
    registerExtension?: typeof registerExtension;
    /**
     * `nj.taggedTmpl`, NornJ tagged templates syntax `njs`.
     */
    taggedTmpl?(strs: TemplateStringsArray, ...args: any[]): any;
    /**
     * `nj.htmlString`, NornJ tagged templates syntax `njs`.
     */
    htmlString?(strs: TemplateStringsArray, ...args: any[]): any;
    /**
     * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
     */
    taggedTmplH?(strs: TemplateStringsArray, ...args: any[]): any;
    /**
     * `nj.taggedTmplH`, NornJ tagged templates syntax `nj` and `html`.
     */
    html?(strs: TemplateStringsArray, ...args: any[]): any;
    /**
     * `nj.template`, NornJ tagged templates syntax `t`.
     */
    template?(strs: TemplateStringsArray, ...args: any[]): any;
    /**
     * `nj.expression`, NornJ tagged templates syntax `n`.
     */
    expression?(strs: TemplateStringsArray, ...args: any[]): any;
    /**
     * `nj.css`, NornJ tagged templates syntax `s`.
     */
    css?(strs: TemplateStringsArray, ...args: any[]): any;
    compile?: typeof compile;
    compileH?: typeof compileH;
    precompile?: typeof precompile;
    render?: typeof render;
    renderH?: typeof renderH;
    buildRender?: typeof buildRender;
    buildRenderH?: typeof buildRenderH;
    arrayPush?: typeof arrayPush;
    arraySlice?: typeof arraySlice;
    isObject?: typeof isObject;
    isNumber?: typeof isNumber;
    isString?: typeof isString;
    isArrayLike?: typeof isArrayLike;
    each?: typeof each;
    noop?: typeof noop;
    assign?: typeof assign;
    upperFirst?: typeof upperFirst;
    lowerFirst?: typeof lowerFirst;
    capitalize?: typeof capitalize;
    config?: typeof config;
    includeParser?: Function;
    createElement?: Function;
    createRegexOperators?: Function;
    createFilterAlias?: Function;
    preAsts: {
        [name: string]: any;
    };
    asts: {
        [name: string]: any;
    };
    templates: {
        [name: string]: any;
    };
    errorTitle: string;
    tmplRule: {
        [name: string]: any;
    };
    textTag: string;
    noWsTag: string;
    outputH: boolean;
    textMode: boolean;
    noWsMode: boolean;
    fixTagName: boolean;
    escape?: typeof escape;
    unescape?: typeof unescape;
    global: {
        [name: string]: any;
    };
    default?: Export;
}

declare const nj: Export;

declare const taggedTmpl: (strs: TemplateStringsArray, ...args: any[]) => any;
declare const taggedTmplH: (strs: TemplateStringsArray, ...args: any[]) => any;
declare function template(strs: TemplateStringsArray, ...args: any[]): any;
declare function expression(strs: TemplateStringsArray, ...args: any[]): any;
declare function css(strs: TemplateStringsArray, ...args: any[]): any;

export default nj;
export { Component, ComponentOption, ComponentOptionFunc, ComponentProps, ConfigOption, ElementType, Export, ExtensionDelegate, ExtensionDelegateMultiParams, ExtensionDelegateOption, ExtensionOption, ExtensionPrefixConfig, FilterDelegate, FilterDelegateOption, FilterOption, Template, compile, compileH, css, expression, taggedTmplH as html, taggedTmpl as htmlString, registerComponent, registerExtension, registerFilter, render, renderH, taggedTmpl, taggedTmplH, template };
