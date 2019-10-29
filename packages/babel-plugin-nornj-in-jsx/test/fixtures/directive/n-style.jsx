const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div>
        <style jsx>{`
          input {
            margin: 0;
          }
        `}</style>
        <if condition={this.props.condition}>
          <input n-style="margin:0;padding-left:15px" />
          <else>
            <input n-style={`margin:${10};padding-left:15px`} />
          </else>
        </if>
      </div>
    );
  }
});
