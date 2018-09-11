import nj from '../../src/core';
import { precompile } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';

describe('Precompile', () => {
  nj.registerExtension('noMargin', options => {
    options.exProps.style = 'margin:0';
  }, { addSet: true });

  it('Extension attribute', () => {
    const ret = precompile(`
      <div type="radio" #show={{show}} #noMargin-arg1-arg2.modifier1.modifier2={{show}}>
        <i><#test /></i>
      </div>
    `, true, nj.tmplRule);

    //console.log(ret.main.toString());
    expect(Object.keys(ret).length).not.toBe(8);
    expect(ret.main.toString()).toContain('p1.x[\'noMargin\']');
  });
});