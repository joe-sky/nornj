'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  escape = require('../utils/escape'),
  replaceSpecialSymbol = require('../utils/replaceSpecialSymbol'),
  errorTitle = nj.errorTitle;

//转换节点参数为字符串
function transformParams(obj, data, parent, paramsE) {
  var ret = '';

  //Attach parameters from "$param" expressions
  if (paramsE) {
    tools.each(paramsE, function (v, k) {
      if (!obj || obj[k] == null) {
        ret += ' ' + k + '="' + v + '"';
      }
    }, false, false);
  }

  tools.each(obj, function (v, k) {
    ret += ' ' + k + '="' + replaceParams(v, data, false, false, parent, true) + '"';
  }, false, false);

  return ret;
}

//转换节点参数为对象
function transformParamsToObj(obj, data, parent, paramsE) {
  var ret = obj || paramsE ? {} : null;

  //Attach parameters from "$param" expressions
  if (paramsE) {
    tools.assign(ret, paramsE);
  }

  tools.each(obj, function (v, k) {
    replaceParams(v, data, ret, k, parent, false);
  }, false, false);

  return ret;
}

//设置对象参数
function setObjParam(obj, key, value, notTran) {
  var style;
  if (!notTran && nj.componentLib) {
    switch (key) {
      case 'class':
        key = 'className';
        break;
      case 'for':
        key = 'htmlFor';
        break;
      case 'style':
      case nj.tagStyle:
        key = 'style';
        style = styleProps(value);
        break;
    }
  }

  obj[key] = style != null ? style : value;
}

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

//Use filters
function _useFilters(filters, ret, data, parent, index, useString) {
  if (filters) {
    var filtersObj = nj.filters;
    tools.each(filters, function (filterObj) {
      var filter = filtersObj[filterObj.name];  //Get filter function
      if (!filter) {
        console.warn(errorTitle + 'A filter called ' + filterObj.name + ' is undefined.');
        return;
      }

      var params,
        paramsF = filterObj.params,
        thisObj = tools.lightObj();

      if (paramsF) {
        params = tools.listPush([ret], paramsF);
      }
      else {
        params = [ret];
      }

      thisObj.data = data;
      thisObj.parent = parent;
      thisObj.index = index;
      thisObj.useString = useString;
      ret = filter.apply(thisObj, params);
    }, false, true);
  }

  return ret;
}

//获取data值
function getDataValue(data, propObj, parent, defaultEmpty, useString) {
  //if (data == null) {
  //  return;
  //}

  var isArr = tools.isArray(data),
    prop = propObj.name,
    filters = propObj.filters,
    parentNum = propObj.parentNum,
    datas, ret, dataP, index;

  //if inside each block,get the parent data and current index
  if (parent && parent.parent) {
    dataP = parent.parent;
    index = parent.index;
  }

  //According to the param path to get data
  if (parent && parentNum) {
    for (var i = 0; i < parentNum; i++) {
      var _parent = parent.parent;
      tools.throwIf(_parent, errorTitle + 'Parent data is undefined, please check the param path declare.');
      parent = _parent;
      index = parent.index;
      datas = [parent.data];
    }
  }
  else if (isArr) {  //The data param is array
    datas = data;
  }
  else {
    datas = [data];
  }

  if (propObj.isStr) {
    ret = _useFilters(filters, prop, datas, dataP, index, useString);
  }
  else if (prop === '.') {  //prop为点号时直接使用data作为返回值
    ret = _useFilters(filters, isArr ? data[0] : data, datas, dataP, index, useString);
  }
  else if (prop === '#') {  //Get current item index
    ret = _useFilters(filters, index, datas, dataP, index, useString);
  }
  else {
    tools.each(datas, function (obj) {
      if (obj) {
        ret = obj[prop];
        if (ret != null) {
          //Use filters
          ret = _useFilters(filters, ret, datas, dataP, index, useString);

          return false;
        }
      }
    }, false, true, true);
  }

  //Default set empty
  if (defaultEmpty && ret == null) {
    ret = '';
  }

  return ret;
}

//Get value from multiple datas
function getDatasValue(datas, prop) {
  var ret, obj;
  for (var i = 0, l = datas.length; i < l; i++) {
    obj = datas[i];
    if (obj) {
      ret = obj[prop];
      if (ret != null) {
        return ret;
      }
    }
  }
}

