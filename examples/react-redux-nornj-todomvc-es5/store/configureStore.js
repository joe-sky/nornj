var reducer = Redux.combineReducers(nj.assign({}, todoApp, {
  routing: ReactRouterRedux.routeReducer
}));

var reduxRouterMiddleware = ReactRouterRedux.syncHistory(ReactRouter.hashHistory);
var createStoreWithMiddleware = Redux.applyMiddleware(reduxRouterMiddleware)(Redux.createStore);

var store = createStoreWithMiddleware(reducer);
reduxRouterMiddleware.listenForReplays(store);