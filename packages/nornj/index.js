if (process.env.NJ_ENV === 'runtime') {
  module.exports = require('./dist/nornj.runtime.common.js');
} else {
  module.exports = require('./dist/nornj.common.js');
}
