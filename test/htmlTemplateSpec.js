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
        `<div id="d1" name="{name}">
          <nj-$each refer="{list}">
            <nj-$if refer="{b}">
              {no:filter1:filter2}
              <nj-$else>
                {no}
              </nj-$else>
            </nj-$if>
            <section nj-style="{../styles}" class="test">
              <nj-$each refer="{../list}">
                _{no}_
              </nj-$each>
            </section>
            <br />
          </nj-$each>
        </div>`,
        function (err, window) {
          var data = {
            name: 'joe_sky',
            id: 100,
            test0: true,
            list: [{ no: 1, b: 1 }, { no: 2, b: 0 }, { no: 3, b: 1 }],
            styles: { color: 'blue', fontSize: '15px' }
          };

          var templateT = nj.compileTagComponent(window.document.querySelector('div'), 'testT1');
          //console.log(JSON.stringify(nj.templates['testT1']));
          var html = ReactDOMServer.renderToStaticMarkup(templateT(data));

          console.log(html);
          expect(html).toBeTruthy();
          done();
        }
      );
    });
  });
});