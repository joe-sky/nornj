---
title: Directives
order: 2
nav:
  title: JS(X) Syntax Extension
  order: 2
toc: menu
---

# 指令

`指令`是一种扩展的 HTML(XML)标签属性，`NornJ`也为`JSX`提供了指令语法：

```js
<div n-show={true}>Test directive</div>
```

上例中的`n-show`即为指令语法。

## 指令与组件 props 的区别

`指令`通常可以用来封装一些实用功能，以实现写更少的代码去做更多的事情为目的。具体来说`NornJ`指令有以下几种与 React 组件 props 不同的特性：

- [需要前缀](#需要前缀)
- [可对组件 props 进行额外处理](#可对组件-props-进行额外处理)
- [支持封装高阶组件](#支持封装高阶组件)

### 需要前缀

`NornJ`指令是全局作用域的，通常每个 React 组件都可能能使用到，一般需要加`n-`前缀：

```js
<input n-debounce={200} onChange={e => console.log(e.target.value)} />
```

但也有可不加前缀的指令，如`mobxBind`：

```js
<input mobxBind={this.inputValue} />
```

是否需要加前缀可以在 babel 配置中设定：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "mobxBind": {
            "needPrefix": "free"  //不加前缀时能保证和其他组件的 props 命名不冲突即可
          }
        }
      }
    ]
  ]
}
```

### 可对组件 props 进行额外处理

`NornJ`指令最主要的功能就是用来设置(或修改)组件的 props 值。比如预置指令`n-show`，它就是用来设置 JSX 标签的`style.display`属性：

```js
<input n-show={false} />

//实际渲染：
<input style="display:none" />
```

目前`JSX`原生的语法可以实现类似指令的效果吗？答案是可以的。通常可以使用`JSX延展操作符`来模拟出类似指令的效果，比如[react-hanger 的 useInput](https://github.com/kitze/react-hanger#useinput)：

```js
const newTodo = useInput('');

<input name="input" {...newTodo.eventBind} />;
/*
 实际渲染：<input name="input" value={newTodo.value} onChange={newTodo.onChange} />
*/
```

但是，上面这种方式也存在以下这些问题：

- 封装扩展的内部无法获取 JSX 标签已有的其他 props 值，比如上例中的`name="input"`。这在开发一些功能时会有局限。
- 写法与常规的 JSX 属性区别较大，可读性差一些。

然而`NornJ`指令语法可以完美解决上述问题。

### 支持封装高阶组件

设置(或修改)`JSX`标签的属性值是`NornJ`指令最基本的功能。指令还能实现更高级的功能，可以在当前指令所在组件的外层再套自定义逻辑的高阶组件。下面我们看一个简单的应用例子(使用[ant-design 的 Tooltip 组件](https://ant.design/components/tooltip/))。

`ant-design的Tooltip组件`常规的写法：

```js
import { Tooltip, Button } from 'antd';

ReactDOM.render(
  <div className="demo">
    <Tooltip placement="topLeft" title={text}>
      <Button>TL</Button>
    </Tooltip>
  </div>
);
```

然而可以使用`NornJ`指令的扩展开发方式将上面的 Tooltip 组件封装在一个高阶组件之中，这样就可以像下面这种方式使用：

```js
ReactDOM.render(
  <div className="demo">
    <Button n-tooltip-topLeft={text}>TL</Button>
  </div>
);
```

如上，使用了指令后组件树结构减少了一层，看起来会更加简洁清晰。上述`n-tooltip`指令的扩展实现方式，我们将在本章节最后详细阐述。

---

下面是`NornJ`已有内置的指令：

## show

使用`n-show`可以在 JSX 中很方便地切换标签的`style.display`值是否为 none，当值为`false`时不显示：

```js
class TestComponent extends Component {
  render() {
    return <input n-show={this.props.show} />;
  }
}

ReactDOM.render(<TestComponent show={false} />);

