import { UPDATE_LOCATION } from 'react-router-redux';
import { ADD_TODO, COMPLETE_TODO, VisibilityFilters } from '../actions/actions';
const { SHOW_ALL } = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case UPDATE_LOCATION:
      var filter = action.payload.pathname.substr(1);
      switch (filter) {
        case '':
        case 'all':
          return VisibilityFilters.SHOW_ALL;
        case 'active':
          return VisibilityFilters.SHOW_ACTIVE;
        case 'completed':
          return VisibilityFilters.SHOW_COMPLETED;
      }
    default:
      return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ];
    case COMPLETE_TODO:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], {
          completed: true
        }),
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

export default {
  visibilityFilter: visibilityFilter,
  todos: todos
};