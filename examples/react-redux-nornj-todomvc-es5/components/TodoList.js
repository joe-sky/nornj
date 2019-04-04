njr.bindTemplate('TodoList', '#template-todoList')(createReactClass({
  propTypes: {
    onTodoClick: PropTypes.func.isRequired,
    todos: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired).isRequired
  },

  todoClick: function (index) {
    this.props.onTodoClick(index);
  },

  render: function () {
    return this.props.template(this.props, this);
  }
}));