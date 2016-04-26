import nj from '../../../../src/base.js';

export default nj`
<div>
  <$params>
    <$spreadParam {params} />
  </$params>
  test{no}
  <br />
  <$each {list}>
    <i key=i_{#}>list{.} + {counter}</i>
  </$each>
</div>
`;