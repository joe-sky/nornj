import { render } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';
import { registerFilter, filters, filterConfig } from '../../src/helpers/filter';

registerFilter({
  cut: (v, len = 2) => {
    return v.substr(len);
  }
});

describe('Filter', () => {
  it('One filter', () => {
    expect(render("{{ '12345' | cut | cut(1) }}")).toBe('45');
  });
});

registerFilter({
  '&': {
    filter: (a, b) => {
      return a * b + b;
    },
    options: {
      isOperator: true
    }
  }
});

describe('Operator', () => {
  it('&', () => {
    expect(render("{{ 2&3**2 }}")).toBe(81);
  });

  it('.', () => {
    expect(render("{{ a.b['c'].length }}", {
      a: {
        b: {
          c: 'abc'
        }
      }
    })).toBe(3);
  });

  it('>', () => {
    expect(render('{{ 2 > 1 }}')).toBe(true);
  });

  it('>=', () => {
    expect(render('{{ 2 >= 2 }}')).toBe(true);
  });

  it('<', () => {
    expect(render('{{ 2 < (1) }}')).toBe(false);
  });

  it('<=', () => {
    expect(render('{{ 2 <= 1 }}')).toBe(false);
  });

  it('==', () => {
    expect(render('{{ 1 == 1 }}')).toBe(true);
  });

  it('===', () => {
    expect(render('{{ 1 === 1 }}')).toBe(true);
  });

  it('!=', () => {
    expect(render('{{ 1 != 2 }}')).toBe(true);
  });

  it('!==', () => {
    expect(render('{{ undefined !== null }}')).toBe(true);
  });

  it('?:', () => {
    expect(render('{{ 1 > 2 ? true : false }}')).toBe(false);
  });

  it('!', () => {
    expect(render('{{ !true }}')).toBe(false);
  });

  it('+', () => {
    expect(render('{{ 1 + (2 + 3) }}')).toBe(6);
  });

  it('-', () => {
    expect(render('{{ 3 - 2 - 1 }}')).toBe(0);
  });

  it('*', () => {
    expect(render('{{ 3 * 5 }}')).toBe(15);
  });

  it('/', () => {
    expect(render('{{ 15 / 2 }}')).toBe(7.5);
  });

  it('%', () => {
    expect(render('{{ 10 % 3 }}')).toBe(1);
  });

  it('&&', () => {
    expect(render("{{ 1=='1' && 1 == '2' }}")).toBe(false);
  });

  it('||', () => {
    expect(render("{{ 1 == '1' || 1=='2' }}")).toBe(true);
  });

  it('int & float', () => {
    expect(render("{{ 20.5 | int * (10.05 | float) + 2 ** 3 + 19 %% 2 }}")).toBe(218);
  });

  it('bool', () => {
    expect(render("{{ 'false' | bool }}")).toBe(false);
  });

  it('_(method)', () => {
    expect(render("{{ 'abc'.substr(1) }}")).toBe('bc');
  });

  it('..', () => {
    expect(render("{{ (0 .. 5).length }}")).toBe(6);
  });

  it('..>', () => {
    expect(render("{{ (0 ..< 5).length }}")).toBe(5);
  });

  it('<=>', () => {
    expect(render("{{ 2 <=> 1 }}")).toBe(1);
  });

  it('array', () => {
    expect(render("{{['1'[0]['length'], '123'[1], '345'[0], ['4567'['length'], 5].join('-')].join('-')}}")).toBe('1-2-3-4-5');
  });

  it('object', () => {
    expect(render(`<img src="{{ { src: 'http://test.com/img.png' }.src }}">`)).toBe('<img src="http://test.com/img.png" />');
  });

  it('currency', function () {
    expect(render("{{98765 | currency}}")).toBe('$98,765.00');
    expect(render("{{'98765' | currency}}")).toBe('$98,765.00');
    expect(render("{{value | currency}}", { value: -98.765e3 })).toBe('-$98,765.00');
    expect(render("{{'-98.765e3' | currency}}")).toBe('-$98,765.00');
    expect(render("{{98765.321 | currency}}")).toBe('$98,765.32');
    expect(render("{{98765.32132 | currency(0)}}")).toBe('$98,765');
    expect(render("{{98765.321 | currency(0,'#')}}")).toBe('#98,765');
    expect(render("{{98765.321 | currency('')}}")).toBe('98,765.32');
    expect(render("{{-98765.321 | currency}}")).toBe('-$98,765.32');
    expect(render("{{-0.99 | currency}}")).toBe('-$0.99');
    expect(render("{{0.99999 | currency}}")).toBe('$1.00');
    expect(render("{{null | currency}}")).toBe('');
    expect(render("{{false | currency}}")).toBe('');
    expect(render("{{Infinity | currency}}")).toBe('');
    expect(render("{{NaN | currency}}")).toBe('');
    expect(render("{{undefined | currency}}")).toBe('');
    expect(render("{{'undefined' | currency}}")).toBe('');

    filterConfig.currency.symbol = '￥';
    expect(render("{{98765 | currency}}")).toBe('￥98,765.00');
    filterConfig.currency.placeholder = '-';
    expect(render("{{NaN | currency}}")).toBe('-');
  })
});