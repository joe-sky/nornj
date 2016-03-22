import nj from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import tmpl from '../templates/TodoListTmpl';
const template = nj.compileComponent(tmpl);

class TodoList extends Component {
  static propTypes = {
    onTodoClick: PropTypes.func.isRequired,
    todos: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired).isRequired
  };

  render() {
    return template(
      [
        this.props,
        { todoClick: (index) => this.props.onTodoClick(index) }
      ]
    );
  }
}

nj.registerComponent('TodoList', TodoList);

export default TodoList;