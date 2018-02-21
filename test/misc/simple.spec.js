'use strict';

const nj = require('../../src/base').default,
  _ = require('lodash'),
  compile = require('../../src/compiler/compile').compile,
  moment = require('moment');

describe('test compile string', function() {
  beforeAll(function() {

  });

  describe('compile string template to html', function() {
    it('test compile 1', function() {


      var tmpl = nj `
        <${'div'} class="{{id}} {{name3}}" {{name3}} {{ ...props}} name={{name1}} autofocus name1={{a.c.d}} name2="{{ [a[a.e['h']].f.g, 2] }}" a="/%'aaa'%/">
          <#prop {{'name1' | vm-var}} />
          {{1 + ${2} + 3 + ${4}}}
          {{111}}
          {{{
            JSON.stringify([{
              a: { c: 1 },
              b: [2, { d: 5 }]
            }, { e: 10 }])
          }}}
          {{ { a: 1 } }}
          {{ 20.5 | int * (10.05 | float) + (2 ** 3) + (19 // 2) }}
          {{ [1, 2, 3].length + [1].push(100) }}
          {{ -10 ..< 10 }}
        </${'div'}>
      `;



      var html = tmpl({
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
          }
        },
      });
      //console.log(html);
      expect(html).toBeTruthy();
    });
  });
});