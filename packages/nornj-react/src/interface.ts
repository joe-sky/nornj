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
