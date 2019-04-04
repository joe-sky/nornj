var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>{t`
        <i>${'content'}</i>
      `}</div>
    );
  }
});
