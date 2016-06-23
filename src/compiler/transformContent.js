'use strict';

var utils = require('../utils/utils');

module.exports = function (transformNode, useString) {
  return function (content, data, parent, paramsExpr) {
    var ret = null;
    if (useString) {
      ret = '';
    }

    if (!content) {
      return ret;
    }
    if (!parent) {  //Init a parent data object and cascade pass on the children node
      parent = utils.lightObj();
      if (data) {
        parent.data = utils.isArray(data) ? data[0] : data;
      }
    }

    if (!useString) {
      ret = [];
    }
    utils.each(content, function (obj) {
      var retN = transformNode(obj, data, parent, paramsExpr);
      if (!useString) {
        utils.listPush(ret, retN, true, true);
      }
      else {
        ret += retN;
      }
    }, false, true);

    return ret;
  };
};