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
                test0: true
            };

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
            
            var tmplFn = compile(nj(tmpl2, tmpl1)),
                html = tmplFn(data);

            console.log(html);
            expect(html).toBeTruthy();
        });
    });
});