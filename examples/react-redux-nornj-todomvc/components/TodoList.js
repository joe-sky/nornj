import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindTemplate } from 'nornj-react';

@bindTemplate({
  name: 'TodoList',
  template: nj`
    <ul>
      <#each {todos}>
        <Todo {text} {completed} key={@index} index={@index} onClick={handleClick} />
      </#each>
    </ul>
  `
})
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
    return this.props.template(this.props, this);
  }
}