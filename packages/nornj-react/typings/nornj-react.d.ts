/*!
 * NornJ-React v5.0.1
 * (c) 2016-2019 Joe_Sky
 * Released under the MIT License.
 */
import { ElementType } from 'nornj';

declare function bindTemplate<T extends ElementType>(target: T): T;
declare function bindTemplate(name: string | ElementType): <T extends ElementType>(target: T) => T;

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
