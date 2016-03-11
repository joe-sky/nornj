nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent([
  { name: 'Provider', component: ReactRedux.Provider },
  { name: 'Router', component: ReactRouter.Router },
  { name: 'Route', component: ReactRouter.Route },
  { name: 'Redirect', component: ReactRouter.Redirect },
  { name: 'Link', component: ReactRouter.Link }
]);

//Set default data for first render NornJ html template.
nj.setInitTagData({
  store: store,
  hashHistory: ReactRouter.hashHistory,
  App: App
});