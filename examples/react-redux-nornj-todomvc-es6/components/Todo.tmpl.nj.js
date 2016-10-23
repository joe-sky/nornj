import nj from '../../../src/base.js';

export default nj`
<li onClick={handleClick} style="text-decoration:{completed:textDecoration};cursor:{completed:cursor};">
  {text}
</li>`;