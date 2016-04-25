import nj from '../../../../src/base.js';

export default nj`
<div class=test onClick={onClick}>
  test{no}
  <br />
  <$each {list}>
    <i>list{.} + {counter}</i>
  </$each>
</div>
`;