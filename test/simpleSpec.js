'use strict';

const nj = require('../src/base').default,
  _ = require('lodash'),
  compile = require('../src/compiler/compile').compile,
  includeParser = require('../tools/includeParser'),
  moment = require('moment');

describe('test compile string', function() {
  beforeAll(function() {

  });

  describe('compile string template to html', function() {
    it('test compile 1', function() {


      var tmpl = nj `
        <div class="{{id}} {{name3}}" {{name3}} {{ ...props}} name={{name1}} autofocus name1={{a.c.d}} name2="{{a.e .('f') .('g')}}" a="/%'aaa'%/">
          <#prop {{'name1' | vm-var}} />
          {{111}}
          {{ 
            { a: 1, b: 2 } }}
          {{ { a: 1 } }}
        </div>
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
            }
          }
        },
      });
      console.log(html);
      expect(html).toBeTruthy();
    });
  });
});