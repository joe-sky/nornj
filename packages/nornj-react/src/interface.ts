import schema, { RuleItem } from 'async-validator';
import { IObservableObject } from 'mobx';

export interface MobxFieldRuleItem extends Omit<RuleItem, 'message'> {
  message?: string | (() => string);
}

export interface MobxFieldDataProps extends MobxFieldRuleItem {
  name: string;
  label?: string;
  value?: any;
  trigger?: string;
  rules?: MobxFieldRuleItem[];
  [key: string]: any;
}

export interface MobxFieldDataInstance extends MobxFieldDataProps {
  setDefaultRule?(rule: MobxFieldRuleItem): void;
  validatorSchema?: schema;
  reset?: Function;
  validateStatus?: string;
  help?: string;
}

export interface MobxFieldData {
  (props: MobxFieldDataProps): JSX.Element;
}

//Reference by https://github.com/react-component/field-form
declare type ValidateMessage = string | ((...args: any[]) => string);
export interface ValidateMessageInfo {
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

export type ValidateMessages = ValidateMessageInfo | ((fieldData: MobxFieldDataInstance) => ValidateMessageInfo);

export interface MobxFormDataProps {
  observable?: boolean;
  validateMessages?: ValidateMessages;
}

export interface MobxFormDataInstance {
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

export interface MobxFormData {
  (props: MobxFormDataProps): JSX.Element;
}

export type JSXElementWithMobxFormData = { formData?: MobxFormDataInstance & IObservableObject };

/**
 * React bindings for NornJ template engine.
 */
export interface Export {
  /**
   * `njr.bindTemplate`, register React component to NornJ template.
   */
  bindTemplate?: typeof import('./bindTemplate').bindTemplate;

  /**
   * [Deprecated]`njr.registerTmpl`, register React component to NornJ template.
   */
  registerTmpl?: typeof import('./bindTemplate').bindTemplate;
}
