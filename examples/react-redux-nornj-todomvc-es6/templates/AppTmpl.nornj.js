'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<div>
  <AddTodo onAddClick={addClick} />
  <TodoList todos={visibleTodos} onTodoClick={todoClick} />
  <Footer filter={visibilityFilter} />
</div>`;