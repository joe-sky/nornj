import {
  compileComponent,
  registerComponent
} from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import tmpl from './TodoList.tmpl';
const template = compileComponent(tmpl);

class TodoList extends Component {
  static propTypes = {
    onTodoClick: PropTypes.func.isRequired,
    todos: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired).isRequired
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(index) {
    return this.props.onTodoClick(index);
  }

  render() {
    return template(this.props, this);
  }
}

registerComponent({ TodoList });
export default TodoList;