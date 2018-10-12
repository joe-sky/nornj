const njInJsx = require('../src/index');
const styledJsx = require('styled-jsx/babel').default;
const objectRestSpread = require('babel-plugin-transform-object-rest-spread');

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
    }],
    objectRestSpread
  ],
  cache: false
});

require('./specs/if.spec');
require('./specs/each.spec');
require('./specs/switch.spec');
require('./specs/with.spec');
//require('./specs/fn.spec');
require('./specs/exAttr.spec');