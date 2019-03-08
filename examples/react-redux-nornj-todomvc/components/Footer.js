import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindTemplate } from 'nornj-react';
import { VisibilityFilters } from '../actions/actions';
const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;

@bindTemplate({
  name: 'Footer',
  template: nj`
    <p>
      {'Show: '}
      <#each {filters}>
        <#if {filter == currentFilter}>
          {name}
          <#else>
            <router-Link to="/{filter | todoState}">
              {name}
            </router-Link>
          </#else>
        </#if>
        <#if {name == 'Active'}>
          .
          <#else>
            {', '}
          </#else>
        </#if>
      </#each>
    </p>
  `
})
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
    return this.props.template({
      filters: [
        { filter: SHOW_ALL, name: 'All' },
        { filter: SHOW_COMPLETED, name: 'Completed' },
        { filter: SHOW_ACTIVE, name: 'Active' }
      ],
      currentFilter: this.props.filter
    }, this);
  }
}