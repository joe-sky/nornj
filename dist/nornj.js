(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NornJ = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],2:[function(require,module,exports){
'use strict';

var nj = require('./core'),
    utils = require('./utils/utils'),
    setComponentEngine = utils.setComponentEngine,
    compiler = require('./compiler/compile'),
    compileStringTmpl = require('./checkElem/checkStringElem');

nj.setComponentEngine = setComponentEngine;
nj.compile = compiler.compile;
nj.compileComponent = compiler.compileComponent;
nj.compileTagComponent = compiler.compileTagComponent;
nj.renderTagComponent = compiler.renderTagComponent;
nj.registerComponent = utils.registerComponent;
nj.registerFilter = utils.registerFilter;
nj.compileStringTmpl = compileStringTmpl;

//创建标签命名空间
utils.createTagNamespace();

//默认使用react作为组件引擎
if (typeof React !== "undefined") {
    setComponentEngine("react", React, typeof ReactDOM !== "undefined" ? ReactDOM : null);
}

var global = typeof self !== "undefined" ? self : this;
module.exports = global.NornJ = global.nj = nj;
},{"./checkElem/checkStringElem":4,"./compiler/compile":6,"./core":9,"./utils/utils":15}],3:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    tools = require('../utils/tools'),
    checkTagElem = require('./checkTagElem');

//检测元素节点
function checkElem(obj, parent) {
    var node = {},
        parentContent = !parent.hasElse ? "content" : "contentElse";

    if (!tools.isArray(obj)) {
        if (tools.isString(obj)) {  //判断是否为文本节点
            node.type = "nj_plaintext";
            node.content = [obj];
            parent[parentContent].push(node);
        }

        return;
    }

    var first = obj[0];
    if (tools.isString(first)) {  //第一个子节点为字符串
        var first = first,
            len = obj.length,
            last = obj[len - 1],
            isElemNode = false,
            control;

        //判断是否为xml标签
        var xmlOpenTag = tools.getXmlOpenTag(first),
            openTagName,
            hasCloseTag = false,
            isTmpl;

        if (xmlOpenTag) {  //tagname为xml标签时,则认为是元素节点
            openTagName = xmlOpenTag[1];

            if (!tools.isXmlSelfCloseTag(first)) {  //非自闭合标签才验证是否存在关闭标签
                hasCloseTag = tools.isXmlCloseTag(last, openTagName);
            }
            else {  //自闭合标签
                node.selfCloseTag = true;
            }
            isElemNode = true;
        }
        else {
            control = tools.isControl(first);
            if (!control) {  //tagname不为xml标签时,必须有结束标签才认为是元素节点
                var openTag = tools.getOpenTag(first);
                if (openTag) {
                    openTagName = openTag[0];

                    if (!tools.isSelfCloseTag(first)) {  //非自闭合标签
                        hasCloseTag = tools.isCloseTag(last, openTagName);
                        if (hasCloseTag) {
                            isElemNode = true;
                        }
                    }
                    else {  //如果是自闭合标签则直接认为是元素节点
                        node.selfCloseTag = true;
                        isElemNode = true;
                    }
                }
            }
            else {  //为特殊节点,也可视为一个元素节点
                var ctrl = control[0].toLowerCase(),
                    refer = control[1];
                isTmpl = tools.isTmpl(ctrl);

                node.type = "nj_" + ctrl;
                if (refer != null) {
                    node.refer = refer;
                }

                if (tools.isControlCloseTag(last, ctrl)) {  //判断是否有流程控制块闭合标签
                    hasCloseTag = true;
                }
                isElemNode = true;
            }
        }

        if (isElemNode) {  //判断是否为元素节点
            var hasParams = false,
                elseIndex = -1,
                pushContent = true;

            //取出节点参数
            var params = obj[1];
            if (tools.isObject(params)) {  //如果第二个参数为对象,则为节点参数
                if (!control) {  //为元素节点时取各参数
                    node.params = params;
                }
                else {  //为特殊节点时取refer
                    var retR = tools.getInsideBraceParam(params.refer);
                    node.refer = retR ? retR[1] : params.refer;
                }

                hasParams = true;
            }

            if (!control) {
                node.type = openTagName;

                //If open tag has a brace,add the typeRefer param.
                var typeRefer = tools.getInsideBraceParam(openTagName);
                if(typeRefer) {
                    node.typeRefer = typeRefer[1];
                }

                //获取openTag内参数
                var tagParams = tools.getOpenTagParams(first, !xmlOpenTag);
                if (tagParams) {
                    if (!node.params) {
                        node.params = {};
                    }
                
                    tools.each(tagParams, function (param) {
                        node.params[param.key] = param.value;
                    });
                }
            }
            else {  //为流程控制块时判断是否有$else
                if (isTmpl) {  //模板元素
                    pushContent = false;

                    //将模板添加到父节点的params中
                    tools.addTmpl(node, parent);
                }
                else {
                    elseIndex = tools.inArray(obj, "$else");
                }
            }

            //放入父节点content内
            if(pushContent) {
                parent[parentContent].push(node);
            }

            //取出子节点集合
            // TODO 此处需要判断参数外是否包裹有流程控制块
            var end = len - (hasCloseTag ? 1 : 0),
                content = obj.slice(hasParams ? 2 : 1, (elseIndex < 0 ? end : elseIndex));
            if (content && content.length) {
                checkContentElem(content, node);
            }

            //如果有$else,则将$else后面的部分存入content_else集合中
            if (elseIndex >= 0) {
                var contentElse = obj.slice(elseIndex + 1, end);
                node.hasElse = true;

                if (contentElse && contentElse.length) {
                    checkContentElem(contentElse, node);
                }
            }
        }
        else {  //如果不是元素节点,则为节点集合
            checkContentElem(obj, parent);
        }
    }
    else if (tools.isArray(first)) {  //如果第一个子节点为数组,则该节点一定为节点集合(可以是多层数组嵌套的集合)
        checkContentElem(obj, parent);
    }
}

