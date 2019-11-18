import { render, precompile } from '../../src/compiler/compile';
import { createTmplRule } from '../../src/utils/createTmplRule';

describe('Directives', () => {
  it('show', () => {
    expect(
      render(`<br n-show={{visible}}>`, {
        visible: false
      })
    ).toBe('<br style="display:none" />');
  });

  it('show with styles', () => {
    expect(render(`<br style="color: #fff;margin:0" n-show={{false}}>`)).toBe(
      '<br style="color: #fff;margin:0;display:none" />'
    );
  });
});
