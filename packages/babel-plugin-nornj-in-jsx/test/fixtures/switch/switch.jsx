const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <NjSwitch value={this.props.condition}>
          <Case value={'case1'}>
            <span>Case1Block</span>
          </Case>
          <Case value={'case2'}>
            <span>Case2Block</span>
          </Case>
          <Default>
            <span>DefaultBlock</span>
          </Default>
        </NjSwitch>
      </div>
    );
  }
});
