var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr="value">
          text child {attr}
        </with>
      </div>
    );
  }
});
