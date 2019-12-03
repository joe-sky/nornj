/*!
 * NornJ-React v5.0.0
 * (c) 2016-2019 Joe_Sky
 * Released under the MIT License.
 */
/// <reference types="react" />
declare function bindTemplate<T extends React.ElementType>(target: T): T;
declare function bindTemplate(name: string | React.ElementType): <T extends React.ElementType>(target: T) => T;

/**
 * React bindings for NornJ template engine.
 */
interface Export {
    /**
     * `njr.bindTemplate`, register React component to NornJ template.
     */
    bindTemplate?: typeof bindTemplate;
    /**
     * [Deprecated]`njr.registerTmpl`, register React component to NornJ template.
     */
    registerTmpl?: typeof bindTemplate;
}

declare const njr: Export;

export default njr;
export { Export, bindTemplate, bindTemplate as registerTmpl };
