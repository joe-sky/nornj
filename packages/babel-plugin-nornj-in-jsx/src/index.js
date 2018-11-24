const nj = require('nornj').default;
// const transformEach = require('./eachTag');
// const transformIf = require('./ifTag');
// const transformSwitch = require('./switchTag');
// const transformWith = require('./withTag');
const transformExTag = require('./exTag');
const transformExAttr = require('./exAttr');
const transformExpression = require('./expression');
const astUtil = require('./util/ast');
const utils = require('./util/utils');

module.exports = function (babel) {
  const types = babel.types;
  // const nodeHandlers = {
  //   'if': transformIf(babel),
  //   each: transformEach(babel),
  //   'switch': transformSwitch(babel),
  //   'with': transformWith(babel)
  // };
  const exTagHandler = transformExTag(babel);
  const exAttrHandler = transformExAttr(babel);
  const expressionHandler = transformExpression(babel);

  const visitor = {
    JSXElement: {
      enter(path, state) {
        const nodeName = path.node.openingElement.name.name;
        // const handler = nodeHandlers[nodeName];
        // if (handler) {
        //   state.hasNjInJSX = true;

        //   path.replaceWith(handler(path.node, path.hub.file, state));
        // }

        if (nodeName != null && astUtil.isExTag(nodeName)) {
          state.hasNjInJSX = true;

          path.replaceWith(exTagHandler(path.node, path.hub.file, state));
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

          path.replaceWith(exAttrHandler(path.node, path.hub.file, state));
        }
      }
    },
    TaggedTemplateExpression(path, state) {
      if (path.node.tag.name === 'n') {
        path.replaceWith(expressionHandler(path.node, path.hub.file, state));
      }
    },
    ImportDeclaration(path, state) {
      const { value } = path.node.source;
      switch (value) {
        case 'nornj':
          state.hasImportNj = true;
          break;
        case 'nornj-react':
          state.hasImportNjr = true;
          break;
        case 'nornj-react/mobx':
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
            types.stringLiteral('nornj-react/mobx')
          ));
        }
        if (!state.hasImportNjr) {
          path.node.body.unshift(types.importDeclaration(
            [],
            types.stringLiteral('nornj-react')
          ));
        }
        if (!state.hasImportNj) {
          path.node.body.unshift(types.importDeclaration(
            [
              types.importDefaultSpecifier(types.identifier('nj')),
              types.importSpecifier(types.identifier('n'), types.identifier('expression')),
              types.importSpecifier(types.identifier('t'), types.identifier('template'))
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
