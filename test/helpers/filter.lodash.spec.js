import { render } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';
import { registerFilter, filters, filterConfig } from '../../src/helpers/filter';
import _ from 'lodash';

Object.keys(_).forEach(name => registerFilter(name, _[name]));

describe('Lodash filters', () => {
  it('repeat', () => {
    expect(render(`{{ '-abc-' | repeat(3) }}`)).toBe('-abc--abc--abc-');
  });

  it('endsWith', () => {
    expect(render(`{{ '-abc-' | endsWith('bc-') }}`)).toBe(true);
  });

  it('snakeCase', () => {
    expect(render(`{{ 'Foo Bar' | snakeCase }}`)).toBe('foo_bar');
  });
});