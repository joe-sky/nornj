import nj from '../../src/core';
import { render, precompile } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';
import * as tools from '../../src/utils/tools';
import { filterConfig } from '../../src/helpers/filter';
import { registerExtension } from '../../src/helpers/extension';

describe('Precompile', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'production';

    registerExtension(
      'noMargin',
      options => {
        options.tagProps.style = 'margin:0';
      },
      { isDirective: true }
    );
  });

  it('Custom directive', () => {
    const ret = precompile(`<i n-noMargin>test</i>`, true);

    expect(Object.keys(ret).length).toBe(4);
    expect(ret.main.toString()).toContain(`g.x['noMargin']`);
  });

  it('Expression case 1', () => {
    const ret = precompile(`{{ d.e ** a.b.c(1, 2, 3) }}`);

    expect(ret.main.toString()).toContain(
      `g.f['**'](g.f['.'](g.es(c.d('d')), 'e'), g.f['_'](g.f['.'](g.f['.'](g.es(c.d('a')), 'b'), 'c', true), [1, 2, 3]))`
    );
  });

  it('Expression case 2', () => {
    const ret = precompile(`{{1 + 2 > 2 && 2 ** (3 + 1) <= 5 && (5 + 6 %% 7) >= 10}}`);

    expect(ret.main.toString()).toContain(`1 + 2 > 2 && g.f['**'](2, 3 + 1) <= 5 && (5 + g.f['%%'](6, 7)) >= 10`);
  });

  it('Expression case 3', () => {
    const ret = precompile(`{{'111'.length + 2 * 3}}`);

    expect(ret.main.toString()).toContain(`g.f['.']('111', 'length') + 2 * 3`);
  });

  it('Expression case 4', () => {
    const ret = precompile(
      `{{' 123 '.trim(1 + 2 %% 5, alt(ctrl(123['length'].toString(123), '5', 6))) + shift() + 4 - 5 ** 6}}`
    );

    expect(ret.main.toString()).toContain(
      `g.f['_'](g.f['.'](' 123 ', 'trim', true), [1 + g.f['%%'](2, 5), g.cf(c.d('alt', 0, true) || g.f['alt'])(g.cf(c.d('ctrl', 0, true) || g.f['ctrl'])(g.f['_'](g.f['.'](g.f['.'](123, 'length'), 'toString', true), [123]), '5', 6))]) + (g.cf(c.d('shift', 0, true) || g.f['shift'])()) + 4 - g.f['**'](5, 6)`
    );
  });

  it('Expression case 5', () => {
    const ret = precompile(`{{'abcde'.substring(1, num.getLength()).length * 5 | test(100)}}`);

    expect(ret.main.toString()).toContain(
      `g.f['.'](g.f['_'](g.f['.']('abcde', 'substring', true), [1, g.f['_'](g.f['.'](g.es(c.d('num')), 'getLength', true))]), 'length') * g.cf(c.d('test', 0, true) || g.f['test'])(5, 100)`
    );
  });

  it('Expression case 6', () => {
    const ret = precompile(`{{('111'.length + 2) * 3 | test}}`);

    expect(ret.main.toString()).toContain(
      `(g.f['.']('111', 'length') + 2) * g.cf(c.d('test', 0, true) || g.f['test'])(3)`
    );
  });

  it('Expression case 7', () => {
    const ret = precompile(`{{('111'.length + 2) * 3 | test(100, 200)}}`);

    expect(ret.main.toString()).toContain(
      `(g.f['.']('111', 'length') + 2) * g.cf(c.d('test', 0, true) || g.f['test'])(3, 100, 200)`
    );
  });

  it('Expression case 8', () => {
    const ret = precompile(`{{a.b.c ? d.e.f : (1 + 2 === 3 ? 1 : 2)}}`);

    expect(ret.main.toString()).toContain(
      `g.f['.'](g.f['.'](g.es(c.d('a')), 'b'), 'c') ? (g.f['.'](g.f['.'](g.es(c.d('d')), 'e'), 'f')) : (1 + 2 === 3 ? 1 : 2)`
    );
  });

  it('Expression case 9', () => {
    const ret = precompile(`{{[1, 2, 3][0] + 100}}`);

    expect(ret.main.toString()).toContain(`g.f['.']([1, 2, 3], 0) + 100`);
  });

  it('Expression case 10', () => {
    const ret = precompile(`{{set a = '123' + '456'}}`);

    expect(ret.main.toString()).toContain(`g.es(c.d('a', 0, true)).source.a = '123' + '456'`);
  });

  it('Expression case 11', () => {
    const ret = precompile(`{{ { a: 1, b: 2 }.b * 100 }}`);

    expect(ret.main.toString()).toContain(`g.f['.']({ a : 1, b : 2 }, 'b') * 100`);
  });

  it('Expression case 12', () => {
    const ret = precompile(`{{ { a: require('../image1.png'), b: { c: { d: (1 + 2) | test } } }[b] * 100 }}`);

    expect(ret.main.toString()).toContain(
      `g.f['.']({ a : (require('../image1.png')), b : ({ c : ({ d : g.cf(c.d('test', 0, true) || g.f['test'])(1 + 2) }) }) }, g.es(c.d('b'))) * 100`
    );
  });

  it('Expression case 13', () => {
    const ret = precompile(`{{ d.e ** a.b.c(1, 2, 3) }}`);

    expect(ret.main.toString()).toContain(
      `g.f['**'](g.f['.'](g.es(c.d('d')), 'e'), g.f['_'](g.f['.'](g.f['.'](g.es(c.d('a')), 'b'), 'c', true), [1, 2, 3]))`
    );
  });

  // Todo
  xit('Expression case 14', () => {
    const ret = precompile(`{{ { fn: param => param + 'abc'.substring(param, 10) } }}`);

    expect(ret.main.toString()).toContain(`{ fn: param => param + (p1.sc(p1.f['.']('abc', 'substring'))(param, 10)) }`);
  });

  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });
});
