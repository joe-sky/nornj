nj.registerComponent({
  ConnectedRouter: ReactRouterRedux.ConnectedRouter
});

nj.registerFilter({
  textDecoration: function (val) {
    return val ? 'line-through' : 'none';
  },
  cursor: function (val) {
    return val ? 'default' : 'pointer';
  }
});