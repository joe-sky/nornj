import nj from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import tmpl from '../templates/AddTodoTmpl';
const template = nj.compileComponent(tmpl);

class AddTodo extends Component {
  static propTypes = {
    onAddClick: PropTypes.func.isRequired
  };

  handleClick(e) {
    var node = this.refs.input;
    var text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  }

  render() {
    return template({ handleClick: (e) => this.handleClick(e) });
  }
}

nj.registerComponent({ AddTodo });

export default AddTodo;