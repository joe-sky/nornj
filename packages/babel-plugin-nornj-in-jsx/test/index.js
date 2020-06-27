const nornjInJsx = require('../src/index');
const styledJsx = require('styled-jsx/babel').default;
const objectRestSpread = require('@babel/plugin-proposal-object-rest-spread').default;

require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    styledJsx,
    [
      nornjInJsx,
      {
        // delimiters: {
        //   start: '{',
        //   end: '}',
        //   comment: ''
        // },
        filterConfig: {
          cut: {
            onlyGlobal: true,
            hasOptions: true
          }
        },
        extensionConfig: {
          simpleFor: {
            newContext: {
              data: {
                item: 'item',
                index: 'index',
                first: 'firstItem'
              }
            }
          },
          while: true,
          set: true,
          switch: {
            needPrefix: 'onlyUpperCase'
          }
        }
      }
    ],
    objectRestSpread
  ],
  cache: false
});

require('./specs/if.spec');
require('./specs/each.spec');
require('./specs/switch.spec');
require('./specs/with.spec');
require('./specs/directive.spec');
require('./specs/taggedTemplate.spec');
require('./specs/customTag.spec');
