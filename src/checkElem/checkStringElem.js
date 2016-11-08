'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  tranElem = require('../transforms/transformElement'),
  REGEX_SPLIT = /\$\{\d+\}/,
  tmplRule = nj.tmplRule,
  shim = require('../utils/shim');

//Cache the string template by unique key
nj.strTmpls = {};

//Compile string template
function compileStringTmpl(tmpl) {
  var tmplKey, ret;
  if (this) {  //The "tmplKey" parameter can be passed by the "this" object.
    tmplKey = this.tmplKey;
  }

  if (tmplKey) {  //If the cache already has template data, direct return the template.
    ret = nj.strTmpls[tmplKey];
    if (ret) {
      return ret;
    }
  }

  var isStr = tools.isString(tmpl),
    xmls = tmpl,
    args = arguments,
    splitNo = 0,
    params = [],
    fullXml = '';

  if (isStr) {
    xmls = tmpl.split(REGEX_SPLIT);
  }

  //Connection xml string
  var l = xmls.length;
  tools.each(xmls, function (xml, i) {
    var split = '';
    if (i < l - 1) {
      var arg = args[i + 1],
        last = xml.length - 1,
        useShim = xml[last] === '@';

      if (!tools.isString(arg) || useShim) {
        split = '_nj-split' + splitNo + '_';

        //Use the shim function to convert the parameter when the front of it with a "@" mark.
        if (useShim) {
          xml = xml.substr(0, last);
          arg = shim(arg);
        }

        params.push(arg);
        splitNo++;
      }
      else {
        split = arg;
      }
    }

    fullXml += xml + split;
  }, false, true);

  fullXml = _clearNotesAndBlank(fullXml);

  if (tmplKey == null) {
    //Get unique key
    tmplKey = tools.uniqueKey(fullXml + _paramsStr(params));

    ret = nj.strTmpls[tmplKey];
    if (ret) {
      return ret;
    }
  }

  //Resolve string to element
  ret = _checkStringElem(fullXml, params);

  //Set the properties for the template object
  _setTmplProps(ret, tmplKey);

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
    pattern = tmplRule.checkElem(),
    matchArr;

  while ((matchArr = pattern.exec(xml))) {
    var textBefore = matchArr[1],
      elem = matchArr[2],
      elemName = matchArr[3],
      textAfter = matchArr[4];

    //Text before tag
    if (textBefore && textBefore !== '\n') {
      textBefore = _formatText(textBefore);
      _setText(textBefore, current.elem, params);
    }

    //Element tag
    if (elem) {
      if (elemName[0] === '/') {  //Close tag
        if (elemName === '/' + current.elemName) {
          current = current.parent;
        }
      }
      else if (elem[elem.length - 2] === '/') {  //Self close tag
        _setSelfCloseElem(elem, elemName, current.elem, params);
      }
      else {  //Open tag
        parent = current;
        current = {
          elem: [],
          elemName: elemName,
          parent: parent
        };

        parent.elem.push(current.elem);
        _setElem(elem, elemName, current.elem, params);
      }
    }

    //Text after tag
    if (textAfter && textAfter !== '\n') {
      textAfter = _formatText(textAfter);
      _setText(textAfter, current.elem, params);
    }
  }

  return root;
}

function _clearNotesAndBlank(str) {
  return str.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+([^\s<]*)\s+</g, '>$1<').trim();
}

function _formatText(str) {
  return str.replace(/\n/g, '\\n').replace(/\r/g, '').trim();
}

//Merge parameters to string
function _paramsStr(params) {
  var str = '';
  tools.each(params, function (p) {
    if (tools.isArray(p)) {
      str += '|' + _cascadeArr(p, true);
    }
    else {
      str += '|' + JSON.stringify(p);
    }
  }, false, true);

  return str;
}

function _cascadeArr(p, isArr) {
  var str;
  if (isArr || tools.isArray(p)) {
    if (p.njKey != null) {
      str = '+' + p.njKey;
    }
    else {
      str = '';
      for (var i = 0, l = p.length; i < l; i++) {
        str += _cascadeArr(p[i]);
      }
    }
  }
  else {
    str = '+' + p;
  }

  return str;
}

//Set element node
function _setElem(elem, elemName, elemArr, params, bySelfClose) {
  var ret, paramsExpr;
  if (elemName[0] === tmplRule.exprRule) {
    ret = elem.substring(1, elem.length - 1);
  }
  else {
    var retS = _getSplitParams(elem, params);
    ret = retS.elem;
    paramsExpr = retS.params;
  }

  if (bySelfClose) {
    var retC = [ret];
    if (paramsExpr) {
      retC.push(paramsExpr);
    }

    elemArr.push(retC);
  }
  else {
    elemArr.push(ret);
    if (paramsExpr) {
      elemArr.push(paramsExpr);
    }
  }
}

//Extract split parameters
function _getSplitParams(elem, params) {
  var exprRule = tmplRule.exprRule,
    beginRule = tmplRule.beginRule,
    endRule = tmplRule.endRule,
    paramsExpr;

  //Replace the parameter like "prop=_nj-split0_".
  elem = elem.replace(/([^\s={}>]+)=['"]?_nj-split(\d+)_['"]?/g, function (all, key, no) {
    if (!paramsExpr) {
      paramsExpr = [exprRule + 'params'];
    }

    paramsExpr.push([exprRule + "param " + beginRule + "'" + key + "'" + endRule, params[no]]);
    return '';
  });

  //Replace the parameter like "{...props}" and "{prop}".
  elem = elem.replace(tmplRule.replaceBraceParam(), function (all, begin, prop) {
    prop = prop.trim();
    var propN = prop.replace(/\.\.\//g, '');

    if (propN.indexOf('...') === 0) {
      if (!paramsExpr) {
        paramsExpr = [exprRule + 'params'];
      }

      paramsExpr.push([exprRule + 'spreadParam ' + beginRule + prop.replace(/\.\.\./g, '') + endRule + '/']);
      return ' ';
    }
    else {
      return ' ' + propN + '=' + all.trim();
    }
  });

  return {
    elem: elem,
    params: paramsExpr
  };
}

//Set self close element node
function _setSelfCloseElem(elem, elemName, elemArr, params) {
  if (elemName === tmplRule.exprRule + 'else') {
    elemArr.push(elem.substr(1, 5));
  }
  else {
    _setElem(elem, elemName, elemArr, params, true);
  }
}

//Set text node
function _setText(text, elemArr, params) {
  var pattern = /_nj-split(\d+)_/g, matchArr,
    splitNos = [];

  while ((matchArr = pattern.exec(text))) {
    splitNos.push(matchArr[1]);
  }

  if (splitNos.length) {
    tools.each(text.split(/_nj-split(?:\d+)_/), function (t) {
      if (t !== '') {
        elemArr.push(t);
      }

      var no = splitNos.shift();
      if (no != null) {
        elemArr.push(params[no]);
      }
    }, false, true);
  }
  else {
    elemArr.push(text);
  }
}

//Set template props
function _setTmplProps(tmpl, key) {
  tmpl.njKey = key;

  tmpl.render = function () {
    return nj.compile(this, this.njKey).apply(null, arguments);
  };

  tmpl.renderComponent = function () {
    return nj.compileComponent(this, this.njKey).apply(null, arguments);
  };
}

module.exports = compileStringTmpl;