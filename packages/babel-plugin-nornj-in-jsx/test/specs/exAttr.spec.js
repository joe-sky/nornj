import chai from 'chai';
import spies from 'chai-spies';
import util from '../testUtil';

chai.use(spies);
const expect = chai.expect;

describe('n-show extension attribute', function () {
  const nShow = require('../fixtures/exAttr/n-show.jsx');

  it('should render n-show when value is true', function () {
    const rendered = util.render(nShow, { condition: true, show: true });
    expect(rendered).to.contain('<p name="wrap" class="wrap" id="wrap">');
    expect(rendered).to.contain('<div style="display:none"');
    expect(rendered).not.to.contain('<p style="display:none"');
  });

  it('should render n-show when value is false', function () {
    const rendered = util.render(nShow, { show: false });
    expect(rendered).to.contain('<input style="display:none"');
    expect(rendered).not.to.contain('<input class=');
  });
});

describe('n-style extension attribute', function () {
  const nStyle = require('../fixtures/exAttr/n-style.jsx');

  it('should render n-style when value is string', function () {
    const rendered = util.render(nStyle, { condition: true });
    expect(rendered).to.contain('<input style="margin:0;padding-left:15px"');
    expect(rendered).not.to.contain('<input class=');
  });

  it('should render n-style when value is string template', function () {
    const rendered = util.render(nStyle);
    expect(rendered).to.contain('<input style="margin:10px;padding-left:15px"');
    expect(rendered).not.to.contain('<input class=');
  });
});