'use strict';

var nj = require('../core'),
  utils = require('../utils/utils'),
  transformContentToComponent = require('./transformContent')(transformToComponent),  //转换子节点为组件节点
  errorTitle = nj.errorTitle;

//转换节点为组件节点
function transformToComponent(obj, data, parent, paramsExpr) {
  var ret = null;

  if (obj.type === 'nj_plaintext') {
    //替换插入在文本中的参数
    ret = utils.replaceParams(obj.content[0], data, true, false, parent, false);

    //执行模板数据
    if (utils.isObject(ret) && ret.expr === 'tmpl') {
      ret = transformContentToComponent(ret.content, data, parent);
    }
  }
  else if (obj.type === 'nj_expr') {  //Expression block
    var dataRefer = utils.getExprParam(obj.refer, data, parent, false),
      hasElse = obj.hasElse,
      expr = nj.exprs[obj.expr],
      itemIsArray;

    utils.throwIf(expr, errorTitle + 'Expression "' + obj.expr + '" is undefined, please check it has been registered.');

    //Create expression's context object and set parameters
    var thisObj = utils.lightObj();
    thisObj.data = data;
    if (parent) {
      thisObj.parent = parent.parent;
      thisObj.index = parent.index;
    }
    thisObj.useString = false;
    thisObj.paramsExpr = paramsExpr;
    thisObj.result = function (param) {
      if (param && param.loop) {
        if (itemIsArray == null) {
          itemIsArray = utils.isArray(data);
        }

        //Create a parent data object
        var _parent = utils.lightObj();
        _parent.data = param.item;
        _parent.parent = parent;
        _parent.index = param.index;

        return transformContentToComponent(obj.content, utils.getItemParam(param.item, data, itemIsArray), _parent, paramsExpr);
      }
      else {
        return transformContentToComponent(obj.content, data, parent, paramsExpr);
      }
    };
    thisObj.inverse = function () {
      return hasElse ? transformContentToComponent(obj.contentElse, data, parent, paramsExpr) : null;
    };

    //Execute expression block
    ret = expr.apply(thisObj, dataRefer);
  }
  else {
    //如果有相应组件,则使用组件类作为type值
    var componentClass = nj.componentClasses[obj.type.toLowerCase()],
      type = componentClass ? componentClass : obj.type;

    //If typeRefer isn't undefined,use it to replace the node type.
    if (obj.typeRefer) {
      var typeRefer = utils.replaceParams(obj.typeRefer, data, true, false, parent, false);
      if (typeRefer) {
        type = typeRefer;
      }
    }

    //Make parameters from the parameters expression.
    var exprP = obj.paramsExpr,
      paramsE;
    if (exprP) {
      paramsE = utils.lightObj();
      transformContentToComponent(exprP.content, data, parent, paramsE);
    }

    //Make React.createElement's parameters
    var params = [type,                                                  //组件名
      utils.transformParamsToObj(obj.params, data, parent, paramsE)],    //参数
      content = transformContentToComponent(obj.content, data, parent);  //子组件
    if (content) {
      utils.listPush(params, content);
    }

    //调用创建组件接口,必须需要用apply以多个参数的形式传参,否则在react中,元素放在数组里时会报需要加key属性的警告
    ret = nj.componentPort.apply(nj.componentLibObj, params);
  }

  return ret;
}

