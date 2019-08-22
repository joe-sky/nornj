const React = require('react');
const testIf = 'testIf';

module.exports = function (props) {
  return (
    <div>
      <If condition={`${props}.condition === testIf`}>
        <span>IfBlock</span>
      </If>
    </div>
  );
};