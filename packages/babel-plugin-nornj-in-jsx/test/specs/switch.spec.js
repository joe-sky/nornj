var chai = require('chai');
var spies = require('chai-spies');
var util = require('../testUtil');

chai.use(spies);
var expect = chai.expect;

describe('requiring in component with switch', function () {
  var SwitchComm = require('../fixtures/switch/switch.jsx');

  it('should render case1 block when condition is "case1"', function () {
    var rendered = util.render(SwitchComm, { condition: 1 });
    console.log(rendered);
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('Case1Block');
  });

  it('should render case2 block when condition is "case2"', function () {
    var rendered = util.render(SwitchComm, { condition: 2 });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('Case2Block');
  });

  it('should render default block when condition is neither "case1" nor "case2"', function () {
    var rendered = util.render(SwitchComm, { condition: 'others' });
    console.log('222222222222', rendered);
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('DefaultBlock');
  });
});
