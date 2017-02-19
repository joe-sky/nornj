import nj from '../core';
import * as tools from '../utils/tools';
const { errorTitle } = nj;

//提取style内参数
export function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (tools.isObject(obj)) {
    return obj;
  }

  //参数为字符串
  let pattern = /([^\s:]+)[\s]?:[\s]?([^;]+)[;]?/g,
    matchArr, ret;

  while ((matchArr = pattern.exec(obj))) {
    let key = matchArr[1],
      value = matchArr[2];

    if (!ret) {
      ret = {};
    }

    //Convert to lowercase when style name is all capital.
    if (/^[A-Z-]+$/.test(key)) {
      key = key.toLowerCase();
    }

    //将连字符转为驼峰命名
    key = tools.toCamelCase(key);

    ret[key] = value;
  }

  return ret;
}

//Get value from multiple datas
export function getData(prop, data) {
  let ret, obj;
  if (data === undefined) {
    data = this.data;
  }

  for (let i = 0, l = data.length; i < l; i++) {
    obj = data[i];
    if (obj) {
      ret = obj[prop];
      if (ret !== undefined) {
        return ret;
      }
    }
  }
}

export function getComputedData(fn, p2, level) {
  if (fn == null) {
    return fn;
  }

  if (fn._njTmpl) { //模板函数
    if (level != null && p2.level != null) {
      level += p2.level;
    }

    return fn.call({
      _njData: p2.data,
      _njParent: p2.parent,
      _njIndex: p2.index,
      _njLevel: level
    });
  } else { //普通函数
    return fn(p2);
  }
}

//Rebuild local variables in the new context
export function newContext(p2, p3) {
  const newData = [];
  if (p3 && 'data' in p3) {
    newData.push(p3.data);
  }
  if (p3 && 'extra' in p3) {
    newData.push(p3.extra);
  }

  return {
    data: newData.length ? tools.arrayPush(newData, p2.data) : p2.data,
    parent: p3 && p3.fallback ? p2 : p2.parent,
    index: p3 && 'index' in p3 ? p3.index : p2.index,
    level: p2.level,
    getData
  };
}

//修正属性名
export function fixPropName(name) {
  switch (name) {
    case 'class':
      name = 'className';
      break;
    case 'for':
      name = 'htmlFor';
      break;
  }

  return name;
}

//合并字符串属性
export function assignStringProp(paramsE, keys) {
  let ret = '';
  for (let k in paramsE) {
    if (!keys || !keys[k]) {
      const v = paramsE[k];
      ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
    }
  }
  return ret;
}

//创建块表达式子节点函数
export function exprRet(p1, p2, fn, p4) {
  return function(param) {
    return fn(p1, p2, param, p4);
  };
}

//构建可运行的模板函数
export function tmplWrap(configs, main) {
  return function() {
    const initCtx = this,
      data = tools.arraySlice(arguments);

    return main(configs, {
      data: initCtx && initCtx._njData ? tools.arrayPush(data, initCtx._njData) : data,
      parent: initCtx ? initCtx._njParent : null,
      index: initCtx ? initCtx._njIndex : null,
      level: initCtx ? initCtx._njLevel : null,
      getData
    });
  };
}

function levelSpace(p2) {
  let ret = '';
  if (p2.level == null) {
    return ret;
  }

  for (let i = 0; i < p2.level; i++) {
    ret += '  ';
  }
  return ret;
}

//创建模板函数
export function template(fns) {
  const configs = {
    useString: fns.useString,
    exprs: nj.exprs,
    filters: nj.filters,
    noop: tools.noop,
    obj: tools.obj,
    throwIf: tools.throwIf,
    warn: tools.warn,
    newContext,
    getComputedData,
    styleProps,
    exprRet
  };

  if (!configs.useString) {
    configs.h = nj.createElement;
    configs.components = nj.components;
  } else {
    configs.assignStringProp = assignStringProp;
    configs.escape = nj.escape;
    configs.levelSpace = levelSpace;
  }

  tools.each(fns, (v, k) => {
    if (k.indexOf('main') === 0) { //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
      configs[k]._njTmpl = true;
      configs['_' + k] = v;
    } else if (k.indexOf('fn') === 0) { //块表达式函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}