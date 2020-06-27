const formDataConfig = {
  onlyGlobal: true,
  newContext: false
};

module.exports = {
  mobxFormData: formDataConfig,
  mobxFieldData: formDataConfig,
  mobxField: Object.assign(
    {
      isDirective: true,
      isBindable: true,
      useExpressionInProps: true,
      needPrefix: 'free'
    },
    formDataConfig
  )
};
