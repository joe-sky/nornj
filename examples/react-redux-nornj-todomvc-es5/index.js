nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent({
  Provider: ReactRedux.Provider,
  Router: ReactRouter.Router,
  Route: ReactRouter.Route,
  Redirect: ReactRouter.Redirect,
  Linkto: ReactRouter.Link
});

//Set default data for first render NornJ html template.
nj.setInitTagData({
  store: store,
  hashHistory: ReactRouter.hashHistory,
  App: App
});