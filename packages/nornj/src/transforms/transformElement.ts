import nj from '../core';
import * as tools from '../utils/tools';
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
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};

export function verifySelfCloseTag(tagName) {
  return OMITTED_CLOSE_TAGS[tagName.toLowerCase()];
}

//Extract parameters inside the xml open tag
export function getOpenTagParams(tag, tmplRule) {
  const pattern = tmplRule.openTagParams;
  let matchArr, ret;

  while ((matchArr = pattern.exec(tag))) {
    let key = matchArr[1];
    if (key === '/') {
      //If match to the last of "/", then continue the loop.
      continue;
    }

    if (!ret) {
      ret = [];
    }

    let value = matchArr[8],
      onlyKey = false;
    const onlyBrace = matchArr[4] != null ? matchArr[4] : matchArr[6];
    if (value != null) {
      value = tools.clearQuot(value); //Remove quotation marks
    } else {
      value = key; //Match to Similar to "checked" or "disabled" attribute.
      if (!onlyBrace) {
        onlyKey = true;
      }
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
    if (key[0] === ':') {
      key = key.substr(1);
      hasColon = true;
    }

    ret.push({
      key,
      value,
      onlyBrace,
      hasColon,
      onlyKey
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
export function isEx(obj, tmplRule, noParams?) {
  let ret;
  const ret1 = tmplRule.extension.exec(obj);
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

const REGEX_LOWER_CASE = /^[a-z]/;
const REGEX_UPPER_CASE = /^[A-Z]/;

export function fixExTagName(tagName, tmplRule) {
  let ret;
  if (!nj.fixTagName) {
    return ret;
  }

  const _tagName = tools.lowerFirst(tagName),
    config = extensionConfig[_tagName];
  if (
    config &&
    (!config.needPrefix ||
      (config.needPrefix == 'onlyUpperCase' && REGEX_LOWER_CASE.test(tagName)) ||
      (config.needPrefix == 'onlyLowerCase' && REGEX_UPPER_CASE.test(tagName)))
  ) {
    ret = tmplRule.extensionRule + _tagName;
  }

  return ret;
}

//Test whether as parameters extension
export function isParamsEx(name) {
  return name === 'params' || name === 'props';
}

//Add to the "paramsEx" property of the parent node
export function addParamsEx(node, parent, isDirective, isSubTag) {
  const exPropsName = 'paramsEx';
  if (!parent[exPropsName]) {
    let exPropsNode;
    if (isDirective || isSubTag) {
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
    tools.arrayPush(parent[exPropsName].content, isDirective || isSubTag ? [node] : node.content);
  }
}

export function exCompileConfig(name) {
  return extensionConfig[name] || {};
}

export function isPropS(elemName, tmplRule) {
  return elemName.indexOf(tmplRule.propRule) === 0;
}

export function isStrPropS(elemName, tmplRule) {
  return elemName.indexOf(tmplRule.strPropRule + tmplRule.propRule) === 0;
}
