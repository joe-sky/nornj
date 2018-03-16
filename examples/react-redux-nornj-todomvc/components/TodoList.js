import { Component } from 'react';
import PropTypes from 'prop-types';
import { registerTmpl } from 'nornj-react';
import tmpls from '../template.nj.html';

@registerTmpl('TodoList')
export default class TodoList extends Component {
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
    return tmpls.todoList(this.props, this);
  }
}