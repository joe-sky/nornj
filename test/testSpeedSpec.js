var nj = require('../src/base'),
  utils = require('../src/utils/utils'),
  compiler = require('../src/compiler/compile'),
  compile = compiler.compile,
  _ = require('lodash'),
  React = require('react'),
  ReactDOM = require('react-dom'),
  ReactDOMServer = require('react-dom/server'),
  Handlebars = require('handlebars');

describe('test speed', function () {
  var tmpl = nj`
  <{div} id="{num '_100'}">
    <#each {arr}>
      <span class=test_{#}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <#each {../list2}>
          <div key={#}>
            <#props>
              <#if {../#:five}>
                <#prop {'name'}>five</#prop>
              </#if>
            </#props>
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

  var _tmpl = nj`
  <{div} id="{num '_100'}">{...props}
    &nbsp;1&gt;2
    <#each {arr}>
      <TestComp id=@${'false'}>
        <#tmpl>
          <span>{text}</span>
        </#tmpl>
        <#tmpl {'t2'}>
          <span key={#}>{.}test!</span>
        </#tmpl>
      </TestComp>
      <span class=test_{#}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <#each {../list2}>
          <div key={#}>
            <#props>
              <#if {../#:five}>
                <#prop {'name'}>five</#prop>
              </#if>
            </#props>
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

  var tmplHbs = `
  <{{div}} id="{{num}}_100" id2="2">
    {{#each arr}}
      <span class="test_{{@index}}">
        test_{{../num}}
        {{#each ../list2}}
          <div key="{{@index}}"{{#five @../index}} name="five"{{/five}}>
            <span>span{{no}}</span>
            <i>{{no}}</i>
          </div>
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

  var tmplNj = nj`
  <{div} id="{num}_100" id2="2">
    <#each {arr}>
      <span class="test_{#}">
        test_{../num}
        <#each {../list2}>
          <div key="{#}">
            <#props>
              <#if {../#:five}>
                <#prop {'name'}>five</#prop>
              </#if>
            </#props>
            <span>span{no}</span>
            <i>{no}</i>
          </div>
        </#each>
      </span>
      <#if {#:five}>
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

    Handlebars.registerHelper('five', function (num, options) {
      if (num % 5 == 0) {
        return options.fn(this);
      }
      else {
        return options.inverse(this);
      }
    });
  });

  it('test render to component by nj', function () {
    var start,
      T = nj.tmplByKey('TestComp');

    nj.registerComponent('TestComp', React.createClass({
      render: function () {
        return T`<div><#each {arr}>{!#../text}</#each></div>`.renderComp({
          text: this.props.tmpls['t2'],
          arr: _.times(2, function (n) {
            return n;
          })
        });
      }
    }));

    var TestComponent = React.createClass({
      getInitialState: function () {
        return {
          num: 100
        };
      },
      template: nj.compileComponent(tmpl, 'tmpl1'),
      onClick: function () {
        this.setState({ num: Date.now() }, function () {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function () {
        start = Date.now();
        var params = {
          arr: this.props.arr,
          num: this.state.num,
          list2: list2,
          onClick: this.onClick,
          params: {
            'data-a': 1,
            'data-b': 2
          },
          //styles: {
          //  color: 'blue'
          //},
          styles: 'color:blue',
          div: 'div',
          //props: {
          //  'data-a': 1,
          //  'data-b': 2
          //}
        };

        var ret = this.template(params);
        console.log('nj:' + (Date.now() - start));
        return ret;
      }
    });

    var list2 = _.times(50, function (n) {
      return { no: n + 1 };
    });

    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, {
      arr: _.times(100, function (n) {
        return n;
      }),
      a: 1,
      list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    }));

    //console.log(JSON.stringify(nj.asts['tmpl1']));
    //console.log(html);
    expect(html).toBeTruthy();
  });

  it('test render to component by jsx', function () {
    var start;
    var TestComponent = React.createClass({
      getInitialState: function () {
        return {
          num: 100
        };
      },
      onClick: function () {
        this.setState({ num: Date.now() }, function () {
          console.log('total:' + (Date.now() - start));
        });
      },
      render: function () {
        start = Date.now();
        var ret = React.createElement('div', { id: this.state.num + '_100' }, this.props.arr.map(function (o, i) {
          return [
              React.createElement('span', { className: 'test_' + i, style: { color: 'blue' }, onClick: this.onClick },
                'test_' + this.state.num,
                list2.map(function (p, j) {
                  return React.createElement('div', i % 5 == 0 ? { name: 'five', key: j } : { key: j },
                    React.createElement('span', null, 'span' + p.no),
                    React.createElement('i', null, p.no)
                  );
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

        console.log('jsx:' + (Date.now() - start));
        return ret;
      }
    });

    var list2 = _.times(50, function (n) {
      return { no: n + 1 };
    });

    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, {
      arr: _.times(100, function (n) {
        return n;
      }),
      a: 1,
      list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    }));


    //console.log(html);
    expect(html).toBeTruthy();
  });

  it('test render to string by nj', function () {
    var data = {
      div: 'div',
      num: 100,
      arr: _.times(500, function (n) {
        return n;
      }),
      list2: _.times(100, function (n) {
        return { no: n + 1 };
      })
    };

    var tmplFn = nj.compile(tmplNj);
    var start = Date.now();
    var ret = tmplFn(data);
    //console.log(ret);
    console.log('nj:' + (Date.now() - start));
    expect(ret).toBeTruthy();
  });

  it('test render to string by hbs', function () {
    var data = {
      div: 'div',
      num: 100,
      arr: _.times(500, function (n) {
        return n;
      }),
      list2: _.times(100, function (n) {
        return { no: n + 1 };
      })
    };

    var tmplFn = Handlebars.compile(tmplHbs);
    var start = Date.now();
    var ret = tmplFn(data);
    //console.log(ret);
    console.log('hbs:' + (Date.now() - start));
    expect(ret).toBeTruthy();
  });
});
