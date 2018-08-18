var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <with attr={() => 'expr' + 'ession'}>
          <span>{attr()}</span>
        </with>
      </div>
    );
  }
});
