const nj = require('nornj').default;
const transformExTag = require('./exTag');
const transformDirective = require('./directive');
const transformTaggedTemplate = require('./taggedTemplate');
const astUtil = require('./util/ast');
const utils = require('./util/utils');

module.exports = function(babel) {
  const types = babel.types;
  const exTagHandler = transformExTag(babel);
  const directiveHandler = transformDirective(babel);
  const taggedTemplateHandler = transformTaggedTemplate(babel);
  const TAGGED_TEMPLATES = ['html', 'nj', 'njs', 'n', 't', 's'];

  const visitor = {
    JSXElement: {
      enter(path, state) {
        const nodeName = path.node.openingElement.name.name;
        if (nodeName != null) {
          const hasMobx = nodeName.toLowerCase() === 'mobxobserver';
          hasMobx &&
            !nj.extensionConfig.mobxObserver &&
            utils.setTmplConfig({ extensionConfig: require('nornj-react/mobx/extensionConfig') });

          if (astUtil.isExTag(nodeName)) {
            state.hasNjInJSX = true;
            if (hasMobx) {
              state.hasMobxWithNj = true;
            }

            path.replaceWith(exTagHandler(path.node, path, state));
          }
        }
      },
      exit(path, state) {
        const directives = astUtil.hasDirective(path.node);
        if (directives.length) {
          state.hasNjInJSX = true;

          const hasMobx = directives.reduce(
            (result, directive) =>
              result || directive.indexOf('n-mobxBind') > -1 || directive.indexOf('n-mstBind') > -1,
            false
          );
          hasMobx &&
            !nj.extensionConfig.mobxBind &&
            utils.setTmplConfig({ extensionConfig: require('nornj-react/mobx/extensionConfig') });
          if (hasMobx) {
            state.hasMobxWithNj = true;
          }

          path.replaceWith(directiveHandler(path.node, path, state));
        }
      }
    },
    TaggedTemplateExpression(path, state) {
      const taggedName = path.node.tag.name;
      if (TAGGED_TEMPLATES.indexOf(taggedName) >= 0 && !state.opts.noTaggedTemplates) {
        state.hasNjInJSX = true;

        path.replaceWith(taggedTemplateHandler(path.node, path, state, taggedName));
      }
    },
    ImportDeclaration(path, state) {
      const { value } = path.node.source;
      switch (value) {
        case 'nornj':
          {
            const specifiers = path.node.specifiers;
            if (
              specifiers &&
              specifiers.length &&
              specifiers[0].type === 'ImportDefaultSpecifier' &&
              specifiers[0].local.name === 'nj'
            ) {
              state.hasImportNj = true;
            }
          }
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

        args.length &&
          path.insertAfter(
            types.expressionStatement(
              types.callExpression(types.functionExpression(null, [], types.blockStatement([])), args)
            )
          );
      }
    },
    Program: {
      enter(path, state) {
        state.hasNjInJSX = false;
        state.hasMobxWithNj = false;
        state.hasImportNj = false;
        state.hasImportNjr = false;
        state.hasImportNjrMobx = false;
        utils.setTmplConfig(state.opts, true);
      },
      exit(path, state) {
        if (!state.hasNjInJSX) {
          return;
        }

        if (state.hasMobxWithNj && !state.hasImportNjrMobx) {
          path.node.body.unshift(
            types.importDeclaration([], types.stringLiteral(`nornj-react/mobx${state.opts.rn ? '/native' : ''}`))
          );
        }
        if (!state.hasImportNjr) {
          path.node.body.unshift(
            types.importDeclaration([], types.stringLiteral(`nornj-react${state.opts.rn ? '/native' : ''}`))
          );
        }
        if (!state.hasImportNj) {
          path.node.body.unshift(
            types.importDeclaration(
              [types.importDefaultSpecifier(types.identifier('nj'))],
              types.stringLiteral('nornj')
            )
          );
        }
      }
    }
  };

  return {
    visitor
  };
};
