export interface FormDataInstance {
  _njMobxFormData: boolean;
  fieldDatas: Map<any, any>;
  validate(name: string): Promise<any>;
  error(help: string, name: string): void;
  clear(name: string): void;
  reset(name: string): void;
  add(fieldData: any): void;
  delete(name: string): void;
  setValue(name: string, value: any): void;
  formData: FormDataInstance;
  [key: string]: any;
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
