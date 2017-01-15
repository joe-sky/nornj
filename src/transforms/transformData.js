'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  errorTitle = nj.errorTitle;

//提取style内参数
function styleProps(obj) {
  //If the parameter is a style object,then direct return.
  if (tools.isObject(obj)) {
    return obj;
  }

  //参数为字符串
  var pattern = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g,
    matchArr, ret;

  while ((matchArr = pattern.exec(obj))) {
    var key = matchArr[1],
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
function getData(data, prop) {
  var ret, obj;
  for (var i = 0, l = data.length; i < l; i++) {
    obj = data[i];
    if (obj) {
      ret = obj[prop];
      if (ret != null) {
        return ret;
      }
    }
  }
}

//Rebuild local variables in the new context
function newContext(p2, p3) {
  var newData = [];
  if ('data' in p3) {
    newData.push(p3.data);
  }
  if ('extra' in p3) {
    newData.push(p3.extra);
  }

  return {
    data: newData.length ? tools.arrayPush(newData, p2.data) : p2.data,
    parent: p3.fallback ? p2 : p2.parent,
    index: 'index' in p3 ? p3.index : p2.index
  };
}

//修正属性名
function fixPropName(name) {
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
function assignStringProp(paramsE, keys) {
  var ret = '';
  for (var k in paramsE) {
    if (!keys || !keys[k]) {
      var v = paramsE[k];
      ret += ' ' + k + (k !== v ? '="' + v + '"' : ' ');
    }
  }
  return ret;
}

//创建块表达式子节点函数
function exprRet(p1, p2, fn, p4) {
  return function(param) {
    return fn(p1, p2, param, p4);
  };
}

//构建可运行的模板函数
function tmplWrap(configs, main) {
  return function() {
    var args = arguments,
      initCtx = this,
      data = !tools.isArray(args[0]) ? tools.arraySlice(args) : args[0];

    return main(configs, {
      data: initCtx && initCtx._njData ? tools.arrayPush([initCtx._njData], data) : data,
      parent: initCtx && initCtx._njParent ? initCtx._njParent : null,
      index: initCtx && initCtx._njIndex ? initCtx._njIndex : null
    });
  };
}

//创建模板函数
function template(fns) {
  var configs = {
    useString: fns.useString,
    exprs: nj.exprs,
    filters: nj.filters,
    getData: getData,
    noop: tools.noop,
    lightObj: tools.lightObj,
    throwIf: tools.throwIf,
    warn: tools.warn,
    newContext: newContext,
    styleProps: styleProps,
    exprRet: exprRet
  };

  if (!configs.useString) {
    configs.h = nj.createElement;
    configs.components = nj.components;
    //configs.assign = tools.assign;
  } else {
    configs.assignStringProp = assignStringProp;
    configs.escape = nj.escape;
  }

  tools.each(fns, function(v, k) {
    if (k.indexOf('main') === 0) { //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
      configs['_' + k] = v;
    } else if (k.indexOf('fn') === 0) { //块表达式函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}

module.exports = {
  newContext,
  getData,
  fixPropName,
  styleProps,
  assignStringProp,
  exprRet,
  tmplWrap,
  template
};