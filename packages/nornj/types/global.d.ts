/**
 * NornJ tag `If`, example:
 *
 * `<If condition={false}><input /></If>`
 */
declare function If(props: { condition: boolean | number | string }): any;

/**
 * NornJ tag `If`, example:
 *
 * `<NjIf condition={false}><input /></NjIf>`
 */
declare function NjIf(props: { condition: boolean | number | string }): any;

/**
 * NornJ tag `Then`, example:
 *
 * `<If condition={foo > 10}><input /><Then>100</Then><Else>200</Else></If>`
 */
declare function Then(): any;

/**
 * NornJ tag `Then`, example:
 *
 * `<NjIf condition={foo > 10}><input /><NjThen>100</NjThen><NjElse>200</NjElse></NjIf>`
 */
declare function NjThen(): any;

/**
 * NornJ tag `Elseif`, example:
 *
 * `<If condition={foo > 10}><input /><Elseif condition={foo > 5}><input type="button" /></Elseif></If>`
 */
declare function Elseif(props: { condition: boolean | number | string }): any;

/**
 * NornJ tag `Elseif`, example:
 *
 * `<NjIf condition={foo > 10}><input /><NjElseif condition={foo > 5}><input type="button" /></NjElseif></NjIf>`
 */
declare function NjElseif(props: { condition: boolean | number | string }): any;

/**
 * NornJ tag `Else`, example:
 *
 * `<If condition={foo > 10}><input /><Else><input type="button" /></Else></If>`
 */
declare function Else(): any;

/**
 * NornJ tag `Else`, example:
 *
 * `<NjIf condition={foo > 10}><input /><NjElse><input type="button" /></NjElse></NjIf>`
 */
declare function NjElse(): any;

/**
 * NornJ tag `Switch`, example:
 *
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function Switch(props: { value: any }): any;

/**
 * NornJ tag `Switch`, example:
 *
 * `<NjSwitch value={foo}><NjCase value={1}><input /></NjCase><NjCase value={2}><input type="button" /></NjCase><NjDefault>nothing</NjDefault></NjSwitch>`
 */
declare function NjSwitch(props: { value: any }): any;

/**
 * NornJ tag `Case`, example:
 *
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function Case(props: { value: any }): any;

/**
 * NornJ tag `Case`, example:
 *
 * `<NjSwitch value={foo}><NjCase value={1}><input /></NjCase><NjCase value={2}><input type="button" /></NjCase><NjDefault>nothing</NjDefault></NjSwitch>`
 */
declare function NjCase(props: { value: any }): any;

/**
 * NornJ tag `Default`, example:
 *
 * `<Switch value={foo}><Case value={1}><input /></Case><Case value={2}><input type="button" /></Case><Default>nothing</Default></Switch>`
 */
declare function Default(): any;

/**
 * NornJ tag `Default`, example:
 *
 * `<NjSwitch value={foo}><NjCase value={1}><input /></NjCase><NjCase value={2}><input type="button" /></NjCase><NjDefault>nothing</NjDefault></NjSwitch>`
 */
declare function NjDefault(): any;

/**
 * NornJ tag `Each`, example:
 *
 * `<Each of={[1, 2, 3]}><i key={index}>{item}</i></Each>`
 */
declare function Each<T>(props: {
  of: Iterable<T> | string;
  item?: string;
  index?: string;
  $key?: string;
  first?: string;
  last?: string;
}): any;

/**
 * NornJ tag `Each`, example:
 *
 * `<NjEach of={[1, 2, 3]}><i key={index}>{item}</i></NjEach>`
 */
declare function NjEach<T>(props: {
  of: Iterable<T> | string;
  item?: string;
  index?: string;
  $key?: string;
  first?: string;
  last?: string;
}): any;

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
 * `<NjEach of={[1, 2, 3]}><i key={index}>{item}</i><NjEmpty>nothing</NjEmpty></NjEach>`
 */
declare function NjEmpty(): any;

/**
 * NornJ tag `For`, example:
 *
 * `<For of={[1, 2, 3]}><i key={index}>{item}</i></For>`
 */
declare function For<T>(props: {
  of: Iterable<T> | string;
  item?: string;
  index?: string;
  $key?: string;
  first?: string;
  last?: string;
}): any;

/**
 * NornJ tag `For`, example:
 *
 * `<NjFor of={[1, 2, 3]}><i key={index}>{item}</i></NjFor>`
 */
declare function NjFor<T>(props: {
  of: Iterable<T> | string;
  item?: string;
  index?: string;
  $key?: string;
  first?: string;
  last?: string;
}): any;

declare function With(props: { [id: string]: any }): any;

declare function NjWith(props: { [id: string]: any }): any;

/**
 * NornJ tagged templates syntax `nj`(full name is `nj.taggedTmplH`), example:
 *
 * `nj'<html>Hello World!</html>'()`
 */
declare function nj(strs: TemplateStringsArray, ...args: any);

/**
 * NornJ tagged templates syntax `html`(full name is `nj.taggedTmplH`), example:
 *
 * `html'<html>Hello World!</html>'()`
 */
