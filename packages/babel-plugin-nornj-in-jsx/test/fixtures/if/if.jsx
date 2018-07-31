const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <style jsx>{`
          div {
            margin: 0;
          }
        `}</style>
        <div id="test" className="bbb" n-show={this.props.show}>
          <if condition={this.props.condition === 'testIf'}>
            <span>IfBlock</span>
          </if>
        </div>
      </div>
    );
  }
});