'use strict';

var utils = require('../utils/utils');

//转换节点为字符串
function transformToString(obj, data, parent) {
    var ret = "",
        controlRefer = obj.refer;

    if (obj.type === "nj_plaintext") {
        //替换插入在文本中的参数
        ret = utils.replaceParams(obj.content[0], data, null, null, parent);
    }
    else if (controlRefer != null) {  //流程控制块
        var dataRefer = utils.getDataValue(data, controlRefer, parent);

        switch (obj.type) {
            case "nj_if":
                ret = transformContentToString(!!dataRefer ? obj.content : obj.contentElse, data, parent);
                break;
            case "nj_each":
                if (dataRefer && dataRefer.length) {
                    utils.each(dataRefer, function (item) {
                        var _parent = {  //Create a parent data object
                            data: item,
                            parent: parent
                        };
                        ret += transformContentToString(obj.content, utils.getItemParam(item, data), _parent);
                    });
                }
                else if (obj.hasElse) {
                    ret = transformContentToString(obj.contentElse, data, parent);
                }
                break;
        }
    }
    else {
        var openTag = "<" + obj.type + utils.transformParams(obj.params, data, parent);
        if (!obj.selfCloseTag) {
            ret = openTag + ">" + transformContentToString(obj.content, data, parent) + "</" + obj.type + ">";
        }
        else {  //自闭合标签
            ret = openTag + "/>";
        }
    }

    return ret;
}

//转换子节点为字符串
function transformContentToString(content, data, parent) {
    var ret = "";
    if (!content) {
        return ret;
    }
    if(!parent && data) {  //Init a parent data object and cascade pass on the children node
        parent = {
            data: utils.isArray(data) ? data[0] : data
        };
    }

    utils.each(content, function (obj) {
        ret += transformToString(obj, data, parent);
    });

    return ret;
}

module.exports = {
    transformToString: transformToString,
    transformContentToString: transformContentToString
};