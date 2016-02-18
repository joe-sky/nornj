nj.registerComponent('Provider', ReactRedux.Provider);

var store = Redux.createStore(todoApp);
nj.renderTagComponent({ store: store });