const expect = require('chai').expect;
const util = require('../testUtil');

describe('nj', function() {
  it('Simple usage', function() {
    const Fixture = require('../fixtures/taggedTemplate/nj.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });
});

describe('nj.string', function() {
  it('Simple usage', function() {
    const Fixture = require('../fixtures/taggedTemplate/nj.string.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>\n  content\n</i>');
  });
});

describe('nj.expression', function() {
  it('Simple usage', function() {
    const Fixture = require('../fixtures/taggedTemplate/nj.expression.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });
});

describe('nj.template', function() {
  it('Simple usage', function() {
    const Fixture = require('../fixtures/taggedTemplate/nj.template.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.contain('<i>content</i>');
  });
});

describe('nj.css', function() {
  it('Simple usage', function() {
    const Fixture = require('../fixtures/taggedTemplate/nj.css.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.contain('<i style="color:blue">content</i>');
  });
});

describe('nj.filter', function() {
  it('Simple usage', function() {
    const Fixture = require('../fixtures/taggedTemplate/nj.filter.jsx');
    const rendered = util.render(Fixture, { value: 'abc', cut: 123 });
    expect(rendered).to.contain('c');
  });
});
