var nj = require("../src/base"),
  utils = require("../src/utils/utils"),
  compile = require("../src/compiler/compile").compile;

describe('test compile string', function () {
  beforeAll(function () {
    nj.registerFilter("filter1", function (v) {
      return v * 2;
    });
    nj.registerFilter("filter2", function (v) {
      return v + 5;
    });
    nj.registerFilter("filter3", function (v) {
      return !!!v;
    });
  });

  describe('compile string template to html', function () {
    it('test compile 1', function () {
      var data = {
        name: "joe_sky",
        id: 100,
        test0: true,
        list: [0, 1, 2]
      };

      //normal template
      var tmpl1 =
      ['div name1=../111', { name: "my name:{name},id:{id},name:{name}", id: "test1" },
        ["span",
          'sky:{name},{id}',
        '/span'],
        ['span1',
          'joe',
        '/span1'],
        ['div id=555',
          ['a /'],
          [
            ['input type=button /'],
            ['$if key={test0}',
                ['input id="test5" /'],
            '/$if']
          ],
        '/div'],
      '/div'];

      //string template by es5
      var tmpl2 =
      [
          '<div name1=../111>',
              '<span>',
                  '<img />',
                  'sky:{name},{id:filter2}',
                  '${0}',
              '</span>',
          '</div>'
      ].join('');

      //string template by es6
      var tmpl3 = nj`
        <div name=test1>
          test2
          <span>
            ${tmpl2}
            <img />
            sky:{name},{id:filter2}
            ${['section',
              tmpl1,
            '/section']}
            <input type=button />
            ${nj`
              <$each {list}>
                <slider>
                  <sliderItem no={.} />
                </slider>
              </$each>
            `}
          </span>
        </div>`;

      var tmplFn = compile(tmpl3, 'tmplEs6'),
        html = tmplFn(data);

      console.log(html);
      expect(html).toBeTruthy();
    });
  });
});