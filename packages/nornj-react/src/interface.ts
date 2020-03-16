import schema, { RuleItem } from 'async-validator';

export interface MobxFieldDataProps extends RuleItem {
  name: string;
  value?: any;
  trigger?: string;
  [key: string]: any;
}

export interface MobxFieldDataInstance extends MobxFieldDataProps {
  validatorSchema?: schema;
  reset?: Function;
  validateStatus?: string;
  help?: string;
}

export interface MobxFieldData {
  (props: MobxFieldDataProps): JSX.Element;
}

export interface MobxFormDataProps {
  observable?: boolean;
}

export interface MobxFormDataInstance {
  _njMobxFormData: boolean;
  fieldDatas: Map<string, MobxFieldDataInstance>;
  validate(name: string | string[]): Promise<any>;
  error(name: string, help: string): void;
  clear(name: string | string[]): void;
  reset(name: string | string[]): void;
  add(fieldData: MobxFieldDataProps | JSX.Element): void;
  delete(name: string): void;
  setValue(name: string | object, value?: any): void;
  formData: MobxFormDataInstance;
  [key: string]: any;
}

export interface MobxFormData {
  (props: MobxFormDataProps): JSX.Element;
}

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
