'use strict';

let nj = require('../../../src/base.js');

module.exports = nj`
<ul>
  <$each {todos}>
    <Todo text={text} completed={completed} key={#} index={#} onClick={todoClick} />
  </$each>
</ul>`;