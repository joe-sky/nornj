import { render, precompile } from '../../src/compiler/compile';
import createTmplRule from '../../src/utils/createTmplRule';

describe('Extension tag', () => {
  it('if', () => {
    expect(render(`
      <#if {{a}}>
        ok
      </#if>
    `, {
      a: true
    })).toBe('ok');
  });

  it('else', () => {
    expect(render(`
      <#if {{a}}>
        ok
        <#else>no</#else>
      </#if>
    `, {
      a: false
    })).toBe('no');
  });

  it('elseif', () => {
    expect(render(`
      <#if {{a}}>
        a
        <#elseif {{b}}>b</#elseif>
        <#else>c</#else>
      </#if>
    `, {
      a: false,
      b: true
    })).toBe('b');
  });

  it('switch', () => {
    expect(render(`
      <#switch {{a}}>
        <#case {{1}}>1</#case>
        <#case {{2}}>2</#case>
        <#default>3</#default>
      </#switch>
    `, {
      a: 2
    })).toBe('2');
  });

  it('each for array', () => {
    expect(render(`
      <nj-noWs>
        <#each {{list}} moreValues>
          <#if {{!(@last)}}>
            <i>{{@item}}</i>
          </#if>
        </#each>
      </nj-noWs>
    `, {
      list: [1, 2, 3]
    })).toBe('<i>1</i><i>2</i>');
  });

  it('each for object', () => {
    expect(render(`
      <nj-noWs>
        <#each {{list}}>
          <i>key:{{@key}},value:{{@item}}</i>
        </#each>
      </nj-noWs>
    `, {
      list: { a: 1, b: 2 }
    })).toBe('<i>key:a,value:1</i><i>key:b,value:2</i>');
  });

  it('for', () => {
    expect(render(`
      <nj-noWs>
        <#for i={{1}} to={{5}} step={{2}}>
          <i>{{i}}</i>
        </#for>
      </nj-noWs>
    `)).toBe('<i>1</i><i>3</i><i>5</i>');

    expect(render(`
      <nj-noWs>
        <#for {{1}} {{5}}>
          <i>{{@index}}</i>
        </#for>
      </nj-noWs>
    `)).toBe('<i>1</i><i>2</i><i>3</i><i>4</i><i>5</i>');
  });

  it('prop', () => {
    expect(render(`
      <input>
        <@type>text</@type>
        <@value>abc</@value>
      </input>
    `)).toBe('<input type="text" value="abc" />');
  });

  it('spread', () => {
    //console.log(precompile(`<div {{... { type: 'text', value: 'abc' } }}></div>`, false, createTmplRule()).main.toString());
    expect(render(`
      <input {{... { type: 'text', value: 'abc' } }}>
    `)).toBe('<input type="text" value="abc" />');
  });

  it('strProp', () => {
    expect(render(`
      <input>
        <@@type>text</@@type>
        <@@value>
          a
          b
          c
        </@@value>
      </input>
    `)).toBe('<input type="text" value="abc" />');
  });

  it('obj', () => {
    expect(render(`
      <#obj a={{1}} b={{2}} />
    `)).toEqual({ a: 1, b: 2 });
  });

  it('list', () => {
    expect(render(`
      <#obj>
        <@list>
          <#list {{1}} {{2}} />
        </@list>
      </#obj>
    `)).toEqual({ list: [1, 2] });
  });

  it('fn', () => {
    expect(render(`
      <#fn a b>
        {{a + b}}
      </#fn>
    `)).toBeDefined();
  });

  it('with', () => {
    expect(render(`
      <#with {{a.b}}>
        {{c}}
      </#with>
    `, {
      a: {
        b: {
          c: 'abc'
        }
      }
    })).toBe('abc');
  });

  it('with as', () => {
    expect(render(`
      <#with {{a.b}} as="val">
        {{val.c}}
      </#with>
    `, {
      a: {
        b: {
          c: 'abc'
        }
      }
    })).toBe('abc');
  });

  it('with multi parameters', () => {
    expect(render(`
      <#with p1={{a}} p2={{a.b}}>
        {{p2.c}}-{{p1.d}}
      </#with>
    `, {
      a: {
        b: {
          c: 'abc'
        },
        d: 'def'
      }
    })).toBe('abc-def');
  });
});