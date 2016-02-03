'use strict';

var nj = require('../core'),
    escape = require('./escape'),
    arrayEvery = Array.prototype.every;

//判断是否为数组
function isArray(obj) {
    return Array.isArray(obj);
}

//判断是否为对象
function isObject(obj) {
    var type = typeof obj;
    return !isArray(obj) && (type === 'function' || type === 'object' && !!obj);
}

//判断是否为字符串
function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

//获取属性值
function getProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}

//是否为类数组
var getLength = getProperty('length');
function isArrayLike(obj) {
    var length = getLength(obj);
    return typeof length == 'number' && length >= 0;
}

//遍历数组或对象
function each(obj, func, context) {
    if (!obj) {
        return;
    }

    //设置回调函数上下文
    context = context ? context : obj;

    if (isArrayLike(obj)) {
        arrayEvery.call(obj, function (o, i, arr) {
            var ret = func.call(context, o, i, arr);

            if (ret === false) {
                return ret;
            }
            return true;
        });
    }
    else {
        var keys = Object.keys(obj);
        arrayEvery.call(keys, function (o, i) {
            var key = keys[i],
                ret = func.call(context, obj[key], key, obj);

            if (ret === false) {
                return ret;
            }
            return true;
        });
    }
}

//判断是否在数组内
function inArray(obj, value) {
    return obj.indexOf(value);
}

//去除字符串空格
function trim(str) {
    if (!!!str) {
        return '';
    }

    return str.trim();
}

//抛出异常
function throwIf(val, msg) {
    if (!val) {
        throw Error(msg || val);
    }
}

//转换节点参数为字符串
function transformParams(obj, data, parent) {
    var ret = "";
    each(obj, function (v, k) {
        ret += " " + k + "='" + replaceParams(v, data, null, null, parent) + "'";
    });

    return ret;
}

//转换节点参数为对象
function transformParamsToObj(obj, data, parent) {
    var ret = obj ? {} : null;
    each(obj, function (v, k) {
        replaceParams(v, data, ret, k, parent);
    });

    return ret;
}

//设置对象参数
function setObjParam(obj, key, value, notTran) {
    var style;
    if (!notTran && nj.componentLib === "react") {
        switch (key) {
            case "class":
                key = "className";
                break;
            case "for":
                key = "htmlFor";
                break;
            case "style":
            case nj.tagStyle:
                key = "style";
                style = getStyleParams(value);
                break;
        }
    }

    obj[key] = style != null ? style : value;
}

//Use filters
function _useFilters(filters, ret) {
    if (filters) {
        var filtersObj = nj.filters;
        each(filters, function (k) {
            var filter = filtersObj[k.toLowerCase()];
            if (filter) {
                ret = filter(ret);
            }
        });
    }

    return ret;
}

//获取data值
function getDataValue(data, prop, parent) {
    if (data == null) {
        return;
    }

    var isArr = isArray(data),
        filters;
    if (prop.indexOf(":") >= 0) {  //prop中有分隔线时使用过滤器
        filters = prop.split(":");
        prop = filters[0];
        filters = filters.slice(1);
    }
    if (prop === ".") {  //prop为点号时直接使用data作为返回值
        return _useFilters(filters, isArr ? data[0] : data);
    }

    var list, ret,
        filtersObj = nj.filters;

    if (parent && prop.indexOf("../") > -1) {  //According to the param path to get data
        prop = prop.replace(/\.\.\//g, function () {
            var _parent = parent.parent;
            throwIf(_parent, "Parent data is undefined, please check the param path declare.");
            parent = _parent;
            list = [parent.data];
            return "";
        });
    }
    else if (isArr) {  //The data param is array
        list = data;
    }
    else {
        list = [data];
    }

    each(list, function (obj) {
        if (obj) {
            ret = obj[prop];

            //Use filters
            ret = _useFilters(filters, ret);

            if (ret != null) {
                return false;
            }
        }
    });

    return ret;
}

