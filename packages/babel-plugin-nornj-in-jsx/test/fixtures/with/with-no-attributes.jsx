const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    const test = 'test';
    return (
      <div>
        <with>
          <span>{test}</span>
        </with>
      </div>
    );
  }
});
