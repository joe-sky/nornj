'use strict';

var nj = require('./src/base'),
  precompile = nj.precompile,
  glob = require('glob'),
  fs = require('fs');
  
module.exports = function(param){
	glob.sync(param.source).forEach(function (file) {
		var f = file.substr(0,file.lastIndexOf('.')),
		    n = f.substr(0,f.lastIndexOf('.'))+".js",
		    content = "";
		    
		var c = require(f);
		
		content = (param.esVersion && param.esVersion == "es6") ? "export default ":"module.exports = ";
		content += JSON.stringify(precompile(c));

		fs.writeFile(n, content, function(err) {
			if (err)
				console.log(JSON.stringify(err));
		}); 
		
	});
};

