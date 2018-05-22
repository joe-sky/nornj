const React = require('react');
const createReactClass = require('create-react-class');
const nj = require('nornj').default;
require('nornj-react');

module.exports = createReactClass({
  render: function() {
    return (
        <div>
        <each of={this.props.of} item="item" index="index">
          <i>{item}</i>
          <i>{index}</i>
        </each>
      </div>
    );
  }
});
