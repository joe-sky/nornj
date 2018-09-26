const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <for end={60}>
          <i key={index}>{index}</i>
        </for>
      </div>
    );
  }
});
