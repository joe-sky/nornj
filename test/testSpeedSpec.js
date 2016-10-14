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
            <#params>
              <#if {../#:five}>
                <#p {'name'}>five</#p>
              </#if>
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

  var _tmpl = nj`
  <{div} id="{num '_100'}" {...props}>
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
            <#params>
              <#if {../#:five}>
                <#p {'name'}>five</#p>
              </#if>
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

  var ast = {
    "type": "nj_root",
    "content": [{
      "type": "{div}",
      "typeRefer": {
        "props": [{
          "prop": {
            "name": "div"
          },
          "escape": true
        }],
        "strs": ["", ""],
        "isAll": true
      },
      "params": {
        "id": {
          "props": [{
            "prop": {
              "name": "num"
            },
            "escape": true
          },
          {
            "prop": {
              "name": "_100",
              "isStr": true
            },
            "escape": true
          }],
          "strs": ["", "", ""],
          "isAll": false
        }
      },
      "content": [{
        "type": "nj_plaintext",
        "content": [{
          "props": null,
          "strs": ["&nbsp;1&gt;2"],
          "isAll": false
        }]
      },
      {
        "type": "nj_expr",
        "expr": "each",
        "refer": {
          "props": [{
            "prop": {
              "name": "arr"
            },
            "escape": true
          }],
          "strs": ["", ""],
          "isAll": true
        },
        "content": [{
          "type": "TestComp",
          "content": [],
          "paramsExpr": {
            "type": "nj_expr",
            "expr": "params",
            "content": [{
              "type": "nj_expr",
              "expr": "param",
              "refer": {
                "props": [{
                  "prop": {
                    "name": "id",
                    "isStr": true
                  },
                  "escape": true
                }],
                "strs": ["", ""],
                "isAll": true
              },
              "content": [{
                "type": "nj_plaintext",
                "content": [{
                  "props": null,
                  "strs": [{
                    "_njShim": [{
                      "id": 1
                    }]
                  }],
                  "isAll": false
                }]
              }]
            }]
          },
          "params": {
            "tmpls": {
              "props": null,
              "strs": [{
                "0": {
                  "type": "nj_expr",
                  "expr": "tmpl",
                  "content": [{
                    "type": "span",
                    "content": [{
                      "type": "nj_plaintext",
                      "content": [{
                        "props": [{
                          "prop": {
                            "name": "test"
                          },
                          "escape": true
                        }],
                        "strs": ["", ""],
                        "isAll": true
                      }]
                    }]
                  }]
                },
                "length": 1
              }],
              "isAll": false
            }
          }
        },
        {
          "type": "span",
          "params": {
            "class": {
              "props": [{
                "prop": {
                  "name": "#"
                },
                "escape": true
              }],
              "strs": ["test_", ""],
              "isAll": false
            },
            "style": {
              "props": [{
                "prop": {
                  "parentNum": 1,
                  "name": "styles"
                },
                "escape": true
              }],
              "strs": ["", ""],
              "isAll": true
            },
            "onClick": {
              "props": [{
                "prop": {
                  "parentNum": 1,
                  "name": "onClick"
                },
                "escape": true
              }],
              "strs": ["", ""],
              "isAll": true
            }
          },
          "content": [{
            "type": "nj_plaintext",
            "content": [{
              "props": [{
                "prop": {
                  "parentNum": 1,
                  "name": "num"
                },
                "escape": true
              }],
              "strs": ["test_", ""],
              "isAll": false
            }]
          },
          {
            "type": "nj_expr",
            "expr": "each",
            "refer": {
              "props": [{
                "prop": {
                  "parentNum": 1,
                  "name": "list2"
                },
                "escape": true
              }],
              "strs": ["", ""],
              "isAll": true
            },
            "content": [{
              "type": "div",
              "params": {
                "key": {
                  "props": [{
                    "prop": {
                      "name": "#"
                    },
                    "escape": true
                  }],
                  "strs": ["", ""],
                  "isAll": true
                }
              },
              "content": [{
                "type": "span",
                "content": [{
                  "type": "nj_plaintext",
                  "content": [{
                    "props": [{
                      "prop": {
                        "name": "no"
                      },
                      "escape": true
                    }],
                    "strs": ["span", ""],
                    "isAll": false
                  }]
                }]
              },
              {
                "type": "i",
                "content": [{
                  "type": "nj_plaintext",
                  "content": [{
                    "props": [{
                      "prop": {
                        "name": "no"
                      },
                      "escape": true
                    }],
                    "strs": ["", ""],
                    "isAll": true
                  }]
                }]
              }],
              "paramsExpr": {
                "type": "nj_expr",
                "expr": "params",
                "content": [{
                  "type": "nj_expr",
                  "expr": "if",
                  "refer": {
                    "props": [{
                      "prop": {
                        "filters": [{
                          "name": "five"
                        }],
                        "parentNum": 1,
                        "name": "#"
                      },
                      "escape": true
                    }],
                    "strs": ["", ""],
                    "isAll": true
                  },
                  "content": [{
                    "type": "nj_expr",
                    "expr": "p",
                    "refer": {
                      "props": [{
                        "prop": {
                          "name": "name",
                          "isStr": true
                        },
                        "escape": true
                      }],
                      "strs": ["", ""],
                      "isAll": true
                    },
                    "content": [{
                      "type": "nj_plaintext",
                      "content": [{
                        "props": null,
                        "strs": ["five"],
                        "isAll": false
                      }]
                    }]
                  }]
                }]
              }
            }]
          }]
        },
        {
          "type": "nj_expr",
          "expr": "if",
          "refer": {
            "props": [{
              "prop": {
                "filters": [{
                  "params": ["1"],
                  "name": "five"
                },
                {
                  "name": "test"
                }],
                "name": "#"
              },
              "escape": true
            }],
            "strs": ["", ""],
            "isAll": true
          },
          "content": [{
            "selfCloseTag": true,
            "type": "br"
          }],
          "hasElse": true,
          "contentElse": [{
            "selfCloseTag": true,
            "type": "img"
          }]
        }]
      }],
      "paramsExpr": {
        "type": "nj_expr",
        "expr": "params",
        "content": [{
          "type": "nj_expr",
          "expr": "spreadparam",
          "refer": {
            "props": [{
              "prop": {
                "name": "props"
              },
              "escape": true
            }],
            "strs": ["", ""],
            "isAll": true
          }
        }]
      }
    }]
  };

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
            <#params>
              <#if {../#:five}>
                <#p {'name'}>five</#p>
              </#if>
            </#params>
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

  xit('test render to string by hbs', function () {
    var data = {
      div: 'div',
      num: 100,
      arr: _.times(1000, function (n) {
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
      arr: _.times(5, function (n) {
        return n;
      }),
      list2: _.times(2, function (n) {
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

    var list2 = _.times(5, function (n) {
      return { no: n + 1 };
    });

    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, {
      arr: _.times(2, function (n) {
        return n;
      }),
      a: 1,
      list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    }));


    console.log(html);
    expect(html).toBeTruthy();
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
      template: nj.compileComponent(_tmpl, 'tmpl1'),
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
          props: {
            'data-a': 1,
            'data-b': 2
          }
        };

        var ret = this.template(params);
        console.log('nj:' + (Date.now() - start));
        return ret;
      }
    });

    var list2 = _.times(5, function (n) {
      return { no: n + 1 };
    });

    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, {
      arr: _.times(2, function (n) {
        return n;
      }),
      a: 1,
      list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }]
    }));

    //console.log(JSON.stringify(nj.asts['tmpl1']));
    console.log(html);
    expect(html).toBeTruthy();
  });

  xit('test compile', function () {
    nj.compileComponent(tmpl, 'tmpl1');
    //console.log(JSON.stringify(nj.asts['tmpl1']));
  });
});
