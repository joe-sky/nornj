const tmpl = {
  useString: false,
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

var _type0 = p1.compClass['todo'] ? p1.compClass['todo'] : 'todo';
var _params0 = {
  text: (!p3.multiData ? data['text'] : p1.getDatasValue(data, 'text')),
  completed: (!p3.multiData ? data['completed'] : p1.getDatasValue(data, 'completed')),
  key: parent.index,
  index: parent.index,
  onClick: (!p3.multiData ? data['todoClick'] : p1.getDatasValue(data, 'todoClick'))
};
var _compParam0 = [_type0, _params0];

return p1.compPort.apply(p1.compLib, _compParam0);
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

var _type0 = p1.compClass['ul'] ? p1.compClass['ul'] : 'ul';
var _compParam0 = [_type0, null];

var _expr0 = p1.exprs['each'];
var _dataRefer0 = [
  (!p3.multiData ? data['todos'] : p1.getDatasValue(data, 'todos'))
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