//获取each块中的item参数
function getItemParam(item, data, isArr) {
  var ret = item;
  if (isArr == null) {
    isArr = tools.isArray(data);
  }
  if (isArr) {
    ret = tools.listPush([item], data.slice(1));
  }

  return ret;
}

//替换参数字符串
function replaceParams(valueObj, data, newObj, newKey, parent, useString) {
  var props = valueObj.props,
    strs = valueObj.strs,
    isAll = valueObj.isAll,
    useObj = tools.isObject(newObj),  //newObj的值可能为对象或布尔值,此处判断是否为对象
    value = strs[0];

  if (props) {
    tools.each(props, function (propObj, i) {
      var dataProp = getDataValue(data, propObj.prop, parent, !newObj, useString);

      //参数为字符串时,须做特殊字符转义
      if (dataProp
        && !newObj            //Only in transform to string need escape
        && propObj.escape) {  //Only in the opening brace's length less than 2 need escape
        dataProp = escape(dataProp);
      }

      //如果参数只存在占位符,则可传引用参数
      if (isAll) {
        if (useObj) {  //在新对象上创建属性
          setObjParam(newObj, newKey, dataProp);
        }

        value = dataProp;
      }
      else {  //Splicing value by one by one
        value += dataProp + strs[i + 1];
      }
    }, false, true);
  }

  //存在多个占位符的情况
  if (useObj && !isAll) {
    setObjParam(newObj, newKey, value);
  }

  //Replace space symbols such as "&nbsp;" when output component.
  if (newObj && !useObj && tools.isString(value)) {
    value = replaceSpecialSymbol(value);
  }
  return value;
}

//Get expression parameter
function getExprParam(refer, data, parent, useString) {
  var ret = [];
  if (refer != null) {
    tools.each(refer.props, function (propObj, i) {
      ret.push(getDataValue(data, propObj.prop, parent, false, useString));
    }, false, true);
  }

  return ret;
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
      ret += ' ' + k + '="' + paramsE[k] + '"';
    }
  }
  return ret;
}

//创建块表达式子节点函数
function exprRet(p1, p2, p3, fn, p5) {
  return function (param) {
    return fn(p1, p2, p3, param, p5);
  };
}

//构建可运行的模板函数
function tmplWrap(configs, main) {
  return function (data) {
    var args = arguments,
      len = args.length,
      data;

    if (len <= 0) {
      data = {};
    }
    else if (len === 1) {
      data = args[0];
    }
    else {
      data = [];
      for (var i = 0; i < len; i++) {
        data[data.length] = args[i];
      }
    }

    var ret = main(configs, { data: data, parent: this ? this.parent : null }, { multiData: nj.isArray(data) });
    if (!configs.useString && tools.isArray(ret)) {  //组件最外层必须是单一节点对象
      ret = ret[0];
    }

    return ret;
  };
}

//创建模板函数
function template(fns) {
  var configs = {
    useString: fns.useString,
    exprs: nj.exprs,
    filters: nj.filters,
    getDatasValue: nj.getDatasValue,
    noop: nj.noop,
    lightObj: nj.lightObj,
    throwIf: nj.throwIf,
    warn: nj.warn,
    getItemParam: nj.getItemParam,
    styleProps: nj.styleProps,
    assign: nj.assign,
    exprRet: nj.exprRet
  };

  if (!configs.useString) {
    configs.compPort = nj.componentPort;
    configs.compLib = nj.componentLibObj;
    configs.compClass = nj.componentClasses;
  }
  else {
    configs.assignStringProp = nj.assignStringProp;
    configs.escape = nj.escape;
  }

  tools.each(fns, function (v, k) {
    if (k.indexOf('main') === 0) {  //将每个主函数构建为可运行的模板函数
      configs[k] = tmplWrap(configs, v);
    }
    else if (k.indexOf('fn') === 0) {  //块表达式函数
      configs[k] = v;
    }
  }, false, false);

  return configs;
}

module.exports = {
  transformParams: transformParams,
  transformParamsToObj: transformParamsToObj,
  replaceParams: replaceParams,
  getDataValue: getDataValue,
  getItemParam: getItemParam,
  setObjParam: setObjParam,
  getExprParam: getExprParam,
  getDatasValue: getDatasValue,
  fixPropName: fixPropName,
  styleProps: styleProps,
  assignStringProp: assignStringProp,
  exprRet: exprRet,
  tmplWrap: tmplWrap,
  template: template
};