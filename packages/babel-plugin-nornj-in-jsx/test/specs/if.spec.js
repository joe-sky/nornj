var chai = require('chai');
var spies = require('chai-spies');
var util = require('../testUtil');

chai.use(spies);
var expect = chai.expect;

describe('if extension tag', function () {
  var IfWithoutElse = require('../fixtures/if/if.jsx');

  it('should render if block when condition true', function () {
    var rendered = util.render(IfWithoutElse, { condition: 'testIf' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });

  it('should render nothing when condition false', function () {
    var rendered = util.render(IfWithoutElse);
    expect(rendered).not.to.contain('<span');
    expect(rendered).not.to.contain('IfBlock');
  });
});

describe('if extension tag with else', function () {
  var IfWithElse = require('../fixtures/if/if-with-else.jsx');

  it('should render if block when condition true', function () {
    var rendered = util.render(IfWithElse, { condition: 'testIf' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });

  it('should render else block when condition false', function () {
    var rendered = util.render(IfWithElse);
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('ElseBlock');
    expect(rendered).not.to.contain('IfBlock');
  });
});

describe('if extension tag with elseif', function () {
  var IfWithoutElse = require('../fixtures/if/else-if.jsx');

  it('should render if block when condition is "testIf"', function () {
    var rendered = util.render(IfWithoutElse, { condition: 'testIf' });
    expect(rendered).to.contain('<span');
    expect(rendered).to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseIfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });

  it('should render nothing when condition is "testElseIf"', function () {
    var rendered = util.render(IfWithoutElse, { condition: 'testElseIf' });
    expect(rendered).to.contain('ElseIf-Block');
    expect(rendered).not.to.contain('IfBlock');
    expect(rendered).not.to.contain('ElseBlock');
  });
});