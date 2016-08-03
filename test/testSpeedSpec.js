var nj = require('../src/base'),
  utils = require('../src/utils/utils'),
  compiler = require('../src/compiler/compile'),
  compile = compiler.compile,
  _ = require('lodash'),
  React = require('react'),
  ReactDOM = require('react-dom'),
  ReactDOMServer = require('react-dom/server');

describe('test speed', function () {
  nj.setTmplRule(null, null, '#');

  var tmpl1 = nj`
  <div>test1</div>
  `;

  var tmpl = nj`
  <div>
    ${[tmpl1, ['{num}', tmpl1]]}
    ${tmpl1}
    <#each {arr}>
      <span class=test_{#}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <#each {../list2}>
          <div>
            <#params>
              <#if {../#:five}>
                <#param {'name'}>five</#param>
              </#if>
            </#params>
            <span>span{#}</span>
            <i>{#}</i>
            <span {../../id}
                  data-a={../../obj.a}
                  name=@${'name100'}
                  data-id=sp200
                  dangerouslySetInnerHTML=${{__html: '>'}}>
            </span>
            @${' space > space '}
          </div>
        </#each>
      </span>
      <#if {#:five(1):test}>
        <br />
      <#else />
        <img alt=@${'test.jpg'} {../...b.spread}>
          <#params>
            <#param {'src'}>test.jpg</#param>
          </#params>
          <#params>
            <#param {'data-alt'}>{../id}</#param>
          </#params>
        </img>
        <input {../...b.spread}/>
      </#if>
    </#each>
  </div>
  `;

  //console.log(tmpl.njKey);

  beforeAll(function () {
    nj.setComponentEngine('react', React, ReactDOM);

    nj.registerFilter('five', function (obj) {
      if (obj % 5 == 0) {
        return true;
      }
    });

    nj.registerFilter('test', function (obj) {
      return obj;
    });
  });

  xit('test render to string', function () {
    var data = {
      arr: _.times(5, function (n) {
        return n;
      }),
      num: Date.now(),
      list2: [1, 2, 3],
      onClick: 'onClick',
      params: {
        'data-a': 1,
        'data-b': 2
      },
      styles: "color:blue",
      id: 'sp100'
    };

    var tmplFn = compile(tmpl, 'tmpl1'),
        html = tmplFn(data);

    //console.log(JSON.stringify(nj.templates['tmpl1']));
    console.log(html);
    expect(html).toBeTruthy();
  });

  it('test render to component', function () {
    var start;

    var TestComponent1 = React.createClass({
      getInitialState: function () {
        start = Date.now();

        return {
          num: 100
        };
      },
      onClick: function () {
        start = Date.now();
        this.setState({ num: Date.now() }, function () {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function () {
        var list2 = [1, 2, 3];

        var start = Date.now();
        var ret = React.createElement('div', null, this.props.arr.map(function (o, i) {
          return [
              React.createElement('span', { className: 'test_' + i, style: { color: 'blue' }, onClick: this.onClick },
                'test_' + this.state.num,
                list2.map(function (p, j) {
                  return [React.createElement('div', i % 5 == 0 ? { name: 'five' } : null,
                    React.createElement('span', null, 'span' + j),
                    React.createElement('i', null, j)
                  )];
                })
              ),
              i % 5 == 0 ? React.createElement('br') : React.createElement('img')
          ];
        }.bind(this)));

        //var params = ['div', null];
        //this.props.arr.forEach(function (o, i) {
        //  params.push(React.createElement('span', { className: 'test_' + i }, 'test_' + i));
        //});
        //ret = React.createElement.apply(React, params);

        console.log('render:' + (Date.now() - start));
        return ret;
      }
    });

    var TestComponent = React.createClass({
      getInitialState: function () {
        start = Date.now();

        return {
          num: 100
        };
      },
      template: nj.compileComponent(tmpl, 'tmpl1'),
      onClick: function () {
        start = Date.now();
        this.setState({ num: Date.now() }, function () {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function () {
        console.log(this.props.tmpls);
        var params = {
          arr: this.props.arr,
          num: this.state.num,
          list2: [1, 2, 3],
          onClick: this.onClick,
          params: {
            'data-a': 1,
            'data-b': 2
          },
          styles: {
            color: 'blue'
          },
          id: 'sp100',
          obj: {
            a: 'a100'
          },
          b: {
            spread: {
              'data-a': 1,
              'data-b': 2,
              'data-c': 3
            }
          }
        };

        //var ret = this.template(params);
        var ret = tmpl.renderComp(params);
        console.log('render:' + (Date.now() - start));
        return ret;
      }
    });
    nj.registerComponent({ TestComponent });

    //var html = ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, {
    //  arr: _.times(5, function (n) {
    //    return n;
    //  }),
    //  a: 1,
    //  list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    //}));
    var html = ReactDOMServer.renderToStaticMarkup(nj`
      <TestComponent {...props}>
        <#tmpl>
          {test123}
        </#tmpl>
        <#tmpl {t1}>
          {test123}
        </#tmpl>
        <#tmpl>
          {test123}
        </#tmpl>
      </TestComponent>
      `.renderComp({
      props: {
        arr: _.times(5, function (n) {
          return n;
        }),
        a: 1,
        list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
      }
    }));

    //console.log(JSON.stringify(nj.templates['tmpl1']));
    console.log(html);
    expect(html).toBeTruthy();
  });
});