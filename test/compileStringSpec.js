var nj = require('../src/base').default,
  _ = require('lodash'),
  compile = require('../src/compiler/compile').compile,
  includeParser = require('../tools/includeParser');

describe('test compile string', function () {
  beforeAll(function () {
    nj.registerFilter('filter1', function (v, p1) {
      //console.log(this.getData('name1'));
      return v * 2 + ((p1 != null && !p1._njOpts) ? parseInt(p1, 10) : 0);
    });
    nj.registerFilter('filter2', function (v, p1, p2) {
      //console.log(p1 + '_' + p2);
      return v + 5;
    });
    nj.registerFilter('filter3', function (v) {
      return !!!v;
    });
    nj.registerFilter('tagName', function (v) {
      return v + 'Tmp';
    });
    nj.registerFilter('emptyFilter', function (n) {
      return 'emptyFilter' + n;
    });

    nj.registerExtension('textExpr', function (arg1, arg2, opts) {
      //return opts.props.tmpls[0]();
      //console.log(opts.props.args);
      console.log(opts.props.a);
      return arg1;
    });

    nj.registerExtension('vm-include', function (opts) {
      const env = this.getData('env');
      if(env === 'vm') {
        return `#parse("${opts.props.src}")`;
      }
      else {
        return `<$include src="${opts.props.src}" />`;
      }
    });

    nj.registerFilter('vm-var', function (val, opts) {
      const env = this.getData('env');
      if(env === 'vm') {
        return `$!${val}`;
      }
      else {
        return `{${val}}`;
      }
    });
  });

  describe('compile string template to html', function () {
    xit('test template string', function () {
      let s = Date.now();

      // const tmpl1 = nj`
      //   <input />
      // `;

      _.times(50000, () => {
        let html = nj`
          <div name="t1">
            <img />
          </div>
        `();
      });

      console.log(Date.now() - s);

      //console.log(html);
      //expect(html).toBeTruthy();
    });

    it('test compile 1', function () {
      var data = [
        {
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
          }
        },
        {
          name1: 'joe_sky1'
        }
      ];

      var tmpl1 = nj`
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

      var tmpl2 = nj`
        <div name1=../111>
          <form-item wrapperCol="{{'[1, 2]'}}">
          <span>
            <img />
            sky:{{name}},{{ id | filter2(1, 2) }}{{'[1]'}}end
          </span>
        </div>
      `;

      var tmpl3 = nj`
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
        <@resetList>{{ list(id, c1) }}</@resetList>
        <!DOCTYPE html>
        <#with {{name3}} as=name5>{{{
          JSON #('stringify', 
            list(
              1,
              obj(
                'a' :(1),
                'b' :(2)
              )
            )
          )
        }}}</#with>
        <#each {{list}}>
          <div>{{this}}</div>
          {{this}}
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
      <img src="test1.png">
      <img src="test1.png">
        <#prop {{'id'}}>img</#prop>
        <@id1>img1</@id1>
      </img>
      <img src="test1.png">
      {{{JSON #('stringify', @data[0])}}}
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
          <@id>{{'bbb' +(${'aaa'}) +(${'ccc'} | filter2)}}</@id>
          <@name>
            img
            img
          </@name>
          <#props>
            <#if {{id >(50) &&(id <=(100))}}>
              <@id1>d{{@global #('parseInt', 2.01, 10)}}</@id1>
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
        <slider {{../name3}} step="{{'name5' | vm-var}}">
          <div></div>
          <script></script>
          <#prop {{'name1' | vm-var}} />
          <#vm-include src="../a.vm" />
          #${nj`<#each {{list}}>
                  {{this}}
                  {{this}}
                </#each>
                <div>
                  111
                  #${nj`<span>1</span>`}
                </div>`}
          #${nj`<div>{{../name3 | #('substring', 0, 3)}}</div>`}
          <{{../sliderItem['a']|tagName(1,2)}} no0="/" no1={{no}} no2="{{-0.05 | filter2}}" checked no='{{ ../sliderItem.b }}' />
        </slider>
      </#each>
      <$if {a .('length')}>1</$if>
      <img src="test1.png">
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

      var html = tmplTest.apply(null, data);
      // var html2 = tmplTest.call(null, { id: 200, c1: 100 }, data[0]);
      console.log(html);
      expect(html).toBeTruthy();
    });

    xit('test include parser', function () {
      nj.config({ includeParser });

      const tmpl = `
        <template name="t1">
          <img />
        </template>
        <template name="t2" local>
          <input />
        </template>
        <template>
          <section>
            <#include src="./resources/testInclude.html" />
            <img />
            <#include src="./resources/testInclude2.html" />
          </section>
        </template>
      `;

      //console.log(includeParser(tmpl, __filename, true));

      var html = nj.compile(tmpl, { fileName: __filename })();
      console.log(html);
      expect(html).toBeTruthy();
    });
  });
});