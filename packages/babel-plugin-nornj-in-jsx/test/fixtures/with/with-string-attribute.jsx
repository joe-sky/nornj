const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr={`string`}>
          <span>{attr}</span>
        </with>
      </div>
    );
  }
});
