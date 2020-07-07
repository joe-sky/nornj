const bindConfig = {
  onlyGlobal: true,
  newContext: false,
  isDirective: true,
  isBindable: true,
  needPrefix: 'free'
};

module.exports = {
  mobxBind: bindConfig,
  mstBind: bindConfig,
  mobxObserver: {
    onlyGlobal: true,
    newContext: false
  }
};
