import nj from '../core';
import * as tools from '../utils/tools';
const REGEX_NUM = /^(-?([0-9]+[.]?[0-9]+)|[0-9])$/;

//提取style内参数
export function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (tools.isObject(obj) || tools.isArray(obj) || tools.isNumber(obj)) {
    return obj;
  }

  //参数为字符串
  const pattern = /([^\s:]+)[\s]?:[\s]?([^;]+)[;]?/g;
  let matchArr, ret;

  while ((matchArr = pattern.exec(obj))) {
    let key = matchArr[1];
    const value = matchArr[2];

    if (!ret) {
      ret = {};
    }

    //Convert to lowercase when style name is all capital.
    if (/^[A-Z-]+$/.test(key)) {
      key = key.toLowerCase();
    }

    //将连字符转为驼峰命名
    key = tools.camelCase(key);

    ret[key] = REGEX_NUM.test(value) ? Number(value) : value;
  }

  return ret;
}

//Get value from multiple datas
export function getData(prop, data, hasSource?) {
  let value, obj;
  if (!data) {
    data = this.data;
  }

  for (let i = 0, l = data.length; i < l; i++) {
    obj = data[i];
    if (obj) {
      value = obj[prop];
      if (value !== undefined) {
        if (hasSource) {
          return {
            source: obj,
            value,
            prop,
            _njSrc: true
          };
        }

        return value;
      }
    }
  }
}

export function getAccessorData(fn, context) {
  if (fn == null) {
    return fn;
  }

  if (fn._njTmpl) {
    //模板函数
    return fn.call(context);
  } else {
    //普通函数
    return fn.call(context.$this, context);
  }
}

export function getElement(name, global, nameO, context, subName?) {
  let element;
  if (!context.icp) {
    element = global.cp[name];
  } else {
    element = getData(nameO, context.icp);
    if (!element) {
      element = global.cp[name];
    }
  }

  if (subName != null && element) {
    element = element[subName];
  }

  return element ? element : nameO;
}

export function getElementRefer(refer, name, global, nameO, context) {
  return refer != null
    ? tools.isString(refer)
      ? getElement(refer.toLowerCase(), global, refer, context)
      : refer
    : getElement(name, global, nameO, context);
}

export function getElementName(refer, name) {
  return refer != null && refer !== '' ? refer : name;
}

export function addArgs(props, dataRefer) {
  const { args } = props;
  if (args) {
    for (let i = args.length; i--; ) {
      dataRefer.unshift(args[i]);
    }
  }
}

//Rebuild local variables in the new context
export function newContext(context, params) {
  if (!params) {
    return context;
  }

  return tools.assign({}, context, {
    data: params.data ? tools.arrayPush(params.data, context.data) : context.data,
    parent: params.newParent ? context : context.parent,
    index: params.index != null ? params.index : context.index,
    item: params.item != null ? params.item : context.item
  });
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
export function assignStrProps(target, ...params) {
  let ret = '';
  const retObj = tools.assign(target, ...params);

  for (const k in retObj) {
    const v = retObj[k];
    ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
  }
  return ret;
}

//创建扩展标签子节点函数
export function exRet(global, context, fn) {
  return function(param) {
    return fn(global, context, param);
  };
}

function _getLocalComponents(localConfigs) {
  let icp;
  if (localConfigs && localConfigs.components) {
    icp = localConfigs.components;
    if (!tools.isArray(icp)) {
      icp = [icp];
    }
  }

  return icp;
}

//构建可运行的模板函数
export function tmplWrap(configs, main) {
  return function(param1, param2) {
    const ctx = this,
      data = tools.arraySlice(arguments);

    return main(
      configs,
      ctx && ctx._njCtx
        ? tools.assign({}, ctx, {
            data: tools.arrayPush(data, ctx.data)
          })
        : {
            data,
            getData,
            get $this() {
              return this.data[this.data.length - 1];
            },
            d: getData,
            icp: _getLocalComponents(param1 && param1._njParam ? param2 : param1),
            _njCtx: true
          }
    );
  };
}

function levelSpace(context) {
  if (context.level == null) {
    return '';
  }

  let ret = '';
  for (let i = 0; i < context.level; i++) {
    ret += '  ';
  }
  return ret;
}

function firstNewline(context) {
  return context.index == null ? '' : context.index == 0 ? '' : '\n';
}

function createElementApply(p) {
  return nj.createElement.apply(null, p);
}

function callFilter(filter) {
  return filter.source ? filter.value.bind(filter.source) : filter;
}

//创建模板函数
export function template(fns, tmplKey?) {
  const configs: any = {
    tmplKey,
    us: fns.useString,
    x: nj.extensions,
    f: nj.filters,
    np: tools.noop,
    tf: tools.throwIf,
    wn: tools.warn,
    n: newContext,
    c: getAccessorData,
    sp: styleProps,
    r: exRet,
    e: getElement,
    er: getElementRefer,
    en: getElementName,
    aa: addArgs,
    an: tools.assign,
    g: nj.global,
    cf: callFilter
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

  tools.each(
    fns,
    (v, k) => {
      if (k === 'main') {
        //将每个主函数构建为可运行的模板函数
        configs[k] = tmplWrap(configs, v);
        tools.defineProps(configs[k], {
          _njTmpl: {
            value: true
          }
        });
        configs['_' + k] = v;
      } else if (k.indexOf('fn') === 0) {
        //扩展标签函数
        configs[k] = v;
      }
    },
    false
  );

  return configs;
}
