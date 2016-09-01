var nj = require('../src/base'),
  utils = require('../src/utils/utils'),
  compiler = require('../src/compiler/compile'),
  compile = compiler.compile,
  _ = require('lodash'),
  React = require('react'),
  ReactDOM = require('react-dom'),
  ReactDOMServer = require('react-dom/server');

describe('test speed', function () {
  var tmpl = nj`
  <{div} id="{num '_100'}">
    <#each {arr}>
      <span class=test_{#}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <#each {../list2}>
          <div>
            <#params>
              <$if {../#:five}>
                <#p {'name'}>five</#p>
              </$if>
            </#params>
            <span>span{no}</span>
            <i>{no}</i>
          </div>
        </#each>
      </span>
      <#if {#:five(1):test}>
        <br />
      <#else />
        <img />
      </#if>
    </#each>
  </{div}>
  `;

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
      styles: "color:blue"
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
        this.setState({ num: Date.now() }, function() {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function () {
        var list2 = [{ no: 1 }, { no: 2 }, { no: 3 }];

        var start = Date.now();
        var ret = React.createElement('div', { id: this.state.num + '_100' }, this.props.arr.map(function (o, i) {
          return [
              React.createElement('span', { className: 'test_' + i, style: { color: 'blue' }, onClick: this.onClick },
                'test_' + this.state.num,
                list2.map(function(p, j) {
                  return [React.createElement('div', i % 5 == 0 ? { name: 'five' } : null,
                    React.createElement('span', null, 'span' + p.no),
                    React.createElement('i', null, p.no)
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
        var params = {
          arr: this.props.arr,
          num: this.state.num,
          list2: [{ no: 1 }, { no: 2 }, { no: 3 }],
          onClick: this.onClick,
          params: {
            'data-a': 1,
            'data-b': 2
          },
          styles: {
            color: 'blue'
          },
          div: 'div'
        };

        var ret = this.template(params);
        console.log('render:' + (Date.now() - start));
        return ret;
      }
    });

    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, {
      arr: _.times(500, function (n) {
        return n;
      }),
      a: 1,
      list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    }));

    //console.log(JSON.stringify(nj.templates['tmpl1']));
    //console.log(html);
    expect(html).toBeTruthy();
  });
});