var React = require('react');
const createReactClass = require('create-react-class');
const content = 'content';

module.exports = createReactClass({
  render: function () {
    return (
      <div dangerouslySetInnerHTML={{
        __html: n`['<i>', content, '</i>'].join('')`
      }} />
    );
  }
});
