var expect = require('chai').expect;
var util = require('../testUtil');

describe('nj', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });
});

describe('nj.template', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.template.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });
});

describe('nj.css', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.css.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i style="color:blue">content</i>');
  });
});