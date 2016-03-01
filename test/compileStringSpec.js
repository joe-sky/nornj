var nj = require("../src/base"),
    utils = require("../src/utils/utils"),
    compile = require("../src/compiler/compile").compile,
    compileStringTmpl = require("../src/checkElem/checkStringElem");

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
                id: "joe",
                test0: true
            };

            //var tmpl =
            //["<div name1=../111>", { name: "my name:{name},id:{id},name:{name}", id: "test1" },
            //    ["<span>", "sky:{name},{id}"],
            //    ["span1", "joe", "/span1"],
            //    ["div id=555", [
            //        ["<a />"],
            //        ["input type=button /"],
            //        ['$if key={test0}',
            //            ['input id="test5" /']
            //        ]
            //    ], "/div"]
            //];

            var tmpl =
            [
                '<div name1=111>',
                    '<span>',
                        '<img />',
                        'sky:{name},{id}',
                    '</span>',
                '</div>'
            ].join('');

            //console.log(compileStringTmpl(tmpl));

            var tmplFn = compile(compileStringTmpl(tmpl)),
                html = tmplFn(data);

            console.log(html);
            expect(html).toBeTruthy();
        });
    });
});