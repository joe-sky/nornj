import nj from '../../../src/base.js';

export default nj`
<p>
  @${'Show: '}
  <#each {filters}>
    <#if {filter:isCurrent}>
      {name}
    <#else />
      <Linkto to=/{filter:todoState}>
        {name}
      </Linkto>
    </#if>
    <#if {name:equal(Active)}>
      .
    <#else />
      @${', '}
    </#if>
  </#each>
</p>`;