//检测子元素节点
function checkContentElem(obj, parent) {
    if (!parent.content) {
        parent.content = [];
    }
    if (parent.hasElse && !parent.contentElse) {
        parent.contentElse = [];
    }

    tools.each(obj, function (item) {
        checkElem(item, parent);
    });
}

module.exports = {
    checkElem: checkElem,
    checkTagElem: checkTagElem
};
},{"../core":9,"../utils/tools":14,"./checkTagElem":5}],4:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    tools = require('../utils/tools'),
    REGEX_CLEAR_NOTES = /<!--[\s\S]*?-->/g,
    REGEX_CLEAR_BLANK = />\s+([^\s<]*)\s+</g,
    REGEX_CHECK_ELEM = /([^>]*)(<([a-z{/$][-a-z0-9_:.{}$]*)[^>]*>)([^<]*)/g,
    REGEX_SPLIT = /\$\{\d+\}/;

//Cache the string template by unique key
nj.strTmpls = {};

//Compile string template
function compileStringTmpl(tmpl) {
    var isStr = tools.isString(tmpl),
        tmplKey;

    //Get unique key
    if (isStr) {
        tmpl = _clearNotesAndBlank(tmpl);
        tmplKey = tools.uniqueKey(tmpl);
    }
    else {
        var fullXml = '';
        tools.each(tmpl, function (xml) {
            fullXml += xml;
        });

        tmplKey = tools.uniqueKey(_clearNotesAndBlank(fullXml));
    }

    //If the cache already has template data,then return the template
    var ret = nj.strTmpls[tmplKey];
    if (ret) {
        return ret;
    }

    var xmls = tmpl,
        args = arguments,
        splitNo = 0,
        params = [];

    ret = '';
    if (isStr) {
        xmls = tmpl.split(REGEX_SPLIT);
    }

    //Connection xml string
    var l = xmls.length;
    tools.each(xmls, function (xml, i) {
        var split = '';
        if(i < l - 1) {
            var arg = args[i + 1];
            if(tools.isString(arg)) {
                split = arg;
            }
            else {
                split = '<nj-split_' + splitNo + ' />';
                params.push(arg);
                splitNo++;
            }
        }

        ret += xml + split;
    });

    //Resolve string to element
    ret = _checkStringElem(isStr ? ret : _clearNotesAndBlank(ret), params);

    //Save to the cache
    nj.strTmpls[tmplKey] = ret;
    return ret;
}

//Resolve string to element
function _checkStringElem(xml, params) {
    var root = [],
        current = {
            elem: root,
            elemName: 'root',
            parent: null
        },
        parent = null,
        matchArr;

    while ((matchArr = REGEX_CHECK_ELEM.exec(xml))) {
        var textBefore = matchArr[1],
            elem = matchArr[2],
            elemName = matchArr[3],
            textAfter = matchArr[4];

        //Text before tag
        if (textBefore) {
            if (/\s/.test(textBefore[textBefore.length - 1])) {
                textBefore = _formatText(textBefore);
            }
            current.elem.push(textBefore);
        }

        //Element tag
        if (elem) {
            if (elemName[0] === '/') {  //Close tag
                if (elemName === '/' + current.elemName) {
                    current = current.parent;
                }
            }
            else if (elem[elem.length - 2] === '/') {  //Self close tag
                current.elem.push(_getSelfCloseElem(elem, elemName, params));
            }
            else {  //Open tag
                parent = current;
                current = {
                    elem: [],
                    elemName: elemName,
                    parent: parent
                };

                parent.elem.push(current.elem);
                current.elem.push(_getElem(elem, elemName));
            }
        }

        //Text after tag
        if (textAfter) {
            if (/\s/.test(textAfter[0])) {
                textAfter = _formatText(textAfter);
            }
            current.elem.push(textAfter);
        }
    }

    return root;
}

function _clearNotesAndBlank(str) {
    return str.replace(REGEX_CLEAR_NOTES, '').replace(REGEX_CLEAR_BLANK, '>$1<').trim();
}

function _formatText(str) {
    return str.replace(/\n/g, '').trim();
}

function _getElem(elem, elemName) {
    switch (elemName) {
        case '$if':
        case '$each':
            return elem.substring(1, elem.length - 1);
        default:
            return elem;
    }
}

//Get self close element
function _getSelfCloseElem(elem, elemName, params) {
    if (elemName.indexOf('nj-split') >= 0) {
        return params[elemName.split('_')[1]];
    }
    else {
        return elemName === '$else' ? elem.substr(1, 5) : [_getElem(elem, elemName)];
    }
}

module.exports = compileStringTmpl;

},{"../core":9,"../utils/tools":14}],5:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    tools = require('../utils/tools');

