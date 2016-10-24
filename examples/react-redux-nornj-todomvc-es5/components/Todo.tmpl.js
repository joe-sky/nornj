var TodoTmpl = nj('\
<li onClick={click} style="text-decoration:{completed:textDecoration};cursor:{completed:cursor};">\
  {text}\
</li>\
');