import nj from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import tmpl from '../templates/TodoTmpl';
const template = nj.compileComponent(tmpl);

class Todo extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  };

  render() {
    return template(
      [
        this.props,
        { click: (e) => this.props.onClick(this.props.index) }
      ]
    );
  }
}

nj.registerComponent({ Todo });

export default Todo;