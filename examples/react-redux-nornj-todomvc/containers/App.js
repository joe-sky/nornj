import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import nj, { registerComponent } from 'nornj';
import { bindTemplate } from 'nornj-react';
import { VisibilityFilters, addTodo, completeTodo } from '../actions/actions';
import '../components/AddTodo';
import '../components/Footer';
import '../components/Todo';
import '../components/TodoList';

const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;

@bindTemplate({
  template: nj`
    <div>
      <AddTodo onAddClick={addClick} />
      <TodoList todos={visibleTodos} onTodoClick={todoClick} />
      <Footer filter={visibilityFilter} />
    </div>
  `
})
class _App extends Component {
  static propTypes = {
    visibleTodos: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    visibilityFilter: PropTypes.oneOf([
      SHOW_ALL,
      SHOW_COMPLETED,
      SHOW_ACTIVE
    ]).isRequired
  };

  constructor(props) {
    super(props);
    this.addClick = this.addClick.bind(this);
    this.todoClick = this.todoClick.bind(this);
  }

  addClick(text) {
    return this.props.dispatch(addTodo(text));
  }

  todoClick(index) {
    return this.props.dispatch(completeTodo(index));
  }

  render() {
    return this.props.template(this.props, this);
  }
}

function selectTodos(todos, filter) {
  switch (filter) {
    case SHOW_ALL:
      return todos;
    case SHOW_COMPLETED:
      return todos.filter(function (todo) {
        return todo.completed;
      });
    case SHOW_ACTIVE:
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
const App = registerComponent('App', connect(select)(_App));
export default App;