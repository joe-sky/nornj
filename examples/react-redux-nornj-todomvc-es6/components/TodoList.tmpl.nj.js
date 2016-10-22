import nj from '../../../src/base.js';

export default nj`
<ul>
  <#each {todos}>
    <Todo {text} {completed} key={#} index={#} onClick={todoClick} />
  </#each>
</ul>`;