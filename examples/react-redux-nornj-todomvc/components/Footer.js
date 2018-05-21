import { Component } from 'react';
import PropTypes from 'prop-types';
import { registerTmpl } from 'nornj-react';
import tmpls from '../template.nj.html';
import { VisibilityFilters } from '../actions/actions';
const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;

@registerTmpl('Footer')
export default class Footer extends Component {
  static propTypes = {
    filter: PropTypes.oneOf([
      SHOW_ALL,
      SHOW_COMPLETED,
      SHOW_ACTIVE
    ]).isRequired
  };

  todoState(obj) {
    switch (obj) {
      case SHOW_ACTIVE:
        return 'active';
      case SHOW_COMPLETED:
        return 'completed';
      case SHOW_ALL:
      default:
        return 'all';
    }
  }

  render() {
    return tmpls.footer({
      filters: [
        { filter: SHOW_ALL, name: 'All' },
        { filter: SHOW_COMPLETED, name: 'Completed' },
        { filter: SHOW_ACTIVE, name: 'Active' }
      ],
      currentFilter: this.props.filter
    }, this);
  }
}