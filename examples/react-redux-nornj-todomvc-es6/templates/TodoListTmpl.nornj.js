import nj from '../../../src/base.js';

export default nj`
<ul>
  <#each {todos}>
    <Todo text={text} completed={completed} key={#} index={#} onClick={todoClick} />
  </#each>
</ul>`;