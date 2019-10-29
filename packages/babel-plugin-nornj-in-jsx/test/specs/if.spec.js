const chai = require('chai');
const spies = require('chai-spies');
const util = require('../testUtil');

chai.use(spies);
const expect = chai.expect;

describe('if extension tag', function() {
  const IfWithoutElse = require('../fixtures/if/if.jsx');

  it('should render if block when condition true', function() {
    const rendered = util.render(IfWithoutElse, { condition: 'testIf' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });

  it('should render nothing when condition false', function() {
    const rendered = util.render(IfWithoutElse);
    expect(rendered).not.to.contain('<span');
    expect(rendered).not.to.contain('IfBlock');
  });
});

describe('if extension tag with else', function() {
  const IfWithElse = require('../fixtures/if/if-with-else.jsx');

  it('should render if block when condition true', function() {
    const rendered = util.render(IfWithElse, { condition: 'testIf' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });

  it('should render else block when condition false', function() {
    const rendered = util.render(IfWithElse);
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('ElseBlock');
    expect(rendered).not.to.contain('IfBlock');
  });
});

describe('if extension tag with elseif', function() {
  const IfWithoutElse = require('../fixtures/if/else-if.jsx');

  it('should render if block when condition is "testIf"', function() {
    const rendered = util.render(IfWithoutElse, { condition: 'testIf' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseIfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });

  it('should render nothing when condition is "testElseIf"', function() {
    const rendered = util.render(IfWithoutElse, { condition: 'testElseIf' });
    expect(rendered).to.contain('ElseIf-Block');
    expect(rendered).not.to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });
});
