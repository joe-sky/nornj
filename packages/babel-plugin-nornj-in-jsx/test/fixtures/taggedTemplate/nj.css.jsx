var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <i style={s`color:blue`}>content</i>
      </div>
    );
  }
});
