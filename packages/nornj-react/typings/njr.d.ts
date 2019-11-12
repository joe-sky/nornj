/**
 * React bindings for NornJ template engine.
 */
declare namespace NornJReact {
  /**
   * `njr.bindTemplate`, register React component to NornJ template.
   */
  export const bindTemplate: typeof import('../src/bindTemplate').bindTemplate;

  /**
   * [Deprecated]`njr.registerTmpl`, register React component to NornJ template.
   */
  export const registerTmpl: typeof bindTemplate;
}

declare module 'nornj-react' {
  export = NornJReact;
}

declare module 'nornj-react/native' {
  export = NornJReact;
}

declare module 'nornj-react/mobx';

declare module 'nornj-react/mobx/native';

declare module 'nornj-react/redux';

declare module 'nornj-react/router';

declare module 'nornj-react/lib/*';
