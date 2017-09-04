import nj from '../core';
import * as tools from '../utils/tools';
const { errorTitle } = nj;

//提取style内参数
export function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (tools.isObject(obj) || tools.isNumber(obj)) {
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
export function getData(prop, data, hasCtx) {
  let ret, obj;
  if (!data) {
    data = this.data;
  }

  for (let i = 0, l = data.length; i < l; i++) {
    obj = data[i];
    if (obj) {
      ret = obj[prop];
      if (ret !== undefined) {
        if (hasCtx) {
          return {
            ctx: obj,
            val: ret
          };
        }

        return ret;
      }
    }
  }
}

function _getLevel(level, p2) {
  if (level != null && p2.level != null) {
    level += p2.level;
  }
  return level;
}

export function getComputedData(fn, p2, level) {
  if (fn == null) {
    return fn;
  }

  if (fn.val._njTmpl) { //模板函数
    return fn.val.call({
      _njData: p2.data,
      _njParent: p2.parent,
      _njIndex: p2.index,
      _njLevel: _getLevel(level, p2),
      _njIcp: p2.icp
    });
  } else { //普通函数
    return fn.val.call(fn.ctx, p2);
  }
}

export function getElement(name, p1, nameO, p2) {
  let element;
  if (!p2.icp) {
    element = p1.cp[name];
  } else {
    element = getData(nameO, p2.icp);
    if (!element) {
      element = p1.cp[name];
    }
  }

  return element ? element : name;
}

export function getElementRefer(refer, name, p1, nameO, p2) {
  return refer != null ? (tools.isString(refer) ? getElement(refer.toLowerCase(), p1, nameO, p2) : refer) : getElement(name, p1, nameO, p2);
}

export function getElementName(refer, name) {
  return (refer != null && refer !== '') ? refer : name;
}

export function addArgs(props, dataRefer) {
  const { args } = props;
  if (args) {
    for (let i = args.length; i--;) {
      dataRefer.unshift(args[i]);
    }
  }
}

//Rebuild local variables in the new context
export function newContext(p2, p3) {
  if (!p3) {
    return p2;
  }

  const newData = [];
  if ('data' in p3) {
    newData.push(p3.data);
  }
  if ('extra' in p3) {
    newData.push(p3.extra);
  }

  return {
    data: newData.length ? tools.arrayPush(newData, p2.data) : p2.data,
    parent: p3.fallback ? p2 : p2.parent,
    index: 'index' in p3 ? p3.index : p2.index,
    level: p2.level,
    getData,
    d: getData,
    icp: p2.icp
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
export function assignStrProps(paramsE, keys) {
  let ret = '';
  for (let k in paramsE) {
    if (!keys || !keys[k]) {
      const v = paramsE[k];
      ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
    }
  }
  return ret;
}

//创建扩展标签子节点函数
export function exRet(p1, p2, fn, p4, p5) {
  return function(param) {
    return fn(p1, p2, param, p4, p5);
  };
}

function _getLocalComponents(localConfigs, initCtx) {
  let icp;
  if (localConfigs && localConfigs.components) {
    icp = localConfigs.components;
    if (!tools.isArray(icp)) {
      icp = [icp];
    }
  }
  if (initCtx && initCtx._njIcp) {
    icp = icp ? tools.arrayPush(icp, initCtx._njIcp) : initCtx._njIcp;
  }
  return icp;
}

//构建可运行的模板函数
export function tmplWrap(configs, main) {
  return function(localConfigs) {
    const initCtx = this,
      data = tools.arraySlice(arguments);

    return main(configs, {
      data: initCtx && initCtx._njData ? tools.arrayPush(data, initCtx._njData) : data,
      parent: initCtx ? initCtx._njParent : null,
      index: initCtx ? initCtx._njIndex : null,
      level: initCtx ? initCtx._njLevel : null,
      getData,
      d: getData,
      icp: _getLocalComponents(localConfigs, initCtx)
    });
  };
}

function levelSpace(p2) {
  if (p2.level == null) {
    return '';
  }

  let ret = '';
  for (let i = 0; i < p2.level; i++) {
    ret += '  ';
  }
  return ret;
}

function firstNewline(p2) {
  return p2.index == null ? '' : (p2.index == 0 ? '' : '\n');
}

function createElementApply(p) {
  return nj.createElement.apply(null, p);
}

//创建模板函数
export function template(fns) {
  const configs = {
    us: fns.useString,
    x: nj.extensions,
    f: nj.filters,
    np: tools.noop,
    tf: tools.throwIf,
    wn: tools.warn,
    n: newContext,
    c: getComputedData,
    sp: styleProps,
    r: exRet,
    e: getElement,
    er: getElementRefer,
    en: getElementName,
    aa: addArgs,
    an: tools.assign,
    g: nj.global,
    l: _getLevel
  };

  if (!configs.us) {
    configs.h = nj.createElement;
    configs.H = createElementApply;
    configs.cp = nj.components;
  } else {
    configs.ans = assignStrProps;
    configs.es = nj.escape;
    configs.ls = levelSpace;
    configs.fl = firstNewline;
  }

  tools.each(fns, (v, k) => {
    if (k.indexOf('main') === 0) { //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
      configs[k]._njTmpl = true;
      if (v._njName != null) { //设置函数名
        configs[k].tmplName = v._njName;
      }
      configs['_' + k] = v;
    } else if (k.indexOf('fn') === 0) { //扩展标签函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}