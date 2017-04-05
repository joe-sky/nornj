njr.registerTmpl('TodoList', '#template-todoList')(React.createClass({
  propTypes: {
    onTodoClick: React.PropTypes.func.isRequired,
    todos: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.string.isRequired,
      completed: React.PropTypes.bool.isRequired
    }).isRequired).isRequired
  },

  todoClick: function (index) {
    this.props.onTodoClick(index);
  },

  render: function () {
    return this.template(this.props, this);
  }
}));