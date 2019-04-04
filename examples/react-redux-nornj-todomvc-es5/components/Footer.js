njr.bindTemplate('Footer', '#template-footer')(createReactClass({
  propTypes: {
    filter: PropTypes.oneOf([
      VisibilityFilters.SHOW_ALL,
      VisibilityFilters.SHOW_COMPLETED,
      VisibilityFilters.SHOW_ACTIVE
    ]).isRequired
  },

  todoState: function(obj) {
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

  render: function () {
    return this.props.template({
      filters: [
        { filter: VisibilityFilters.SHOW_ALL, name: 'All' },
        { filter: VisibilityFilters.SHOW_COMPLETED, name: 'Completed' },
        { filter: VisibilityFilters.SHOW_ACTIVE, name: 'Active' }
      ],
      currentFilter: this.props.filter
    }, this);
  }
}));