import nj from '../../src/core';
import { render, precompile } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';

describe('Precompile', () => {
  nj.registerExtension('noMargin', options => {
    options.exProps.style = 'margin:0';
  }, { addSet: true });

  xit('Extension attribute', () => {
    const ret = precompile(`
      <div type="radio" #show={{show}} #noMargin-arg1-arg2.modifier1.modifier2={{show}}>
        <i><#test /></i>
      </div>
    `, true, nj.tmplRule);

    //console.log(ret.main.toString());
    expect(Object.keys(ret).length).not.toBe(8);
    expect(ret.main.toString()).toContain('p1.x[\'noMargin\']');
  });

  it('Simple', () => {
    //console.log(render(`<i>{{(1+2**3) %% 5+'_123'}}</i>`));

    //const REGEX_OPERATOR = /\+|-|\*|%|==|<=|>=|<|>|&&/;
    const OPERATORS = ['+', '-', '*', '%', '==', '<=', '>=', '<', '>', '&&'];

    const tmpl = `<div>
      {{'abcde'.substring(1, num.getLength()).length * 5 | test(100)}}
      <!--#
      <#tmpl>{123}</#tmpl>
      {{1 + 2 > 2 && 2 ** (3 + 1) <= 5 && (5 + 6 %% 7) >= 10}}
      {{1 + 2 ** 3 - 4 * 5 %% (6 + 7)}}
      {{'111'.length + 2 * 3}}
      {{' 123 '.trim() + 4 - 5 ** 6}}
      {{' 123 '.trim(1 + 2 %% 5, alt(ctrl(123['length'].toString(123), '5', 6))) + shift() + 4 - 5 ** 6}}
      {{('111'.length + 2) * 3}}
      {{('111'.length + 2) * 3 | test}}
      {{('111'.length + 2) * 3 | test(100, 200)}}
      {{ { a: 1, b: 2 }.b * 100 }}
      {{[1, 2, 3][0] + 100}}
      {{ { fn: param => param + 'abc'.substring(param, 10) } }}
      {{set a = '123' + '456'}}
      #-->
    </div>`;

    const ast0 = {
      "prop": {
        "filters": [{
          "params": [{
            "name": "2",
            "isBasicType": true
          }],
          "name": "ctrl"
        }],
        "name": "'5'",
        "isBasicType": true
      },
      "escape": true
    };

    const ast = {
      "prop": {
        "filters": [{
          "params": [{
            "name": "'substring'",
            "isBasicType": true
          }],
          "name": "."
        },
        {
          "params": [{
            "name": "1",
            "isBasicType": true
          },
          {
            "filters": [{
              "params": [{
                "name": "'getLength'",
                "isBasicType": true
              }],
              "name": "."
            },
            {
              "params": [],
              "name": "_"
            }],
            "name": "num"
          }],
          "name": "_"
        },
        {
          "params": [{
            "name": "'length'",
            "isBasicType": true
          }],
          "name": "."
        },
        {
          "params": [{
            "name": "5",
            "isBasicType": true
          }],
          "name": "*"
        },
        {
          "params": [{
            "name": "100",
            "isBasicType": true
          }],
          "name": "test"
        }],
        "name": "'abcde'",
        "isBasicType": true
      },
      "escape": true
    };

    function _buildExpression(ast) {
      let codeStr = (ast.filters && OPERATORS.indexOf(ast.filters[0].name) < 0) ? '' : ast.name;
      let lastCodeStr = '';

      ast.filters && ast.filters.forEach((filter, i) => {
        const hasFilterNext = ast.filters[i + 1] && OPERATORS.indexOf(ast.filters[i + 1].name) < 0;

        if (OPERATORS.indexOf(filter.name) >= 0) {  //Native operator
          codeStr += ` ${filter.name} `;

          if (!ast.filters[i + 1] || OPERATORS.indexOf(ast.filters[i + 1].name) >= 0) {
            if (filter.params[0].filters) {
              codeStr += '(';
              codeStr += _buildExpression(filter.params[0]);
              codeStr += ')';
            }
            else {
              codeStr += filter.params[0].name;
            }
          }
        }
        else if (filter.name === '_') {  //Call function
          let _codeStr = lastCodeStr;
          _codeStr += '(';
          filter.params.forEach((param, j) => {
            _codeStr += _buildExpression(param);
            if (j < filter.params.length - 1) {
              _codeStr += ', ';
            }
          });
          _codeStr += ')';

          if (hasFilterNext) {
            lastCodeStr = _codeStr;
          }
          else {
            codeStr += _codeStr;
            lastCodeStr = '';
          }
        }
        else {  //Custom filter
          let _codeStr = `p1.f['${filter.name}'](`;
          if (ast.isEmpty && i == 0) {  //Method
            filter.params.forEach((param, j) => {
              _codeStr += _buildExpression(param);
              if (j < filter.params.length - 1) {
                _codeStr += ', ';
              }
            });
          }
          else {  //Operator
            if (i == 0) {
              _codeStr += ast.name;
            }
            else if (lastCodeStr !== '') {
              _codeStr += lastCodeStr;
            }
            else {
              if (ast.filters[i - 1].params[0].filters) {
                _codeStr += _buildExpression(ast.filters[i - 1].params[0]);
              }
              else {
                _codeStr += ast.filters[i - 1].params[0].name;
              }
            }
            _codeStr += ', ';
            if (filter.params[0].filters) {
              _codeStr += _buildExpression(filter.params[0]);
            }
            else {
              _codeStr += filter.params[0].name;
            }
          }
          _codeStr += ')';

          if (hasFilterNext) {
            lastCodeStr = _codeStr;
          }
          else {
            codeStr += _codeStr;
            lastCodeStr = '';
          }
        }
      });

      return codeStr;
    }

    console.log(_buildExpression(ast.prop));

    const ret = precompile(tmpl, true, nj.tmplRule);

    const gCode = `
      p1.f['**'](p1.f['ctrl']('5', 2), 5)

      p1.f['.'](p1.f['.'](p1.f['.'](a, 'b'), 'c'), 'd')

      1 + p1.f['**'](2, 3) - 4 * p1.f['%%'](5, 6 + 7)

      p1.f['.']('111', 'length') + 2 * 3

      var _v0 = p1.f['.'](' 123 ', 'trim');
      (_v0 && _v0()) + 4 - p1.f['**'](5, 6)

      p1.f['.']({ a: 1, b: 2 }, 'b') * 100

      p1.f['.']([1, 2, 3], 0) + 100

      var _v0 = p1.f['.']('abcde', 'substring');
      var _v1 = p1.f['.'](p2.d('num'), 'getLength');
      p1.f['.']((_v0 && _v0(1, (_v1 && _v1()))), 'length') * 5
      
      var _v0 = p1.f['.']('abc', 'substring');
      { fn: param => param + (_v0 && _v0(param, 10)) }

      p2.d('a', 0, true)._njCtx.a = '123' + '456'
    `;

    //console.log(ret.main.toString());
    // var _v0 = null;
    // console.log('1' + (_v0 && _v0()) + 3);
  });
});