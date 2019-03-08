import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindTemplate } from 'nornj-react';

@bindTemplate({
  name: 'AddTodo',
  template: nj`
    <div>
      <input type=text ref=input />
      <button onClick={handleClick}>
        Add
      </button>
    </div>
  `
})
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
    return this.props.template(this);
  }
}