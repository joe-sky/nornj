'use strict';

var nj = require('../core'),
  tools = require('../utils/tools'),
  escape = require('../utils/escape'),
  errorTitle = nj.errorTitle;

//转换节点参数为字符串
function transformParams(obj, data, parent) {
  var ret = '';
  tools.each(obj, function (v, k) {
    ret += ' ' + k + '="' + replaceParams(v, data, false, false, parent) + '"';
  }, false, false);

  return ret;
}

//转换节点参数为对象
function transformParamsToObj(obj, data, parent) {
  var ret = obj ? {} : null;
  tools.each(obj, function (v, k) {
    replaceParams(v, data, ret, k, parent);
  }, false, false);

  return ret;
}

//设置对象参数
function setObjParam(obj, key, value, notTran) {
  var style;
  if (!notTran && nj.componentLib === 'react') {
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
        style = _getStyleParams(value);
        break;
    }
  }

  obj[key] = style != null ? style : value;
}

//提取style内参数
function _getStyleParams(obj) {
  //If the parameter is a style object,then direct return.
  if (tools.isObject(obj)) {
    return obj;
  }

  //参数为字符串
  var pattern = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g,
    matchArr, ret;

  while ((matchArr = pattern.exec(obj))) {
    var key = matchArr[1].toLowerCase(),
      value = matchArr[2];

    if (!ret) {
      ret = {};
    }

    //将连字符转为驼峰命名
    if (key.indexOf('-') > -1) {
      key = key.replace(/-\w/g, function (letter) {
        return letter.substr(1).toUpperCase();
      });
    }

    ret[key] = value;
  }

  return ret;
}

//Use filters
function _useFilters(filters, ret, data, parent, index) {
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
      ret = filter.apply(thisObj, params);
    }, false, true);
  }

  return ret;
}

//获取data值
function getDataValue(data, propObj, parent, defaultEmpty) {
  if (data == null) {
    return;
  }

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
    ret = _useFilters(filters, prop, datas, dataP, index);
  }
  else if (prop === '.') {  //prop为点号时直接使用data作为返回值
    ret = _useFilters(filters, isArr ? data[0] : data, datas, dataP, index);
  }
  else if (prop === '#') {  //Get current item index
    ret = _useFilters(filters, index, datas, dataP, index);
  }
  else {
    tools.each(datas, function (obj) {
      if (obj) {
        ret = obj[prop];

        //Use filters
        ret = _useFilters(filters, ret, datas, dataP, index);

        if (ret != null) {
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
function replaceParams(valueObj, data, newObj, newKey, parent) {
  var props = valueObj.props,
    strs = valueObj.strs,
    isAll = valueObj.isAll,
    useObj = tools.isObject(newObj),  //newObj的值可能为对象或布尔值,此处判断是否为对象
    value = strs[0];

  if (props) {
    tools.each(props, function (propObj, i) {
      var dataProp = getDataValue(data, propObj.prop, parent, !newObj);

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

  return value;
}

//Get expression parameter
function getExprParam(refer, data, parent) {
  var ret = [];
  tools.each(refer.props, function (propObj, i) {
    ret.push(getDataValue(data, propObj.prop, parent));
  }, false, true);

  return ret;
}

module.exports = {
  transformParams: transformParams,
  transformParamsToObj: transformParamsToObj,
  replaceParams: replaceParams,
  getDataValue: getDataValue,
  getItemParam: getItemParam,
  setObjParam: setObjParam,
  getExprParam: getExprParam
};