//检测标签元素节点
function checkTagElem(obj, parent) {
    var node = {},
        nodeType = obj.nodeType,
        nodeValue = tools.trim(obj.nodeValue),
        parentContent = !parent.hasElse ? "content" : "contentElse";

    //处理文本节点
    if (nodeType === 3) {
        if (nodeValue === '') {
            return;
        }

        node.type = "nj_plaintext";
        node.content = [nodeValue];
        parent[parentContent].push(node);

        return;
    }

    //处理元素节点
    if (nodeType === 1) {
        var tagName = tools.getTagComponentName(obj),
            params = tools.getTagComponentAttrs(obj),
            isControl = tools.isTagControl(tagName),
            pushContent = true,
            isTmpl;

        if (isControl) {  //特殊节点
            if(tagName !== "else") {
                node.type = "nj_" + tagName;

                isTmpl = tools.isTmpl(tagName);
                if (isTmpl) {  //模板元素
                    pushContent = false;
                
                    //将模板添加到父节点的params中
                    tools.addTmpl(node, parent);
                }
                else {  //流程控制块
                    var retR = tools.getInsideBraceParam(params.refer);
                    node.refer = retR ? retR[1] : params.refer;
                }
            }
            else {  //else节点
                pushContent = false;

                //将else标签内的子节点放入当前父节点的contentElse中
                node = parent;
                node.hasElse = true;
            }
        }
        else {  //元素节点
            node.type = tagName;
            if (params) {
                node.params = params;
            }
        }

        //放入父节点content内
        if (pushContent) {
            parent[parentContent].push(node);
        }

        //处理子元素
        var childNodes = obj.childNodes;
        if (childNodes && childNodes.length) {
            checkTagContentElem(childNodes, node);
        }
    }
}

//检测标签子元素节点
function checkTagContentElem(obj, parent) {
    if (!parent.content) {
        parent.content = [];
    }
    if (parent.hasElse && !parent.contentElse) {
        parent.contentElse = [];
    }

    tools.each(obj, function (item) {
        checkTagElem(item, parent);
    });
}

module.exports = checkTagElem;
},{"../core":9,"../utils/tools":14}],6:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    utils = require('../utils/utils'),
    tranString = require('./transformToString'),
    tranComponent = require('./transformToComponent');

