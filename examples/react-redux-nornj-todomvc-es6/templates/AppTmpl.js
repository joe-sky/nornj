const tmpl = {
  useString: false,
  main: function anonymous(p1,p2,p3,p4,p5
/**/) {
var parent = p2.parent;
var data = p2.data;
if(!parent) {
  parent = p1.lightObj();
  if (data) {
    parent.data = p3.multiData ? data[0] : data;
  }
  p2.parent = parent;
};

var _type0 = p1.compClass['div'] ? p1.compClass['div'] : 'div';
var _compParam0 = [_type0, null];

var _type1 = p1.compClass['addtodo'] ? p1.compClass['addtodo'] : 'addtodo';
var _params0 = {
  onAddClick: (!p3.multiData ? data['addClick'] : p1.getDatasValue(data, 'addClick'))
};
var _compParam1 = [_type1, _params0];

_compParam0.push(p1.compPort.apply(p1.compLib, _compParam1));

var _type2 = p1.compClass['todolist'] ? p1.compClass['todolist'] : 'todolist';
var _params1 = {
  todos: (!p3.multiData ? data['visibleTodos'] : p1.getDatasValue(data, 'visibleTodos')),
  onTodoClick: (!p3.multiData ? data['todoClick'] : p1.getDatasValue(data, 'todoClick'))
};
var _compParam2 = [_type2, _params1];

_compParam0.push(p1.compPort.apply(p1.compLib, _compParam2));

var _type3 = p1.compClass['footer'] ? p1.compClass['footer'] : 'footer';
var _params2 = {
  filter: (!p3.multiData ? data['visibilityFilter'] : p1.getDatasValue(data, 'visibilityFilter'))
};
var _compParam3 = [_type3, _params2];

_compParam0.push(p1.compPort.apply(p1.compLib, _compParam3));

return p1.compPort.apply(p1.compLib, _compParam0);
}
};
export default tmpl;