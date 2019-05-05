'use strict';

const nj = require('../../src/base').default,
  _ = require('lodash'),
  compile = require('../../src/compiler/compile').compile,
  moment = require('moment');

describe('test compile string', function () {
  beforeAll(function () {

  });

  describe('compile string template to html', function () {
    it('test compile simple', function () {
      const tmpl = nj`
        <${'div1'} class="{{id}} {{name3}}" {{name3}} {{ ...props}} name={{name1}} autofocus name1={{a.c.d}} name2="{{ [a[a.e['h']].f.g, 2] }}" a="/%'aaa'%/" {{... Object.assign({ e: 0 }, ${{ a: '...123', b: 2 }}, { c: 3 }) }} {{... ${{ g: '...123', b: 20 }} }}>
          <!--# <n-prop {{'name1' | vm_var}} /> #-->
          {{1 + ${2} + 3 + ${4}}}
          {{-111 + 222-333 + -555}}
          {{{
          JSON.stringify([{
          a: { c: 1 },
          b: [2, { d: 5 }]
          }, { e: 10 }])
          }}}
          {{ { a: 1 } }}
          {{ 20.5 | int * (10.05 | float) + (2 ** 3) + (19 %% 2) }}
          {{ [1, 2, 3].length + [1].push(100) }}
          {{ -10 ..< 10 }}
          {{1 >(0) ?: ('+','')}}
          {{ a._ }}
          {{ a.#prop }}
          {{ { a: 1 }.a }}
          <i>test</i>
          <each {{1 .. 2}}>
            {{@item}}
            #${({ item, index }) => item + 100 * index}
            {{@root.test}}
            {{@context.data[2].a.b}}
            {{../@context.data[1].a.b}}
            <each {{1 .. 2}}>
              {{../../@context.data[1].a.b}}
            </each>
          </each>
          {{ set a.b = '__cde' }}{{ a.b }}
          <if {{ a._ > 100 }}>{{ set x = '__yzx' }}</if>{{ x }}
          {{{${nj.template`
            <input value="${100}">
          `}}}}
          {{!a.f != !x}}
          {{(('abc') + ('def')).substr((2), ((2 - 1)))}}
          {{{${nj.expression`${10} .. ${20}`}}}}
          <br><n-css style="color:${'blue'};margin:${0};" />
          {{{${JSON.stringify(nj.css`
            color:${'yel'}low;
            margin:${0};
            background-image:url('../a.png');
          `)}}}}
          <${'span'}>
            12345
            <${'span'}>
              12345
            <//>
          <//>
        <//>
      `;
      //console.log(nj.templates[tmpl._njTmplKey]._main.toString());

      const html = tmpl({
        a: {
          b: '__abc',
          c: {
            d: 'bcd'
          },
          e: {
            f: {
              g: 'efg'
            },
            h: 'e'
          },
          f: false,
          _: 123,
          prop: ctx => 456
        },
        x: '__xyz'
      });

      //console.log(html);
      expect(html).toBeTruthy();
    });

    it('test require', function () {
      global.require = function (url) {
        return url;
      };

      const tmpl = nj`
        {{require('../../a.png')}}
      `;

      const html = tmpl();
      expect(html).toBe('../../a.png');
    });

    it('test directive', function () {
      const tmpl = nj`
        <input #show-bcd.abc.vbn-bcd="{{ {name:[123]} }}">12345
      `;

      const html = tmpl();
      //console.log(html);
    });

    it('tag no prefix', function () {
      const tmpl = nj`
        <If {{true}}>
          <n-switch value={{5}}>
            <Case value={{1}}>111</Case>
            <default>555</default>
          </n-switch>
        </If>
      `;

      const html = tmpl();
      //console.log(html);
    });
  });
});