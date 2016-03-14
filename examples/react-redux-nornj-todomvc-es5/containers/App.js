var _App = React.createClass({
  propTypes: {
    visibleTodos: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.string.isRequired,
      completed: React.PropTypes.bool.isRequired
    }).isRequired).isRequired,
    visibilityFilter: React.PropTypes.oneOf([
      VisibilityFilters.SHOW_ALL,
      VisibilityFilters.SHOW_COMPLETED,
      VisibilityFilters.SHOW_ACTIVE
    ]).isRequired
  },

  template: nj.compileComponent(AppTmpl),

  addClick: function (text) {
    this.props.dispatch(addTodo(text));
  },

  todoClick: function (index) {
    this.props.dispatch(completeTodo(index));
  },

  render: function () {
    return this.template(
      [
        this.props,
        {
          addClick: this.addClick,
          todoClick: this.todoClick
        }
      ]
    );
  }
});

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
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
  }
}

//Wrap component,inject dispatch and state into its default connect(select)(App)
var App = nj.registerComponent('App', ReactRedux.connect(select)(_App));