//渲染结果：
<input style="display:none" />;
```

- `n-show指令`与`<if>标签`的区别

| 语法     | 特点                         | 建议使用场景                     |
| :------- | :--------------------------- | :------------------------------- |
| `n-show` | 初始渲染开销大；切换时开销小 | 在条件频繁切换时使用，性能会更好 |
| `<if>`   | 初始渲染开销小；切换时开销大 | 在条件很少改变时使用，性能会更好 |

## style

使用`n-style`可以在 JSX 中使用与 html 语法一致的 css 写法：

```js
class TestComponent extends Component {
  render() {
    //以下与<input style={{ marginLeft: '10px', padding: 0 }} />效果相同
    return <input n-style="margin-left:10px;padding:0" />;
  }
}
```

在`n-style`中也可以动态嵌入变量：

```js
const cssProp = 'padding';

class TestComponent extends Component {
  render() {
    return <input n-style={`margin-left:${10};${cssProp}:0`} />;
  }
}
```

## debounce

使用`n-debounce`可以在 JSX 中为`input`等表单元素增加防抖效果，以减少用户输入频率而提高性能：

```js
class TestComponent extends Component {
  onChange = e => {
    //每次输入后延迟一定毫秒才触发一次
    console.log(e.target.value);
  };

  render() {
    return (
      <>
        <input n-debounce onChange={this.onChange} defaultValue="test" />
        <input n-debounce={200} onChange={this.onChange} />
      </>
    );
  }
}
```

如上，`n-debounce`的触发事件默认为`onChange`。如果不写`n-debounce`的值，默认为`100毫秒`。

- 指定任意事件

`n-debounce`也可以支持`onChange`以外的其他事件。比如`onInput`，则需要在`n-debounce`后面添加`onInput`参数：

```js
class TestComponent extends Component {
  onInput = e => {
    console.log(e.target.value);
  };

  render() {
    return <input n-debounce-onInput={200} onInput={this.onInput} />;
  }
}
```

## 开发新的指令

`NornJ`指令都是支持可扩展的，也就是说可以自行封装各种新功能。

### 开发一个最简单的指令

例如实现一个`n-class`指令，功能即为与[classnames](https://github.com/JedWatson/classnames)库相同：

```js
<div id="test" n-class={{ foo: true, bar: true }}>
  Test
</div>
/* 以上渲染内容为：
<div id="test" class="foo bar">Test</div>
*/
```

上面的`n-class`指令实际上是一个扩展函数，使用`nj.registerExtension`方法注册：

```js
import nj from 'nornj';
import classNames from 'classnames';

nj.registerExtension(
  'class', //注意：指令名称需要使用小写开头的camel命名方式
  options => {
    const {
      tagProps, //指令所在组件的props对象，本例中为{ id: 'test' }
      value //指令值函数，注意它是个函数需要执行才能取到结果
    } = options;

    //在组件渲染前，使用classNames库来设置className属性的值
    tagProps.className = classNames(
      value() //此处返回例中的{ foo: true, bar: true }
    );
  }
);
```

配置`.babelrc`(该例中此步骤也可以省略)：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "class": {
            "isDirective": true
          }
        }
      }
    ]
  ]
}
```

