var chai = require('chai');
var spies = require('chai-spies');
var util = require('../testUtil');

chai.use(spies);
var expect = chai.expect;

describe('requiring in component with each', function () {
  var eachCompomment = require('../fixtures/each/each.jsx');

  it('should render each block when the "of" props is array and it is not empty ', function () {
    var rendered = util.render(eachCompomment, { 'of': ['xxxx', 2, 3] });
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('0');
    expect(rendered).to.contain('xxxx');
  });
  it('should render each block when the "of" props literal like `3 ...5` ', function () {
    var rendered = util.render(eachCompomment, { 'of': `${1} .. 2` });
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('0');
    expect(rendered).to.contain('2');
  });

  it('should render nothing when  "of"  props is an empty array ', function () {
    var rendered = util.render(eachCompomment, { 'of': [] });
    expect(rendered).not.to.contain('<i');
  });

});

describe('requiring in component with item or index props', function () {
  var eachCompomment2 = require('../fixtures/each/each-item-index.jsx');

  it('should render each block when have item or index props', function () {
    var rendered = util.render(eachCompomment2);
    expect(rendered).to.contain('xxxx');
    expect(rendered).to.contain('4');
  });
});
