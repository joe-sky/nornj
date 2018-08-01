const React = require('react');
const createReactClass = require('create-react-class');

const Wrap = ({ children, ...props }) => {
  return <p {...props}>
    {children}
  </p>;
};

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <style jsx>{`
          div {
            margin: 0;
          }
        `}</style>
        <Wrap id="wrap" n-show={this.props.show} {...{ name: 'wrap' }} {...{ className: 'wrap' }}>
          <div className="test" n-show={!this.props.show}>
            <if condition={this.props.condition}>
              <span>IfBlock</span>
              <else>
                <input n-show={this.props.show} />
              </else>
            </if>
          </div>
        </Wrap>
      </div>
    );
  }
});