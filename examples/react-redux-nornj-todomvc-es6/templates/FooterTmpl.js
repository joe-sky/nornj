'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<p>
  Show:&nbsp;
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
      ,&nbsp;
    </$if>
  </$each>
</p>`;