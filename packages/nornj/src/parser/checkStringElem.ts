import nj from '../core';
import * as tools from '../utils/tools';
import * as tranElem from '../transforms/transformElement';
const { preAsts } = nj;
const SPLIT_FLAG = '_njParam';
const TEXT_CONTENT = ['style', 'script', 'textarea', 'xmp', nj.textTag];
const { OMITTED_CLOSE_TAGS } = tranElem;

//Compile string template
export function compileStringTmpl(tmpl) {
  const tmplKey = tmpl.toString(); //Get unique key
  let ret = preAsts[tmplKey];
  const { outputH, tmplRule, onlyParse, fileName, isExpression, isCss } = this;

  if (!ret) {
    //If the cache already has template data, direct return the template.
    const isStr = tools.isString(tmpl),
      xmls = isStr ? [tmpl] : tmpl,
      l = xmls.length;
    let fullXml = '',
      isInBrace: boolean | string = false;

    //Connection xml string
    tools.each(
      xmls,
      (xml, i) => {
        let split = '';

        if (i == 0) {
          if (isExpression) {
            xml = (outputH ? tmplRule.firstChar : '') + tmplRule.startRule + ' ' + xml;
          } else if (isCss) {
            xml = '<' + tmplRule.extensionRule + 'css style="' + xml;
          }
        }
        if (i < l - 1) {
          const last = xml.length - 1,
            lastChar = xml[last],
            lastChar3 = xml.substr(last - 2),
            isAccessor = lastChar === '#',
            isSpread = lastChar3 === '...';

          if (isInBrace) {
            isInBrace = !tmplRule['incompleteEnd' + (isInBrace === 'isR' ? 'R' : '')].test(xml);
          }
          if (!isInBrace) {
            if (tmplRule.incompleteStartR.test(xml)) {
              isInBrace = 'isR';
            } else {
              isInBrace = tmplRule.incompleteStart.test(xml);
            }
          }
          if (isAccessor) {
            xml = xml.substr(0, last);
          } else if (isSpread) {
            xml = xml.substr(0, last - 2);
          }

          split = (isAccessor ? '#' : isSpread ? '...' : '') + SPLIT_FLAG + i;
          if (!isInBrace) {
            split = tmplRule.startRule + split + tmplRule.endRule;
          }
        }
        if (i == l - 1) {
          if (isExpression) {
            xml += ' ' + tmplRule.endRule + (outputH ? tmplRule.lastChar : '');
          } else if (isCss) {
            xml += '" />';
          }
        }

        fullXml += xml + split;
      },
      true
    );

    //Merge all include tags
    const includeParser = nj.includeParser;
    if (includeParser) {
      fullXml = includeParser(fullXml, fileName, tmplRule);
    }

    fullXml = _formatAll(fullXml, tmplRule);
    if (!outputH) {
      if (nj.textMode) {
        fullXml = '<' + nj.textTag + '>' + fullXml + '</' + nj.textTag + '>';
      }
      if (nj.noWsMode) {
        fullXml = '<' + nj.noWsTag + '>' + fullXml + '</' + nj.noWsTag + '>';
      }
    }

    //Resolve string to element
    ret = _checkStringElem(fullXml, tmplRule, outputH);
    tools.defineProp(ret, '_njParamCount', {
      value: l - 1
    });

    //Save to the cache
    preAsts[tmplKey] = ret;
  }

  let tmplFn;
  if (!onlyParse) {
    let params;
    const args = arguments,
      paramCount = ret._njParamCount;
    if (paramCount > 0) {
      params = {};
      tools.defineProp(params, '_njParam', {
        value: true
      });

      for (let i = 0; i < paramCount; i++) {
        params[SPLIT_FLAG + i] = args[i + 1];
      }
    }

    tmplFn = params
      ? function() {
        return tmplMainFn.apply(this, tools.arrayPush([params], arguments));
      }
      : function() {
        return tmplMainFn.apply(this, arguments);
      };
    tools.defineProps(tmplFn, {
      _njTmpl: {
        value: ret
      },
      _njTmplKey: {
        value: tmplKey
      }
    });

    const tmplMainFn = nj['compile' + (outputH ? 'H' : '')](tmplFn, tmplKey, null, null, tmplRule);
  } else {
    tmplFn = {
      _njTmpl: ret,
      _njTmplKey: tmplKey
    };
  }

  return tmplFn;
}

function _createCurrent(elemName, parent) {
  const current = {
    elem: [],
    elemName,
    parent
  };

  parent.elem.push(current.elem);
  return current;
}

function _setTextAfter(textAfter, current) {
  textAfter && textAfter !== '' && _setText(textAfter, current.elem);
}

