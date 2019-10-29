const chai = require('chai');
const spies = require('chai-spies');
const util = require('../testUtil');

chai.use(spies);
const expect = chai.expect;

describe('each extension tag', function() {
  const eachComponent = require('../fixtures/each/each.jsx');

  it('should render each block when the "of" props is array and it is not empty ', function() {
    const rendered = util.render(eachComponent, { of: ['xxxx', 2, 3] });
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('0');
    expect(rendered).to.contain('xxxx');
    expect(rendered).to.contain('last one');
  });

  it('should render each block when the "of" props literal like `3 ...5` ', function() {
    const rendered = util.render(eachComponent, { of: `${1} .. 2` });
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('0');
    expect(rendered).to.contain('2');
  });

  it('should render nothing when  "of"  props is an empty array ', function() {
    const rendered = util.render(eachComponent, { of: [] });
    expect(rendered).not.to.contain('<i');
  });
});

describe('each extension tag with item or index props', function() {
  const eachComponent2 = require('../fixtures/each/each-item-index.jsx');

  it('should render each block when have item or index props', function() {
    const rendered = util.render(eachComponent2);
    expect(rendered).to.contain('xxxx');
    expect(rendered).to.contain('4');
  });
});

describe('for extension tag', function() {
  const forComponent = require('../fixtures/each/for.jsx');

  it('should render for block', function() {
    const rendered = util.render(forComponent);
    expect(rendered).to.contain('<i>55</i>');
  });
});

describe('each with object parameter', function() {
  const eachComponent = require('../fixtures/each/each-object.jsx');

  it('should render each tag with object parameter', function() {
    const rendered = util.render(eachComponent);
    expect(rendered).to.contain('<i>a</i><i>1</i><i>1</i>');
  });
});
