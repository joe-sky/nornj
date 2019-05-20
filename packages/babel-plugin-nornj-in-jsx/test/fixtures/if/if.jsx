const React = require('react');

module.exports = function (props) {
  return (
    <div>
      <if condition={`${props}.condition === 'testIf'`}>
        <span>IfBlock</span>
      </if>
    </div>
  );
};