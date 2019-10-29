const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    this.foo = 'outer';
    return (
      <div>
        <with foo="attribute">
          <span>{foo + this.foo}</span>
        </with>
      </div>
    );
  }
});
