var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr1="value1" attr2="value2" attr3="value3">
          <span>{attr1 + attr2 + attr3}</span>
        </with>
      </div>
    );
  }
});
