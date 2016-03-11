nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent([
  { name: 'Provider', component: ReactRedux.Provider },
  { name: 'Router', component: ReactRouter.Router },
  { name: 'Route', component: ReactRouter.Route },
  { name: 'Redirect', component: ReactRouter.Redirect },
  { name: 'Link', component: ReactRouter.Link }
]);

var reducer = Redux.combineReducers(nj.assign({}, todoApp, {
  routing: ReactRouterRedux.routeReducer
}));

var reduxRouterMiddleware = ReactRouterRedux.syncHistory(ReactRouter.hashHistory);
var createStoreWithMiddleware = Redux.applyMiddleware(reduxRouterMiddleware)(Redux.createStore);

var store = createStoreWithMiddleware(reducer);
reduxRouterMiddleware.listenForReplays(store);

//Set default data for first render NornJ html template.
nj.setInitTagData({
  store: store,
  hashHistory: ReactRouter.hashHistory,
  App: App
});