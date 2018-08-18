var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    var foo = 'variable';
    return (
      <div>
        <with bar="attribute">
          <span>{foo + bar}</span>
        </with>
      </div>
    );
  }
});
