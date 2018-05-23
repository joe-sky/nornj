const React = require('react');
const createReactClass = require('create-react-class');
const nj = require('nornj').default;
require('nornj-react');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
      <switch value={1}>
        <case value={1}><span>Case1Block</span></case>
        <case value={2}><span>Case2Block</span></case>
        <default>
          <span>DefaultBlock</span>
        </default>
      </switch>
      </div>
    );
  }
});