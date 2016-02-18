var Todo = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func.isRequired,
        text: React.PropTypes.string.isRequired,
        completed: React.PropTypes.bool.isRequired
    },
    template: nj.compileComponent(TodoTmpl, 'Todo'),
    click: function () {
        this.props.onClick(this.props.index);
    },
    render: function () {
        return this.template(
            [
                this.props,
                { click: this.click }
            ]
        );
    }
});
nj.registerComponent('Todo', Todo);