这样我们就成功开发了一个`n-class`指令，该实例演示了`NornJ`指令的[可对组件 props 进行额外处理](#可对组件-props-进行额外处理)功能。

### 更复杂的指令

接下来我们来实现一个内部封装了高阶组件的指令`n-tooltip`，它的作用和[ant-design 的 Tooltip 组件](https://ant.design/components/tooltip/)是一样的：

```js
<div>
  <Button n-tooltip-topLeft={text}>TL</Button>
</div>
```

首先，我们组要实现一个高阶组件`WrappedTooltip.jsx`：

```js
import React from 'react';
import { Tooltip } from 'antd';

const WrappedTooltip = ({
  TooltipDirectiveTag, //指令所在组件的组件对象；如果是原生html标签的话就是标签名字符串，如div
  tooltipDirectiveOptions, //指令扩展函数的options对象
  ...tagProps //指令所在组件的props对象
}) => {
  const { props, value } = tooltipDirectiveOptions;

  //获取指令参数
  const args = props && props.arguments;

  return (
    <Tooltip
      placement={
        (args && args[0].name) || 'rightTop' //指令的第一个参数传递到Tooltip组件的placement属性，即显示位置
      }
      title={value()} //指令的值传到Tooltip组件的title属性，即显示文本
    >
      <TooltipDirectiveTag //此处渲染指令所在组件
        {...tagProps} //传递指令所在组件的props对象
      />
    </Tooltip>
  );
};

export default WrappedTooltip;
```

然后使用`nj.registerExtension`方法注册扩展函数：

```js
import nj from 'nornj';
import WrappedTooltip from './WrappedTooltip.jsx';

nj.registerExtension(
  'tooltip', //注意：指令名称需要使用小写开头的camel命名方式
  options => {
    const {
      tagName, //指令所在组件对象
      tagProps, //指令所在组件的props对象
      setTagName //运行此函数，可以修改当前即将渲染的组件对象
    } = options;

    setTagName(WrappedTooltip); //将当前渲染的组件修改为高阶组件
    tagProps.TooltipDirectiveTag = tagName; //传递指令所在组件对象到高阶组件中
    tagProps.tooltipDirectiveOptions = options; //传递指令的options到高阶组件中
  }
);
```

> 上例有个需要注意的地方，就是`TooltipDirectiveTag`和`tooltipDirectiveOptions`参数的命名应当特例化而避免和其他指令的重复。因为这样才能适应同时存在多个含有高阶组件的指令的场景，比如`<div n-directive1 n-directive2>`。

这样`n-tooltip`指令就开发完成了，还可以变更参数控制显示方向：

```js
<div>
  <Button n-tooltip-topLeft="test1">TL</Button>
  <Button n-tooltip-topRight="test2">TL</Button>
</div>
```

### 数据绑定指令

数据绑定指令一般用来将传入的值与表单控件建立`双向绑定关系`，`mobxBind`就是一个数据绑定指令，这种特殊的指令同样也可以支持扩展。下面我们先来实现一个用于 React Hooks Api 的`n-bind`指令，用法如下：

```js
function TestBind() {
  const [count, setCount] = useState(100);

  return (
    <div>
      <input
        n-bind={count} //与count建立双向数据绑定关系
        onChange={e => console.log(e.target.value)}
      />
      input: {count}
    </div>
  );
}
```

首先需要修改`.babelrc`配置：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "bind": {
            "isDirective": true,
            "isBindable": true //设置isBindable为true，在取指令的值时会返回特殊的格式
          }
        }
      }
    ]
  ]
}
```

然后编写`n-bind`的扩展函数：

```js
nj.registerExtension('bind', options => {
  const {
    tagProps,
    value,
    context: { getData }
  } = options;

  const _value = value(); //注意，这里的value函数返回值是个特殊的对象结构，各属性如示例下面的表格所示
  const setter = context.getData(`set${nj.upperFirst(_value.prop)}`);
  tagProps.value = _value.value; //设置当前组件的value对象

  //暂存当前组件的onChange事件函数
  const _onChange = tagProps.onChange;

  //重新设置onChange事件
  tagProps.onChange = function(e) {
    setter(e.target.value); //更新变量值
    _onChange.apply(null, arguments); //执行组件的onChange事件，并传递参数
  };
});
```

上面扩展函数代码中的`_value`对象的各属性为：

| 属性名   | 类型   | 作用                                                                                                                                                                                                       |
| :------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`  | Any    | 指令值，例：`<input n-stateBind={this.state.foo.bar} />`中的`this.state.foo.bar`值。                                                                                                                       |
| `prop`   | String | 指令值的属性名，例：`<input n-stateBind={this.state.foo.bar} />`中的`'bar'`。                                                                                                                              |
| `source` | Object | 指令值的当前层级所属对象引用，例：`<input n-stateBind={this.state.foo.bar} />`中的`this.state.foo`。                                                                                                       |
| `parent` | Object | 指令值的当前层级所属对象的父级对象引用，例：`<input n-stateBind={this.state.foo.bar} />`中的`this.state`。 <br> 但是`parent`对象也是一个包含`source`属性的对象，所以可以向上级递归取出所有层级的对象引用。 |

