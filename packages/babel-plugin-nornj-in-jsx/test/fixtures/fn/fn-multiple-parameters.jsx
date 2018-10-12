var React = require('react');
const createReactClass = require('create-react-class');

const Wrap = ({ children, ...props }) => {
  return (
    <div>
      {children(props.prefix, props.suffix)}
    </div>
  );
};

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <Wrap prefix="123" suffix="456">
          <fn prefix suffix>
            <i><b>{prefix}</b>content<b>{suffix}</b></i>
          </fn>
        </Wrap>
      </div>
    );
  }
});
