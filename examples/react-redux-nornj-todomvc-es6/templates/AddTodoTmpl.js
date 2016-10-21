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

var _type1 = p1.compClass['input'] ? p1.compClass['input'] : 'input';
var _params0 = {
  type: 'text',
  ref: 'input'
};
var _compParam1 = [_type1, _params0];

_compParam0.push(p1.compPort.apply(p1.compLib, _compParam1));

var _type2 = p1.compClass['button'] ? p1.compClass['button'] : 'button';
var _params1 = {
  onClick: (!p3.multiData ? data['handleClick'] : p1.getDatasValue(data, 'handleClick'))
};
var _compParam2 = [_type2, _params1];

_compParam2.push('Add');

_compParam0.push(p1.compPort.apply(p1.compLib, _compParam2));

return p1.compPort.apply(p1.compLib, _compParam0);
}
};
export default tmpl;