用如上的方式我们就成功实现了一个简单的数据绑定指令`n-bind`。但是它目前只支持文本框，下面我们再让它支持单选按钮，用法如下：

```js
function TestBind() {
  const [count, setCount] = useState(100);
  const [num, setNum] = useState('');

  return (
    <div>
      <input n-bind={count} onChange={e => console.log(e.target.value)} />
      input: {count}
      <input type="radio" value="first" n-bind={num} />
      <input type="radio" value="second" n-bind={num} />
      radio: {num}
    </div>
  );
}
```

修改`n-bind`的扩展函数：

```js
nj.registerExtension('bind', options => {
  const {
    tagProps,
    value,
    context: { getData }
  } = options;

  const _value = value(); //获取指令值
  const setter = context.getData(`set${nj.upperFirst(_value.prop)}`);

  if (tagProps.type == 'radio') {
    //单选按钮
    tagProps.checked = tagProps.value === _value.value; //判断当前单选按钮组件是否为选中状态
  } else {
    //文本框
    tagProps.value = _value.value; //设置当前文本框组件的value对象
  }

  //暂存当前组件的onChange事件函数
  const _onChange = tagProps.onChange;

  //重新设置onChange事件
  tagProps.onChange = function(e) {
    setter(e.target.value); //更新变量值
    _onChange.apply(null, arguments); //执行组件的onChange事件，并传递参数
  };
});
```

如上，我们就实现了一个同时支持文本框和单选按钮的`n-bind`指令。而判断控件类型的逻辑，则是利用了`NornJ`指令能取到标签的所有其他 props 的特性。

接下来还有一种更复杂的场景，比如我们需要实现一个支持 React Class 组件的`n-stateBind`指令，用法如下：

```js
class TestStateBind extends Component {
  state = {
    count: 100,
    foo: {
      count: 100
    },
    bar: {
      baz: {
        count: 100
      }
    }
  };

  render() {
    return (
      <div>
        <input n-stateBind={this.state.foo.count} onChange={e => console.log(e.target.value)} />
        input: {this.state.foo.count}
      </div>
    );
  }
}
```

首先需要修改`.babelrc`配置：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "stateBind": {
            "isDirective": true,
            "isBindable": true //设置isBindable为true，在取指令的值时会返回特殊的格式
          }
        }
      }
    ]
  ]
}
```

然后编写`n-stateBind`的扩展函数：

```js
nj.registerExtension('stateBind', options => {
  const {
    tagProps,
    value,
    context: {
      $this //对于Class组件，可以这样取出当前组件的实例对象"$this"变量，也就是组件的实例引用"this"
    }
  } = options;

  const _value = value();
  tagProps.value = _value.value; //设置当前组件的value对象

  //暂存当前组件的onChange事件函数
  const _onChange = tagProps.onChange;

  //重新设置onChange事件
  tagProps.onChange = function(e) {
    $this.setState(
      //使用组件实例上的setState函数更新值
      putStateValue(_value, e.target.value), //用自定义的putStateValue函数创建出setState所需的参数结构，下面有putStateValue的详细实现
      () => _onChange.apply($this, arguments) //执行组件的onChange事件，并传递参数
    );
  };
});
```

最后是`putStateValue`函数的实现：

```js
function putStateValue(value, ret) {
  return value.prop == 'state' ? ret : putStateValue(value.parent, { [value.prop]: ret });
}
```

`putStateValue`函数的实现逻辑其实很简单，就是递归获取`this.state.foo.count`当前层级值的`parent`属性，然后按相应格式构造出`setState`函数所需的参数结构即可。

如上，我们就实现了一个更复杂的数据绑定指令 n-stateBind。其实 `mobxBind` 指令的实现方式也与本例中的 n-bind 和 n-stateBind 类似。
