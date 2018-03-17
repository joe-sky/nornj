nj.registerComponent({
  Provider: ReactRedux.Provider,
  ConnectedRouter: ReactRouterRedux.ConnectedRouter,
  Route: ReactRouterDOM.Route,
  Redirect: ReactRouterDOM.Redirect,
  'router-Link': ReactRouterDOM.Link
});

nj.registerFilter({
  textDecoration: function (val) {
    return val ? 'line-through' : 'none';
  },
  cursor: function (val) {
    return val ? 'default' : 'pointer';
  }
});