const nj = require('nornj').default;
const transformExTag = require('./exTag');
const transformExAttr = require('./exAttr');
const transformTaggedTemplate = require('./taggedTemplate');
const astUtil = require('./util/ast');
const utils = require('./util/utils');

module.exports = function (babel) {
  const types = babel.types;
  const exTagHandler = transformExTag(babel);
  const exAttrHandler = transformExAttr(babel);
  const taggedTemplateHandler = transformTaggedTemplate(babel);
  const TAGGED_TEMPLATES = ['nj', 'njs', 'n', 't', 's'];

  const visitor = {
    JSXElement: {
      enter(path, state) {
        const nodeName = path.node.openingElement.name.name;
        if (nodeName != null && astUtil.isExTag(nodeName)) {
          state.hasNjInJSX = true;

          path.replaceWith(exTagHandler(path.node, path, state));
        }
      },
      exit(path, state) {
        const exAttrs = astUtil.hasExAttr(path.node);
        if (exAttrs.length) {
          state.hasNjInJSX = true;

          const hasMobx = exAttrs.reduce((result, exAttr) =>
            result || (exAttr.indexOf('n-mobx') > -1 || exAttr.indexOf('n-mst') > -1), false);
          hasMobx
            && !nj.extensionConfig['mobx']
            && Object.assign(nj.extensionConfig, require('nornj-react/mobx/extensionConfig'));
          if (hasMobx) {
            state.hasMobxWithNj = true;
          }

          path.replaceWith(exAttrHandler(path.node, path, state));
        }
      }
    },
    TaggedTemplateExpression(path, state) {
      const taggedName = path.node.tag.name;
      if (TAGGED_TEMPLATES.indexOf(taggedName) >= 0) {
        state.hasNjInJSX = true;

        path.replaceWith(taggedTemplateHandler(path.node, path, state, taggedName));
      }
    },
    ImportDeclaration(path, state) {
      const { value } = path.node.source;
      switch (value) {
        case 'nornj':
          state.hasImportNj = true;
          break;
        case 'nornj-react':
        case 'nornj-react/native':
          state.hasImportNjr = true;
          break;
        case 'nornj-react/mobx':
        case 'nornj-react/mobx/native':
          state.hasImportNjrMobx = true;
          break;
      }

      if (state.opts.imports && state.opts.imports.indexOf(value) >= 0) {
        const args = [];
        path.node.specifiers.forEach(spec => {
          if (types.isImportSpecifier(spec)) {
            args.push(types.identifier(spec.local.name));
          }
        });

        args.length && path.insertAfter(types.expressionStatement(types.callExpression(
          types.functionExpression(null, [], types.blockStatement([])),
          args
        )));
      }
    },
    Program: {
      enter(path, state) {
        state.hasNjInJSX = false;
        state.hasMobxWithNj = false;
        state.hasImportNj = false;
        state.hasImportNjr = false;
        state.hasImportNjrMobx = false;
        utils.setTmplConfig(state.opts);
      },
      exit(path, state) {
        if (!state.hasNjInJSX) {
          return;
        }

        if (state.hasMobxWithNj && !state.hasImportNjrMobx) {
          path.node.body.unshift(types.importDeclaration(
            [],
            types.stringLiteral(`nornj-react/mobx${state.opts.rn ? '/native' : ''}`)
          ));
        }
        if (!state.hasImportNjr) {
          path.node.body.unshift(types.importDeclaration(
            [],
            types.stringLiteral(`nornj-react${state.opts.rn ? '/native' : ''}`)
          ));
        }
        if (!state.hasImportNj) {
          path.node.body.unshift(types.importDeclaration(
            [
              types.importDefaultSpecifier(types.identifier('nj')),
              types.importSpecifier(types.identifier('n'), types.identifier('expression')),
              types.importSpecifier(types.identifier('t'), types.identifier('template')),
              types.importSpecifier(types.identifier('s'), types.identifier('css'))
            ],
            types.stringLiteral('nornj')
          ));
        }
      }
    }
  };

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor
  };
};
