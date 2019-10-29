import nj from '../core';
import * as tools from '../utils/tools';
import * as tranParam from '../transforms/transformParam';
import * as tranElem from '../transforms/transformElement';
const NO_SPLIT_NEWLINE = ['style', 'script', 'textarea', 'pre', 'xmp', 'template', 'noscript', nj.textTag];

function _plainTextNode(obj, parent, parentContent, noSplitNewline, tmplRule) {
  const node = {};
  node.type = 'nj_plaintext';
  node.content = [
    tranParam.compiledParam(
      obj,
      tmplRule,
      null,
      null,
      parent.ex != null ? tranElem.exCompileConfig(parent.ex).isBindable : null
    )
  ];
  node.allowNewline = noSplitNewline;
  parent[parentContent].push(node);
}

const REGEX_REPLACE_BP = /_njBp(\d+)_/g;

//检测元素节点
export default function checkElem(obj, parent, tmplRule, hasExProps, noSplitNewline, isLast) {
  const parentContent = 'content';

  if (!tools.isArray(obj)) {
    //判断是否为文本节点
    if (tools.isString(obj)) {
      if (!noSplitNewline) {
        const braceParams = [];
        const strs = obj
          .replace(tmplRule.braceParamG, match => {
            braceParams.push(match);
            return '_njBp' + (braceParams.length - 1) + '_';
          })
          .split(/\n/g);

        strs.forEach((str, i) => {
          str = str.trim();
          str !== '' &&
            _plainTextNode(
              str.replace(REGEX_REPLACE_BP, (all, g1) => braceParams[g1]),
              parent,
              parentContent,
              noSplitNewline,
              tmplRule
            );
        });
      } else {
        _plainTextNode(
          isLast && parent.allowNewline === 'nlElem' && !nj.textMode ? tools.trimRight(obj) : obj,
          parent,
          parentContent,
          noSplitNewline,
          tmplRule
        );
      }
    } else {
      _plainTextNode(obj, parent, parentContent, noSplitNewline, tmplRule);
    }

    return;
  }

  const node = {},
    first = obj[0];
  if (tools.isString(first)) {
    //第一个子节点为字符串
    const len = obj.length,
      last = obj[len - 1];
    let isElemNode = false,
      exParams;

    //判断是否为xml标签
    let openTagName,
      hasCloseTag = false,
      isParamsEx,
      isDirective,
      isSubTag,
      needAddToProps;

    const ex = tranElem.isEx(first, tmplRule);
    if (!ex) {
      const xmlOpenTag = tranElem.getXmlOpenTag(first, tmplRule);
      if (xmlOpenTag) {
        //tagname为xml标签时,则认为是元素节点
        openTagName = xmlOpenTag[1];
        if (/\/$/.test(openTagName)) {
          openTagName = openTagName.substr(0, openTagName.length - 1);
        }

        if (!tranElem.isXmlSelfCloseTag(first)) {
          //非自闭合标签才验证是否存在关闭标签
          hasCloseTag = tranElem.isXmlCloseTag(last, openTagName);
        } else {
          //自闭合标签
          node.selfCloseTag = true;
        }
        isElemNode = true;
      }
    } else {
      //为扩展标签,也可视为一个元素节点
      const exName = ex[0];
      exParams = ex[1];
      isParamsEx = tranElem.isParamsEx(exName);
      if (!isParamsEx) {
        const exConfig = tranElem.exCompileConfig(exName);
        isDirective = exConfig.isDirective;
        isSubTag = exConfig.isSubTag;
        needAddToProps = isDirective ? !hasExProps : isSubTag;

        if (exConfig.useString) {
          node.useString = exConfig.useString;
        }
      }

      node.type = 'nj_ex';
      node.ex = exName;
      if (exParams != null && !isParamsEx) {
        if (!node.args) {
          node.args = [];
        }

        tools.each(
          exParams,
          param => {
            const { key, value } = param;
            if (key === 'useString') {
              node.useString = !(value === 'false');
              return;
            } else if (key === '_njIsDirective') {
              node.isDirective = isDirective = true;
              needAddToProps = !hasExProps;
              return;
            }

            const paramV = tranParam.compiledParam(value, tmplRule, param.hasColon, param.onlyKey);
            if (param.onlyBrace) {
              //提取匿名参数
              node.args.push(paramV);
            } else {
              if (!node.params) {
                node.params = tools.obj();
              }
              node.params[key] = paramV;
            }
          },
          true
        );
      }

      isElemNode = true;
    }

    if (isElemNode) {
      //判断是否为元素节点
      let pushContent = true;
      if (noSplitNewline) {
        node.allowNewline = true;
      }

      if (!ex) {
        node.type = openTagName;

        //If open tag has a brace,add the typeRefer param.
        const typeRefer = tranElem.getInsideBraceParam(openTagName, tmplRule);
        if (typeRefer) {
          node.typeRefer = tranParam.compiledParam(typeRefer[0], tmplRule);
        }

        //获取openTag内参数
        const tagParams = tranElem.getOpenTagParams(first, tmplRule);
        if (tagParams) {
          if (!node.params) {
            node.params = tools.obj();
          }

          tools.each(
            tagParams,
            param => {
              //The parameter like "{prop}" needs to be replaced.
              node.params[
                param.onlyBrace ? param.onlyBrace.replace(/\.\.\//g, '') : param.key
              ] = tranParam.compiledParam(param.value, tmplRule, param.hasColon, param.onlyKey);
            },
            true
          );
        }

        //Verify if self closing tag again, because the tag may be similar to "<br></br>".
        if (!node.selfCloseTag) {
          node.selfCloseTag = tranElem.verifySelfCloseTag(openTagName);
        }

        if (noSplitNewline == null && NO_SPLIT_NEWLINE.indexOf(openTagName.toLowerCase()) > -1) {
          noSplitNewline = true;
          node.allowNewline = 'nlElem';
        }
      } else {
        if (isParamsEx || needAddToProps) {
          pushContent = false;
        }

        if (noSplitNewline == null && node.ex === 'pre') {
          noSplitNewline = true;
          node.allowNewline = 'nlElem';
        }
      }

      //放入父节点content内
      if (pushContent) {
        parent[parentContent].push(node);
      }

      //取出子节点集合
      const end = len - (hasCloseTag ? 1 : 0),
        content = obj.slice(1, end);
      if (content && content.length) {
        _checkContentElem(
          content,
          node,
          tmplRule,
          isParamsEx || (hasExProps && !isDirective),
          noSplitNewline,
          tmplRule
        );
      }

      //If this is params block, set on the "paramsEx" property of the parent node.
      if (isParamsEx || needAddToProps) {
        tranElem.addParamsEx(node, parent, isDirective, isSubTag);
      }
    } else {
      //如果不是元素节点,则为节点集合
      _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline);
    }
  } else if (tools.isArray(first)) {
    //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
    _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline);
  }
}

//检测子元素节点
function _checkContentElem(obj, parent, tmplRule, hasExProps, noSplitNewline) {
  if (!parent.content) {
    parent.content = [];
  }

  tools.each(
    obj,
    (item, i, l) => {
      checkElem(item, parent, tmplRule, hasExProps, noSplitNewline, i == l - 1);
    },
    true
  );
}
