'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<p>
  ${['Show: ']}
  <$each {filters}>
    <$if {filter:isCurrent}>
      {name}
    <$else />
      <Linkto to=/{filter:todoState}>
        {name}
      </Linkto>
    </$if>
    <$if {name:equal(Active)}>
      .
    <$else />
      ${[', ']}
    </$if>
  </$each>
</p>`;