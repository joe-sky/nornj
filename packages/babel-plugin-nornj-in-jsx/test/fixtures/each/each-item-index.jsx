const React = require('react');
const createReactClass = require('create-react-class');
const nj = require('nornj').default;
require('nornj-react');

module.exports = createReactClass({
  render: function() {
    return (
        <div>
        <each of={['xxxx','yyyy','zzzz',4]} item="itemAliases" index="indexAliases">
          <i>{itemAliases}</i>
          <i>{indexAliases}</i>
        </each>
      </div>
    );
  }
});
