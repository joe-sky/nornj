/*!
 * NornJ-React v5.0.7
 * (c) 2016-2019 Joe_Sky
 * Released under the MIT License.
 */
import nj, { registerExtension } from 'nornj';
import React, { Component } from 'react';

var njr = {};

function _registerComponent(name, component) {
  if (name != null) {
    nj.registerComponent(name, component);
  }
}

function bindTemplate(name) {
  if (nj.isString(name)) {
    return function (component) {
      _registerComponent(name, component);

      return component;
    };
  } else {
    name.name && _registerComponent(name.name, name);
    return name;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function debounce(fn, delay) {
  var timeoutID = null;
  return function () {
    var _arguments = arguments,
        _this = this;

    clearTimeout(timeoutID);
    timeoutID = setTimeout(function () {
      fn.apply(_this, _arguments);
    }, delay);
  };
}
nj.assign(nj, {
  debounce: debounce
});

var DebounceWrapClass =
/*#__PURE__*/
function (_Component) {
  _inherits(DebounceWrapClass, _Component);

  function DebounceWrapClass(props) {
    var _this;

    _classCallCheck(this, DebounceWrapClass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DebounceWrapClass).call(this, props));
    _this.componentConfig = void 0;
    _this.changeEventName = void 0;
    _this.$this = void 0;
    _this.emitChangeDebounced = void 0;

    _this.emitChange = function (args) {
      _this.props[_this.changeEventName].apply(_this.$this, args);
    };

    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    var _this$props$debounceD = _this.props.debounceDirectiveOptions,
        tagName = _this$props$debounceD.tagName,
        $this = _this$props$debounceD.context.$this,
        directiveProps = _this$props$debounceD.props,
        value = _this$props$debounceD.value;

    var _args = directiveProps && directiveProps.arguments;

    _this.componentConfig = nj.getComponentConfig(tagName) || {};
    _this.changeEventName = _args && _args[0].name || _this.componentConfig.changeEventName || 'onChange';
    _this.$this = $this;
    _this.emitChangeDebounced = debounce(_this.emitChange, value() || 100);
    return _this;
  }

  _createClass(DebounceWrapClass, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var prevValue = prevProps.debounceDirectiveOptions.value;
      var value = this.props.debounceDirectiveOptions.value;
      var newValue = value();

      if (newValue != null && newValue != prevValue()) {
        this.emitChangeDebounced = debounce(this.emitChange, newValue);
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      // React pools events, so we read the value before debounce.
      // Alternately we could call `event.persist()` and pass the entire event.
      // For more info see reactjs.org/docs/events.html#event-pooling
      e && e.persist && e.persist();
      this.emitChangeDebounced(arguments);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          DebounceTag = _this$props.DebounceTag,
          debounceDirectiveOptions = _this$props.debounceDirectiveOptions,
          innerRef = _this$props.innerRef,
          others = _objectWithoutProperties(_this$props, ["DebounceTag", "debounceDirectiveOptions", "innerRef"]);

      return React.createElement(DebounceTag, _extends({
        ref: innerRef
      }, others, _defineProperty({}, this.changeEventName, this.handleChange)));
    }
  }]);

  return DebounceWrapClass;
}(Component);

var DebounceWrap = React.forwardRef(function (props, ref) {
  return React.createElement(DebounceWrapClass, _extends({
    innerRef: ref
  }, props));
});
registerExtension('debounce', function (options) {
  var tagName = options.tagName,
      setTagName = options.setTagName,
      tagProps = options.tagProps;
  setTagName(DebounceWrap);
  tagProps.DebounceTag = tagName;
  tagProps.debounceDirectiveOptions = options;
}, {
  useExpressionInProps: true,
  onlyGlobal: true,
  isDirective: true
});

nj.assign(njr, {
  bindTemplate: bindTemplate,
  registerTmpl: bindTemplate
}); //Set createElement function for NornJ

nj.config({
  createElement: React.createElement,
  outputH: true,
  delimiters: {
    start: '{',
    end: '}',
    comment: ''
  }
});
var _defaultCfg = {
  hasEventObject: true
},
    componentConfig = nj.componentConfig;
componentConfig.set('input', _defaultCfg);
componentConfig.set('select', _defaultCfg);
componentConfig.set('textarea', _defaultCfg);
var _global = nj.global;
_global.NornJReact = _global.njr = njr;

export default njr;
export { bindTemplate, bindTemplate as registerTmpl };
