nj.registerFilter({
  isCurrent: function (obj) {
    return obj === this.parent.currentFilter;
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