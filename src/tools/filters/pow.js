import nj from '../../base';

nj.registerFilter('**', (val1, val2) => Math.pow(val1, val2), {
  onlyGlobal: true,
  transOperator: true
});