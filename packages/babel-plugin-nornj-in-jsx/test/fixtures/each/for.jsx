const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <for of={`30 .. 60`}>
          <i key={index}>{item}</i>
        </for>
      </div>
    );
  }
});
