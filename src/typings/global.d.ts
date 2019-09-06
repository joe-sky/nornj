/**
 * NornJ tag `If`, example:
 * 
 * `<If condition={false}><input /></If>`
 */
declare function If(props: { condition: boolean | number | string }): any;

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
declare function Elseif(props: { condition: boolean | number | string }): any;

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
 * The parameter `first` in NornJ tag `Each` loop, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>isFirst:{first}</i></Each>`
 */
declare const first: number;

/**
 * The parameter `last` in NornJ tag `Each` loop, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>isLast:{last}</i></Each>`
 */
declare const last: number;

/**
 * The parameter `key` in NornJ tag `Each` loop, example:
 * 
 * `<Each of={{ a: 1, b: 2 }}><i key={index}>{key},{item}</i></Each>`
 */
declare const key: any;

/**
 * NornJ tag `Empty`, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i><Empty>nothing</Empty></Each>`
 */
declare function Empty(): any;

/**
 * NornJ tag `Empty`, example:
 * 
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i><Empty>nothing</Empty></Each>`
 */
declare function NjEmpty(): any;

declare function For<T>(props: { [id: string]: any; i?: number; to: number; step?: number; index?: string }): any;

declare const i: number;

declare function With(props: { [id: string]: any }): any;

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

  declare namespace NornJ {
    interface Childrenable {
      children?: TChildren | TChildren[];
    }

    interface If extends Childrenable {
      condition: boolean | number | string;
    }

    interface Then extends Childrenable { }

    interface Elseif extends Childrenable {
      condition: boolean | number | string;
    }

    interface Else extends Childrenable { }

    interface Switch extends Childrenable {
      value: any
    }

    interface Case extends Childrenable {
      value: any
    }

    interface Default extends Childrenable { }

    interface Each<T> extends Childrenable {
      of: Iterable<T> | string;
      item?: string;
      index?: string;
    }

    interface With extends Childrenable {
      [id: string]: any
    }
  }

  interface IntrinsicElements {
    /**
     * NornJ tag `if`, example:
     * 
     * `<if condition={false}><input /></if>`
     */
    if: NornJ.If;

    /**
     * NornJ tag `then`, example:
     * 
     * `<if condition={foo > 10}><input /><then>100</then><else>200</else></if>`
     */
    then: NornJ.Then;

    /**
     * NornJ tag `elseif`, example:
     * 
     * `<if condition={foo > 10}><input /><elseif condition={foo > 5}><input type="button" /></elseif></if>`
     */
    elseif: NornJ.Elseif;

    /**
     * NornJ tag `else`, example:
     * 
     * `<if condition={foo > 10}><input /><else><input type="button" /></else></if>`
     */
    else: NornJ.Else;

    /**
    * NornJ tag `Switch`, example:
    * 
    * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
    */
    switch: NornJ.Switch;

    /**
     * NornJ tag `Case`, example:
     * 
     * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
     */
    case: NornJ.Case;

    /**
     * NornJ tag `Default`, example:
     * 
     * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
     */
    default: NornJ.Default;

    /**
     * NornJ tag `Each`, example:
     * 
     * `<Each of={[1, 2, 3]}><i key={index}>{item}</i></Each>`
     */
    each: NornJ.Each;

    /**
     * NornJ tag `Empty`, example:
     * 
     * `<Each of={[1, 2, 3]}><i key={index}>{item}</i><Empty>nothing</Empty></Each>`
     */
    empty: NornJ.Empty;

    for: NornJ.Each;

    with: NornJ.With;
  }

  interface IntrinsicAttributes {
    children?: TChildren | TChildren[];

    /**
     * NornJ directive `n-show`, example:
     * 
     * `<input n-show={false} />`
     */
    ['n-show']?: boolean | number | string

    /**
     * NornJ directive `n-style`, example:
     * 
     * `<input n-style="margin-left:5px;padding:10" />`
     */
    ['n-style']?: string

    /**
     * NornJ directive `n-debounce`, example:
     * 
     * `<input n-debounce={200} />`
     */
    ['n-debounce']?: number | string

    /**
     * NornJ directive `n-mobxBind`, example:
     * 
     * `<input n-mobxBind={this.inputValue} />`
     */
    ['n-mobxBind']?: any
  }
}