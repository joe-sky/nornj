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

  xit('Simple', () => {
    const tmpl = `
      {{1 + 2 ** 3}}
      {{'111'.length + 2 * 3}}
      {{' 123 '.trim() + 4 - 5 ** 6}}
    `;

    const ret = precompile(tmpl, true, nj.tmplRule);

    const gCode = `
      1 + p1.f['**'](2, 3)
      p1.f['.']('111', 'length') + 2 * 3
      p1.f['.'](' 123 ', 'trim')() + 4 - p1.f['**'](5, 6)
    `;

    console.log(ret.main.toString());
  });
});