//获取each块中的item参数
function getItemParam(item, data) {
    var ret = item;
    if (isArray(data)) {
        ret = [item].concat(data.slice(1));
    }

    return ret;
}

//替换参数字符串
function replaceParams(value, data, newObj, newKey, parent) {
    var params = getReplaceParam(value),
        useObj = isObject(newObj),  //newObj的值可能为对象或布尔值,此处判断是否为对象
        isAll;

    if (params) {
        each(params, function (param) {
            var placeholder = param[0],
                prop = param[2],
                dataProp = getDataValue(data, prop, parent),
                isAll = placeholder === value;

            //参数为字符串时,须做特殊字符转义
            if (dataProp
                && !newObj                  //Only in transform to string need escape
                && param[1].length < 2) {   //Only in the opening brace's length less than 2 need escape
                dataProp = escape(dataProp);
            }

            //如果参数只存在占位符,则可传引用参数
            if (isAll) {
                if (useObj) {  //在新对象上创建属性
                    setObjParam(newObj, newKey, dataProp);
                }

                value = dataProp;
            }
            else {  //逐个替换占位符
                value = value.replace(new RegExp(placeholder, "ig"), dataProp);
            }
        });
    }

    //存在多个占位符的情况
    if (useObj && !isAll) {
        setObjParam(newObj, newKey, value);
    }

    return value;
}

