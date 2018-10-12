var expect = require('chai').expect;
var util = require('../testUtil');

describe('fn extension tag', function () {
  it('should render without parameters', function () {
    var Fixture = require('../fixtures/fn/fn-no-parameter.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });

  it('should render with multiple parameters', function () {
    var Fixture = require('../fixtures/fn/fn-multiple-parameters.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i><b>123</b>content<b>456</b></i>');
  });
});
