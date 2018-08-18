const Jasmine = require('jasmine');
const jasmine = new Jasmine();

jasmine.loadConfig({
  spec_dir: 'test/',
  spec_files: [
    //'misc/simple.spec.js',
    //'compiler/compile.spec.js',
    'helpers/extensionAttribute.spec.js',
  ],
  helpers: [
    '../node_modules/babel-core/register.js'
  ]
});

jasmine.execute();