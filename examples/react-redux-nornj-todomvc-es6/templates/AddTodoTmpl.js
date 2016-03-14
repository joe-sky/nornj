'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<div>
  <input type=text ref=input />
  <button onClick={handleClick}>
    Add
  </button>
</div>`;