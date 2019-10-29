const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr="value">
          <span>{attr}</span>
          <span>{attr}</span>
          <span>{attr}</span>
        </with>
      </div>
    );
  }
});
