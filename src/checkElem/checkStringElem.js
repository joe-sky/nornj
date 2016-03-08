'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  REGEX_CLEAR_NOTES = /<!--[\s\S]*?-->/g,
  REGEX_CLEAR_BLANK = />\s+([^\s<]*)\s+</g,
  REGEX_CHECK_ELEM = /([^>]*)(<([a-z{/$][-a-z0-9_:.{}$]*)[^>]*>)([^<]*)/ig,
  REGEX_SPLIT = /\$\{\d+\}/;

//Cache the string template by unique key
nj.strTmpls = {};

//Compile string template
function compileStringTmpl(tmpl) {
  var isStr = tools.isString(tmpl),
    tmplKey;

  //Get unique key
  if (isStr) {
    tmpl = _clearNotesAndBlank(tmpl);
    tmplKey = tools.uniqueKey(tmpl);
  }
  else {
    var fullXml = '';
    tools.each(tmpl, function (xml) {
      fullXml += xml;
    }, false, true);

    tmplKey = tools.uniqueKey(_clearNotesAndBlank(fullXml));
  }

  //If the cache already has template data,then return the template
  var ret = nj.strTmpls[tmplKey];
  if (ret) {
    return ret;
  }

  var xmls = tmpl,
    args = arguments,
    splitNo = 0,
    params = [];

  ret = '';
  if (isStr) {
    xmls = tmpl.split(REGEX_SPLIT);
  }

  //Connection xml string
  var l = xmls.length;
  tools.each(xmls, function (xml, i) {
    var split = '';
    if (i < l - 1) {
      var arg = args[i + 1];
      if (tools.isString(arg)) {
        split = arg;
      }
      else {
        split = '<nj-split_' + splitNo + ' />';
        params.push(arg);
        splitNo++;
      }
    }

    ret += xml + split;
  }, false, true);

  //Resolve string to element
  ret = _checkStringElem(isStr ? ret : _clearNotesAndBlank(ret), params);

  //Save to the cache
  nj.strTmpls[tmplKey] = ret;
  return ret;
}

//Resolve string to element
function _checkStringElem(xml, params) {
  var root = [],
    current = {
      elem: root,
      elemName: 'root',
      parent: null
    },
    parent = null,
    matchArr;

  while ((matchArr = REGEX_CHECK_ELEM.exec(xml))) {
    var textBefore = matchArr[1],
      elem = matchArr[2],
      elemName = matchArr[3],
      textAfter = matchArr[4];

    //Text before tag
    if (textBefore) {
      if (/\s/.test(textBefore[textBefore.length - 1])) {
        textBefore = _formatText(textBefore);
      }
      current.elem.push(textBefore);
    }

    //Element tag
    if (elem) {
      if (elemName[0] === '/') {  //Close tag
        if (elemName === '/' + current.elemName) {
          current = current.parent;
        }
      }
      else if (elem[elem.length - 2] === '/') {  //Self close tag
        current.elem.push(_getSelfCloseElem(elem, elemName, params));
      }
      else {  //Open tag
        parent = current;
        current = {
          elem: [],
          elemName: elemName,
          parent: parent
        };

        parent.elem.push(current.elem);
        current.elem.push(_getElem(elem, elemName));
      }
    }

    //Text after tag
    if (textAfter) {
      if (/\s/.test(textAfter[0])) {
        textAfter = _formatText(textAfter);
      }
      current.elem.push(textAfter);
    }
  }

  return root;
}

function _clearNotesAndBlank(str) {
  return str.replace(REGEX_CLEAR_NOTES, '').replace(REGEX_CLEAR_BLANK, '>$1<').trim();
}

function _formatText(str) {
  return str.replace(/\n/g, '').trim();
}

function _getElem(elem, elemName) {
  switch (elemName) {
    case '$if':
    case '$each':
      return elem.substring(1, elem.length - 1);
    default:
      return elem;
  }
}

//Get self close element
function _getSelfCloseElem(elem, elemName, params) {
  if (elemName.indexOf('nj-split') >= 0) {
    return params[elemName.split('_')[1]];
  }
  else {
    return elemName === '$else' ? elem.substr(1, 5) : [_getElem(elem, elemName)];
  }
}

module.exports = compileStringTmpl;