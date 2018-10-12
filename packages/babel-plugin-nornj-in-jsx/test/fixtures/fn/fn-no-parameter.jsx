var React = require('react');
const createReactClass = require('create-react-class');

const Wrap = ({ children, ...props }) => {
  return (
    <div>
      {children()}
    </div>
  );
};

module.exports = createReactClass({
  render: function () {
    return (
      <div>
        <Wrap>
          <fn>
            <i>content</i>
          </fn>
        </Wrap>
      </div>
    );
  }
});
