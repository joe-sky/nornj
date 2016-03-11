nj.registerFilter([
  {
    name: 'isCurrent', filter: function (obj) {
      return obj === this.parent.currentFilter;
    }
  },
  {
    name: 'todoState', filter: function (obj) {
      switch (obj) {
        case VisibilityFilters.SHOW_ACTIVE:
          return 'active';
        case VisibilityFilters.SHOW_COMPLETED:
          return 'completed';
        case VisibilityFilters.SHOW_ALL:
        default:
          return 'all';
      }
    }
  },
  {
    name: 'textDecoration', filter: function (obj) {
      return obj ? 'line-through' : 'none';
    }
  },
  {
    name: 'cursor', filter: function (obj) {
      return obj ? 'default' : 'pointer';
    }
  }
]);