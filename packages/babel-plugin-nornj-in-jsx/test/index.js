var plugin = require('../src/index');

require('babel-core/register')({
  presets: ['babel-preset-react'],
  plugins: [plugin],
  cache: false
});

require('./specs/if.spec');