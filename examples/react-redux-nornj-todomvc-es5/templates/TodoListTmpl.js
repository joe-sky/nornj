var TodoListTmpl =
['ul',
    ['$each {todos}',
        ['<Todo text={text} completed={completed} key={..} index={..} onClick={todoClick} />']
    ],
'/ul'];