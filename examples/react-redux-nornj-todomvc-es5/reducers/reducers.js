var SHOW_ALL = VisibilityFilters.SHOW_ALL;

function visibilityFilter(state, action) {
    if (!state) {
        state = SHOW_ALL;
    }

    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

function todos(state, action) {
    if (!state) {
        state = [];
    }

    switch (action.type) {
        case ADD_TODO:
            return state.concat([{
                text: action.text,
                completed: false
            }]);
        case COMPLETE_TODO:
            return state.slice(0, action.index).concat(nj.assign({}, state[action.index], {
                completed: true
            })).concat(state.slice(action.index + 1));
        default:
            return state
    }
}

var todoApp = Redux.combineReducers({
    visibilityFilter: visibilityFilter,
    todos: todos
});