import React from 'react';

export default props => (
  <if condition={props.isTest}>
    <i>success</i>
    <else>
      <i>fail</i>
    </else>
  </if>
);
