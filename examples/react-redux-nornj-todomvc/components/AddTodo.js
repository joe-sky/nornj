import { Component } from 'react';
import PropTypes from 'prop-types';
import { registerTmpl } from 'nornj-react';
import tmpls from '../template.nj.html';

@registerTmpl('AddTodo')
export default class AddTodo extends Component {
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
    return tmpls.addTodo(this);
  }
}