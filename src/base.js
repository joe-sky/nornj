const nj = require('./core'),
  tools = require('./utils/tools'),
  expression = require('./helpers/expression'),
  filter = require('./helpers/filter'),
  compiler = require('./compiler/compile'),
  tmplTag = require('./utils/tmplTag'),
  escape = require('./utils/escape').default,
  registerComponent = require('./utils/registerComponent').default,
  replaceSpecialSymbol = require('./utils/replaceSpecialSymbol').default,
  setTmplRule = require('./utils/setTmplRule').default,
  config = require('./config').default;

tools.assign(nj, {
  escape,
  registerComponent,
  replaceSpecialSymbol,
  setTmplRule,
  config
}, tools, expression, filter, compiler, tmplTag);

//Set default template rules
setTmplRule();

const _global = typeof self !== 'undefined' ? self : global;
module.exports = _global.NornJ = _global.nj = nj;