//Action type
var ADD_TODO = 'ADD_TODO';
var COMPLETE_TODO = 'COMPLETE_TODO';

//Other constant
var VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

//Action create function
function addTodo(text) {
  return { type: ADD_TODO, text: text }
}

function completeTodo(index) {
  return { type: COMPLETE_TODO, index: index }
}