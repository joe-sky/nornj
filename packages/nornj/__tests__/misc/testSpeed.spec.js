const nj = require('../../src/base').default,
  compiler = require('../../src/compiler/compile'),
  compile = compiler.compile,
  _ = require('lodash'),
  React = require('react'),
  ReactDOM = require('react-dom'),
  createReactClass = require('create-react-class'),
  ReactDOMServer = require('react-dom/server'),
  Handlebars = require('handlebars/dist/handlebars');

const Nj = nj.createTaggedTmplH({
  delimiters: {
    start: '{',
    end: '}'
  }
});

nj.config({
  createElement: React.createElement
});

describe('test speed', function() {
  const t1 = Nj`
  <img src="t1" />
  `;

  const t2 = Nj`
  <img src="t2" style="margin:0 auto" />
  `;

  /* eslint-disable */
  const tmpl = Nj`
  <{div} id="{num}_100'200'">
    <p-class useString>
      test
      <if {true}>
        Ok
      </if>
    </p-class>
    <pre>
      <input />
      aaa
      <img />
    </pre>
    <n-pre>
    <!--
      aaa
      <div>
        <span />
      </div>
    -->
    <![CDATA[
      <div>
        <span />
      </div>
    ]]>
    </n-pre>
    #${t1}
    ${t2()}
    <each ${[1, 2, 3]}>
      #${ctx => {
        return ctx.getData('no') + 1;
      }}
    </each>
    <TestComp2>
      <p-store><n-obj id=1 name="2" /></p-store>
    </TestComp2>
    <each {arr}>
      <span class=test_{@index}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <each {../list2}>
          <div key={@index}>
            <span>span{no}</span>
            <i>{no-1 ? 10 : 20}</i>
          </div>
        </each>
      </span>
      <if {@index | five(1)}>
        <br />
        <elseif {@index >= 1}>
          <img name="elseif" />
        </elseif>
        <else>
          <img />
        </else>
      </if>
      <switch {@index}>
        <case {1}>
          <img name="case_1{100 | test(500, styles.color)}" />
        </case>
        <case {2}>
          <img name="case_2" />
        </case>
        <default>
          <img name="case_default" />
        </default>
      </switch>
    </each>
  </{div}>
  `;
  /* eslint-enable */

  const tmpl2 = Nj`
  <{div} id="{num}_100">
    <each {arr}>
      {item.name['fullName']}
      <span class=test_{@index}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <each {../list2}>
          <div key={@index}>
            <span>span{no}</span>
            <i>{no}</i>
            <div><i><i>1000</i></i><i><i>1000</i></i><i><i>1000</i></i><i><i>1000</i></i><i><i>1000</i></i></div>
          </div>
        </each>
      </span>
      <if {@index | five(1)}>
        <br />
        <else>
          <img />
        </else>
      </if>
    </each>
  </{div}>
  `;

  const tmplFns = {
    useString: false,
    fn4: function(p1, p2, p3, p4) {
      return 'five';
    },
    fn3: function(p1, p2, p3, p4) {
      const _expr0 = p1.exprs['prop'];
      p1.throwIf(_expr0, 'prop', 'expr');

      return _expr0.apply(p2, [
        'name',
        { useString: p1.useString, exprProps: p4, result: p1.exprRet(p1, p2, p1.fn4, p4), inverse: p1.noop }
      ]);
    },
    fn2: function(p1, p2, p3, p4) {
      p2 = p1.newContext(p2, p3);

      const _paramsE0 = {};

      const _expr0 = p1.exprs['if'];
      let _value0 = p2.parent.index;

      const _filter0 = p1.filters['five'];
      if (!_filter0) {
        p1.warn('five', 'filter');
      } else {
        _value0 = _filter0.apply(p2, [_value0, { useString: p1.useString }]);
      }

      // var _value0 = p2.parent.index
      //   _tmp0, _valueP0;

      // var _filter0 = p1.filters['five'];
      // if (!_filter0) {
      //   p1.warn('five', 'filter');
      // } else {
      //   _tmp0 = _filter0.apply(p2, [_value0, { useString: p1.useString }]);
      //   _valueP0 = _value0;
      //   _value0 = _tmp0;
      // }

      p1.throwIf(_expr0, 'if', 'expr');

      _expr0.apply(p2, [
        _value0,
        { useString: p1.useString, result: p1.exprRet(p1, p2, p1.fn3, _paramsE0), inverse: p1.noop }
      ]);

      _paramsE0['key'] = p2.index;

      return p1.h('div', _paramsE0, p1.h('span', null, 'span' + p2.getData('no')), p1.h('i', null, p2.getData('no')));
    },
    fn5: function(p1, p2, p3, p4) {
      return p1.h('br');
    },
    fn6: function(p1, p2, p3, p4) {
      return p1.h('img');
    },
    fn1: function(p1, p2, p3, p4) {
      p2 = p1.newContext(p2, p3);

      const _expr0 = p1.exprs['each'];
      p1.throwIf(_expr0, 'each', 'expr');

      const _expr1 = p1.exprs['if'];
      let _value0 = p2.index;

      const _filter0 = p1.filters['five'];
      if (!_filter0) {
        p1.warn('five', 'filter');
      } else {
        _value0 = _filter0.apply(p2, [_value0, '1', { useString: p1.useString }]);
      }

      // var _filter1 = p1.filters['test'];
      // if (!_filter1) {
      //   p1.warn('test', 'filter');
      // }
      // else {
      //   _value0 = _filter1.apply(p2, [_value0, { useString: p1.useString }]);
      // }

      p1.throwIf(_expr1, 'if', 'expr');

      return [
        p1.h(
          'span',
          {
            className: 'test_' + p2.index,
            style: p1.styleProps(p2.getData('styles', p2.parent.data)),
            onClick: p2.getData('onClick', p2.parent.data)
          },
          'test_' + p2.getData('num', p2.parent.data),
          _expr0.apply(p2, [
            p2.getData('list2', p2.parent.data),
            { useString: p1.useString, result: p1.exprRet(p1, p2, p1.fn2, p4), inverse: p1.noop }
          ])
        ),
        _expr1.apply(p2, [
          _value0,
          { useString: p1.useString, result: p1.exprRet(p1, p2, p1.fn5, p4), inverse: p1.exprRet(p1, p2, p1.fn6, p4) }
        ])
      ];
    },
    main: function(p1, p2, p3, p4) {
      const _typeRefer0 = p2.getData('div');
      const _type0 = _typeRefer0 ? _typeRefer0 : 'div';

      const _expr0 = p1.exprs['each'];
      p1.throwIf(_expr0, 'each', 'expr');

      return p1.h(
        _type0,
        {
          id: p2.getData('num') + '_100'
        },
        _expr0.apply(p2, [
          p2.getData('arr'),
          { useString: p1.useString, result: p1.exprRet(p1, p2, p1.fn1, p4), inverse: p1.noop }
        ])
      );
    }
  };

  const _tmpl = Nj`
  <{div} id="{num}_100" {...props}>
    &nbsp;1&gt;2
    <each {arr}>
      <TestComp id={'false'}>
      </TestComp>
      <span class=test_{@index}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <each {../list2}>
          <div key={@index}>
            <span>span{no}</span>
            <i>{no}</i>
          </div>
        </each>
      </span>
      <if {@index | five(1) | test}>
        <br />
        <else>
          <img />
        </else>
      </if>
    </each>
  </{div}>
  `;

  const tmplHbs = `
  <{{div}} id="{{num}}_100" id2="2">
    {{#each arr}}
      <span class="test_{{@index}}">
        test_{{../num}}
        {{#each ../list2}}
          {{no}}{{no}}<div>{{no}}</div>{{no}}{{no}}
        {{/each}}
      </span>
      {{#five @index}}
        <br />
      {{else}}
        <img />
      {{/five}}
    {{/each}}
  </{{div}}>
  `;

  const tmplNj = `
  <{{div}} id="{{num}}_100" id2="2">
    <each {{arr}}>
      <span class="test_{{@index}}">
        test_{{../num}}
        <each {{../list2}}>
          {{no}}{{no}}<div>{{no}}</div>{{no}}{{no}}
        </each>
      </span>
      <if {{@index | five}}>
        <br />
        <else>
          <img />
        </else>
      </if>
    </each>
  </{{div}}>
  `;

  beforeAll(function() {
    nj.registerFilter('five', function(obj) {
      if (obj % 5 == 0) {
        return true;
      }
    });

    nj.registerFilter('test', function(obj, p, p2) {
      return obj + p + p2;
    });

    Handlebars.registerHelper('five', function(num, options) {
      if (num % 5 == 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  });

  it('test render to string by hbs', function() {
    const data = {
      div: 'div',
      num: 100,
      arr: _.times(100, function(n) {
        return n;
      }),
      list2: _.times(1000, function(n) {
        return { no: n + 1 };
      })
    };

    const tmplFn = Handlebars.compile(tmplHbs);
    const start = Date.now();
    const ret = tmplFn(data);
    //console.log(ret);
    console.log('hbs:' + (Date.now() - start));
    expect(ret).toBeTruthy();
  });

  it('test render to string by nj', function() {
    const data = {
      div: 'div',
      num: 100,
      arr: _.times(100, function(n) {
        return n;
      }),
      list2: _.times(1000, function(n) {
        return { no: n + 1 };
      })
    };

    const tmplFn = nj.compile(tmplNj, 't1');
    //console.log(nj.templates['t1'].fn2.toString());
    // nj.templates['t1'].fn2 = new Function('p1', 'p2', 'p3', 'p4', 'p5', `
    // `);
    const start = Date.now();
    const ret = tmplFn(data);
    //console.log(ret);
    console.log('nj:' + (Date.now() - start));
    expect(ret).toBeTruthy();
  });

  it('test render to component by jsx', function() {
    let start;
    let sum = 0;

    const TestComponent = createReactClass({
      getInitialState: function() {
        return {
          num: 100
        };
      },
      onClick: function() {
        this.setState({ num: Date.now() }, function() {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function() {
        const ret = (
          <div id={this.state.num + '_100'}>
            {this.props.arr.map((o, i) => [
              o.item.name['fullName'],
              <span className={'test_' + i} style={{ color: 'blue' }} onClick={this.onClick}>
                {'test_' + this.state.num}
                {list2.map((p, j) => (
                  <div key={j}>
                    <span>{'span' + p.no}</span>
                    <i>{p.no}</i>
                    <div>
                      <i>
                        <i>1000</i>
                      </i>
                      <i>
                        <i>1000</i>
                      </i>
                      <i>
                        <i>1000</i>
                      </i>
                      <i>
                        <i>1000</i>
                      </i>
                      <i>
                        <i>1000</i>
                      </i>
                    </div>
                  </div>
                ))}
              </span>
            ])}
          </div>
        );

        // var ret = React.createElement('div', { id: this.state.num + '_100' }, this.props.arr.map(function(o, i) {
        //   return [
        //     o.item.name['fullName'],
        //     React.createElement('span', { className: 'test_' + i, style: { color: 'blue' }, onClick: this.onClick },
        //       'test_' + this.state.num,
        //       list2.map(function(p, j) {
        //         return React.createElement('div', i % 5 == 0 ? { name: 'five', key: j } : { key: j },
        //           React.createElement('span', null, 'span' + p.no),
        //           React.createElement('i', null, p.no),
        //           React.createElement('i', null, React.createElement('i', null, '1000'))
        //         );
        //       })
        //     ),
        //     i % 5 == 0 ? React.createElement('br') : React.createElement('img')
        //   ];
        // }.bind(this)));

        //var params = ['div', null];
        //this.props.arr.forEach(function (o, i) {
        //  params.push(React.createElement('span', { className: 'test_' + i }, 'test_' + i));
        //});
        //ret = React.createElement.apply(React, params);

        return ret;
      }
    });

    const list2 = _.times(100, function(n) {
      return { no: n };
    });

    let html = '';
    const count = 20;
    _.times(count, n => {
      start = Date.now();
      html += ReactDOMServer.renderToStaticMarkup(
        <TestComponent
          key={n}
          arr={_.times(10, function(n) {
            return {
              no: n,
              item: {
                name: {
                  fullName: 'test' + n
                }
              }
            };
          })}
          a={1}
          list={[
            { no: 1, b: 1 },
            { no: 2, b: 0 },
            { no: 3, b: 1 }
          ]}
        />
      );

      const time = Date.now() - start;
      console.log('jsx:' + time);
      sum += time;
    });

    console.log('avg:' + sum / count);

    //console.log(html);
    expect(html).toBeTruthy();
  });

  it('test render to component by nj', function() {
    let start;

    nj.registerComponent(
      'TestComp',
      createReactClass({
        render: function() {
          return Nj`<div><each {arr}></each></div>`({
            arr: _.times(2, function(n) {
              return n;
            })
          });
        }
      })
    );

    nj.registerComponent(
      'TestComp2',
      createReactClass({
        render: function() {
          return Nj`
        <div>
          <br />
        </div>
        `({
            no: 5002
          });
        }
      })
    );

    let sum = 0;

    const TestComponent = createReactClass({
      getInitialState: function() {
        return {
          num: 100
        };
      },
      onClick: function() {
        this.setState({ num: Date.now() }, function() {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function() {
        const params = {
          arr: this.props.arr,
          num: this.state.num,
          list2: list2,
          no: 5000,
          onClick: this.onClick,
          params: {
            'data-a': 1,
            'data-b': 2
          },
          styles: {
            color: 'blue'
          },
          //styles: 'color:blue',
          div: 'div'
          //props: {
          //  'data-a': 1,
          //  'data-b': 2
          //}
          // test: function (obj) {
          //   return obj;
          // }
        };

        // var ret = nj `
        // <{div} id="{num}_100">
        //   <#each {arr}>
        //     <span class=test_{@index}
        //           style={../styles}
        //           onClick={../onClick}>
        //       test_{../num}
        //       <#each {../list2}>
        //         <div key={@index}>
        //           <#props>
        //             <#if {../@index | five}>
        //               <@name>five</@name>
        //             </#if>
        //           </#props>
        //           <span>span{no}</span>
        //           <i>{no}</i>
        //         </div>
        //       </#each>
        //     </span>
        //     <#if {@index | five(1)}>
        //       <br />
        //       <#else>
        //         <img />
        //       </#else>
        //     </#if>
        //   </#each>
        // </{div}>
        // ` (params);

        const ret = tmpl2(params);
        return ret;
      }
    });

    const list2 = _.times(100, function(n) {
      return { no: n };
    });

    // var html = ReactDOMServer.renderToStaticMarkup(React.createElement('div', null, _.times(1, (i) => React.createElement(TestComponent, {
    //   key: i,
    //   arr: _.times(100, function(n) {
    //     return n;
    //   }),
    //   a: 1,
    //   list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    // }))));

    let html = '';
    const count = 20;
    _.times(count, n => {
      start = Date.now();
      html += ReactDOMServer.renderToStaticMarkup(
        Nj`<${TestComponent} key=${n} arr=${_.times(10, function(n) {
          return {
            no: n,
            item: {
              name: {
                fullName: 'test' + n
              }
            }
          };
        })} a={1} :list="[{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]" />`()
      );

      const time = Date.now() - start;
      console.log('nj:' + time);
      sum += time;
    });

    console.log('avg:' + sum / count);

    //console.log(JSON.stringify(nj.asts['tmpl1']));
    //console.log(html);
    expect(html).toBeTruthy();
  });
});
