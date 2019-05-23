import nj from '../../src/core';
import { render, precompile } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';
import * as tools from '../../src/utils/tools';
import { filterConfig } from '../../src/helpers/filter';

describe('Precompile', () => {
  nj.registerExtension('noMargin', options => {
    options.exProps.style = 'margin:0';
  }, { addSet: true });

  it('Extension attribute', () => {
    const ret = precompile(`
      <i><n-test {{...abc}} /></i>
    `, true, nj.tmplRule);

    //console.log(ret.main.toString());
    //expect(Object.keys(ret).length).not.toBe(8);
    //expect(ret.main.toString()).toContain('g.x[\'noMargin\']');
  });

  xit('Simple', () => {
    const CUSTOM_VAR = 'nj_custom';

    function _replaceBackslash(str) {
      return str = str.replace(/\\/g, '\\\\');
    }

    function _buildOptions() {
      return '{ _njOpts: true }';
    }

    function _buildDataValue(ast) {
      let dataValueStr, special = false;
      const { isComputed, hasSet } = ast;

      if (ast.isBasicType) {
        dataValueStr = ast.name;
      } else {
        const { name, parentNum } = ast;
        let data = '',
          specialP = false;

        switch (name) {
          case '@index':
            data = 'index';
            special = true;
            break;
          case '@item':
            data = 'item';
            special = true;
            break;
          case 'this':
            data = 'data';
            special = data => `${data}[${data}.length - 1]`;
            break;
          case '@data':
            data = 'data';
            special = true;
            break;
          case '@g':
            data = 'p1.g';
            special = CUSTOM_VAR;
            break;
          case '@root':
            data = '(p2.root || p2)';
            special = CUSTOM_VAR;
            break;
          case '@context':
            data = 'p2';
            special = CUSTOM_VAR;
            break;
          case '@lt':
            data = '\'<\'';
            special = CUSTOM_VAR;
            break;
          case '@gt':
            data = '\'>\'';
            special = CUSTOM_VAR;
            break;
          case '@lb':
            data = '\'{\'';
            special = CUSTOM_VAR;
            break;
          case '@rb':
            data = '\'}\'';
            special = CUSTOM_VAR;
            break;
          case '@q':
            data = '\'"\'';
            special = CUSTOM_VAR;
            break;
          case '@sq':
            data = '"\'"';
            special = CUSTOM_VAR;
            break;
        }

        if (parentNum) {
          if (!data) {
            data = 'data';
          }

          const isCtx = data == 'p2';
          for (let i = 0; i < parentNum; i++) {
            data = !isCtx ? ('parent.' + data) : (data + '.parent');
          }

          if (!special) {
            specialP = true;
          }
        }

        if (!special && !specialP) {
          dataValueStr = (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\'' + ((isComputed || hasSet) ? ', 0, true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : '');
        } else {
          let dataStr = special === CUSTOM_VAR ? data : 'p2.' + data;
          if (tools.isObject(special)) {
            dataStr = special(dataStr);
          }
          dataValueStr = (special ? dataStr : (isComputed ? 'p1.c(' : '') + 'p2.d(\'' + name + '\', ' + dataStr + ((isComputed || hasSet) ? ', true' : '') + ')' + (isComputed ? ', p2, ' + level + ')' : ''));
        }
      }
      if (dataValueStr) {
        dataValueStr = _replaceBackslash(dataValueStr);
      }

      return dataValueStr;
    }

    //console.log(render(`<i>{{(1+2**3) %% 5+'_123'}}</i>`));

    //const REGEX_OPERATOR = /\+|-|\*|%|==|<=|>=|<|>|&&/;
    const OPERATORS = ['+', '-', '*', '/', '%', '===', '!==', '==', '!=', '<=', '>=', '=', '+=', '<', '>', '&&', '?', ':'];
    const ASSIGN_OPERATORS = ['=', '+='];

    const tmpl = `<div>
      {{ d.e ** a.b.c(1, 2, 3) }}
      <!--#
      {{1 + 2 > 2 && 2 ** (3 + 1) <= 5 && (5 + 6 %% 7) >= 10}}
      {{1 + 2 ** 3 - 4 * 5 %% (6 + 7)}}
      {{'111'.length + 2 * 3}}
      {{' 123 '.trim() + 4 - 5 ** 6}}
      {{' 123 '.trim(1 + 2 %% 5, alt(ctrl(123['length'].toString(123), '5', 6))) + shift() + 4 - 5 ** 6}}
      {{'abcde'.substring(1, num.getLength()).length * 5 | test(100)}}
      {{('111'.length + 2) * 3}}
      {{('111'.length + 2) * 3 | test}}
      {{('111'.length + 2) * 3 | test(100, 200)}}
      {{a.b.c ? d.e.f : (1 + 2 === 3 ? 1 : 2)}}
      {{[1, 2, 3][0] + 100}}
      {{set a = '123' + '456'}}
      {{ { a: 1, b: 2 }.b * 100 }}
      {{ { a: require('../image1.png'), b: { c: { d: (1 + 2) | test } } }[b] * 100 }}
      {{ d.e ** a.b.c(1, 2, 3) }}
      {{ { fn: param => param + 'abc'.substring(param, 10) } }}
      #-->
    </div>`;

    const ast = {
      "prop": {
        "filters": [{
          "params": [{
            "name": "'e'",
            "isBasicType": true
          }],
          "name": "."
        },
        {
          "params": [{
            "filters": [{
              "params": [{
                "name": "'b'",
                "isBasicType": true
              }],
              "name": "."
            },
            {
              "params": [{
                "name": "'c'",
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
                "name": "2",
                "isBasicType": true
              },
              {
                "name": "3",
                "isBasicType": true
              }],
              "name": "_"
            }],
            "name": "a"
          }],
          "name": "**"
        }],
        "name": "d"
      },
      "escape": true
    };

    function _buildExpression(ast, inObj) {
      let codeStr = (ast.filters && OPERATORS.indexOf(ast.filters[0].name) < 0) ? '' : (!inObj ? _buildDataValue(ast) : ast.name);
      let lastCodeStr = '';

      ast.filters && ast.filters.forEach((filter, i) => {
        const hasFilterNext = ast.filters[i + 1] && OPERATORS.indexOf(ast.filters[i + 1].name) < 0;

        if (OPERATORS.indexOf(filter.name) >= 0) {  //Native operator
          if (ASSIGN_OPERATORS.indexOf(filter.name) >= 0) {
            codeStr += `.source.${i == 0 ? ast.name : tools.clearQuot(ast.filters[i - 1].params[0].name)} ${filter.name} `;
          }
          else {
            codeStr += ` ${filter.name} `;
          }

          if (!ast.filters[i + 1] || OPERATORS.indexOf(ast.filters[i + 1].name) >= 0) {
            if (filter.params[0].filters) {
              codeStr += '(';
              codeStr += _buildExpression(filter.params[0]);
              codeStr += ')';
            }
            else {
              codeStr += _buildDataValue(filter.params[0]);
            }
          }
        }
        else if (filter.name === '_') {  //Call function
          let _codeStr = `p1.sc(${lastCodeStr})`;
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
          let startStr, endStr, isObj, configF;
          if (filter.name === 'bracket') {
            startStr = '(';
            endStr = ')';
          }
          else if (filter.name === 'list') {
            startStr = '[';
            endStr = ']';
          }
          else if (filter.name === 'obj') {
            startStr = '{ ';
            endStr = ' }';
            isObj = true;
          }
          else {
            if (filter.name == 'require') {
              startStr = 'require';
            }
            else {
              const filterStr = `p1.f['${filter.name}']`,
                warnStr = `p1.wn('${filter.name}', 'f')`,
                isDev = process.env.NODE_ENV !== 'production';

              configF = filterConfig[filter.name];
              if (configF && configF.onlyGlobal) {
                startStr = isDev ? `(${filterStr} || ${warnStr})` : filterStr;
              }
              else {
                startStr = `(p2.d('${filter.name}') || ${filterStr}${isDev ? ` || ${warnStr}` : ''})`;
              }
            }
            startStr += '(';
            endStr = ')';
          }

          let _codeStr = startStr;
          if (ast.isEmpty && i == 0) {  //Method
            filter.params.forEach((param, j) => {
              _codeStr += _buildExpression(param, isObj);
              if (j < filter.params.length - 1) {
                _codeStr += ', ';
              }
            });
          }
          else {  //Operator
            if (i == 0) {
              _codeStr += _buildDataValue(ast);
            }
            else if (lastCodeStr !== '') {
              _codeStr += lastCodeStr;
            }
            else {
              if (ast.filters[i - 1].params[0].filters) {
                _codeStr += _buildExpression(ast.filters[i - 1].params[0]);
              }
              else {
                _codeStr += _buildDataValue(ast.filters[i - 1].params[0]);
              }
            }

            filter.params && filter.params.forEach((param, j) => {
              _codeStr += ', ';
              if (param.filters) {
                _codeStr += _buildExpression(param);
              }
              else {
                _codeStr += _buildDataValue(param);
              }
            });

            if (!configF || configF.hasOptions) {
              _codeStr += `, ${_buildOptions()}`;
            }
          }
          _codeStr += endStr;

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

    //console.log(_buildExpression(ast.prop));

    const ret = precompile(tmpl, false, nj.tmplRule);

    const gCode = `
      p1.f['**'](p1.f['ctrl']('5', 2), 5)

      p1.f['.'](p1.f['.'](p1.f['.'](a, 'b'), 'c'), 'd')

      1 + p1.f['**'](2, 3) - 4 * p1.f['%%'](5, 6 + 7)

      p1.f['.']('111', 'length') + 2 * 3

      (p1.sc(p1.f['.'](' 123 ', 'trim'))()) + 4 - p1.f['**'](5, 6)

      p1.f['.']({ a: 1, b: 2 }, 'b') * 100

      p1.f['.']([1, 2, 3], 0) + 100

      p1.f['.']((p1.sc(p1.f['.']('abcde', 'substring'))(1, (p1.sc(p1.f['.'](p2.d('num'), 'getLength'))()))), 'length') * 5
      
      { fn: param => param + (p1.sc(p1.f['.']('abc', 'substring'))(param, 10)) }

      p2.d('a', 0, true).source.a = '123' + '456'
    `;

    //console.log(ret.main.toString());
    //console.log(render(`{{ 1 == '1' || 1 == '2' }}`));
    // var _v0 = null;
    // console.log('1' + (_v0 && _v0()) + 3);
  });
});