//Resolve string to element
function _checkStringElem(xml, tmplRule, outputH) {
  const root = [],
    pattern = tmplRule.checkElem;
  let current = {
      elem: root,
      elemName: 'root',
      parent: null
    },
    parent = null,
    matchArr,
    inTextContent,
    omittedCloseElem = null;

  while ((matchArr = pattern.exec(xml))) {
    const textBefore = matchArr[1],
      elem = matchArr[2],
      elemName = matchArr[3],
      elemParams = matchArr[4];
    let textAfter = matchArr[5];

    //处理上一次循环中的可省略闭合标签
    if (omittedCloseElem) {
      const [_elem, _elemName, _elemParams, _textAfter] = omittedCloseElem;
      const isEx = elem ? tranElem.isExAll(elemName, tmplRule) : false;

      if (
        isEx &&
        !isEx[1] &&
        (tranElem.isPropS(elemName, tmplRule) ||
          tranElem.isStrPropS(elemName, tmplRule) ||
          tranElem.isParamsEx(isEx[3]) ||
          tranElem.exCompileConfig(isEx[3]).isDirective)
      ) {
        parent = current;
        current = _createCurrent(_elemName, parent);
        _setElem(_elem, _elemName, _elemParams, current.elem, null, tmplRule, outputH);
      } else {
        _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule, outputH);
      }

      _setTextAfter(_textAfter, current);
      omittedCloseElem = null;
    }

    //Text before tag
    if (textBefore && textBefore !== '') {
      _setText(textBefore, current.elem);
    }

    //Element tag
    if (elem) {
      if (elem !== '<') {
        if (elem.indexOf('<!') === 0) {
          //一些特殊标签当做文本处理
          _setText(elem, current.elem);
        } else {
          const isEx = tranElem.isExAll(elemName, tmplRule);
          if (elemName[0] === '/') {
            //Close tag
            if (elemName.substr(1).toLowerCase() === inTextContent) {
              //取消纯文本子节点标记
              inTextContent = null;
            }

            if (isEx || !inTextContent) {
              const cName = current.elemName;
              if (
                cName.indexOf(SPLIT_FLAG) < 0
                  ? elemName === '/' + cName
                  : elemName.indexOf(SPLIT_FLAG) > -1 || elemName === '//'
              ) {
                //如果开始标签包含SPLIT_FLAG，则只要结束标签包含SPLIT_FLAG就认为该标签已关闭
                current = current.parent;
              }
            } else {
              _setText(elem, current.elem);
            }
          } else if (elem[elem.length - 2] === '/') {
            //Self close tag
            if (isEx || !inTextContent) {
              _setSelfCloseElem(elem, elemName, elemParams, current.elem, tmplRule, outputH);
            } else {
              _setText(elem, current.elem);
            }
          } else {
            //Open tag
            if (isEx || !inTextContent) {
              if (!inTextContent && OMITTED_CLOSE_TAGS[elemName.toLowerCase()]) {
                //img等可不闭合标签
                omittedCloseElem = [elem, elemName, elemParams, textAfter];
              } else {
                const elemNameL = elemName.toLowerCase();
                if (TEXT_CONTENT.indexOf(elemNameL) > -1) {
                  //标记该标签为纯文本子节点
                  inTextContent = elemNameL;
                }

                parent = current;
                current = _createCurrent(elemName, parent);
                _setElem(elem, elemName, elemParams, current.elem, null, tmplRule, outputH);
              }
            } else {
              _setText(elem, current.elem);
            }
          }
        }
      } else {
        //单独的"<"和后面的文本拼合在一起
        if (textAfter == null) {
          textAfter = '';
        }
        textAfter = elem + textAfter;
      }
    }

    //Text after tag
    !omittedCloseElem && _setTextAfter(textAfter, current);
  }

  //处理最后一次循环中遗留的可省略闭合标签
  if (omittedCloseElem) {
    const [_elem, _elemName, _elemParams, _textAfter] = omittedCloseElem;

    _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule, outputH);
    _setTextAfter(_textAfter, current);
  }

  return root;
}

const LT_GT_LOOKUP = {
  '<': '_njLt_',
  '>': '_njGt_'
};
const REGEX_LT_GT = />|</g;

function _formatAll(str, tmplRule) {
  const commentRule = tmplRule.commentRule;
  return str
    .replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '')
    .replace(
      new RegExp('([\\s]+:[^\\s=>]+=((\'[^\']+\')|("[^"]+")))|(' + tmplRule.braceParamStr + ')', 'g'),
      (all, g1, g2, g3, g4, g5) => (g1 ? g1 : g5).replace(REGEX_LT_GT, match => LT_GT_LOOKUP[match])
    );
}

