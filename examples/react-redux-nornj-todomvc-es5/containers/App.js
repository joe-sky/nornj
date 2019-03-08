var _App = createReactClass({
  propTypes: {
    visibleTodos: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    visibilityFilter: PropTypes.oneOf([
      VisibilityFilters.SHOW_ALL,
      VisibilityFilters.SHOW_COMPLETED,
      VisibilityFilters.SHOW_ACTIVE
    ]).isRequired
  },

  addClick: function (text) {
    this.props.dispatch(addTodo(text));
  },

  todoClick: function (index) {
    this.props.dispatch(completeTodo(index));
  },

  render: function () {
    return this.props.template({
      addClick: this.addClick,
      todoClick: this.todoClick
    }, this.props);
  }
});

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(function (todo) {
        return todo.completed;
      });
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(function (todo) {
        return !todo.completed;
      });
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

//Wrap component,inject dispatch and state into its default connect(select)(App)
var App = nj.registerComponent('App', ReactRedux.connect(select)(
  njr.bindTemplate({ template: '#template-app' })(_App)
));