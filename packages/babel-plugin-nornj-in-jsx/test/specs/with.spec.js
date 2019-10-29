const expect = require('chai').expect;
const util = require('../testUtil');

describe('with extension tag', function() {
  it('should render without attributes', function() {
    const Fixture = require('../fixtures/with/with-no-attributes.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>test<\/span><\/div>$/);
  });

  it('should render with a single attribute', function() {
    const Fixture = require('../fixtures/with/with-single-attribute.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>value<\/span><\/div>$/);
  });

  it('should render with multiple attributes', function() {
    const Fixture = require('../fixtures/with/with-multiple-attributes.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>value1value2value3<\/span><\/div>$/);
  });

  it('should render with an unused attribute', function() {
    const Fixture = require('../fixtures/with/with-unused-attribute.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>used<\/span><\/div>$/);
  });

  it('should render a string attribute', function() {
    const Fixture = require('../fixtures/with/with-string-attribute.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>string<\/span><\/div>$/);
  });

  it('should render an expression attribute', function() {
    const Fixture = require('../fixtures/with/with-expression-attribute.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>expression<\/span><\/div>$/);
  });

  it('should inherit nested attributes', function() {
    const Fixture = require('../fixtures/with/with-nested.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>outerinner<\/span><\/div>$/);
  });

  it('should shadow nested attributes', function() {
    const Fixture = require('../fixtures/with/with-nested-shadowed.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>inner<\/span><\/div>$/);
  });

  it('should restore shadowed nested attributes', function() {
    const Fixture = require('../fixtures/with/with-nested-shadowed-restored.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(
      /^<div[^>]*><span[^>]*>outer<\/span><span[^>]*>inner<\/span><span[^>]*>outer<\/span><\/div>$/
    );
  });

  it('should preserve access to outer variables', function() {
    const Fixture = require('../fixtures/with/with-outer.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>variableattribute<\/span><\/div>$/);
  });

  it('should shadow outer variables', function() {
    const Fixture = require('../fixtures/with/with-outer-shadowed.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>attribute<\/span><\/div>$/);
  });

  it('should restore shadowed outer variables', function() {
    const Fixture = require('../fixtures/with/with-outer-shadowed-restored.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(
      /^<div[^>]*><span[^>]*>variable<\/span><span[^>]*>attribute<\/span><span[^>]*>variable<\/span><\/div>$/
    );
  });

  it('should preserve access to outer this', function() {
    const Fixture = require('../fixtures/with/with-outer-this.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>attributeouter<\/span><\/div>$/);
  });

  it('should render nothing if content is empty', function() {
    const Fixture = require('../fixtures/with/with-empty-content.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><\/div>$/);
  });

  it('should render a text child', function() {
    const Fixture = require('../fixtures/with/with-text-child.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*>text child <![^>]*>value<\/div>$/);
  });

  it('should render a single element child', function() {
    const Fixture = require('../fixtures/with/with-element-child.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<div[^>]*><span[^>]*>value<\/span><\/div>$/);
  });

  it('should render multiple children', function() {
    const Fixture = require('../fixtures/with/with-multiple-children.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(
      /^<div[^>]*><span[^>]*>value<\/span><span[^>]*>value<\/span><span[^>]*>value<\/span><\/div>$/
    );
  });

  it('should render as toplevel component', function() {
    const Fixture = require('../fixtures/with/with-toplevel-component.jsx');
    const rendered = util.render(Fixture);
    expect(rendered).to.match(/^<span[^>]*>value<\/span>$/);
  });
});
