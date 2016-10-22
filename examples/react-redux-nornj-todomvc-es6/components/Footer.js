import nj from '../../../src/base.js';
import { Component, PropTypes } from 'react';
import { VisibilityFilters } from '../actions/actions';
import tmpl from './Footer.tmpl';
const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;
const template = nj.compileComponent(tmpl);

class Footer extends Component {
  static propTypes = {
    filter: PropTypes.oneOf([
      SHOW_ALL,
      SHOW_COMPLETED,
      SHOW_ACTIVE
    ]).isRequired
  };

  render() {
    return template({
      filters: [
        { filter: SHOW_ALL, name: 'All' },
        { filter: SHOW_COMPLETED, name: 'Completed' },
        { filter: SHOW_ACTIVE, name: 'Active' }
      ],
      currentFilter: this.props.filter
    });
  }
}

nj.registerComponent({ Footer });

export default Footer;