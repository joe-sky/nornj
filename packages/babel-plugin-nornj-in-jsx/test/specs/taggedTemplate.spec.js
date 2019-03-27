var expect = require('chai').expect;
var util = require('../testUtil');

describe('nj', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });
});

describe('nj.string', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.string.jsx');
    var rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>\n  content\n</i>');
  });
});

describe('nj.expression', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.expression.jsx');
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

describe('nj.filter', function () {
  it('Simple usage', function () {
    var Fixture = require('../fixtures/taggedTemplate/nj.filter.jsx');
    var rendered = util.render(Fixture, { value: 'abc', cut: 123 });
    expect(rendered).to.contain('c');
  });
});