//提取替换参数
function getReplaceParam(obj) {
    var pattern = /({+)([^"'\s{}]+)}+/g,
        matchArr,
        ret;

    while ((matchArr = pattern.exec(obj))) {
        if (!ret) {
            ret = [];
        }
        ret.push(matchArr);
    }

    return ret;
}

//提取xml open tag
function getXmlOpenTag(obj) {
    return /^<([a-z][-a-z0-9_:.]*)[^>]*>$/i.exec(obj);
}

//验证xml self close tag
function isXmlSelfCloseTag(obj) {
    return /^<[^>]+\/>$/i.test(obj);
}

//提取xml open tag内参数
function getOpenTagParams(obj, noXml) {
    var pattern = /([^\s=]+)=((['"][^"']+['"])|(['"]?[^"'\s]+['"]?))/g,  //如果属性值中有空格,则必须加引号
        matchArr,
        ret;

    while ((matchArr = pattern.exec(obj))) {
        if (!ret) {
            ret = [];
        }

        var key = matchArr[1],
            value = matchArr[2].replace(/['"]+/g, ""),  //去除引号
            len = value.length;

        //去除末尾的"/>"或">"
        if (!noXml) {
            if (value.lastIndexOf("/>") === len - 2) {
                value = value.replace(/\/>/, "");
            }
            else if (value.lastIndexOf(">") === len - 1) {
                value = value.replace(/>/, "");
            }
        }
        ret.push({ key: key, value: value });
    }

    return ret;
}

//判断xml close tag
function isXmlCloseTag(obj, tagName) {
    return isString(obj) && obj.toLowerCase() === "</" + tagName + ">";
}

//提取open tag
function getOpenTag(obj) {
    return /^[a-z][-a-z0-9_:.]*/i.exec(obj);
}

//验证self close tag
function isSelfCloseTag(obj) {
    return /\/$/i.test(obj);
}

//判断close tag
function isCloseTag(obj, tagName) {
    return isString(obj) && obj.toLowerCase() === "/" + tagName.toLowerCase();
}

//提取流程控制块refer值
function getControlRefer(obj) {
    return /{([^"'\s{}]+)}/i.exec(obj);
}

//判断流程控制块并返回refer值
function isControl(obj) {
    var ret, ret1 = /^\$(if|each|tmpl)/i.exec(obj);
    if (ret1) {
        ret = [ret1[1]];

        var ret2 = getControlRefer(obj);  //提取refer值
        if (ret2) {
            ret.push(ret2[1]);
        }
    }

    return ret;
}

//判断流程控制块close tag
function isControlCloseTag(obj, tagName) {
    return isString(obj) && obj === "/$" + tagName;
}

//判断是否模板元素
function isTmpl(obj) {
    return obj === "tmpl";
}

//加入到模板集合中
function addTmpl(node, parent) {
    var paramsP = parent.params;
    if (!paramsP) {
        paramsP = parent.params = {};
    }

    var tmpls = paramsP.tmpls;
    if (!paramsP.tmpls) {
        tmpls = paramsP.tmpls = [];
    }

    tmpls.push(node);
}

//获取标签组件名
function getTagComponentName(el) {
    var namespace = nj.tagNamespace,
        tagName = el.tagName.toLowerCase();

    if (tagName.indexOf(namespace + ":") === 0) {
        tagName = tagName.split(":")[1];
    }

    return tagName;
}

//提取style内参数
function getStyleParams(obj) {
    //参数为字符串
    var pattern = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g,
        matchArr,
        ret;

    while ((matchArr = pattern.exec(obj))) {
        var key = matchArr[1].toLowerCase(),
            value = matchArr[2];

        if (!ret) {
            ret = {};
        }

        //将连字符转为驼峰命名
        if (key.indexOf("-") > -1) {
            key = key.replace(/-\w/g, function (letter) {
                return letter.substr(1).toUpperCase();
            });
        }

        ret[key] = value;
    }

    return ret;
}

//获取标签组件所有属性
function getTagComponentAttrs(el) {
    var attrs = el.attributes,
        ret;

    each(attrs, function (obj) {
        var attrName = obj.nodeName;
        if (attrName !== nj.tagId && obj.specified) {  //此处如不判断specified属性,则低版本IE中会列出所有可能的属性
            var val = obj.nodeValue;
            if (!ret) {
                ret = {};
            }

            if (attrName === "style") {  //style属性使用cssText
                val = el.style.cssText;
            }
            else if (attrName.indexOf("on") === 0) {  //以on开头的属性统一转换为驼峰命名
                attrName = attrName.replace(/on\w/, function (letter) {
                    return "on" + letter.substr(2).toUpperCase();
                });
            }

            setObjParam(ret, attrName, val, true);
        }
    });

    return ret;
}

//判断标签流程控制块
function isTagControl(obj) {
    return /^(if|each|else|tmpl)$/i.test(obj);
}

//获取全部标签组件
function getTagComponents(el) {
    if (!el) {
        el = document;
    }

    return el.querySelectorAll("." + nj.tagClassName);
}

var tools = {
    isArray: isArray,
    isArrayLike: isArrayLike,
    isObject: isObject,
    isString: isString,
    each: each,
    inArray: inArray,
    trim: trim,
    throwIf: throwIf,
    replaceParams: replaceParams,
    transformParams: transformParams,
    transformParamsToObj: transformParamsToObj,
    getXmlOpenTag: getXmlOpenTag,
    isXmlCloseTag: isXmlCloseTag,
    getOpenTag: getOpenTag,
    isCloseTag: isCloseTag,
    getOpenTagParams: getOpenTagParams,
    isXmlSelfCloseTag: isXmlSelfCloseTag,
    isSelfCloseTag: isSelfCloseTag,
    getControlRefer: getControlRefer,
    isControl: isControl,
    isControlCloseTag: isControlCloseTag,
    getTagComponentName: getTagComponentName,
    getTagComponentAttrs: getTagComponentAttrs,
    isTagControl: isTagControl,
    getTagComponents: getTagComponents,
    getDataValue: getDataValue,
    getItemParam: getItemParam,
    isTmpl: isTmpl,
    addTmpl: addTmpl
};

//部分函数绑定到nj对象
nj.isArray = isArray;
nj.isArrayLike = isArrayLike;
nj.isObject = isObject;
nj.isString = isString;
nj.each = each;
nj.inArray = inArray;
nj.trim = trim;

module.exports = tools;