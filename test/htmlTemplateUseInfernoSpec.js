var nj = require('../src/base'),
  utils = require('../src/utils/utils'),
  compile = require('../src/compiler/compile').compile,
  jsdom = require('jsdom'),
  Inferno = require('inferno'),
  createElement = require('inferno/dist/inferno-create-element'),
  InfernoServer = require('inferno-server');

describe('test compile html', function () {
  beforeAll(function () {
    nj.registerFilter('filter1', function (v) {
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
    it('test html 1', function (done) {
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
          <!--<nj-{testCom} one-click=2></nj-{testCom}>-->
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
          global.window = window;
          var InfernoDOM = require('inferno-dom');
          nj.setComponentEngine('inferno', Inferno, InfernoDOM, createElement, 'render');

          //var TestComponent = React.createClass({
          //  render: function () {
          //    return React.createElement('button', null, 'click me' + this.props.oneClick);
          //  }
          //});
          //console.log(window.document.querySelector('div').innerHTML);
          //nj.registerComponent('TestComponent', TestComponent);

          var data = {
            name: 'joe_sky',
            id: 100,
            test0: true,
            list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }],
            styles: { color: 'blue', fontSize: '15px' },
            //testcom: TestComponent
          };

          //nj.registerComponent('TestComponent', TestComponent);

          var templateT = nj.compileTagComponent(window.document.querySelector('div'), 'testT1');
          //console.log(JSON.stringify(nj.templates['testT1']));
          //console.log(templateT(data));

          var html = InfernoServer.renderToString(templateT(data));

          console.log(html);
          expect(html).toBeTruthy();
          done();
        }
      );
    });
  });
});