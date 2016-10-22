import nj from '../../../src/base.js';

export default nj`
<div>
  <AddTodo onAddClick={addClick} />
  <TodoList todos={visibleTodos} onTodoClick={todoClick} />
  <Footer filter={visibilityFilter} />
</div>`;