nj.registerComponent({
  Provider: ReactRedux.Provider,
  Router: ReactRouter.Router,
  Route: ReactRouter.Route,
  Redirect: ReactRouter.Redirect,
  'router-Link': ReactRouter.Link
});

nj.registerFilter({
  textDecoration: function (val) {
    return val ? 'line-through' : 'none';
  },
  cursor: function (val) {
    return val ? 'default' : 'pointer';
  }
});