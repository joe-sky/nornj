import nj from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { VisibilityFilters, addTodo, completeTodo } from '../actions/actions';
import tmpl from './App.tmpl';
import '../components/AddTodo';
import '../components/Footer';
import '../components/Todo';
import '../components/TodoList';

const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;
const template = nj.compileComponent(tmpl);

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

  render() {
    return template(
      this.props,
      {
        addClick: (text) => this.props.dispatch(addTodo(text)),
        todoClick: (index) => this.props.dispatch(completeTodo(index))
      }
    );
  }
}

function selectTodos(todos, filter) {
  switch (filter) {
    case SHOW_ALL:
      return todos
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
  }
}

//Wrap component,inject dispatch and state into its default connect(select)(App)
const App = nj.registerComponent('App', connect(select)(_App));

export default App;
