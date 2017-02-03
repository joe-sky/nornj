'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranElem = require('../transforms/transformElement'),
  tmplRule = nj.tmplRule,
  tmplStrs = nj.tmplStrs,
  SPLIT_FLAG = '_nj_split';

//Compile string template
function compileStringTmpl(tmpl) {
  var tmplKey = tmpl.toString(), //Get unique key
    ret = tmplStrs[tmplKey],
    outputH = this ? this.outputH : false;

  if (!ret) { //If the cache already has template data, direct return the template.
    var isStr = tools.isString(tmpl),
      xmls = isStr ? [tmpl] : tmpl,
      l = xmls.length,
      computedNos = [],
      fullXml = '';

    //Connection xml string
    tools.each(xmls, function(xml, i) {
      var split = '';
      if (i < l - 1) {
        var last = xml.length - 1,
          lastChar = xml[last],
          isComputed = lastChar === '#',
          isNoEscape = lastChar === '@';

        if (isComputed || isNoEscape) {
          isComputed && computedNos.push(i);
          xml = xml.substr(0, last);
        }

        split = (isNoEscape ? tmplRule.firstChar : '') + tmplRule.startRule +
          (isComputed ? '#' : '') + SPLIT_FLAG + i +
          tmplRule.endRule + (isNoEscape ? tmplRule.lastChar : '');
      }

      fullXml += xml + split;
    }, false, true);

    fullXml = _clearNotesAndBlank(fullXml);

    //Resolve string to element
    ret = _checkStringElem(fullXml);
    ret._njParamCount = l - 1;
    ret._njComputedNos = computedNos;

    //Save to the cache
    tmplStrs[tmplKey] = ret;
  }

  var params,
    args = arguments,
    paramCount = ret._njParamCount;
  if (paramCount > 0) {
    params = {};

    for (var i = 0; i < paramCount; i++) {
      params[SPLIT_FLAG + i] = args[i + 1];
    }
  }

  var tmplFn = function() {
    return nj['compile' + (outputH ? 'H' : '')](tmplFn, tmplKey).apply(this, params ? tools.arrayPush([params], arguments) : arguments);
  };
  tmplFn._njTmpl = ret;
  tmplFn._njTmplKey = tmplKey;
  tmplFn._njParams = params;

  return tmplFn;
}

//Resolve string to element
function _checkStringElem(xml) {
  var root = [],
    current = {
      elem: root,
      elemName: 'root',
      parent: null
    },
    parent = null,
    pattern = tmplRule.checkElem,
    matchArr;

  while (matchArr = pattern.exec(xml)) {
    var textBefore = matchArr[1],
      elem = matchArr[2],
      elemName = matchArr[3],
      elemParams = matchArr[4],
      textAfter = matchArr[5];

    //Text before tag
    if (textBefore && textBefore !== '\n') {
      textBefore = _formatNewline(textBefore);
      _setText(textBefore, current.elem);
    }

    //Element tag
    if (elem) {
      if (elemName[0] === '/') { //Close tag
        if (elemName === '/' + current.elemName) {
          current = current.parent;
        }
      } else if (elem[elem.length - 2] === '/') { //Self close tag
        _setSelfCloseElem(elem, elemName, elemParams, current.elem);
      } else { //Open tag
        parent = current;
        current = {
          elem: [],
          elemName: elemName,
          parent: parent
        };

        parent.elem.push(current.elem);
        _setElem(elem, elemName, elemParams, current.elem);
      }
    }

    //Text after tag
    if (textAfter && textAfter !== '\n') {
      textAfter = _formatNewline(textAfter);
      _setText(textAfter, current.elem);
    }
  }

  return root;
}

const SPECIAL_LOOKUP = {
  '>(': 'gt(',
  '<(': 'lt(',
  '>=(': 'gte(',
  '<=(': 'lte('
};

function _clearNotesAndBlank(str) {
  return str.replace(/<#!--[\s\S]*?--#>/g, '').replace(/>\s+([^\s<]*)\s+</g, '>$1<').trim()
    .replace(/(>|<|>=|<=)\(/g, (match) => SPECIAL_LOOKUP[match]);
}

function _formatNewline(str) {
  return str.trim().replace(/\n/g, '\\n').replace(/\r/g, '');
}

//Set element node
function _setElem(elem, elemName, elemParams, elemArr, bySelfClose) {
  var ret, paramsExpr;
  elem = _formatNewline(elem);

  if (elemName[0] === tmplRule.exprRule) {
    ret = elem.substring(1, elem.length - 1);
  } else if (elemName.indexOf(tmplRule.propRule) === 0) {
    ret = tmplRule.exprRule + 'prop ' + tmplRule.startRule + '\'' + elemName.substr(tmplRule.propRule.length) + '\'' + tmplRule.endRule + elemParams;
  } else {
    var retS = _getSplitParams(elem);
    ret = retS.elem;
    paramsExpr = retS.params;
  }

  if (bySelfClose) {
    var retC = [ret];
    if (paramsExpr) {
      retC.push(paramsExpr);
    }

    elemArr.push(retC);
  } else {
    elemArr.push(ret);
    if (paramsExpr) {
      elemArr.push(paramsExpr);
    }
  }
}

//Extract split parameters
function _getSplitParams(elem) {
  var exprRule = tmplRule.exprRule,
    startRule = tmplRule.startRule,
    endRule = tmplRule.endRule,
    paramsExpr;

  //Replace the parameter like "{...props}".
  elem = elem.replace(tmplRule.spreadProp, function(all, begin, prop) {
    prop = prop.trim();

    if (!paramsExpr) {
      paramsExpr = [exprRule + 'props'];
    }

    paramsExpr.push([exprRule + 'spread ' + startRule + prop.replace(/\.\.\./g, '') + endRule + '/']);
    return ' ';
  });

  return {
    elem: elem,
    params: paramsExpr
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemParams, elemArr) {
  _setElem(elem, elemName, elemParams, elemArr, true);
}

//Set text node
function _setText(text, elemArr) {
  elemArr.push(text);
}

module.exports = compileStringTmpl;