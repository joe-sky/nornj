const React = require('react');

module.exports = function (props) {
  return (
    <div>
      <if condition={`condition === 'testIf'`}>
        <span>IfBlock</span>
      </if>
    </div>
  );
};