function __transformToComponent(data) {
  var useString = false;
  var compPort = nj.componentPort,
    compLib = nj.componentLibObj;

  var parent = utils.lightObj();
  var __parent_0 = parent;
  var __data_0 = data;
  if (data) {
    parent.data = utils.isArray(data) ? data[0] : data;
  }

  var compType0 = nj.componentClasses.div,
    type0 = compType0 ? compType0 : 'div';

  var compParam0 = [type0, null];

  /* div子节点开始 */
  var dataRefer0 = data.arr;

  var expr0 = nj.exprs['each'],
    __itemIsArray0_0;

  utils.throwIf(expr0, errorTitle + 'Expression "each" is undefined, please check it has been registered.');

  var thisObj0 = utils.lightObj();
  thisObj0.data = data;
  thisObj0.parent = parent.parent;
  thisObj0.index = parent.index;
  thisObj0.useString = useString;
  thisObj0.result = function (param) {
    if (__itemIsArray0_0 == null) {
      __itemIsArray0_0 = utils.isArray(__data_0);
    }
    
    var parent = utils.lightObj();
    var __parent_1 = parent;
    parent.data = param.item;
    parent.parent = __parent_0;
    parent.index = param.index;
    var data = utils.getItemParam(param.item, __data_0, __itemIsArray0_0);
    var __data_1 = data;

    var ret = [];

    /* span开始 */
    var compType0 = nj.componentClasses.span,
      type0 = compType0 ? compType0 : 'span';

    var params0 = {
      className: 'test_' + parent.index,
      style: parent.parent.data.styles,
      onClick: parent.parent.data.onClick
    };

    var compParam0 = [type0, params0];

    /* test_{../num} */
    compParam0.push('test_' + parent.parent.data.num);

    /* <$each {../list2}>开始 */
    var dataRefer0 = parent.parent.data.list2;

    var expr0 = nj.exprs['each'],
      __itemIsArray0_1;

    utils.throwIf(expr0, errorTitle + 'Expression "each" is undefined, please check it has been registered.');

    var thisObj0 = utils.lightObj();
    thisObj0.data = data;
    thisObj0.parent = parent.parent;
    thisObj0.index = parent.index;
    thisObj0.useString = useString;
    thisObj0.result = function (param) {
      if (__itemIsArray0_1 == null) {
        __itemIsArray0_1 = utils.isArray(__data_1);
      }

      var parent = utils.lightObj();
      var __parent_2 = parent;
      parent.data = param.item;
      parent.parent = __parent_1;
      parent.index = param.index;
      var data = utils.getItemParam(param.item, __data_1, __itemIsArray0_1);
      var __data_2 = data;

      var compType0 = nj.componentClasses.div,
        type0 = compType0 ? compType0 : 'div';

      var params0 = {};
      var __paramsE0_2 = utils.lightObj();

      /* $params块开始 */
      var valueF0 = parent.parent.index;

      var filter0 = nj.filters['five'];
      if (!filter0) {
        console.warn(errorTitle + 'A filter called five is undefined.');
      }
      else {
        var thisObjF0 = utils.lightObj();
        thisObjF0.data = data;
        thisObjF0.parent = parent.parent;
        thisObjF0.index = parent.index;
        thisObjF0.useString = useString;

        valueF0 = filter0.apply(thisObjF0, [valueF0]);
      }

      var dataRefer0 = valueF0;

      var expr0 = nj.exprs['if'],
        __itemIsArray0_2;

      utils.throwIf(expr0, errorTitle + 'Expression "if" is undefined, please check it has been registered.');

      var thisObj0 = utils.lightObj();
      thisObj0.data = data;
      thisObj0.parent = parent.parent;
      thisObj0.index = parent.index;
      thisObj0.useString = useString;
      thisObj0.result = function (param) {
        var dataRefer0 = 'name';

        var expr0 = nj.exprs['param'],
          __itemIsArray0_3;

        utils.throwIf(expr0, errorTitle + 'Expression "param" is undefined, please check it has been registered.');

        var thisObj0 = utils.lightObj();
        thisObj0.data = data;
        thisObj0.parent = parent.parent;
        thisObj0.index = parent.index;
        thisObj0.useString = useString;
        thisObj0.paramsExpr = __paramsE0_2;
        thisObj0.result = function (param) {
          return 'five';
        };

        return expr0.apply(thisObj0, [dataRefer0]);
      };
      thisObj0.inverse = function () {
        return null;
      };

      expr0.apply(thisObj0, [dataRefer0]);
      /* $params块结束 */

      if (__paramsE0_2) {
        utils.assign(params0, __paramsE0_2);
      }

      var compParam0 = [type0, params0];

      /* span开始 */
      var compType1 = nj.componentClasses.span,
        type1 = compType1 ? compType1 : 'span';

      var compParam1 = [type1, null];
      compParam1.push('span' + parent.index);

      compParam0.push(compPort.apply(compLib, compParam1));
      /* span结束 */

      /* i开始 */
      var compType2 = nj.componentClasses.i,
        type2 = compType2 ? compType2 : 'i';

      var compParam2 = [type2, null];
      compParam2.push(parent.index);

      compParam0.push(compPort.apply(compLib, compParam2));
      /* i结束 */

      return compPort.apply(compLib, compParam0);
    };
    thisObj0.inverse = function () {
      return null;
    };

    utils.listPush(compParam0, expr0.apply(thisObj0, [dataRefer0]), true, true);
    /* <$each {../list2}>结束 */

    ret.push(compPort.apply(compLib, compParam0));
    /* span结束 */

    /* if开始 */
    var valueF0 = parent.index;

    var filter0 = nj.filters['five'];
    if (!filter0) {
      console.warn(errorTitle + 'A filter called five is undefined.');
    }
    else {
      var thisObjF0 = utils.lightObj();
      thisObjF0.data = data;
      thisObjF0.parent = parent.parent;
      thisObjF0.index = parent.index;
      thisObjF0.useString = useString;

      valueF0 = filter0.apply(thisObjF0, [valueF0, '1']);
    }

    var filter1 = nj.filters['test'];
    if (!filter1) {
      console.warn(errorTitle + 'A filter called test is undefined.');
    }
    else {
      var thisObjF1 = utils.lightObj();
      thisObjF1.data = data;
      thisObjF1.parent = parent.parent;
      thisObjF1.index = parent.index;
      thisObjF1.useString = useString;

      valueF0 = filter1.apply(thisObjF1, [valueF0]);
    }

    var dataRefer1 = valueF0;

    var expr1 = nj.exprs['if'],
      __itemIsArray1_1;

    utils.throwIf(expr1, errorTitle + 'Expression "if" is undefined, please check it has been registered.');

    var thisObj1 = utils.lightObj();
    thisObj1.data = data;
    thisObj1.parent = parent.parent;
    thisObj1.index = parent.index;
    thisObj1.useString = useString;
    thisObj1.result = function (param) {
      var compType0 = nj.componentClasses.br,
        type0 = compType0 ? compType0 : 'br';

      var compParam0 = [type0, null];

      return compPort.apply(compLib, compParam0);
    };
    thisObj1.inverse = function () {
      var compType0 = nj.componentClasses.img,
        type0 = compType0 ? compType0 : 'img';

      var compParam0 = [type0, null];

      return compPort.apply(compLib, compParam0);
    };

    utils.listPush(ret, expr1.apply(thisObj1, [dataRefer1]), true, true);
    /* if结束 */

    return ret;
  };
  thisObj0.inverse = function () {
    return null;
  };

  utils.listPush(compParam0, expr0.apply(thisObj0, [dataRefer0]), true, true);
  /* div子节点结束 */

  return compPort.apply(compLib, compParam0);
}

module.exports = {
  transformToComponent: transformToComponent,
  transformContentToComponent: transformContentToComponent,
  __transformToComponent: __transformToComponent
};