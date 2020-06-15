/*!
 * NornJ-React v5.2.0-rc.5
 * (c) 2016-2020 Joe_Sky
 * Released under the MIT License.
 */
import { ElementType } from 'nornj';
import schema, { RuleItem } from 'async-validator';
import { IObservableObject } from 'mobx';

declare function bindTemplate<T extends ElementType>(target: T): T;
declare function bindTemplate(name: string | ElementType): <T extends ElementType>(target: T) => T;

interface MobxFieldRuleItem extends Omit<RuleItem, 'message'> {
    message?: string | (() => string);
}
interface MobxFieldDataProps extends MobxFieldRuleItem {
    name: string;
    label?: string;
    value?: any;
    trigger?: string;
    rules?: MobxFieldRuleItem[];
    [key: string]: any;
}
interface MobxFieldDataInstance extends MobxFieldDataProps {
    setDefaultRule?(rule: MobxFieldRuleItem): void;
    validatorSchema?: schema;
    reset?: Function;
    validateStatus?: string;
    help?: string;
}
interface MobxFieldData {
    (props: MobxFieldDataProps): JSX.Element;
}
declare type ValidateMessage = string | ((...args: any[]) => string);
interface ValidateMessageInfo {
    default?: ValidateMessage;
    required?: ValidateMessage;
    enum?: ValidateMessage;
    whitespace?: ValidateMessage;
    date?: {
        format?: ValidateMessage;
        parse?: ValidateMessage;
        invalid?: ValidateMessage;
    };
    types?: {
        string?: ValidateMessage;
        method?: ValidateMessage;
        array?: ValidateMessage;
        object?: ValidateMessage;
        number?: ValidateMessage;
        date?: ValidateMessage;
        boolean?: ValidateMessage;
        integer?: ValidateMessage;
        float?: ValidateMessage;
        regexp?: ValidateMessage;
        email?: ValidateMessage;
        url?: ValidateMessage;
        hex?: ValidateMessage;
    };
    string?: {
        len?: ValidateMessage;
        min?: ValidateMessage;
        max?: ValidateMessage;
        range?: ValidateMessage;
    };
    number?: {
        len?: ValidateMessage;
        min?: ValidateMessage;
        max?: ValidateMessage;
        range?: ValidateMessage;
    };
    array?: {
        len?: ValidateMessage;
        min?: ValidateMessage;
        max?: ValidateMessage;
        range?: ValidateMessage;
    };
    pattern?: {
        mismatch?: ValidateMessage;
    };
}
declare type ValidateMessages = ValidateMessageInfo | ((fieldData: MobxFieldDataInstance) => ValidateMessageInfo);
interface MobxFormDataProps {
    observable?: boolean;
    validateMessages?: ValidateMessages;
}
interface MobxFormDataInstance {
    readonly _njMobxFormData: boolean;
    fieldDatas: Map<string, MobxFieldDataInstance & IObservableObject>;
    validate(name?: string | string[]): Promise<any>;
    error(name: string, help: string): void;
    clear(name?: string | string[], success?: boolean): void;
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
export { Export, JSXElementWithMobxFormData, MobxFieldData, MobxFieldDataInstance, MobxFieldDataProps, MobxFieldRuleItem, MobxFormData, MobxFormDataInstance, MobxFormDataProps, ValidateMessageInfo, ValidateMessages, bindTemplate, bindTemplate as registerTmpl };
