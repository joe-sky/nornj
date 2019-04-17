import { render, precompile } from '../../src/compiler/compile';
import createTmplRule from '../../src/utils/createTmplRule';

describe('Extension attribute', () => {
  it('show', () => {
    //console.log(precompile(`<br #show={{visible}} #show={{visible}}>`, false, createTmplRule()).main.toString());
    expect(render(`<br #show={{visible}}>`, {
      visible: false
    })).toBe('<br style="display:none" />');

    // expect(render(`<br style="color: #fff;margin:0" #show={{false}}>`))
    //   .toBe('<br style="color: #fff;margin:0;display:none" />');

    // expect(render(`<#if {{ ' #fff' }}>test</#if>`))
    //   .toBe('test');
  });
});