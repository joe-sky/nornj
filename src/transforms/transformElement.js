import nj from '../core';
import * as tools from '../utils/tools';
import * as tranParam from './transformParam';
import { extensionConfig } from '../helpers/extension';

//提取xml open tag
export function getXmlOpenTag(obj, tmplRule) {
  return tmplRule.xmlOpenTag.exec(obj);
}

//验证xml self close tag
const REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;

export function isXmlSelfCloseTag(obj) {
  return REGEX_XML_SELF_CLOSE_TAG.test(obj);
}

//Verify self close tag name
export const OMITTED_CLOSE_TAGS = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};

export function verifySelfCloseTag(tagName) {
  return OMITTED_CLOSE_TAGS[tagName.toLowerCase()];
}

//Extract parameters inside the xml open tag
export function getOpenTagParams(tag, tmplRule) {
  let pattern = tmplRule.openTagParams,
    matchArr, ret;

  while ((matchArr = pattern.exec(tag))) {
    let key = matchArr[1];
    if (key === '/') { //If match to the last of "/", then continue the loop.
      continue;
    }

    if (!ret) {
      ret = [];
    }

    let value = matchArr[8],
      onlyBrace = matchArr[4] != null ? matchArr[4] : matchArr[6];
    if (value != null) {
      value = tools.clearQuot(value); //Remove quotation marks
    } else {
      value = key; //Match to Similar to "checked" or "disabled" attribute.
    }

    //Removed at the end of "/>", ">" or "/".
    if (!matchArr[9] && !matchArr[10]) {
      if (/\/>$/.test(value)) {
        value = value.substr(0, value.length - 2);
      } else if (/>$/.test(value) || /\/$/.test(value)) {
        value = value.substr(0, value.length - 1);
      }
    }

    //Transform special key
    let hasColon;
    if(key[0] === ':') {
      key = key.substr(1);
      hasColon = true;
    }

    ret.push({
      key,
      value,
      onlyBrace,
      hasColon
    });
  }

  return ret;
}

//判断xml close tag
export function isXmlCloseTag(obj, tagName) {
  return tools.isString(obj) && obj.toLowerCase() === '</' + tagName + '>';
}

//get inside brace param
export function getInsideBraceParam(obj, tmplRule) {
  return tmplRule.braceParam.exec(obj);
}

//判断扩展标签并返回参数
export function isEx(obj, tmplRule, noParams) {
  let ret, ret1 = tmplRule.extension.exec(obj);
  if (ret1) {
    ret = [ret1[1]];

    if (!noParams) {
      const params = getOpenTagParams(obj, tmplRule); //提取各参数
      if (params) {
        ret.push(params);
      }
    }
  }

  return ret;
}

export function isExAll(obj, tmplRule) {
  return obj.match(tmplRule.exAll);
}

//判断是否模板元素
export function isTmpl(obj) {
  return obj === 'tmpl';
}

//加入到模板集合中
export function addTmpl(node, parent, name) {
  let paramsP = parent.params;
  if (!paramsP) {
    paramsP = parent.params = tools.obj();
  }

  const tmpls = paramsP.tmpls;
  if (!tmpls) {
    const objT = {
      [name != null ? name : '_njT0']: { node, no: 0 },
      _njLen: 1
    };

    paramsP.tmpls = tranParam.compiledParam(objT);
  } else { //Insert the compiled template to the parameter name for "tmpls"'s "strs" array.
    let objT = tmpls.strs[0],
      len = objT._njLen;

    objT[name != null ? name : ('_njT' + len)] = { node, no: len };
    objT._njLen = ++len;
  }
}

//Test whether as parameters extension
export function isParamsEx(name) {
  return name === 'params' || name === 'props';
}

//Add to the "paramsEx" property of the parent node
export function addParamsEx(node, parent, isProp, isSub) {
  const exPropsName = isSub ? 'propsExS' : 'paramsEx';
  if (!parent[exPropsName]) {
    let exPropsNode;
    if (isProp || isSub) {
      exPropsNode = {
        type: 'nj_ex',
        ex: 'props',
        content: [node]
      };
    } else {
      exPropsNode = node;
    }

    exPropsNode.parentType = parent.type;
    parent[exPropsName] = exPropsNode;
  } else {
    tools.arrayPush(parent[exPropsName].content, isProp || isSub ? [node] : node.content);
  }
}

export function exCompileConfig(name) {
  const config = extensionConfig[name];
  return {
    isSub: config ? config.isSub : false,
    isProp: config ? config.isProp : false,
    useString: config ? config.useString : false,
    addSet: config ? config.addSet : false
  };
}

export function isPropS(elemName, tmplRule) {
  return elemName.indexOf(tmplRule.propRule) === 0;
}

export function isStrPropS(elemName, tmplRule) {
  return elemName.indexOf(tmplRule.strPropRule + tmplRule.propRule) === 0;
}