var React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  contentTmpl: nj`
    <i>${'content'}</i>
  `,

  render: function () {
    return (
      <div>{nj`<${'b'}>{content}</${'b'}>`({
        content: this.contentTmpl()
      })}</div>
    );
  }
});
