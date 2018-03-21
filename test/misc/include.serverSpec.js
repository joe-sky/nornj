'use strict';

const nj = require('../../src/base').default,
  includeParser = require('../../tools/includeParser');

nj.config({ includeParser });
const NJ = nj.createTaggedTmpl({ fileName: __filename });

describe('test compile string', function() {
  it('test include parser', function () {
    const tmplFn = NJ`
      <section>
        <#include src="./resources/testInclude.html" />
        <img />
        <#include src="./resources/testInclude2.html" />
      </section>
    `;

    //console.log(includeParser(tmpl, __filename, true));

    //var html = nj.compile(tmpl, { fileName: __filename })();
    var html = tmplFn();
    console.log(html);
    expect(html).toBeTruthy();
  });
});