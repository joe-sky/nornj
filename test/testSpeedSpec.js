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
  <{div} id="{num}_100">
    <#each {arr}>
      <span class=test_{#}
            style={../styles}
            onClick={../onClick}>
        test_{../num}
        <#each {../list2}>
          <div key={#}>
            <#props>
              <#if {../# | five}>
                <@name>five</@name>
              </#if>
            </#props>
            <span>span{no}</span>
            <i>{no}</i>
          </div>
        </#each>
      </span>
      <#if {# | five(1) | test}>
        <br />
      <#else />
        <img />
      </#if>
    </#each>
  </{div}>
  `;

  var tmplFns = {
    useString: false,
    fn4: function (p1, p2, p3, p4) {
      return 'five';
    },
    fn3: function (p1, p2, p3, p4) {
      var _expr0 = p1.exprs['prop'];
      p1.throwIf(_expr0, 'prop', 'expr');

      return _expr0.call({
        useString: p1.useString,
        paramsExpr: p4,
        result: p1.exprRet(p1, p2, p1.fn4, p4)
      }, 'name');
    },
    fn2: function (p1, p2, p3, p4) {
      var _p2 = p1.newContextVars(p1, p2, p3),
        parent = _p2.parent,
        data = _p2.data,
        multiData = _p2.multiData;

      var _paramsE0 = {};

      var _expr0 = p1.exprs['if'];
      var _value0 = parent.parent.index;

      var _filter0 = p1.filters['five'];
      if (!_filter0) {
        p1.warn('five', 'filter');
      }
      else {
        _value0 = _filter0.call({
          useString: p1.useString,
          data: parent.data,
          parent: parent.parent,
          index: parent.index
        }, _value0);
      }

      p1.throwIf(_expr0, 'if', 'expr');

      _expr0.call({
        useString: p1.useString,
        result: p1.exprRet(p1, _p2, p1.fn3, _paramsE0),
        inverse: p1.noop
      }, _value0);

      _paramsE0['key'] = parent.index;

      return p1.h('div', _paramsE0,
        p1.h('span', null, 'span' + ((!multiData ? data['no'] : p1.getDatasValue(data, 'no')))),
        p1.h('i', null, (!multiData ? data['no'] : p1.getDatasValue(data, 'no')))
      );
    },
    fn5: function (p1, p2, p3, p4) {
      return p1.h('br');
    },
    fn6: function (p1, p2, p3, p4) {
      return p1.h('img');
    },
    fn1: function (p1, p2, p3, p4) {
      var _p2 = p1.newContextVars(p1, p2, p3),
        parent = _p2.parent,
        data = _p2.data,
        multiData = _p2.multiData;

      var _expr0 = p1.exprs['each'];
      p1.throwIf(_expr0, 'each', 'expr');

      var _expr1 = p1.exprs['if'];
      var _value0 = parent.index;

      var _filter0 = p1.filters['five'];
      if (!_filter0) {
        p1.warn('five', 'filter');
      }
      else {
        _value0 = _filter0.call({
          useString: p1.useString,
          data: parent.data,
          parent: parent.parent,
          index: parent.index
        }, _value0, '1');
      }

      var _filter1 = p1.filters['test'];
      if (!_filter1) {
        p1.warn('test', 'filter');
      }
      else {
        _value0 = _filter1.call({
          useString: p1.useString,
          data: parent.data,
          parent: parent.parent,
          index: parent.index
        }, _value0);
      }

      p1.throwIf(_expr1, 'if', 'expr');

      return [
        p1.h('span', {
          'className': 'test_' + (parent.index),
          'style': p1.styleProps(parent.parent.data['styles']),
          'onClick': parent.parent.data['onClick']
        }, 'test_' + (parent.parent.data['num']),
          _expr0.call({
            useString: p1.useString,
            result: p1.exprRet(p1, _p2, p1.fn2, p4),
            inverse: p1.noop
          }, parent.parent.data['list2'])
        ),
        _expr1.call({
          useString: p1.useString,
          result: p1.exprRet(p1, _p2, p1.fn5, p4),
          inverse: p1.exprRet(p1, _p2, p1.fn6, p4)
        }, _value0)
      ];
    },
    main: function (p1, p2, p3, p4) {
      var parent = p2.parent,
        data = p2.data,
        multiData = p2.multiData;
      if (!parent) {
        if (data) parent = { data: multiData ? data[0] : data };
        else parent = {};
        p2.parent = parent;
      };

      var _typeRefer0 = (!multiData ? data['div'] : p1.getDatasValue(data, 'div'));
      var _type0 = _typeRefer0 ? _typeRefer0 : 'div';

      var _expr0 = p1.exprs['each'];
      p1.throwIf(_expr0, 'each', 'expr');

      return p1.h(_type0, {
        'id': ((!multiData ? data['num'] : p1.getDatasValue(data, 'num'))) + '_100'
      }, _expr0.call({
        useString: p1.useString,
        result: p1.exprRet(p1, p2, p1.fn1, p4),
        inverse: p1.noop
      }, (!multiData ? data['arr'] : p1.getDatasValue(data, 'arr')))
      );
    }
  };

  var _tmpl = nj`
  <{div} id="{num}_100">{...props}
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
              <#if {../# | five}>
                <@name>five</@name>
              </#if>
            </#props>
            <span>span{no}</span>
            <i>{no}</i>
          </div>
        </#each>
      </span>
      <#if {# | five(1) | test}>
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
              <#if {../# | five}>
                <@name>five</@name>
              </#if>
            </#props>
            <span>span{no}</span>
            <i>{no}</i>
          </div>
        </#each>
      </span>
      <#if {# | five}>
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

  xit('test render to string by hbs', function () {
    var data = {
      div: 'div',
      num: 100,
      arr: _.times(200, function (n) {
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

  xit('test render to string by nj', function () {
    var data = {
      div: 'div',
      num: 100,
      arr: _.times(200, function (n) {
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

  xit('test render to component by jsx', function () {
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

    var list2 = _.times(100, function (n) {
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

  it('test render to component by nj', function () {
    var start,
      T = nj.tmplByKey('TestComp');

    nj.registerComponent('TestComp', React.createClass({
      render: function () {
        return T`<div><#each {arr}>{!#../text}</#each></div>`.renderComponent({
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
          styles: {
           color: 'blue'
          },
          //styles: 'color:blue',
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

    var list2 = _.times(100, function (n) {
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
});
