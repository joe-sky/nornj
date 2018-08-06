import nj from '../../src/core';
import { precompile } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';

describe('precompile', () => {
  nj.registerExtension('noMargin', options => {
    options.exProps.style = 'margin:0';
  }, { addSet: true });

  it('Extension attribute', () => {
    const ret = precompile(`
      <input type="radio" #show={{show}} #noMargin={{show}}>
    `, true, nj.tmplRule);

    console.log(ret.main.toString());
    expect(Object.keys(ret).length).not.toBe(8);
    expect(ret.main.toString()).toContain('p1.x[\'noMargin\']');
  });
});