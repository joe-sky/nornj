import {
  compileComponent,
  registerComponent
} from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import tmpl from './Todo.tmpl';
const template = compileComponent(tmpl);

class Todo extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    return this.props.onClick(this.props.index);
  }

  render() {
    return template(this.props, this);
  }
}

registerComponent({ Todo });
export default Todo;