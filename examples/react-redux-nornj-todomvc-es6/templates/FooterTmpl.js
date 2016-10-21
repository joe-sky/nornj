const tmpl = {
  useString: false,
  fn2: function anonymous(p1,p2,p3,p4,p5
/**/) {
var parent = p2.parent;
var data = p2.data;

return (!p3.multiData ? data['name'] : p1.getDatasValue(data, 'name'));
},
  fn3: function anonymous(p1,p2,p3,p4,p5
/**/) {
var parent = p2.parent;
var data = p2.data;

var _type0 = p1.compClass['linkto'] ? p1.compClass['linkto'] : 'linkto';
var _value0 = (!p3.multiData ? data['filter'] : p1.getDatasValue(data, 'filter'));

var _filter0 = p1.filters['todostate'];
if (!_filter0) {
  p1.warn('todostate', 'filter');
}
else {
  var _thisF0 = p1.lightObj();
  _thisF0.useString = p1.useString;
  _thisF0.data = data;
  _thisF0.parent = parent.parent;
  _thisF0.index = parent.index;

  _value0 = _filter0.apply(_thisF0, [_value0]);
}
var _params0 = {
  to: '/' + (_value0)
};
var _compParam0 = [_type0, _params0];

_compParam0.push((!p3.multiData ? data['name'] : p1.getDatasValue(data, 'name')));

return p1.compPort.apply(p1.compLib, _compParam0);
},
  fn4: function anonymous(p1,p2,p3,p4,p5
/**/) {
var parent = p2.parent;
var data = p2.data;

return '.';
},
  fn5: function anonymous(p1,p2,p3,p4,p5
/**/) {
var parent = p2.parent;
var data = p2.data;

return ', ';
},
  fn1: function anonymous(p1,p2,p3,p4,p5
/**/) {
var parent = p1.lightObj();
parent.data = p4.item;
parent.parent = p2.parent;
parent.index = p4.index;
var data = p1.getItemParam(p4.item, p2.data, p3.multiData);
var _p2 = p1.lightObj();
_p2.parent = parent;
_p2.data = data;
var ret = [];

var _expr0 = p1.exprs['if'];
var _value0 = (!p3.multiData ? data['filter'] : p1.getDatasValue(data, 'filter'));

var _filter0 = p1.filters['iscurrent'];
if (!_filter0) {
  p1.warn('iscurrent', 'filter');
}
else {
  var _thisF0 = p1.lightObj();
  _thisF0.useString = p1.useString;
  _thisF0.data = data;
  _thisF0.parent = parent.parent;
  _thisF0.index = parent.index;

  _value0 = _filter0.apply(_thisF0, [_value0]);
}
var _dataRefer0 = [
  _value0
];
p1.throwIf(_expr0, 'if', 'expr');

var _this0 = p1.lightObj();
_this0.useString = p1.useString;
_this0.result = p1.exprRet(p1, _p2, p3, p1.fn2, p5);
_this0.inverse = p1.exprRet(p1, _p2, p3, p1.fn3, p5);

ret.push(_expr0.apply(_this0, _dataRefer0));

var _expr1 = p1.exprs['if'];
var _value1 = (!p3.multiData ? data['name'] : p1.getDatasValue(data, 'name'));

var _filter1 = p1.filters['equal'];
if (!_filter1) {
  p1.warn('equal', 'filter');
}
else {
  var _thisF1 = p1.lightObj();
  _thisF1.useString = p1.useString;

  _value1 = _filter1.apply(_thisF1, [_value1, 'Active']);
}
var _dataRefer1 = [
  _value1
];
p1.throwIf(_expr1, 'if', 'expr');

var _this1 = p1.lightObj();
_this1.useString = p1.useString;
_this1.result = p1.exprRet(p1, _p2, p3, p1.fn4, p5);
_this1.inverse = p1.exprRet(p1, _p2, p3, p1.fn5, p5);

ret.push(_expr1.apply(_this1, _dataRefer1));
return ret;
},
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

var _type0 = p1.compClass['p'] ? p1.compClass['p'] : 'p';
var _compParam0 = [_type0, null];

_compParam0.push('Show: ');

var _expr0 = p1.exprs['each'];
var _dataRefer0 = [
  (!p3.multiData ? data['filters'] : p1.getDatasValue(data, 'filters'))
];
p1.throwIf(_expr0, 'each', 'expr');

var _this0 = p1.lightObj();
_this0.useString = p1.useString;
_this0.result = p1.exprRet(p1, p2, p3, p1.fn1, p5);
_this0.inverse = p1.noop;

_compParam0.push(_expr0.apply(_this0, _dataRefer0));

return p1.compPort.apply(p1.compLib, _compParam0);
}
};
export default tmpl;