function _transformToEx(isStr, elemName, elemParams, tmplRule) {
  return (
    tmplRule.extensionRule +
    (isStr ? 'strProp' : 'prop') +
    ' ' +
    tmplRule.startRule +
    `'` +
    elemName.substr((isStr ? tmplRule.strPropRule.length : 0) + tmplRule.propRule.length) +
    `'` +
    tmplRule.endRule +
    elemParams
  );
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose, tmplRule, outputH) {
  let ret, paramsEx;
  const fixedExTagName = tranElem.fixExTagName(elemName, tmplRule);
  if (fixedExTagName) {
    elemName = fixedExTagName;
  }
  if (tranElem.isEx(elemName, tmplRule, true)) {
    ret = elem.substring(1, elem.length - 1);
    if (fixedExTagName) {
      ret = tmplRule.extensionRule + tools.lowerFirst(ret);
    }

    const retS = _getSplitParams(ret, tmplRule, outputH);
    ret = retS.elem;
    paramsEx = retS.params;
  } else if (tranElem.isStrPropS(elemName, tmplRule)) {
    ret = _transformToEx(true, elemName, elemParams, tmplRule);
  } else if (tranElem.isPropS(elemName, tmplRule)) {
    ret = _transformToEx(false, elemName, elemParams, tmplRule);
  } else {
    const retS = _getSplitParams(elem, tmplRule, outputH);
    ret = retS.elem;
    paramsEx = retS.params;
  }

  if (bySelfClose) {
    const retC = [ret];
    if (paramsEx) {
      retC.push(paramsEx);
    }

    elemArr.push(retC);
  } else {
    elemArr.push(ret);
    if (paramsEx) {
      elemArr.push(paramsEx);
    }
  }
}

const REGEX_EX_ATTR = /([^\s-$.]+)(([$.][^\s-$.]+)*)((-[^\s-$.]+([$.][^\s-$.]+)*)*)/;

//Extract split parameters
function _getSplitParams(elem, tmplRule, outputH) {
  const { extensionRule, startRule, endRule, firstChar, lastChar, spreadProp, directives } = tmplRule;
  let paramsEx;

  //Replace the parameter like "{...props}".
  elem = elem.replace(spreadProp, (all, g1, propR, g3, prop) => {
    if (propR) {
      prop = propR;
    }

    if (!paramsEx) {
      paramsEx = [extensionRule + 'props'];
    }

    paramsEx.push([
      extensionRule +
        'spread ' +
        (propR ? firstChar : '') +
        startRule +
        prop.replace(/\.\.\./, '') +
        endRule +
        (propR ? lastChar : '') +
        '/'
    ]);
    return ' ';
  });

  //Replace the parameter like "#show={false}".
  elem = elem.replace(directives, (all, g1, g2, g3, g4, g5, g6, key, hasColon, hasEx, name, hasEqual, value) => {
    if (hasEx == null) {
      return all;
    }

    if (!paramsEx) {
      paramsEx = [extensionRule + 'props'];
    }

    let args, modifiers;
    name = name.replace(REGEX_EX_ATTR, (all, name, modifier, g3, arg) => {
      if (arg) {
        args = arg
          .substr(1)
          .split('-')
          .map(item => {
            let argStr;
            let modifierStr = '';
            const strs = item.split(/[$.]/);
            strs.forEach((str, i) => {
              if (i == 0) {
                argStr = `name:'${str}'` + (i < strs.length - 1 ? ',' : '');
              } else {
                modifierStr += `'${str}'` + (i < strs.length - 1 ? ',' : '');
              }
            });

            return '{' + argStr + (modifierStr != '' ? 'modifiers:[' + modifierStr + ']' : '') + '}';
          });
      }
      if (modifier) {
        modifiers = modifier
          .substr(1)
          .split(/[$.]/)
          .map(item => `'${item}'`);
      }
      return name;
    });

    const exPreAst = [
      extensionRule +
        name +
        ' _njIsDirective' +
        (args ? ' arguments="' + firstChar + startRule + '[' + args.join(',') + ']' + endRule + lastChar + '"' : '') +
        (modifiers ? ' modifiers="' + startRule + '[' + modifiers.join(',') + ']' + endRule + '"' : '') +
        (hasEqual ? '' : ' /')
    ];
    hasEqual &&
      exPreAst.push(
        (hasColon ? (outputH ? firstChar : '') + startRule + ' ' : '') +
          tools.clearQuot(value) +
          (hasColon ? ' ' + endRule + (outputH ? lastChar : '') : '')
      );
    paramsEx.push(exPreAst);
    return ' ';
  });

  return {
    elem,
    params: paramsEx
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr, tmplRule, outputH) {
  if (/\/$/.test(elemName)) {
    elemName = elemName.substr(0, elemName.length - 1);
  }
  _setElem(elem, elemName, elemParams, elemArr, true, tmplRule, outputH);
}

//Set text node
function _setText(text, elemArr) {
  elemArr.push(text);
}
