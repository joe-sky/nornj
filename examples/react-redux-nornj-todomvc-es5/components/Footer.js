var Footer = React.createClass({
    propTypes: {
        onFilterChange: React.PropTypes.func.isRequired,
        filter: React.PropTypes.oneOf([
          'SHOW_ALL',
          'SHOW_COMPLETED',
          'SHOW_ACTIVE'
        ]).isRequired
    },
    template: nj.compileComponent(FooterTmpl, 'Footer'),
    filterChange: function (e) {
        e.preventDefault();
        this.props.onFilterChange(e.target.getAttribute("data-filter"));
    },
    render: function () {
        return this.template(
            [
                {
                    filters: [
                        { filter: 'SHOW_ALL', name: 'All' },
                        { filter: 'SHOW_COMPLETED', name: 'Completed' },
                        { filter: 'SHOW_ACTIVE', name: 'Active' }
                    ]
                }, {
                    filter: this.props.filter,
                    filterChange: this.filterChange
                }
            ]
        );
    }
});

nj.registerComponent('Footer', Footer);