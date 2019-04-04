const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <for i={30} to={60}>
          <i key={index}>{i}</i>
        </for>
      </div>
    );
  }
});
