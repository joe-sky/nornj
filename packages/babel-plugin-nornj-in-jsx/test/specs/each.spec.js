var chai = require('chai');
var spies = require('chai-spies');
var util = require('../testUtil');

chai.use(spies);
var expect = chai.expect;

describe('each extension tag', function () {
  var eachComponent = require('../fixtures/each/each.jsx');

  it('should render each block when the "of" props is array and it is not empty ', function () {
    var rendered = util.render(eachComponent, { 'of': ['xxxx', 2, 3] });
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('0');
    expect(rendered).to.contain('xxxx');
    expect(rendered).to.contain('last one');
  });

  it('should render each block when the "of" props literal like `3 ...5` ', function () {
    var rendered = util.render(eachComponent, { 'of': `${1} .. 2` });
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('0');
    expect(rendered).to.contain('2');
  });

  it('should render nothing when  "of"  props is an empty array ', function () {
    var rendered = util.render(eachComponent, { 'of': [] });
    expect(rendered).not.to.contain('<i');
  });
});

describe('each extension tag with item or index props', function () {
  var eachComponent2 = require('../fixtures/each/each-item-index.jsx');

  it('should render each block when have item or index props', function () {
    var rendered = util.render(eachComponent2);
    expect(rendered).to.contain('xxxx');
    expect(rendered).to.contain('4');
  });
});

describe('for extension tag', function () {
  var forComponent = require('../fixtures/each/for.jsx');

  it('should render for block', function () {
    var rendered = util.render(forComponent);
    expect(rendered).to.contain('<i>55</i>');
  });
});

describe('each with object parameter', function () {
  var eachComponent = require('../fixtures/each/each-object.jsx');

  it('should render each tag with object parameter', function () {
    var rendered = util.render(eachComponent);
    expect(rendered).to.contain('<i>a</i><i>1</i><i>1</i>');
  });
});