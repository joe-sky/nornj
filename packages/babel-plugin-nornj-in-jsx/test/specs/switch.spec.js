const chai = require('chai');
const spies = require('chai-spies');
const util = require('../testUtil');

chai.use(spies);
const expect = chai.expect;

describe('switch extension tag', function() {
  const SwitchComm = require('../fixtures/switch/switch.jsx');

  it('should render case1 block when condition is "case1"', function() {
    const rendered = util.render(SwitchComm, { condition: 'case1' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('Case1Block');
  });

  it('should render case2 block when condition is "case2"', function() {
    const rendered = util.render(SwitchComm, { condition: 'case2' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('Case2Block');
  });

  it('should render default block when condition is neither "case1" nor "case2"', function() {
    const rendered = util.render(SwitchComm, { condition: 'others' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('DefaultBlock');
  });
});

describe('switch extension tag nested switch', function() {
  const NestedSwitch = require('../fixtures/switch/switch-in-switch.jsx');

  it('should render nested case1 block when condition1 is "case1" and condition2 is 1', function() {
    const rendered = util.render(NestedSwitch, { condition1: 'case1', condition2: 1 });
    expect(rendered).to.contain('<i');
    expect(rendered).to.contain('NestedCase1Block');
    expect(rendered).not.to.contain('NestedDefaultBlock');
  });

  it('should render nested case2 block when condition1 is "case1" and condition2 is 2', function() {
    const rendered = util.render(NestedSwitch, { condition1: 'case1', condition2: 2 });
    expect(rendered).to.contain('<i');
    expect(rendered).to.contain('NestedCase2Block');
    expect(rendered).not.to.contain('NestedCase1Block');
  });

  it('should render nested default block when condition1 is "case1" and condition2 is 3', function() {
    const rendered = util.render(NestedSwitch, { condition1: 'case1', condition2: 3 });
    expect(rendered).not.to.contain('<i');
    expect(rendered).to.contain('NestedDefaultBlock');
  });
});
