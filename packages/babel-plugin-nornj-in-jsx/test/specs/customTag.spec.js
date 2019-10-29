const chai = require('chai');
const spies = require('chai-spies');
const util = require('../testUtil');

chai.use(spies);
const expect = chai.expect;

describe('simpleFor tag', function() {
  const SimpleFor = require('../fixtures/customTag/simpleFor.jsx');

  it('should render simpleFor tag without first item', function() {
    const rendered = util.render(SimpleFor, { of: [1, 2, 3] });
    expect(rendered).to.contain('<div>2</div>');
    expect(rendered).not.to.contain('<div>1</div>');
  });
});

describe('while tag', function() {
  const While = require('../fixtures/customTag/while.jsx');

  it('should render while tag', function() {
    const rendered = util.render(While);
    expect(rendered).to.contain('<div>5</div>');
    expect(rendered).not.to.contain('<div>10</div>');
  });
});
