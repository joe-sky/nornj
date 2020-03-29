/*!
 * NornJ-React v5.2.0-beta.2
 * (c) 2016-2020 Joe_Sky
 * Released under the MIT License.
 */
/// <reference types="react" />
import { ElementType } from 'nornj';
import schema, { RuleItem } from 'async-validator';
import { IObservableObject } from 'mobx';

declare function bindTemplate<T extends ElementType>(target: T): T;
declare function bindTemplate(name: string | ElementType): <T extends ElementType>(target: T) => T;

interface MobxFieldDataProps extends RuleItem {
    name: string;
    value?: any;
    trigger?: string;
    rules?: RuleItem[];
    [key: string]: any;
}
interface MobxFieldDataInstance extends MobxFieldDataProps {
    setDefaultRule?(rule: RuleItem): void;
    validatorSchema?: schema;
    reset?: Function;
    validateStatus?: string;
    help?: string;
}
interface MobxFieldData {
    (props: MobxFieldDataProps): JSX.Element;
}
interface MobxFormDataProps {
    observable?: boolean;
}
interface MobxFormDataInstance {
    readonly _njMobxFormData: boolean;
    fieldDatas: Map<string, MobxFieldDataInstance & IObservableObject>;
    validate(name?: string | string[]): Promise<any>;
    error(name: string, help: string): void;
    clear(name?: string | string[]): void;
    reset(name?: string | string[]): void;
    add(fieldData: MobxFieldDataProps | JSX.Element): void;
    delete(name: string): void;
    setValue(name: string | object, value?: any): void;
    formData: MobxFormDataInstance;
    [key: string]: any;
}
interface MobxFormData {
    (props: MobxFormDataProps): JSX.Element;
}
declare type JSXElementWithMobxFormData = {
    formData?: MobxFormDataInstance & IObservableObject;
};
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
export { Export, JSXElementWithMobxFormData, MobxFieldData, MobxFieldDataInstance, MobxFieldDataProps, MobxFormData, MobxFormDataInstance, MobxFormDataProps, bindTemplate, bindTemplate as registerTmpl };
