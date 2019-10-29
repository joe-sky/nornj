const React = require('react');
const createReactClass = require('create-react-class');

const Wrap = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};
const Show = {
  Wrap
};
const Test = {
  Show
};

const Noop = () => <i>noop</i>;

module.exports = createReactClass({
  render: function() {
    const { show } = this.props;

    return (
      <div>
        <style jsx>{`
          div {
            margin: 0;
          }
        `}</style>
        <Test.Show.Wrap id="wrap" n-show={this.props.show} {...{ name: 'wrap' }} {...{ className: 'wrap' }}>
          <div className="test" n-show={`show == false`}>
            <if condition={this.props.condition}>
              {n`100 * 10 + ${20}`}
              <span>IfBlock</span>
              <else>
                <input n-show={`${this}.props.show`} />
                <div n-show={true} disabled>
                  <Noop>1</Noop>
                  <Noop id="1">2</Noop>
                  <Noop>3</Noop>
                </div>
              </else>
            </if>
          </div>
        </Test.Show.Wrap>
      </div>
    );
  }
});
