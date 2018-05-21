var _history = History.createHashHistory();
var middleware = ReactRouterRedux.routerMiddleware(_history);
var store = Redux.createStore(
  Redux.combineReducers(nj.assign({}, todoApp, {
    routing: ReactRouterRedux.routerReducer
  })),
  Redux.applyMiddleware(middleware)
);