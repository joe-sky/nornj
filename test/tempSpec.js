var nj = require('../src/base'),
  utils = require('../src/utils/utils'),
  compiler = require('../src/compiler/compile'),
  compile = compiler.compile;

describe('test convert template', function () {
  xit('test convert 1', function () {
    var tmpl =
    ['<div name1=../111>', { name: 'my name:fanyj,id:1231,name:name', id: 'test1' },
      ['<span>', 'sky:name,id'],
      ['span1', 'joe', '/span1'],
      ['div id=555', [
        ['<a />'],
        ['input type=button /'],
        ['$if key={test0}',
          ['input id="test5" /']
        ]
      ], '/div']
    ];

    var root = {
      type: 'nj_root',
      content: []
    };

    utils.checkElem(tmpl, root);

    console.log(root.content);
    expect(root).toBeTruthy();
  });

  xit('test convert 2', function () {
    var tmpl =
    ['<div name1=../111>',
      ['$params',
        ['$if {test0}',
          ['$param {@name}', 'my name:jesy,id:1231,name:name'],
        '$else',
          ['$param {@name2:filter}', 'my name:jesy'],
        ],
        ['$param {@id}', '{test0:filter1 @test1:filter2 @test2}'],
      ],
      ['<span>', 'sky:name,id']
    ];

    var tmpl2 = nj`
    <div name1=../111>
      <$params>
        <$if {test0}>
          <$param {@name}>my name:jesy,id:1231,name:name</$param>
        <$else />
          <$param {@name2:filter1}>my name:jesy</$param>
        </$if>
        <$param {@id}>{test0:filter1 @test1:filter2 @test2}</$param>
      </$params>
      ${['<span>', 'sky:name,id']}
    </div>
    `;

    var data = {
      name: "joe_sky",
      id: "<joe/>",
      test0: true,
      num: 100
    };

    var tmplFn = compile(tmpl, 'tmplTmp1'),
      html = tmplFn(data);

    console.log(html);
    expect(html).toBeTruthy();
  });
});