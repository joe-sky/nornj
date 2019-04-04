'use strict';

const nj = require('../../src/base').default,
  _ = require('lodash'),
  compile = require('../../src/compiler/compile').compile,
  moment = require('moment');

describe('test compile string', function() {
      beforeAll(function() {
        nj.registerFilter('filter1', function(v, p1) {
          //console.log(this.getData('name1'));
          return v * 2 + ((p1 != null && !p1._njOpts) ? parseInt(p1, 10) : 0);
        });
        nj.registerFilter('filter2', function(v, p1, p2) {
          //console.log(p1 + '_' + p2);
          return v + 5;
        });
        nj.registerFilter('filter3', function(v) {
          return !!!v;
        });
        nj.registerFilter('tagName', function(v1, v2, v3, options) {
          //console.log(options.lastValue);
          return v1 + 'Tmp';
        });
        nj.registerFilter('emptyFilter', function(n) {
          return 'emptyFilter' + n;
        });
        nj.registerFilter('**', function(v, m) {
          return Math.pow(v, m);
        }, { transOperator: true });

        nj.registerExtension('textExpr', function(arg1, arg2, opts) {
          //return opts.props.tmpls[0]();
          //console.log(opts.props.args);
          //console.log(opts.props.a);
          return arg1;
        });

        nj.registerExtension('vm-include', function({ context, props }) {
          const env = context.getData('env');
          if (env === 'vm') {
            return `#parse("${props.src}")`;
          } else {
            return `<$include src="${props.src}" />`;
          }
        });

        nj.registerFilter('vm_var', function(val, { context }) {
          const env = context.getData('env');
          if (env === 'vm') {
            return `$!${val}`;
          } else {
            return `{${val}}`;
          }
        });
      });

      describe('compile string template to html', function() {
            xit('test template string', function() {
              let s = Date.now();

              // const tmpl1 = nj`
              //   <input />
              // `;

              _.times(50000, () => {
                let html = nj `
          <div name="t1">
            <img />
          </div>
        ` ();
              });

              console.log(Date.now() - s);

              //console.log(html);
              //expect(html).toBeTruthy();
            });

            it('test compile string', function() {
                  var data = [{
                      f1: function() {
                        return '__f1__' + this.name3;
                      },
                      f2: {
                        f3: function() {
                          return '__f3__' + this.name3;
                        },
                        name3: 'testF3'
                      },
                      e1: function(options) {
                        return '<e1 name=' + this.name3 + '>' + options.result() + '</e1>';
                      },
                      //env: 'vm',
                      name: "<i>joe_sky1</i>",
                      name3: 'name3',
                      props: {
                        n: 1,
                        n2: 2
                      },
                      id: 100,
                      test0: false,
                      list: [0, 1, 2],
                      list2: [{ no: 0 }, { no: 1 }, { no: 2 }],
                      c1: 100,
                      sliderItem: {
                        a: 'sliderItem',
                        b: 'sliderItem1'
                      },
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
                      _test_: 'test'
                    },
                    {
                      name1: 'joe_sky1',
                      fns: [p => 'fn1' + p],
                      moment
                    }
                  ];

                  var tmpl1 = nj `
        <div name1="../111" class="{{ c1 }} c0{{ 5 | filter1 }}{{'!'}}{{ 10 | filter1(1) }} c2" id1=666 id2=777 name="my name:{{'name'}}{{name}},id:{{id}},name:{{name}}" id=test1>
          <span>
            sky:{{name}},{{id}}
          </span>
          <span1>
            <#props>
              <#prop {{'test12'}}>test</#prop>
            </#props>
            joe
          </span1>
          <div id=555>
            <a />
            <input type=button />
            <#unless {{false}}>
              <input id="test5" />
            </#unless>
          </div>
        </div>
      `;

                  var tmpl2 = nj `
        <div name1=../111>
          <form-item wrapperCol="{{'[1, 2]'}}">
          <span>
            <img />
            sky:{{name}},{{ id | filter2(1, 2) }}{{'[1]'}}end
          </span>
        </div>
      `;

                  var tmpl3 = nj `
        <div class="{{id}} {{name3}}" {{name3}} {{ ...props}} name={{name1}} autofocus name1={{a.c.d}} name2="{{a.e .('f') .('g')}}" a="/%'aaa'%/">
          <@name checked>{{test0 | filter1}}{{'test1' | filter2}}test2</@name>
          <@checked />
          <@data-name10>
            <#each {{{list}}}>
              <#if {{this}}>{{ @index | filter2 }}<#else>{{ 100 | filter1 }}</#else></#if>
            </#each>
          </@data-name10>
          <#props>
            <#each {{list}}>
              <#prop {{'data-name'}}>{{this | filter1}}{{'test1'}}test2</#prop>
            </#each>
          </#props>
          <input autofocus />
          <br></br>
          test2
          <span>
            #${tmpl2}
            <img />
            sky:{{{ 'name555' }}},{{ id | filter2 }}
            <section>
            #${tmpl1}
            </section>
            <input type=button />
            #${nj`
              <#each {{ list2 }}>
                <#each {{list}}>
                  <@moreValues />
                  <#if {{@last | filter3}}>
                    {{../../list2.length}}split{{@index}}
                  </#if>
                </#each>
                <slider {{../name3}}>
                  <{{../sliderItem.a|tagName}} no1={{no}} no2="{{-0.05 | filter2}}" checked no='{{ ../sliderItem.b }}' />
                </slider>
              </#each>
            `}
          </span>
        </div>
      `;

      var tmplTest = nj`
      <#once>
        <!DOCTYPE html>
        <#with {{name3}} as=name5>{{{
          JSON.stringify( 
            [
              1,
              {
                a: 1,
                b: 2
              }
            ]
          )
        }}}</#with>
        <#each {{list}}>
          <div>{{this}}</div>
          {{this}}
          <#empty>
            no data
          </#empty>
        </#each>
        <style>
          .class1 {
            margin-left: 10px;
          }
        </style>
        <script>
          <@type>text</@type>
          function test() {
            console.log(1);

            <#if {{true}}>var reg = /\\n+/;</#if>
            var a = '{{ @lt +('test') +(@gt) }}';

            if(i < 10) {
              return;
            }

            var num = <#each><#arg>{{ list(1, 2, 3) }}</#arg>{{this}}</#each>;

            function test2() {
              console.log('    <div  >a<img    />  b  </div>  <div>  '
                + ' <img /> </div>  ');
            }

            var scriptUrl = '<script src="'+prefix+'/resources/app/pages/'+path+'index.js">' + '<' + '/script>';
          }
        </script>
        <textarea>
          1 < 123
          <img src="test1.png">
        </textarea>
      </#once>
      <${'img'} src="test1.png" />
      <img src="test1.png">
        <#prop {{'id'}}>img</#prop>
        <@id1>img1</@id1>
      </img>
      <img src="test1.png">
      {{{JSON.stringify_(@data[0])}}}
      <#each {{ list2 }}>
        <!--<i>test</i>-->
        <![CDATA[
          test2
        ]]>
        <#pre>
          <!-- <message> Welcome to YiiBai </message> -->
          <![CDATA[
            function() {
              console.log(' <img /> ');
            }
            <message> Welcome to YiiBai </message>
          ]]>
        </#pre>
        <div {{...props}} ...${{ id10: 'id_10' }}>
          <@id>{{'bbb' + (${'aaa'}) + (${'ccc'} | filter2)}}</@id>
          <@name>
            img
            img
          </@name>
          <#props>
            <#if {{id > (50) && (id <= (100))}}>
              <@id1>d{{@g.parseInt_(2.01, 10)}}</@id1>
            </#if>
          </#props>
          <@name1>{{../@data[2].name1}}</@name1>
        </div>
        <#each {{list}}>
          {{../../list2.length}}${'split1'}{{../@index}}
        </#each>
        <#textExpr>
          <#tmpl>
            <TextExpr name="{{no}}" />
          </#tmpl>
          <@@a />
          <#strArg>
            num:
            <#block>
              <#list {{1}} {{2}} {{3}} />
            </#block>
            <#block>
              <#list {{4}} {{5}} {{6}} useString="false" />
            </#block>
          </#strArg>
          <#arg>{{1 +(2)}}</#arg>
          <img /><img />
          <@@name>
            img
            <div>
              <@name>
                1
                2
                <#list {{3}} {{4}} {{5}} />
              </@name>
            </div>
            <#list {{1}} {{2}} />
          </@@name>
        </#textExpr>
        <slider {{../name3}} step="{{'name5' | vm_var}}">
          <div></div>
          <script></script>
          <#prop {{'name1' | vm_var}} />
          <#vm-include src="../a.vm" />
          #${nj`<#each {{list}}>
                  {{this}}
                  {{this}}
                </#each>
                <div>
                  111
                  #${nj`<span>1</span>`}
                </div>`}
          #${nj`<div>{{../name3.substring(0, 3)}}</div>`}
          <{{tagName(../sliderItem.('a'),1,2)}} no0="/" no1={{no}} no2="{{-0.05 | filter2}}" checked no='{{ ../sliderItem.b }}' />
        </slider>
      </#each>
      <$if {a.('length')}>1</$if>
      {{{a.c.d.substr(1) + ("a,(b)" + (@sq)) + 'a,b'}}}
      {{{[[JSON.stringify({a:'1',b:2}), 2], 3]}}}
      {{reg('^[abc]$', 'i').('test')('A')}}
      {{#f1}}
      <${'div'}>
        {{f2#('f3')}}
        <${'div'}>
          <${'img'} />
          <${'span'}>aaa</${'span'}>
        </${'div'}>
      </${'div'}>
      <#e1>111</#e1>
      {{Date.now()}} + {{Math.max(Math.max(10 + 1, 1), 2 + 20, 3)}}
      <img src="test1.png" a="{{1 + (5 ** 2) + 'abc ' + a.c.d}}" b="{{{'1 + 5'}}}" c="{{ false ?: 1 }}" alt="">
      {{fns[0]('fns[0]()')}}
      {{ -10 ..< 10 }}
      <#each {{list}}>{{ ../_test_.slice(1) }}</#each>
      <div data-auto :name="1 + props.n2 + ({ a: 20, b: ({ c: 50 }) }.('b').('c'))" :name2="1 > 2"><@id>1</@id></div>
      {{'123'[1]['length'] + ([[[-1, 0], 1], 2, 3])}}
      {{moment('2011-10-10', 'hh:mm:ss').format('hh:mm:ss')}}
      <div :#show="'1' !== '1'">
      </div>
      `;

      //console.log(tmplTest._njTmpl);

      var tmplTest2 = nj.compile(`
      <div>
        <#props>
          <#if {{false}}>
            <@id1>2</@id1>
            <#props>
              <@id1>2</@id1>
            </#props>
            <#elseif {{true}}>
              <@id0>2</@id0>
            </#elseif>
            <#else>
              <!--#<#props>
                <@id21>21</@id21>
              </#props>#-->
              <@id2>2</@id2>
              <@id3>2</@id3>
              <#if {{false}}>
                <@id4>2</@id4>
                <#else>
                  <@id5>2</@id5>
                </#else>
              </#if>
            </#else>
          </#if>
        </#props>
      </div>
      `, 'test2');

      // let str1 = `
      //   <div name1=../111>
      //     <form-item wrapperCol=@{{'[1, 2]'}}>
      //     <span>
      //       <img />
      //       sky:{{name}},@{{ id | filter2(1, 2) }}{{'[1]'}}end
      //     </span>
      //   </div>
      // `;

      // let reg = /\([^()]*(\([\s\S]*?\))*[\s\S]*?\)/g;
      // //let reg1 = /@\{[^{}]*(?:\{[\s\S]*?\})*[^{}]*\}/g;
      // let str = '1 +(2, 3 +(4) +(5) +(6 +(7)) +(2)) +(2) +(2, 3 +(4))'.replace(reg, function(all, s1, s2) {
      //   console.log(all);
      //   return '';
      // });
      // //let str = str1.split(reg1);
      // console.log(str);

      // var tmplFn = compile(tmpl3, 'tmplString');
      // var html = tmplFn.apply(null, data);
      // var html = nj.render.call(null, tmplTest, data[0], data[1]);
      // var html = tmplTest2.apply(null, data);
      
      // const fns = nj.templates['test2'];
      // console.log('0:\n', fns._main.toString());
      // console.log('\n1:\n', fns.fn1.toString());
      // console.log('\n2:\n', fns.fn2.toString());
      // console.log('\n3:\n', fns.fn3.toString());
      // console.log('\n4:\n', fns.fn4.toString());
      //console.log(JSON.stringify(nj.asts['tmplString']));

      const tmplTest3 = 
`<nj-text>
<template>
  <div>1</div>
</template>

<style>
  .a {
    margin-left: 100px;
  }
</style>

<script>
        function test() {
          console.log({% 1 .. 10 .slice(1) %});

          <$$if {%true%}>var reg = /\\n+/;</$$if>
          var a = '{%@lt + ('test%'.length|int()) + @gt%}';

          if(i < 10) {
            return;
          }

          var num = <$$each><$$arg>{%list(1, 2, 3)%}</$$arg><##moreValues /><$$if {%@last|!%}>{%this%}</$$if></$$each>;

          function test2() {
            console.log('    <div  >a<img    />  b  </div>  <div>  '
              + ' <img /> </div>  ');
          }

          var scriptUrl = '<script src="'+prefix+'/resources/app/pages/'+path+'index.js">' + '<' + '/script>';
        }
</script></nj-text>`;

      const html = tmplTest.apply(null, data);
      const html2 = tmplTest2();
      const html3 = nj.compile(tmplTest3, { delimiters: {
        start: '{%',
        end: '%}',
        extension: '$$',
        prop: '##'
      } }).apply(null, data);
      // var html2 = tmplTest.call(null, { id: 200, c1: 100 }, data[0]);
      //console.log(html);
      expect(html).toBeTruthy();
    });
  });
});