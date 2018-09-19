const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <switch value={this.props.condition}>
          <case value={'case1'}>
            <span>Case1Block</span>
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