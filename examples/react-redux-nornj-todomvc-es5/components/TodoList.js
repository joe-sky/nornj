var TodoList = React.createClass({
    propTypes: {
        onTodoClick: React.PropTypes.func.isRequired,
        todos: React.PropTypes.arrayOf(React.PropTypes.shape({
            text: React.PropTypes.string.isRequired,
            completed: React.PropTypes.bool.isRequired
        }).isRequired).isRequired
    },
    template: nj.compileComponent(TodoListTmpl, 'TodoList'),
    todoClick: function (index) {
        this.props.onTodoClick(index);
    },
    render: function () {
        return this.template(
            [
                this.props,
                { todoClick: this.todoClick }
            ]
        );
    }
});
nj.registerComponent('TodoList', TodoList);