declare function html(strs: TemplateStringsArray, ...args: any);

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
  namespace NJ {
    type Children = Element | string | number | boolean | null | typeof undefined;

    interface Childrenable {
      children?: Children | Children[];
    }

    interface If extends Childrenable {
      condition: boolean | number | string;
    }

    interface Then extends Childrenable {}

    interface Elseif extends Childrenable {
      condition: boolean | number | string;
    }

    interface Else extends Childrenable {}

    interface Switch extends Childrenable {
      value: any;
    }

    interface Case extends Childrenable {
      value: any;
    }

    interface Default extends Childrenable {}

    interface Each<T = any> extends Childrenable {
      of: Iterable<T> | string;
      item?: string;
      index?: string;
      $key?: string;
      first?: string;
      last?: string;
    }

    interface With extends Childrenable {
      [id: string]: any;
    }

    interface Empty extends Childrenable {}
  }

  interface IntrinsicElements {
    /**
     * NornJ tag `if`, example:
     *
     * `<if condition={false}><input /></if>`
     */
    if: NJ.If;

    /**
     * NornJ tag `if`, example:
     *
     * `<n-if condition={false}><input /></n-if>`
     */
    'n-if': NJ.If;

    /**
     * NornJ tag `then`, example:
     *
     * `<if condition={foo > 10}><input /><then>100</then><else>200</else></if>`
     */
    then: NJ.Then;

    /**
     * NornJ tag `then`, example:
     *
     * `<n-if condition={foo > 10}><input /><n-then>100</n-then><n-else>200</n-else></n-if>`
     */
    'n-then': NJ.Then;

    /**
     * NornJ tag `elseif`, example:
     *
     * `<if condition={foo > 10}><input /><elseif condition={foo > 5}><input type="button" /></elseif></if>`
     */
    elseif: NJ.Elseif;

    /**
     * NornJ tag `elseif`, example:
     *
     * `<n-if condition={foo > 10}><input /><n-elseif condition={foo > 5}><input type="button" /></n-elseif></n-if>`
     */
    'n-elseif': NJ.Elseif;

    /**
     * NornJ tag `else`, example:
     *
     * `<if condition={foo > 10}><input /><else><input type="button" /></else></if>`
     */
    else: NJ.Else;

    /**
     * NornJ tag `else`, example:
     *
     * `<n-if condition={foo > 10}><input /><n-else><input type="button" /></n-else></n-if>`
     */
    'n-else': NJ.Else;

    /**
     * NornJ tag `Switch`, example:
     *
     * `<n-switch value={foo}><n-case value={1}><input /></n-case><n-case value={2}><input type="button" /></n-case><n-default>nothing</n-default></n-switch>`
     */
    'n-switch': NJ.Switch;

    /**
     * NornJ tag `case`, example:
     *
     * `<switch value={foo}><case value={1}><input /></case><case value={2}><input type="button" /></case><default>nothing</default></switch>`
     */
    case: NJ.Case;

    /**
     * NornJ tag `case`, example:
     *
     * `<n-switch value={foo}><n-case value={1}><input /></n-case><n-case value={2}><input type="button" /></n-case><n-default>nothing</n-default></n-switch>`
     */
    'n-case': NJ.Case;

    /**
     * NornJ tag `default`, example:
     *
     * `<switch value={foo}><case value={1}><input /></case><case value={2}><input type="button" /></case><default>nothing</default></switch>`
     */
    default: NJ.Default;

    /**
     * NornJ tag `default`, example:
     *
     * `<n-switch value={foo}><n-case value={1}><input /></n-case><n-case value={2}><input type="button" /></n-case><n-default>nothing</n-default></n-switch>`
     */
    'n-default': NJ.Default;

    /**
     * NornJ tag `each`, example:
     *
     * `<each of={[1, 2, 3]}><i key={index}>{item}</i></each>`
     */
    each: NJ.Each;

    /**
     * NornJ tag `each`, example:
     *
     * `<n-each of={[1, 2, 3]}><i key={index}>{item}</i></n-each>`
     */
    'n-each': NJ.Each;

    /**
     * NornJ tag `empty`, example:
     *
     * `<each of={[1, 2, 3]}><i key={index}>{item}</i><empty>nothing</empty></each>`
     */
    empty: NJ.Empty;

    /**
     * NornJ tag `empty`, example:
     *
     * `<n-each of={[1, 2, 3]}><i key={index}>{item}</i><n-empty>nothing</n-empty></n-each>`
     */
    'n-empty': NJ.Empty;

    for: NJ.Each;

    'n-for': NJ.Each;

    with: NJ.With;

    'n-with': NJ.With;
  }

  interface IntrinsicAttributes {
    children?: NJ.Children | NJ.Children[];

    /**
     * NornJ directive `n-show`, example:
     *
     * `<input n-show={false} />`
     */
    ['n-show']?: boolean | number | string;

    /**
     * NornJ directive `n-style`, example:
     *
     * `<input n-style="margin-left:5px;padding:10" />`
     */
    ['n-style']?: string;

    /**
     * NornJ directive `n-debounce`, example:
     *
     * `<input n-debounce={200} />`
     */
    ['n-debounce']?: number | string;
  }
}

declare module 'nornj/lib/*';
