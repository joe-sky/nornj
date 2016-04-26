import nj from '../../../../src/base.js';

export default nj`
<div class=test onClick={onClick} style=color:blue;>
  test{no}
  <br />
  <$each {list}>
    <i key=i_{#}>list{.} + {counter}</i>
  </$each>
</div>
`;