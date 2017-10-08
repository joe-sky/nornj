import nj from '../../base';

nj.registerFilter('//', val => Math.sqrt(val), {
  onlyGlobal: true,
  hasOptions: false
});