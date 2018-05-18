const React = require('react');
const createReactClass = require('create-react-class');
const nj = require('nornj').default;
require('nornj-react');

module.exports = createReactClass({
  render: function () {
    return (
      <if condition={this.props.condition === 'testIf'}>
        <span>IfBlock</span>
        <elseif condition={this.props.condition === 'testElseIf'}>
          <span>ElseIf-Block</span>
        </elseif>
        <elseif condition={this.props.condition === 'testElseIf2'}>
          <span>ElseIf-Block2</span>
        </elseif>
        <else>
          <span>ElseBlock</span>
        </else>
      </if>
    );
  }
});