import nj from '../../../src/base.js';

export default nj`
<li onClick={click} style="text-decoration:{completed:textDecoration};cursor:{completed:cursor};">
  {text}
</li>`;