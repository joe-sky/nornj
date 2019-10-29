const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr1="used" attr2="unused">
          <span>{attr1}</span>
        </with>
      </div>
    );
  }
});
