const nj = require('nornj').default;
const transformEach = require('./eachTag');
const transformIf = require('./ifTag');
const transformSwitch = require('./switchTag');
const transformWith = require('./withTag');
const transformExTag = require('./exTag');
const transformExAttr = require('./exAttr');
const transformExpression = require('./expression');
const astUtil = require('./util/ast');
const utils = require('./util/utils');

module.exports = function (babel) {
  const types = babel.types;
  const nodeHandlers = {
    'if': transformIf(babel),
    each: transformEach(babel),
    'switch': transformSwitch(babel),
    'with': transformWith(babel)
  };
  const exTagHandler = transformExTag(babel);
  const exAttrHandler = transformExAttr(babel);
  const expressionHandler = transformExpression(babel);

  const visitor = {
    JSXElement: {
      enter(path, state) {
        const nodeName = path.node.openingElement.name.name;
        const handler = nodeHandlers[nodeName];
        if (handler) {
          state.file.hasNjInJSX = true;

          path.replaceWith(handler(path.node, path.hub.file, state));
        }

        // if (nodeName != null && astUtil.isExTag(nodeName)) {
        //   state.file.hasNjInJSX = true;

        //   path.replaceWith(exTagHandler(path.node, path.hub.file, state));
        // }
      },
      exit(path, state) {
        const exAttrs = astUtil.hasExAttr(path.node);
        if (exAttrs.length) {
          state.file.hasNjInJSX = true;

          const hasMobx = exAttrs.reduce((result, exAttr) =>
            result || (exAttr.indexOf('n-mobx') > -1 || exAttr.indexOf('n-mst') > -1), false);
          hasMobx
            && !nj.extensionConfig['mobx']
            && Object.assign(nj.extensionConfig, require('nornj-react/mobx/extensionConfig'));
          if (hasMobx) {
            state.file.hasMobx = true;
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
      switch (path.node.source.value) {
        case 'nornj':
          state.file.hasImportNj = true;
          break;
        case 'nornj-react':
          state.file.hasImportNjr = true;
          break;
        case 'nornj-react/mobx':
          state.file.hasImportNjrMobx = true;
          break;
      }
    },
    Program: {
      enter(path, state) {
        state.file.hasNjInJSX = false;
        state.file.hasMobx = false;
        state.file.hasImportNj = false;
        state.file.hasImportNjr = false;
        state.file.hasImportNjrMobx = false;
        utils.setTmplConfig(state.opts);
      },
      exit(path, state) {
        if (!state.file.hasNjInJSX) {
          return;
        }

        if (state.file.hasMobx && !state.file.hasImportNjrMobx) {
          path.node.body.unshift(types.importDeclaration(
            [],
            types.stringLiteral('nornj-react/mobx')
          ));
        }
        if (!state.file.hasImportNjr) {
          path.node.body.unshift(types.importDeclaration(
            [],
            types.stringLiteral('nornj-react')
          ));
        }
        if (!state.file.hasImportNj) {
          path.node.body.unshift(types.importDeclaration(
            [
              types.importDefaultSpecifier(types.identifier('nj')),
              types.importSpecifier(types.identifier('n'), types.identifier('expression'))
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
