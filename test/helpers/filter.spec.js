import { filters } from '../../src/helpers/filter';

describe('filter', () => {
  it('>', () => {
    expect(filters['gt'](2, 1)).toBe(true);
  });

  it('<', () => {
    expect(filters['lt'](2, 1)).toBe(false);
  });
});