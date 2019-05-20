const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <if {...{ condition: this.props.condition === 'testIf' }}>
        <span>IfBlock</span>
        <else>
          <span>ElseBlock</span>
        </else>
      </if>
    );
  }
});