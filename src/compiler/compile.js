import nj from '../core';
import * as tools from '../utils/tools';
import checkElem from '../parser/checkElem';
import * as tranData from '../transforms/transformData';
import buildRuntime from './buildRuntime';
import compileStringTmpl from '../parser/checkStringElem';

//编译模板并返回转换函数
function _createCompile(outputH) {
  return (tmpl, tmplKey, fileName) => {
    if (!tmpl) {
      return;
    }
    if (tools.isObject(tmplKey)) {
      const options = tmplKey;
      tmplKey = options.tmplKey;
      fileName = options.fileName;
    }

    //编译模板函数
    let tmplFns;
    if (tmplKey) {
      tmplFns = nj.templates[tmplKey];
    }
    if (!tmplFns) {
      let isObj = tools.isObject(tmpl),
        fns;
      if (isObj && tmpl.main) { //直接传入预编译模板
        fns = tmpl;
      } else { //编译AST
        let root;
        if (tmplKey) {
          root = nj.asts[tmplKey];
        }
        if (!root) {
          //Can be directly introduced into the AST
          if (isObj && tmpl.type === 'nj_root') {
            root = tmpl;
          } else {
            root = _createAstRoot();

            //Auto transform string template to array
            if (tools.isString(tmpl)) {
              //Merge all include blocks
              const includeParser = nj.includeParser;
              if (includeParser) {
                tmpl = includeParser(tmpl, fileName);
              }

              tmpl = compileStringTmpl(tmpl);
            }

            //分析传入参数并转换为节点树对象
            checkElem(tmpl._njTmpl, root);
          }

          //保存模板AST编译结果到全局集合中
          if (tmplKey) {
            nj.asts[tmplKey] = root;
          }
        }

        fns = buildRuntime(root.content, !outputH);
      }

      tmplFns = tranData.template(fns);

      //保存模板函数编译结果到全局集合中
      if (tmplKey) {
        nj.templates[tmplKey] = tmplFns;
      }
    }

    if (tmpl._njParams) {
      const tmplFn = function() {
        return tmplFns.main.apply(this, tools.arrayPush([tmpl._njParams], arguments));
      };
      tmplFn._njTmpl = true;
      return tmplFn;
    } else {
      return tmplFns.main;
    }
  };
}

export const compile = _createCompile();
export const compileH = _createCompile(true);

//Create template root object
function _createAstRoot() {
  const root = tools.obj();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//Precompile template
export function precompile(tmpl, outputH) {
  const root = _createAstRoot();

  if (tools.isString(tmpl)) {
    tmpl = compileStringTmpl(tmpl);
  }
  checkElem(tmpl._njTmpl, root);

  return buildRuntime(root.content, !outputH);
}

function _createRender(outputH) {
  return function(tmpl, options) {
    return (outputH ? compileH : compile)(tmpl, options ? {
      tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
      fileName: options.fileName
    } : tmpl._njTmplKey).apply(null, tools.arraySlice(arguments, 1));
  };
}

export const render = _createRender();
export const renderH = _createRender(true);

tools.assign(nj, {
  compile,
  compileH,
  precompile,
  render,
  renderH
});