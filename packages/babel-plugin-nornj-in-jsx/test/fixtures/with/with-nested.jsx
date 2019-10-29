const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr1="outer">
          <with attr2="inner">
            <span>{attr1 + attr2}</span>
          </with>
        </with>
      </div>
    );
  }
});
