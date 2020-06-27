const bindConfig = {
  onlyGlobal: true,
  newContext: false,
  isBindable: true,
  useExpressionInProps: true,
  isDirective: true,
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
