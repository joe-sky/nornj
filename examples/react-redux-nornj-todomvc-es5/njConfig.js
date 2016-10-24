nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent({
  Provider: ReactRedux.Provider,
  Router: ReactRouter.Router,
  Route: ReactRouter.Route,
  Redirect: ReactRouter.Redirect,
  Linkto: ReactRouter.Link
});

nj.registerFilter({
  isCurrent: function (obj) {
    return obj === this.parent.data.currentFilter;
  },
  todoState: function (obj) {
    switch (obj) {
      case VisibilityFilters.SHOW_ACTIVE:
        return 'active';
      case VisibilityFilters.SHOW_COMPLETED:
        return 'completed';
      case VisibilityFilters.SHOW_ALL:
      default:
        return 'all';
    }
  },
  textDecoration: function (obj) {
    return obj ? 'line-through' : 'none';
  },
  cursor: function (obj) {
    return obj ? 'default' : 'pointer';
  }
});