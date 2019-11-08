/// <reference path="./typings/global.d.ts" />
/// <reference path="./typings/nj.d.ts" />

declare module 'nornj' {
  /**
   * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
   *
   * `nj'<html>Hello World!</html>'()`
   */
  const nj: NornJ.Export;
  export = nj;
}

declare module 'nornj/dist/nornj.common' {
  /**
   * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
   *
   * `nj'<html>Hello World!</html>'()`
   */
  const nj: NornJ.Export;
  export = nj;
}

declare module 'nornj/typings' {
  export = NornJ;
}

declare module 'nornj/lib/*';
