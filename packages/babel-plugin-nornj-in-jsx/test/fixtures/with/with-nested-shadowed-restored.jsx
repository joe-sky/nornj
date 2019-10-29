const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr="outer">
          <span>{attr}</span>
          <with attr="inner">
            <span>{attr}</span>
          </with>
          <span>{attr}</span>
        </with>
      </div>
    );
  }
});
