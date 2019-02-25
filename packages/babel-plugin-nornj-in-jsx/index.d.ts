declare function If(props: { condition: boolean | string }): any;
declare function Elseif(props: { condition: boolean | string }): any;
declare function Else(): any;
declare function Switch(props: { value: any }): any;
declare function NjSwitch(props: { value: any }): any;
declare function Case(props: { value: any }): any;
declare function Default(): any;
declare function Each<T>(props: { of: Iterable<T> | string; item?: string; index?: string }): any;
declare const item: any;
declare const index: number;
declare function Empty(): any;
declare function For<T>(props: { [id: string]: any; i?: number; to: number; step?: number; index?: string }): any;
declare const i: number;
declare function With(props: { [id: string]: any }): any;
declare function Fn(props: { [id: string]: any }): any;
declare const nj: any;
declare const njs: any;
declare const t: any;
declare const n: any;
declare const s: any;

declare namespace JSX {
  type TChildren =
    | Element
    | string
    | number
    | boolean
    | null
    | typeof undefined;

  interface IntrinsicAttributes {
    children?: TChildren | TChildren[];
  }
}