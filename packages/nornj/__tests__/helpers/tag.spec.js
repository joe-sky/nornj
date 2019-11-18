import { render, precompile } from '../../src/compiler/compile';
import { createTmplRule } from '../../src/utils/createTmplRule';
import { registerExtension } from '../../src/helpers/extension';

describe('Tags', () => {
  it('if', () => {
    expect(
      render(
        `<if {{a}}>
           ok
         </if>`,
        {
          a: true
        }
      )
    ).toBe('ok');
  });

  it('else', () => {
    expect(
      render(
        `<if {{a}}>
           ok
           <else>no</else>
         </if>`,
        {
          a: false
        }
      )
    ).toBe('no');
  });

  it('elseif', () => {
    expect(
      render(
        `<if {{a}}>
           a
           <elseif {{b}}>b</elseif>
           <else>c</else>
         </if>`,
        {
          a: false,
          b: true
        }
      )
    ).toBe('b');
  });

  it('switch', () => {
    expect(
      render(
        `<Switch {{a}}>
           <case {{1}}>1</case>
           <case {{2}}>2</case>
           <default>3</default>
         </Switch>`,
        {
          a: 2
        }
      )
    ).toBe('2');
  });

  it('switch without case', () => {
    expect(
      render(
        `<Switch {{a}}>
           <default>3</default>
         </Switch>`,
        {
          a: 2
        }
      )
    ).toBe('3');
  });

  it('each for array', () => {
    expect(
      render(
        `<nj-noWs>
           <each {{list}} moreValues>
             <if {{!(@last)}}>
               <i>{{@item}}</i>
             </if>
           </each>
         </nj-noWs>`,
        {
          list: [1, 2, 3]
        }
      )
    ).toBe('<i>1</i><i>2</i>');
  });

  it('each for object', () => {
    expect(
      render(
        `<nj-noWs>
           <each {{list}}>
             <i>key:{{@key}},value:{{@item}}</i>
           </each>
         </nj-noWs>`,
        {
          list: { a: 1, b: 2 }
        }
      )
    ).toBe('<i>key:a,value:1</i><i>key:b,value:2</i>');

    expect(
      render(`
        <nj-noWs>
          <each {{1 .. 5}}>
            <i>{{@item}}</i>
          </each>
        </nj-noWs>
      `)
    ).toBe('<i>1</i><i>2</i><i>3</i><i>4</i><i>5</i>');
  });

  it('prop', () => {
    expect(
      render(`
        <input>
          <p-type>text</p-type>
          <p-value>abc</p-value>
        </input>
      `)
    ).toBe('<input type="text" value="abc" />');
  });

  it('spread', () => {
    expect(
      render(`
        <input {{... { type: 'text', value: 'abc' } }}>
      `)
    ).toBe('<input type="text" value="abc" />');
  });

  it('strProp', () => {
    expect(
      render(`
        <input>
          <sp-type>text</sp-type>
          <sp-value>
            a
            b
            c
          </sp-value>
        </input>
      `)
    ).toBe('<input type="text" value="abc" />');
  });

  it('with', () => {
    expect(
      render(
        `<with {{a.b}}>
           {{c}}
         </with>`,
        {
          a: {
            b: {
              c: 'abc'
            }
          }
        }
      )
    ).toBe('abc');
  });

  it('with as', () => {
    expect(
      render(
        `<with {{a.b}} as="val">
           {{val.c}}
         </with>`,
        {
          a: {
            b: {
              c: 'abc'
            }
          }
        }
      )
    ).toBe('abc');
  });

  it('with multi parameters', () => {
    expect(
      render(
        `<with p1={{a}} p2={{a.b}}>
           {{p2.c}}-{{p1.d}}
         </with>`,
        {
          a: {
            b: {
              c: 'abc'
            },
            d: 'def'
          }
        }
      )
    ).toBe('abc-def');
  });
});

describe('Register tags', () => {
  beforeAll(() => {
    registerExtension({
      wrap1: ({ props }) => {
        return 'subProps:' + (props.props ? props.props : props.subProps);
      },
      wrap2: {
        extension: options => {
          const { props } = options;
          options.tagProps.subProps = props && props.subProps ? props.subProps : 'test';
        },
        options: {
          isSubTag: true
        }
      },
      wrap3: {
        extension: options => {
          options.tagProps.subProps = 'test3';
        },
        options: {
          isSubTag: true
        }
      },
      wrap4: {
        extension: options => {
          options.tagProps.props = 'test4';
        },
        options: {
          isSubTag: true
        }
      },
      wrap5: {
        extension: options => {
          const { props } = options;
          options.tagProps.props = props.props;
        },
        options: {
          isSubTag: true
        }
      }
    });
  });

  it('2 layers', () => {
    expect(
      render(`
      <wrap1>
        <wrap2 />
      </wrap1>
    `)
    ).toBe('subProps:test');
  });

  it('3 layers(case 1)', () => {
    expect(
      render(`
      <wrap1>
        <wrap2>
          <p-title>1</p-title>
          <wrap3 />
        </wrap2>
      </wrap1>
    `)
    ).toBe('subProps:test3');
  });

  it('3 layers(case 2)', () => {
    expect(
      render(`
      <wrap1>
        <wrap5>
          <wrap4 />
        </wrap5>
      </wrap1>
    `)
    ).toBe('subProps:test4');
  });
});
