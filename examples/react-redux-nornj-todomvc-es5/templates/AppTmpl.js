var AppTmpl = nj('\
<div>\
  <AddTodo onAddClick={addClick} />\
  <TodoList todos={visibleTodos} onTodoClick={todoClick} />\
  <Footer filter={visibilityFilter} />\
</div>\
');