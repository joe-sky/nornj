var nj = require("../src/base"),
    utils = require("../src/utils/utils");

describe('test convert template', function () {
	xit('test convert 1', function () {
            var tmpl =
            ["<div name1=../111>", { name: "my name:fanyj,id:1231,name:name", id: "test1" },
                ["<span>", "sky:name,id"],
                ["span1", "joe", "/span1"],
                ["div id=555", [
                    ["<a />"],
                    ["input type=button /"],
                    ['$if key={test0}',
                        ['input id="test5" /']
                    ]
                ], "/div"]
            ];

			var root = {
				type : "nj_root",
				content : []
			}; 
            
            utils.checkElem(tmpl, root);

            console.log(root.content);
            
            
            expect(root).toBeTruthy();
        });    
});

