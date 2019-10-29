const mobxConfig = {
  onlyGlobal: true,
  newContext: false,
  isBindable: true,
  useExpressionInProps: true,
  isDirective: true
};

module.exports = {
  mobxBind: mobxConfig,
  mstBind: mobxConfig,
  mobxObserver: {
    onlyGlobal: true,
    newContext: false
  }
};
