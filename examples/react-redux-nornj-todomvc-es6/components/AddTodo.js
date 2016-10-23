import {
  compileComponent,
  registerComponent
} from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import tmpl from './AddTodo.tmpl';
const template = compileComponent(tmpl);

class AddTodo extends Component {
  static propTypes = {
    onAddClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    var node = this.refs.input;
    var text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  }

  render() {
    return template(this);
  }
}

registerComponent({ AddTodo });
export default AddTodo;