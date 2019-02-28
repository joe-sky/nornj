var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div dangerouslySetInnerHTML={{
        __html: njs`<i>${'content'}</i>`()
      }} />
    );
  }
});