//编译字面量并返回转换函数
function compile(obj, tmplName, isComponent, isTag) {
    if (!obj) {
        return;
    }

    var root;
    if (tmplName) {
        root = nj.templates[tmplName];
    }
    if (!root) {
        if (utils.isObject(obj) && obj.type === "nj_root") {  //If obj is Object,we think obj is a precompiled template.
            root = obj;
        }
        else {
            root = {
                type: "nj_root",
                content: []
            };

            //分析传入参数并转换为节点树对象
            if (isTag) {
                utils.checkTagElem(obj, root);
            }
            else {
                utils.checkElem(obj, root);
            }
        }

        //保存模板编译结果到全局集合中
        if (tmplName) {
            nj.templates[tmplName] = root;
        }
    }

    return function (data) {
        if (!data) {
            data = {};
        }

        return !isComponent
            ? tranString.transformContentToString(root.content, data)     //转换字符串
            : tranComponent.transformToComponent(root.content[0], data);  //转换组件
    };
}

//编译字面量并返回组件转换函数
function compileComponent(obj, tmplName) {
    return compile(obj, tmplName, true);
}

//编译标签并返回组件转换函数
function compileTagComponent(obj, tmplName) {
    return compile(obj, tmplName, true, true);
}

//渲染标签组件
function renderTagComponent(data, el) {
    var tags = utils.getTagComponents(el),
        ret = [];

    utils.each(tags, function (tag) {
        var tmpl = compileTagComponent(tag, tag.getAttribute(nj.tagId));
        ret.push(nj.componentLibDom[nj.componentRender](tmpl(data), tag.parentNode));
    });

    return ret;
}

module.exports = {
    compile: compile,
    compileComponent: compileComponent,
    compileTagComponent: compileTagComponent,
    renderTagComponent: renderTagComponent
};
},{"../core":9,"../utils/utils":15,"./transformToComponent":7,"./transformToString":8}],7:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    utils = require('../utils/utils');

//转换节点为组件节点
function transformToComponent(obj, data, parent) {
    var ret = null,
        controlRefer = obj.refer;

    if (obj.type === "nj_plaintext") {
        //替换插入在文本中的参数
        ret = utils.replaceParams(obj.content[0], data, true, null, parent);

        //执行模板数据
        if (utils.isObject(ret) && ret.type === "nj_tmpl") {
            ret = transformContentToComponent(ret.content, data, parent);
        }
    }
    else if (controlRefer != null) {  //流程控制块
        var dataRefer = utils.getDataValue(data, controlRefer, parent);

        switch (obj.type) {
            case "nj_if":
                ret = transformContentToComponent(!!dataRefer ? obj.content : obj.contentElse, data, parent);
                break;
            case "nj_each":
                if (dataRefer && dataRefer.length) {
                    ret = [];
                    utils.each(dataRefer, function (item, index) {
                        var _parent = {  //Create a parent data object
                            data: item,
                            parent: parent,
                            index: index
                        };
                        ret.push(transformContentToComponent(obj.content, utils.getItemParam(item, data), _parent));
                    });
                }
                else if (obj.hasElse) {
                    ret = transformContentToComponent(obj.contentElse, data, parent);
                }
                break;
        }
    }
    else {
        //如果有相应组件,则使用组件类作为type值
        var componentClass = nj.componentClasses[obj.type.toLowerCase()],
            type = componentClass ? componentClass : obj.type;

        //If typeRefer isn't undefined,use it replace the node type.
        if (obj.typeRefer) {
            var typeRefer = utils.getDataValue(data, obj.typeRefer, parent);
            if (typeRefer) {
                type = typeRefer;
            }
        }

        //调用创建组件接口,必须需要用apply以多个参数的形式传参,否则在react中,元素放在数组里时会报需要加key属性的警告
        ret = nj.componentLibObj[nj.componentPort].apply(nj.componentLibObj,
            [type,                                                 //组件名
            utils.transformParamsToObj(obj.params, data, parent)].concat(  //参数
            transformContentToComponent(obj.content, data, parent)));      //子组件
    }

    return ret;
}

//转换子节点为组件节点
function transformContentToComponent(content, data, parent) {
    if (!content) {
        return null;
    }
    if (!parent && data) {  //Init a parent data object and cascade pass on the children node
        parent = {
            data: utils.isArray(data) ? data[0] : data
        };
    }

    var ret = [];
    utils.each(content, function (obj) {
        ret.push(transformToComponent(obj, data, parent));
    });

    return ret.length === 1 ? ret[0] : ret;
}

