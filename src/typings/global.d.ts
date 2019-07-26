/**
 * NornJ tag `If`, example:
 * 
 * `<If condition={false}><input /></If>`
 */
declare function If(props: { condition: boolean | string }): any;

/**
 * NornJ tag `Then`, example:
 * 
 * `<If condition={foo > 10}><input /><Then>100</Then><Else>200</Else></If>`
 */
declare function Then(): any;

/**
 * NornJ tag `Elseif`, example:
 * 
 * `<If condition={foo > 10}><input /><Elseif condition={foo > 5}><input type="button" /></Elseif></If>`
 */
declare function Elseif(props: { condition: boolean | string }): any;

/**
 * NornJ tag `Else`, example:
 * 
 * `<If condition={foo > 10}><input /><Else><input type="button" /></Else></If>`
 */
declare function Else(): any;

/**
 * NornJ tag `Switch`, example:
 * 
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function Switch(props: { value: any }): any;

/**
 * NornJ tag `Switch`, example:
 * 
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function NjSwitch(props: { value: any }): any;

/**
 * NornJ tag `Case`, example:
 * 
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function Case(props: { value: any }): any;

/**
 * NornJ tag `Default`, example:
 * 
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function Default(): any;

/**
 * NornJ tag `Each`, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i></Each>`
 */
declare function Each<T>(props: { of: Iterable<T> | string; item?: string; index?: string }): any;

/**
 * The parameter `item` in NornJ tag `Each` loop, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i></Each>`
 */
declare const item: any;

/**
 * The parameter `index` in NornJ tag `Each` loop, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i></Each>`
 */
declare const index: number;

/**
 * NornJ tag `Empty`, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i><Empty>nothing</Empty></Each>`
 */
declare function Empty(): any;

declare function For<T>(props: { [id: string]: any; i?: number; to: number; step?: number; index?: string }): any;

declare const i: number;

declare function With(props: { [id: string]: any }): any;

declare function Fn(props: { [id: string]: any }): any;

/**
 * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
 * 
 * `nj'<html>Hello World!</html>'()`
 */
declare function nj(strs: TemplateStringsArray, ...args: any);

/**
 * NornJ tagged templates syntax `njs`(full name is `nj.taggedTmpl`), example:
 * 
 * `njs'<each {[1, 2, 3]}><i key={@index}>{@item}</i></each>'()`
 */
declare function njs(strs: TemplateStringsArray, ...args: any);

/**
 * NornJ tagged templates syntax `t`(full name is `nj.template`), example:
 * 
 * `t'<each {[1, 2, 3]}><i key={@index}>{@item}</i></each>'`
 */
declare function t(strs: TemplateStringsArray, ...args: any);

/**
 * NornJ tagged templates syntax `n`(full name is `nj.expression`), example:
 * 
 * `n'((1 + 2) .. 100)[50] * 0.3 | int'`
 */
declare function n(strs: TemplateStringsArray, ...args: any);

/**
 * NornJ tagged templates syntax `s`(full name is `nj.css`), example:
 * 
 * `s'margin-left:10px;padding-top:5px'`
 */
declare function s(strs: TemplateStringsArray, ...args: any);

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