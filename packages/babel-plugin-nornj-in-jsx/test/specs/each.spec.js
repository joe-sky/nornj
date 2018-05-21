var chai = require('chai');
var spies = require('chai-spies');
var util = require('../testUtil');

chai.use(spies);
var expect = chai.expect;

describe('requiring in component with each', function () {
  var eachWithArray = require('../fixtures/each/each.jsx');

  it('should render each block when the "of" attr is array and its length > 0 ', function () {
    var rendered = util.render(eachWithArray);
    expect(rendered).to.contain('<div');
    expect(rendered).to.contain('<i');
  });
});
