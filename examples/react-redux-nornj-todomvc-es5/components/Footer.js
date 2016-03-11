nj.registerComponent('Footer', React.createClass({
  propTypes: {
    filter: React.PropTypes.oneOf([
      VisibilityFilters.SHOW_ALL,
      VisibilityFilters.SHOW_COMPLETED,
      VisibilityFilters.SHOW_ACTIVE
    ]).isRequired
  },

  template: nj.compileComponent(FooterTmpl),

  render: function () {
    return this.template({
      filters: [
        { filter: VisibilityFilters.SHOW_ALL, name: 'All' },
        { filter: VisibilityFilters.SHOW_COMPLETED, name: 'Completed' },
        { filter: VisibilityFilters.SHOW_ACTIVE, name: 'Active' }
      ],
      currentFilter: this.props.filter
    });
  }
}));