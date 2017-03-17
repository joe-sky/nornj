import nj from '../core';
import * as tools from '../utils/tools';
import * as tranElem from '../transforms/transformElement';
const { preAsts } = nj;
const SPLIT_FLAG = '_nj_split';

//Compile string template
export default function compileStringTmpl(tmpl) {
  let tmplKey = tmpl.toString(), //Get unique key
    ret = preAsts[tmplKey];
  const { outputH, tmplRule } = this;

  if (!ret) { //If the cache already has template data, direct return the template.
    let isStr = tools.isString(tmpl),
      xmls = isStr ? [tmpl] : tmpl,
      l = xmls.length,
      fullXml = '';

    //Connection xml string
    tools.each(xmls, (xml, i) => {
      let split = '';
      if (i < l - 1) {
        const last = xml.length - 1,
          lastChar = xml[last],
          lastChar3 = xml.substr(last - 2),
          isComputed = lastChar === '#',
          isSpread = lastChar3 === '...';

        if (isComputed) {
          xml = xml.substr(0, last);
        } else if (isSpread) {
          xml = xml.substr(0, last - 2);
        }

        split = tmplRule.startRule +
          (isComputed ? '#' : (isSpread ? '...' : '')) + SPLIT_FLAG + i +
          tmplRule.endRule;
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

    for (let i = 0; i < paramCount; i++) {
      params[SPLIT_FLAG + i] = args[i + 1];
    }
  }

  const tmplFn = function() {
    return nj['compile' + (outputH ? 'H' : '')](tmplFn, { tmplKey, tmplRule }).apply(this, params ? tools.arrayPush([params], arguments) : arguments);
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
    matchArr;

  while (matchArr = pattern.exec(xml)) {
    let textBefore = matchArr[1],
      elem = matchArr[2],
      elemName = matchArr[3],
      elemParams = matchArr[4],
      textAfter = matchArr[5];

    //Text before tag
    if (textBefore && textBefore !== '\n') {
      _setText(textBefore, current.elem);
    }

    //Element tag
    if (elem) {
      if (elem.indexOf('<!') === 0) { //doctype等标签当做文本处理
        _setText(elem, current.elem);
      } else {
        if (elemName[0] === '/') { //Close tag
          if (elemName === '/' + current.elemName) {
            current = current.parent;
          }
        } else if (elem[elem.length - 2] === '/') { //Self close tag
          _setSelfCloseElem(elem, elemName, elemParams, current.elem, tmplRule);
        } else { //Open tag
          parent = current;
          current = {
            elem: [],
            elemName: elemName,
            parent: parent
          };

          parent.elem.push(current.elem);
          _setElem(elem, elemName, elemParams, current.elem, null, tmplRule);
        }
      }
    }

    //Text after tag
    if (textAfter && textAfter !== '\n') {
      _setText(textAfter, current.elem);
    }
  }

  return root;
}

const SP_FILTER_LOOKUP = {
  '>(': 'gt(',
  '<(': 'lt(',
  '>=(': 'gte(',
  '<=(': 'lte('
};
const REGEX_SP_FILTER = /(\|)?[\s]+((>|<|>=|<=)\()/g;

function _formatAll(str, tmplRule) {
  const commentRule = tmplRule.commentRule;
  return str.replace(new RegExp('<!--' + commentRule + '[\\s\\S]*?' + commentRule + '-->', 'g'), '')
    .replace(REGEX_SP_FILTER, (all, s1, match) => '|' + SP_FILTER_LOOKUP[match]);
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose, tmplRule) {
  let ret, paramsEx;
  if (elemName[0] === tmplRule.extensionRule) {
    ret = elem.substring(1, elem.length - 1);
  } else if (elemName.indexOf(tmplRule.propRule) === 0) {
    ret = tmplRule.extensionRule + 'prop ' + tmplRule.startRule + '\'' + elemName.substr(tmplRule.propRule.length) + '\'' + tmplRule.endRule + elemParams;
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
    elem: elem,
    params: paramsEx
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr, tmplRule) {
  _setElem(elem, elemName, elemParams, elemArr, true, tmplRule);
}

//Set text node
function _setText(text, elemArr) {
  elemArr.push(text);
}