const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <each of={this.props.of} item="item" index="index">
          <div key={index}>
            {/* <if condition={last}>last one</if> */}
            <i>{item}</i>
            <i>{index}</i>
          </div>
        </each>
      </div>
    );
  }
});
