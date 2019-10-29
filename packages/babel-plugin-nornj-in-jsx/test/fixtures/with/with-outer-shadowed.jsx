const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    const foo = 'variable';
    return (
      <div>
        <with foo="attribute">
          <span>{foo}</span>
        </with>
      </div>
    );
  }
});
