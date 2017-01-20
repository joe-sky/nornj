var nj = require('../src/base'),
  _ = require('lodash'),
  utils = require('../src/utils/utils'),
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
  });

  describe('compile string template to html', function () {
    it('test template string', function () {
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

      var tmpl1 = `
        <div name1="../111" class="{ c1 } c0{ '5' | filter1 }{'!'}{ '10' | filter1('1') } c2" id1=666 id2=777 name="my name:{'name'}{name},id:{id},name:{name}" id=test1>
          <span>
            sky:{name},{id}
          </span>
          <span1>
            <#props>
              <#prop {'test12'}>test</#prop>
            </#props>
            joe
          </span1>
          <div id=555>
            <a />
            <input type=button />
            <#unless {test0}>
              <input id="test5" />
            </#unless>
          </div>
        </div>
      `;

      var tmpl2 = nj(`
        <div name1=../111>
          <form-item wrapperCol="@{[
            { span: 22, offset: { a: 1 }}, 100
          ]}">
          <span>
            <img />
            sky:{name},{ id | filter2(1, 2) }@{{a:1}}end
          </span>
        </div>
      `);

      var tmpl3 = nj`
        <div class="{id} {name3}" {name3} { ...props} name={name1} autofocus name1={a.c.d} name2="{a.e | prop('f') | prop('g')}" a="/%'aaa'%/">
          <#props>
            <@name checked>{test0 | filter1}{'test1' | filter2}test2</@name>
            <@checked />
            <#each {list}>
              <#prop {'data-name'}>{this | filter1}{'test1'}test2</#prop>
            </#each>
            <@data-name10>
              <#each {list}>
                <#if {this}>{ @index | filter2 }<#else />{ '100' | filter1 }</#if>
              </#each>
            </@data-name10>
          </#props>
          <input autofocus />
          <br></br>
          test2
          <span>
            ${tmpl2}
            <img />
            sky:{{ 'name555' }},{ id | filter2 }
            <section>
            ${tmpl1}
            </section>
            <input type=button />
            ${nj`
              <#each { list2 }>
                <slider {../name3}>
                  <{../sliderItem.a|tagName} no1={no} checked no='{ ../sliderItem.b }' />
                </slider>
              </#each>
            `}
          </span>
        </div>
      `;

      // var tmplFn = compile(tmpl3, 'tmplString');
      // var html = tmplFn(data);
      var html = nj.render(tmpl3, data);

      //console.log(JSON.stringify(nj.asts['tmplString']));
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

      console.log(includeParser(tmpl, __filename, true));

      var html = nj.compile(tmpl, { fileName: __filename })();
      console.log(html);
      expect(html).toBeTruthy();
    });
  });
});