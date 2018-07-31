const njInJsx = require('../src/index');
const styledJsx = require('styled-jsx/babel').default;

require('babel-core/register')({
  presets: ['babel-preset-react'],
  plugins: [
    styledJsx,
    [njInJsx, {
      delimiters: {
        start: '{',
        end: '}',
        comment: ''
      }
    }]
  ],
  cache: false
});

require('./specs/if.spec');
require('./specs/each.spec');
require('./specs/switch.spec');
require('./specs/with.spec');