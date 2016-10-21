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

var _type0 = p1.compClass['li'] ? p1.compClass['li'] : 'li';
var _value0 = (!p3.multiData ? data['completed'] : p1.getDatasValue(data, 'completed'));

var _filter0 = p1.filters['textdecoration'];
if (!_filter0) {
  p1.warn('textdecoration', 'filter');
}
else {
  var _thisF0 = p1.lightObj();
  _thisF0.useString = p1.useString;
  _thisF0.data = data;
  _thisF0.parent = parent.parent;
  _thisF0.index = parent.index;

  _value0 = _filter0.apply(_thisF0, [_value0]);
}
var _value1 = (!p3.multiData ? data['completed'] : p1.getDatasValue(data, 'completed'));

var _filter1 = p1.filters['cursor'];
if (!_filter1) {
  p1.warn('cursor', 'filter');
}
else {
  var _thisF1 = p1.lightObj();
  _thisF1.useString = p1.useString;
  _thisF1.data = data;
  _thisF1.parent = parent.parent;
  _thisF1.index = parent.index;

  _value1 = _filter1.apply(_thisF1, [_value1]);
}
var _params0 = {
  onClick: (!p3.multiData ? data['click'] : p1.getDatasValue(data, 'click')),
  style: p1.styleProps('text-decoration:' + (_value0) + ';cursor:' + (_value1) + ';')
};
var _compParam0 = [_type0, _params0];

_compParam0.push((!p3.multiData ? data['text'] : p1.getDatasValue(data, 'text')));

return p1.compPort.apply(p1.compLib, _compParam0);
}
};
export default tmpl;