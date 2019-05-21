var chai = require('chai');
var spies = require('chai-spies');
var util = require('../testUtil');

chai.use(spies);
var expect = chai.expect;

describe('simpleFor tag', function () {
  var SimpleFor = require('../fixtures/customTag/simpleFor.jsx');

  it('should render simpleFor tag without first item', function () {
    var rendered = util.render(SimpleFor, { of: [1, 2, 3] });
    expect(rendered).to.contain('<div>2</div>');
    expect(rendered).not.to.contain('<div>1</div>');
  });
});