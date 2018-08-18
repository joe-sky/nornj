import { render } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';

describe('extension attribute', () => {
  it('show', () => {
    expect(render(`<br #show={{visible}}>`, {
      visible: false
    })).toBe('<br style="display:none" />');

    expect(render(`<br style="color: #fff;margin:0" #show={{true}}>`))
      .toBe('<br style="color: #fff;margin:0" />');

    expect(render(`<#if {{ ' #fff' }}>test</#if>`))
      .toBe('test');
  });
});