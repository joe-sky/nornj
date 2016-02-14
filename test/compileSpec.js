var nj = require("../src/base"),
    utils = require("../src/utils/utils"),
    compile = require("../src/compiler/compile").compile;

describe('test compile', function () {
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

    describe('compile to html', function () {
        xit('compile', function () {
            var data = {
                name: "joe_sky",
                id: "joe",
                test0: true
            };

            var tmpl =
            ["<div name1=../111>", { name: "my name:{name},id:{id},name:{name}", id: "test1" },
                ["<span>", "sky:{name},{id}"],
                ["span1", "joe", "/span1"],
                ["div id=555", [
                    ["<a />"],
                    ["input type=button /"],
                    ['$if key={test0}',
                        ['input id="test5" /']
                    ]
                ], "/div"]
            ];

            var tmplFn = compile(tmpl),
                html = tmplFn(data);

            console.log(html);
            expect(html).toBeTruthy();
        });

        it('compile to html 2', function () {
            var data = {
                name: "joe_sky<input>",
                id: "joe",
                id2: 555,
                key: true,
                key2: [1, 2, 3],
                key3: [
                    { id: 1 }, { id: 2 }, { id: 3 }
                ],
                key4: [1, 2, 3]
            };

            var tmplSon =
            ["$each {key4}",
                ['<h1>', { ids: 'hello world333 !!!!!___{../id2:filter1}' },
                    'test___',
                    [
                        "aaa{.:filter1:filter2}",
                        "bbb",
                        "ccc",
                        ['$each {../key3}',
                            ['$each {../../key2}', 'ddd{.}']
                        ]
                    ]
                ],
            "$else",
                "aaaaa!! {name}"
            ];

            var tmpl =
            ['<div>', { id: 1, name: 'test1', fn: "fn" },
                ['<h1 name=test10>', { id: 'testH1' },
                    'hello world1',
                    ['<div>', { id: 'test2' }],
                    ['<divx name={{name}} />'],
                    ['img/'],
                    ['input id="test5" /'],
                '</h1>'],
                ['h2',
                    ['hello world2',
                    ['<div>', 'test3']],
                '/h2'],
                ["$if {key:filter3}",
                    ['<h3>', 'hello world3 !!!'],
                "$else",
                    tmplSon
                ],
            '</div>'];

            var tmplFn = compile(tmpl, "newTmpl"),
                html = tmplFn(data);

            console.log(html);
            expect(html).toBe("<div id='1' name='test1' fn='fn'><h1 id='testH1' name='test10'>hello world1<div id='test2'></div><divx name='joe_sky<input>'/><img/><input id='test5'/></h1><h2>hello world2<div>test3</div></h2><h1 ids='hello world333 !!!!!___1110'>test___aaa7bbbcccddd1ddd2ddd3ddd1ddd2ddd3ddd1ddd2ddd3</h1><h1 ids='hello world333 !!!!!___1110'>test___aaa9bbbcccddd1ddd2ddd3ddd1ddd2ddd3ddd1ddd2ddd3</h1><h1 ids='hello world333 !!!!!___1110'>test___aaa11bbbcccddd1ddd2ddd3ddd1ddd2ddd3ddd1ddd2ddd3</h1></div>");
        });
    });
});