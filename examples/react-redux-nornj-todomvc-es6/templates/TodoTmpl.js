'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<li onClick={click} style="text-decoration:{completed:textDecoration};cursor:{completed:cursor};">
  {text}
</li>`;