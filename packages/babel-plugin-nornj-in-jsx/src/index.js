const nj = require('nornj/dist/nornj.common').default;
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

          const hasMobxFormData =
            nodeName.toLowerCase() === 'mobxformdata' || nodeName.toLowerCase() === 'mobxfielddata';
          hasMobxFormData &&
            !nj.extensionConfig.mobxFormData &&
            utils.setTmplConfig({ extensionConfig: require('nornj-react/mobx/formData/extensionConfig') });

          if (astUtil.isExTag(nodeName)) {
            state.hasNjInJSX = true;
            if (hasMobx) {
              state.hasMobxWithNj = true;
            }
            if (hasMobxFormData) {
              state.hasMobxFormDataWithNj = true;
            }

            path.replaceWith(exTagHandler(path.node, path, state));
          }
        }

        const directives = astUtil.hasDirective(path.node);
        if (directives && directives.length) {
          const mobxField = directives.find(
            directive => directive.startsWith('n-mobxField') || directive.startsWith('mobxField')
          );
          if (mobxField && !state.mobxFieldNodes.has(path.node)) {
            if (!mobxField.includes('-noBind') && !astUtil.hasMobxBind(path)) {
              const children = astUtil.getChildren(types, path.node);
              const directiveParam = mobxField.split(
                mobxField.includes('n-mobxField') ? 'n-mobxField' : 'mobxField'
              )[1];

              children[0].openingElement.attributes.push(
                types.jsxAttribute(
                  types.jsxIdentifier(`n-mobxBind${directiveParam}`),
                  path.node.openingElement.attributes.find(
                    node =>
                      node.name && (node.name.name.startsWith('n-mobxField') || node.name.name.startsWith('mobxField'))
                  ).value
                )
              );
            }

            state.mobxFieldNodes.add(path.node);

            path.replaceWith(
              types.jsxElement(types.jsxOpeningElement(types.jsxIdentifier('MobxObserver'), []), null, [path.node])
            );
          }
        }
      },
      exit(path, state) {
        const directives = astUtil.hasDirective(path.node);
        if (directives && directives.length) {
          state.hasNjInJSX = true;

          const hasMobx = directives.reduce(
            (result, directive) =>
              result ||
              directive.startsWith('n-mobxBind') ||
              directive.startsWith('mobxBind') ||
              directive.startsWith('n-mstBind') ||
              directive.startsWith('mstBind'),
            false
          );
          hasMobx &&
            !nj.extensionConfig.mobxBind &&
            utils.setTmplConfig({ extensionConfig: require('nornj-react/mobx/extensionConfig') });
          if (hasMobx) {
            state.hasMobxWithNj = true;
          }

          const hasMobxFormData = directives.reduce(
            (result, directive) => result || directive.startsWith('n-mobxField') || directive.startsWith('mobxField'),
            false
          );
          hasMobxFormData &&
            !nj.extensionConfig.mobxField &&
            utils.setTmplConfig({ extensionConfig: require('nornj-react/mobx/formData/extensionConfig') });
          if (hasMobxFormData) {
            state.hasMobxFormDataWithNj = true;
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
        case 'nornj-react/mobx/formData':
          state.hasImportNjrMobxFormData = true;
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
        state.hasMobxFormDataWithNj = false;
        state.hasImportNj = false;
        state.hasImportNjr = false;
        state.hasImportNjrMobx = false;
        state.hasImportNjrMobxFormData = false;
        state.mobxFieldNodes = new Set();
        utils.setTmplConfig(state.opts);
      },
      exit(path, state) {
        if (!state.hasNjInJSX) {
          return;
        }

        if (state.hasMobxWithNj && !state.hasImportNjrMobx) {
          path.node.body.unshift(
            types.importDeclaration([], types.stringLiteral('nornj-react/mobx' + (state.opts.esm ? '/esm' : '')))
          );
        }
        if (state.hasMobxFormDataWithNj && !state.hasImportNjrMobxFormData) {
          path.node.body.unshift(
            types.importDeclaration(
              [],
              types.stringLiteral('nornj-react/mobx/formData' + (state.opts.esm ? '/esm' : ''))
            )
          );
        }
        if (!state.hasImportNjr) {
          path.node.body.unshift(
            types.importDeclaration(
              [],
              types.stringLiteral(`nornj-react${state.opts.rn ? '/native' + (state.opts.esm ? '/esm' : '') : ''}`)
            )
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
