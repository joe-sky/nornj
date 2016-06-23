var nj = require('../src/base'),
  utils = require('../src/utils/utils'),
  compile = require('../src/compiler/compile').compile,
  jsdom = require('jsdom'),
  React = require('react'),
  ReactDOM = require('react-dom'),
  ReactDOMServer = require('react-dom/server');

describe('test compile html', function () {
  beforeAll(function () {
    nj.setComponentEngine('react', React, ReactDOM);

    nj.registerFilter('filter1', function (v) {
      //console.log(this.useString);
      return v * 2;
    });
    nj.registerFilter('filter2', function (v) {
      return v + 5;
    });
    nj.registerFilter('filter3', function (v) {
      return !!v;
    });
  });

  describe('compile html template', function () {
    xit('test html 1', function (done) {
      nj.setTmplRule(null, null, '$');

      jsdom.env(
        `<div id="d1" data-test="1" name="{name}">
          <nj-$params>
            <nj-$param refer="{'name'}">{id:filter1 'test1' 'test2'}</nj-$param>
            <nj-$each refer="{list}">
              <nj-$param refer="{'data-name' no}">{no:filter1 'test1' 'test2'}</nj-$param>
            </nj-$each>
            <nj-$param refer="{'data-name10'}">
              <nj-$each refer="{list}">
                <nj-$if refer="{b}">
                  { no:filter2 }
                <nj-$else />
                  { '100':filter1 }
                </nj-$if>
              </nj-$each>
            </nj-$param>
          </nj-$params>
          <nj-{testCom} one-click=2></nj-{testCom}>
          <nj-TestComponent one-click=1></nj-TestComponent>
          <nj-$each refer="{ list }">
            <nj-$if refer="{b}">
              { no:filter1:filter2 'id' }
            <nj-$else />
              {no}
              <i>test{no}</i>
              <nj-br>
              </nj-br>
            </nj-$if>
            <section nj-style="{ ../styles }" class="test">
              <nj-$each refer="{ ../list }">
                _{no}_
              </nj-$each>
            </section>
            <br />
          </nj-$each>
        </div>`,
        function (err, window) {
          var TestComponent = React.createClass({
            render: function () {
              return React.createElement('button', null, 'click me' + this.props.oneClick);
            }
          });
          //console.log(window.document.querySelector('div').innerHTML);
          //nj.registerComponent('TestComponent', TestComponent);

          var data = {
            name: 'joe_sky',
            id: 100,
            test0: true,
            list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }],
            //styles: { color: 'blue', fontSize: '15px' },
            styles: "color:blue;font-size:15px;",
            //testcom: TestComponent
            testcom: 'testcom'
          };

          nj.registerComponent('TestComponent', TestComponent);

          //var templateT = nj.compileTagComponent(window.document.querySelector('div'), 'testT1');
          var templateT = nj.compile(window.document.querySelector('div'), 'testT1', false, true);
          //console.log(JSON.stringify(nj.templates['testT1']));
          //var html = ReactDOMServer.renderToStaticMarkup(templateT(data));
          var html = templateT(data);

          console.log(html);
          expect(html).toBeTruthy();
          done();
        }
      );
    });
  });
});