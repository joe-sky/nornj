import precompiler from 'nornj/precompiler';

//Precompile all nornj templates which use "nornj.js" names to the end.
precompiler({
  source: __dirname + '/templates/**/*.nornj.js',
  extension: '.nornj.js'
});