import { render } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';
import config from '../../src/config';

describe('Render with global text mode', () => {
  beforeEach(() => {
    config({
      textMode: true
    });
  });

  it('Default', () => {
    const ret = render(
      `
      <i>test</i>   <textarea>
        11111<input>  
      </textarea>
    `,
      { tmplKey: 'test-text-mode' }
    );

    expect(ret).toBe(`\n      <i>test</i>   <textarea>\n        11111<input>  \n      </textarea>\n    `);
  });

  afterEach(() => {
    config({
      textMode: false
    });
  });
});
