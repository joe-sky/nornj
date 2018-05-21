import { Component } from 'react';
import PropTypes from 'prop-types';
import { registerTmpl } from 'nornj-react';
import tmpls from '../template.nj.html';

@registerTmpl('Todo')
export default class Todo extends Component {
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
    return tmpls.todo(this.props, this);
  }
}