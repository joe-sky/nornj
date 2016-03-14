'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<p>
  ${['Show: ']}
  <$each {filters}>
    <$if {filter:isCurrent}>
      {name}
    <$else />
      <Link to=/{filter:todoState}>
        {name}
      </Link>
    </$if>
    <$if {name:equal(Active)}>
      .
    <$else />
      ${[', ']}
    </$if>
  </$each>
</p>`;