module.exports = {
    transformToComponent: transformToComponent,
    transformContentToComponent: transformContentToComponent
};
},{"../core":9,"../utils/utils":15}],8:[function(require,module,exports){
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
                    utils.each(dataRefer, function (item, index) {
                        var _parent = {  //Create a parent data object
                            data: item,
                            parent: parent,
                            index: index
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
        var type = obj.type;

        //If typeRefer isn't undefined,use it replace the node type.
        if (obj.typeRefer) {
            var typeRefer = utils.escape(utils.getDataValue(data, obj.typeRefer, parent));
            if (typeRefer) {
                type = typeRefer;
            }
        }

        var openTag = "<" + type + utils.transformParams(obj.params, data, parent);
        if (!obj.selfCloseTag) {
            ret = openTag + ">" + transformContentToString(obj.content, data, parent) + "</" + type + ">";
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
    if (!parent && data) {  //Init a parent data object and cascade pass on the children node
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
},{"../utils/utils":15}],9:[function(require,module,exports){
'use strict';

function nj() {
    return nj.compileStringTmpl.apply(null, arguments);
}

nj.componentLib = null;
nj.componentLibObj = null;
nj.componentLibDom = null;
nj.componentPort = null;
nj.componentRender = null;
nj.componentClasses = {};
nj.tagNamespace = "nj";
nj.tagId = "nj-id";
nj.tagStyle = "nj-style";
nj.tagClassName = "nj-component";
nj.templates = {};

module.exports = nj;
},{}],10:[function(require,module,exports){
'use strict';

var ESCAPE_LOOKUP = {
    '&': '&amp;',
    '>': '&gt;',
    '<': '&lt;',
    '"': '&quot;',
    '\'': '&#x27;'
},
ESCAPE_REGEX = /[&><"']/g,
ESCAPE_LOOKUP_BRACKETS = {
    '(': '\\(',
    ')': '\\)'
},
ESCAPE_REGEX_BRACKETS = /[()]/g;

function _escape(regex, lookup) {
    return function (text) {
        if (text == null) {
            return;
        }

        return ('' + text).replace(regex, function (match) {
            return lookup[match];
        });
    };
}

module.exports = {
    escape: _escape(ESCAPE_REGEX, ESCAPE_LOOKUP),
    escapeBrackets: _escape(ESCAPE_REGEX_BRACKETS, ESCAPE_LOOKUP_BRACKETS)
};
},{}],11:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    tools = require('./tools');

//过滤器对象
nj.filters = {
    //Get param properties
    prop: function (obj, props) {
        var ret = obj;
        ret && tools.each(props.split("."), function (p) {
            ret = ret[p];
        });

        return ret;
    },

    //Get list count
    count: function (obj) {
        return obj ? obj.length : 0;
    },

    //Get list item
    item: function (obj, no) {
        return obj ? obj[no] : null;
    }
};

//注册过滤器
function registerFilter(name, filter) {
    var params = name;
    if (!tools.isArray(name)) {
        params = [{ name: name, filter: filter }];
    }

    tools.each(params, function (param) {
        nj.filters[param.name.toLowerCase()] = param.filter;
    });
}

module.exports = {
    registerFilter: registerFilter
};
},{"../core":9,"./tools":14}],12:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    tools = require('./tools');

//注册组件
function registerComponent(name, obj) {
    var params = name;
    if (!tools.isArray(name)) {
        params = [{ name: name, obj: obj }];
    }

    tools.each(params, function (param) {
        nj.componentClasses[param.name.toLowerCase()] = param.obj;
    });
}

//注册组件标签命名空间
function registerTagNamespace(name) {
    nj.tagNamespace = name;
    createTagNamespace();

    //修改标签组件id及类名
    nj.tagId = name + "-id";
    nj.tagStyle = name + "-style";
    nj.tagClassName = name + "-component";
}

//创建标签命名空间
function createTagNamespace() {
    if (typeof document === "undefined") {
        return;
    }

    var doc = document;
    if (doc && doc.namespaces) {
        doc.namespaces.add(nj.tagNamespace, 'urn:schemas-microsoft-com:vml', "#default#VML");
    }
}

module.exports = {
    registerComponent: registerComponent,
    registerTagNamespace: registerTagNamespace,
    createTagNamespace: createTagNamespace
};
},{"../core":9,"./tools":14}],13:[function(require,module,exports){
'use strict';

var nj = require('../core');

//设置组件引擎
function setComponentEngine(name, obj, dom, port, render) {
    nj.componentLib = name;
    nj.componentLibObj = obj;
    nj.componentLibDom = dom || obj;
    if (name === "react") {
        port = "createElement";
        render = "render";
    }
    nj.componentPort = port;
    nj.componentRender = render;
}

module.exports = {
    setComponentEngine: setComponentEngine
};
},{"../core":9}],14:[function(require,module,exports){
'use strict';

var nj = require('../core'),
    escape = require('./escape'),
    assign = require('object-assign'),
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
function _useFilters(filters, ret, data, parent, index) {
    if (filters) {
        var filtersObj = nj.filters;
        each(filters, function (k) {
            var retF = _getFilterParam(k),
                filter = filtersObj[retF[1].toLowerCase()];  //Get filter function

            if (filter) {
                var params = [ret],
                    paramsF = retF[3];  //Get filter param

                //Multiple params are separated by commas.
                if (paramsF) {
                    each(paramsF.split(","), function (p) {
                        params[params.length] = p;
                    });
                }

                ret = filter.apply({
                    data: data,
                    parent: parent,
                    index: index
                }, params);
            }
        });
    }

    return ret;
}

//Get filter param
var REGEX_FILTER_PARAM = /([\w$]+)(\(([^()]+)\))*/;
function _getFilterParam(obj) {
    return REGEX_FILTER_PARAM.exec(obj);
}

//获取data值
function getDataValue(data, prop, parent, defaultEmpty) {
    if (data == null) {
        return;
    }

    var isArr = isArray(data),
        filters, datas, ret, dataP, index;

    //prop中有分隔线时使用过滤器
    if (prop.indexOf(":") >= 0) {
        filters = prop.split(":");
        prop = filters[0];
        filters = filters.slice(1);
    }

    //if inside each block,get the parent data and current index
    if (parent && parent.parent) {
        dataP = parent.parent.data;
        index = parent.index;
    }

    //According to the param path to get data
    if (parent && prop.indexOf("../") > -1) {
        prop = prop.replace(/\.\.\//g, function () {
            var _parent = parent.parent;
            throwIf(_parent, "Parent data is undefined, please check the param path declare.");
            parent = _parent;
            datas = [parent.data];
            return "";
        });
    }
    else if (isArr) {  //The data param is array
        datas = data;
    }
    else {
        datas = [data];
    }

    if (prop === ".") {  //prop为点号时直接使用data作为返回值
        return _useFilters(filters, isArr ? data[0] : data, datas, dataP, index);
    }
    else if (prop === "#") {  //Get current item index
        return _useFilters(filters, index, datas, dataP, index);
    }

    each(datas, function (obj) {
        if (obj) {
            ret = obj[prop];

            //Use filters
            ret = _useFilters(filters, ret, datas, dataP, index);

            if (ret != null) {
                return false;
            }
        }
    });

    //Default set empty
    if (defaultEmpty && ret == null) {
        ret = '';
    }

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
                dataProp = getDataValue(data, prop, parent, !newObj),
                isAll = placeholder === value;

            //参数为字符串时,须做特殊字符转义
            if (dataProp
                && !newObj                  //Only in transform to string need escape
                && param[1].length < 2) {   //Only in the opening brace's length less than 2 need escape
                dataProp = escape.escape(dataProp);
            }

            //如果参数只存在占位符,则可传引用参数
            if (isAll) {
                if (useObj) {  //在新对象上创建属性
                    setObjParam(newObj, newKey, dataProp);
                }

                value = dataProp;
            }
            else {  //逐个替换占位符
                try {
                    value = value.replace(new RegExp(escape.escapeBrackets(placeholder), "ig"), dataProp);
                }
                catch (ex) {
                    console.error('Replace parameter error:' + ex.message);
                }
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
var REGEX_REPLACE_PARAM = /({{1,2})([^"'\s{}]+)}{1,2}/g;
function getReplaceParam(obj) {
    var matchArr,
        ret;

    while ((matchArr = REGEX_REPLACE_PARAM.exec(obj))) {
        if (!ret) {
            ret = [];
        }
        ret.push(matchArr);
    }

    return ret;
}

//提取xml open tag
var REGEX_XML_OPEN_TAG = /^<([a-z{][-a-z0-9_:.}]*)[^>]*>$/i;
function getXmlOpenTag(obj) {
    return REGEX_XML_OPEN_TAG.exec(obj);
}

//验证xml self close tag
var REGEX_XML_SELF_CLOSE_TAG = /^<[^>]+\/>$/i;
function isXmlSelfCloseTag(obj) {
    return REGEX_XML_SELF_CLOSE_TAG.test(obj);
}

//提取xml open tag内参数
var REGEX_OPEN_TAG_PARAMS = /([^\s=]+)=((['"][^"']+['"])|(['"]?[^"'\s]+['"]?))/g;
function getOpenTagParams(obj, noXml) {
    var matchArr,
        ret;

    while ((matchArr = REGEX_OPEN_TAG_PARAMS.exec(obj))) {
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
var REGEX_OPEN_TAG = /^[a-z{][-a-z0-9_:.}]*/i;
function getOpenTag(obj) {
    return REGEX_OPEN_TAG.exec(obj);
}

//验证self close tag
var REGEX_SELF_CLOSE_TAG = /\/$/i;
function isSelfCloseTag(obj) {
    return REGEX_SELF_CLOSE_TAG.test(obj);
}

//判断close tag
function isCloseTag(obj, tagName) {
    return isString(obj) && obj.toLowerCase() === "/" + tagName.toLowerCase();
}

//get inside brace param
var REGEX_INSIDE_BRACE_PARAM = /{([^"'\s{}]+)}/i;
function getInsideBraceParam(obj) {
    return REGEX_INSIDE_BRACE_PARAM.exec(obj);
}

//判断流程控制块并返回refer值
var REGEX_CONTROL = /^\$(if|each|tmpl)/i;
function isControl(obj) {
    var ret, ret1 = REGEX_CONTROL.exec(obj);
    if (ret1) {
        ret = [ret1[1]];

        var ret2 = getInsideBraceParam(obj);  //提取refer值
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
    else if(tagName.indexOf(namespace + "-") === 0) {
        tagName = tagName.split("-")[1];
    }

    return tagName;
}

//提取style内参数
var REGEX_STYLE_PARAMS = /([^\s:]+)[\s]?:[\s]?([^\s;]+)[;]?/g;
function getStyleParams(obj) {
    //参数为字符串
    var matchArr,
        ret;

    while ((matchArr = REGEX_STYLE_PARAMS.exec(obj))) {
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
var REGEX_TAG_CONTROL = /^(if|each|else|tmpl)$/i;
function isTagControl(obj) {
    return REGEX_TAG_CONTROL.test(obj);
}

//获取全部标签组件
function getTagComponents(el) {
    if (!el) {
        el = document;
    }

    return el.querySelectorAll("." + nj.tagClassName);
}

//create a unique key
function uniqueKey(str) {
    var len = str.length;
    if (len == 0) {
        return str;
    }

    var hash = 0, i, chr;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash;
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
    getInsideBraceParam: getInsideBraceParam,
    isControl: isControl,
    isControlCloseTag: isControlCloseTag,
    getTagComponentName: getTagComponentName,
    getTagComponentAttrs: getTagComponentAttrs,
    isTagControl: isTagControl,
    getTagComponents: getTagComponents,
    getDataValue: getDataValue,
    getItemParam: getItemParam,
    isTmpl: isTmpl,
    addTmpl: addTmpl,
    assign: assign,
    uniqueKey: uniqueKey
};
assign(tools, escape);

//部分函数绑定到nj对象
nj.isArray = isArray;
nj.isArrayLike = isArrayLike;
nj.isObject = isObject;
nj.isString = isString;
nj.each = each;
nj.inArray = inArray;
nj.trim = trim;
nj.assign = assign;

module.exports = tools;
},{"../core":9,"./escape":10,"object-assign":1}],15:[function(require,module,exports){
'use strict';

var tools = require('./tools'),
    checkElem = require('../checkElem/checkElem'),
    setComponentEngine = require('./setComponentEngine'),
    registerComponent = require('./registerComponent'),
    filter = require('./filter');

module.exports = tools.assign(
    {},
    checkElem,
    setComponentEngine,
    registerComponent,
    filter,
    tools
);
},{"../checkElem/checkElem":3,"./filter":11,"./registerComponent":12,"./setComponentEngine":13,"./tools":14}]},{},[2])(2)
});