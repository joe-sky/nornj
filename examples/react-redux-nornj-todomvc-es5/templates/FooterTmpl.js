var FooterTmpl = nj('\
<p>\
  ${0}\
  <$each {filters}>\
    <$if {filter:isCurrent}>\
      {name}\
    <$else />\
      <Linkto to=/{filter:todoState}>\
        {name}\
      </Linkto>\
    </$if>\
    <$if {name:equal(Active)}>\
      .\
    <$else />\
      ${1}\
    </$if>\
  </$each>\
</p>\
', ['Show: '], [', ']);