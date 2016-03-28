import nj from '../../../src/base.js';
import { VisibilityFilters } from '../actions/actions';
const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;

nj.registerFilter({
  isCurrent: function (obj) {
    return obj === this.parent.data.currentFilter;
  },
  todoState: function (obj) {
    switch (obj) {
      case SHOW_ACTIVE:
        return 'active';
      case SHOW_COMPLETED:
        return 'completed';
      case SHOW_ALL:
      default:
        return 'all';
    }
  },
  textDecoration: function (obj) {
    return obj ? 'line-through' : 'none';
  },
  cursor: function (obj) {
    return obj ? 'default' : 'pointer';
  }
});