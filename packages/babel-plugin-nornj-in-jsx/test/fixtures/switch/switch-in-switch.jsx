const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
      <switch value={this.props.condition1}>
        <case value={'case1'}>
          <switch value={this.props.condition2}>
            <case value={1}>
              <i>NestedCase1Block</i>
            </case>
            <case value={2}>
              <i>NestedCase2Block</i>
            </case>
            <default>
              NestedDefaultBlock
            </default>
          </switch>
        </case>
        <case value={'case2'}>
          <span>Case2Block</span>
        </case>
        <default>
          <span>DefaultBlock</span>
        </default>
      </switch>
      </div>
    );
  }
});