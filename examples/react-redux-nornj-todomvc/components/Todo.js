import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindTemplate } from 'nornj-react';

@bindTemplate({
  name: 'Todo',
  template: nj`
    <li onClick={handleClick} style="text-decoration:{completed | textDecoration};cursor:{completed | cursor};">
      {text}
    </li>
  `
})
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
    return this.props.template(this.props, this);
  }
}