/**
 * React bindings for NornJ template engine.
 */
declare namespace NornJReact {
  /**
   * `njr.bindTemplate`, register React component to NornJ template.
   */
  export function bindTemplate<T extends React.ElementType>(target: T): T;

  /**
   * `njr.bindTemplate`, register React component to NornJ template.
   */
  export function bindTemplate(name: string): <T extends React.ElementType>(target: T) => T;

  /**
   * [Deprecated]`njr.registerTmpl`, register React component to NornJ template.
   */
  export function registerTmpl(name: string): <T extends React.ElementType>(target: T) => T;
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
