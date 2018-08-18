var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    var foo = 'variable';
    return (
      <div>
        <span>{foo}</span>
        <with foo="attribute">
          <span>{foo}</span>
        </with>
        <span>{foo}</span>
      </div>
    );
  }
});
