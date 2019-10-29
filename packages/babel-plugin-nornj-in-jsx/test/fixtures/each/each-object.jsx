const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <each of={{ b: 2, a: 1 }} item="item" index="index" $key="key">
          <i>{key}</i>
          <i>{index}</i>
          <i>{item}</i>
        </each>
      </div>
    );
  }
});
