import nj from '../core';
import * as tools from '../utils/tools';
import * as tranElem from '../transforms/transformElement';
const { preAsts } = nj;
const SPLIT_FLAG = '_nj_split';
const TEXT_CONTENT = [
  'style',
  'script',
  'textarea',
  'xmp'
];
const { OMITTED_CLOSE_TAGS } = tranElem;

//Compile string template
export default function compileStringTmpl(tmpl) {
  let tmplKey = tmpl.toString(), //Get unique key
    ret = preAsts[tmplKey];
  const { outputH, tmplRule } = this;

  if (!ret) { //If the cache already has template data, direct return the template.
    let isStr = tools.isString(tmpl),
      xmls = isStr ? [tmpl] : tmpl,
      l = xmls.length,
      fullXml = '',
      isInBrace = false;

    //Connection xml string
    tools.each(xmls, (xml, i) => {
      let split = '';
      if (i < l - 1) {
        const last = xml.length - 1,
          lastChar = xml[last],
          lastChar3 = xml.substr(last - 2),
          isComputed = lastChar === '#',
          isSpread = lastChar3 === '...';

        if (isInBrace) {
          isInBrace = !tmplRule.incompleteEnd.test(xml);
        }
        if (!isInBrace && tmplRule.incompleteStart.test(xml)) {
          isInBrace = true;
        }
        if (isComputed) {
          xml = xml.substr(0, last);
        } else if (isSpread) {
          xml = xml.substr(0, last - 2);
        }

        split = (isComputed ? '#' : (isSpread ? '...' : '')) + SPLIT_FLAG + i;
        if (!isInBrace) {
          split = tmplRule.startRule + split + tmplRule.endRule;
        }
      }

      fullXml += xml + split;
    }, false, true);

    fullXml = _formatAll(fullXml, tmplRule);

    //Resolve string to element
    ret = _checkStringElem(fullXml, tmplRule);
    tools.defineProp(ret, '_njParamCount', {
      value: l - 1
    });

    //Save to the cache
    preAsts[tmplKey] = ret;
  }

  let params,
    args = arguments,
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

  const tmplFn = function() {
    return nj['compile' + (outputH ? 'H' : '')](tmplFn, tmplKey, null, null, tmplRule).apply(this, arguments);
  };
  tools.defineProps(tmplFn, {
    _njTmpl: {
      value: ret
    },
    _njTmplKey: {
      value: tmplKey
    },
    _njParams: {
      value: params
    }
  });

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
function _checkStringElem(xml, tmplRule) {
  let root = [],
    current = {
      elem: root,
      elemName: 'root',
      parent: null
    },
    parent = null,
    pattern = tmplRule.checkElem,
    matchArr,
    inTextContent = false,
    omittedCloseElem = null;

  while (matchArr = pattern.exec(xml)) {
    let textBefore = matchArr[1],
      elem = matchArr[2],
      elemName = matchArr[3],
      elemParams = matchArr[4],
      textAfter = matchArr[5];

    //处理上一次循环中的可省略闭合标签
    if (omittedCloseElem) {
      const [_elem, _elemName, _elemParams, _textAfter] = omittedCloseElem;
      let isEx = elem ? tranElem.isExAll(elemName, tmplRule) : false;

      if (isEx && !isEx[1] && (tranElem.isPropS(elemName, tmplRule) ||
          tranElem.isStrPropS(elemName, tmplRule) ||
          tranElem.isParamsEx(isEx[3]) ||
          tranElem.exCompileConfig(isEx[3]).isProp)) {
        parent = current;
        current = _createCurrent(_elemName, parent);
        _setElem(_elem, _elemName, _elemParams, current.elem, null, tmplRule);
      } else {
        _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule);
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
        if (elem.indexOf('<!') === 0) { //一些特殊标签当做文本处理
          _setText(elem, current.elem);
        } else {
          const isEx = tranElem.isExAll(elemName, tmplRule);
          if (elemName[0] === '/') { //Close tag
            if (TEXT_CONTENT.indexOf(elemName.substr(1).toLowerCase()) > -1) { //取消纯文本子节点标记
              inTextContent = false;
            }

            if (isEx || !inTextContent) {
              if (elemName === '/' + current.elemName) {
                current = current.parent;
              }
            } else {
              _setText(elem, current.elem);
            }
          } else if (elem[elem.length - 2] === '/') { //Self close tag
            if (isEx || !inTextContent) {
              _setSelfCloseElem(elem, elemName, elemParams, current.elem, tmplRule);
            } else {
              _setText(elem, current.elem);
            }
          } else { //Open tag
            if (isEx || !inTextContent) {
              if (!inTextContent && OMITTED_CLOSE_TAGS[elemName.toLowerCase()]) { //img等可不闭合标签
                omittedCloseElem = [elem, elemName, elemParams, textAfter];
              } else {
                if (TEXT_CONTENT.indexOf(elemName.toLowerCase()) > -1) { //标记该标签为纯文本子节点
                  inTextContent = true;
                }

                parent = current;
                current = _createCurrent(elemName, parent);
                _setElem(elem, elemName, elemParams, current.elem, null, tmplRule);
              }
            } else {
              _setText(elem, current.elem);
            }
          }
        }
      } else { //单独的"<"和后面的文本拼合在一起
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

    _setSelfCloseElem(_elem, _elemName, _elemParams, current.elem, tmplRule);
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
  return str.replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '')
    .replace(new RegExp(tmplRule.startRule + '[^' + tmplRule.endRule + ']*' + tmplRule.endRule, 'g'), all => all.replace(REGEX_LT_GT, match => LT_GT_LOOKUP[match]));
}

function _transformToEx(isStr, elemName, elemParams, tmplRule) {
  return tmplRule.extensionRule + (isStr ? 'strProp' : 'prop') + ' ' + tmplRule.startRule + '\'' + elemName.substr((isStr ? tmplRule.strPropRule.length : 0) + tmplRule.propRule.length) + '\'' + tmplRule.endRule + elemParams;
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose, tmplRule) {
  let ret, paramsEx;
  if (elemName[0] === tmplRule.extensionRule) {
    ret = elem.substring(1, elem.length - 1);
  } else if (tranElem.isStrPropS(elemName, tmplRule)) {
    ret = _transformToEx(true, elemName, elemParams, tmplRule);
  } else if (tranElem.isPropS(elemName, tmplRule)) {
    ret = _transformToEx(false, elemName, elemParams, tmplRule);
  } else {
    const retS = _getSplitParams(elem, tmplRule);
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

//Extract split parameters
function _getSplitParams(elem, tmplRule) {
  const { extensionRule, startRule, endRule } = tmplRule;
  let paramsEx;

  //Replace the parameter like "{...props}".
  elem = elem.replace(tmplRule.spreadProp, (all, begin, prop) => {
    prop = prop.trim();

    if (!paramsEx) {
      paramsEx = [extensionRule + 'props'];
    }

    paramsEx.push([extensionRule + 'spread ' + startRule + prop.replace(/\.\.\./g, '') + endRule + '/']);
    return ' ';
  });

  return {
    elem,
    params: paramsEx
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr, tmplRule) {
  if (/\/$/.test(elemName)) {
    elemName = elemName.substr(0, elemName.length - 1);
  }
  _setElem(elem, elemName, elemParams, elemArr, true, tmplRule);
}

//Set text node
function _setText(text, elemArr) {
  elemArr.push(text);
}