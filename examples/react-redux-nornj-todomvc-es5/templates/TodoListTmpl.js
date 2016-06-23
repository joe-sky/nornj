var TodoListTmpl = nj('\
<ul>\
  <$each {todos}>\
    <Todo text={text} completed={completed} key={#} index={#} onClick={todoClick} />\
  </$each>\
</ul>\
');