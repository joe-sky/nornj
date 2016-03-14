//Action type
export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';

//Other constant
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

//Action create function
export function addTodo(text) {
  return { type: ADD_TODO, text: text };
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index: index };
}