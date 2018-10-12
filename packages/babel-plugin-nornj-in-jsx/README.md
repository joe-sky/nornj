<div align="center">
  <a href="https://joe-sky.github.io/nornj-guide/">
    <img width="100" src="https://raw.githubusercontent.com/joe-sky/nornj-highlight/master/images/logo.png">
  </a>
  <a href="https://babeljs.io/">
    <img width="245" src="https://raw.githubusercontent.com/babel/logo/master/babel.png">
  </a>
  <div>
    <img width="100" height="100" title="Babel Plugin" src="https://michael-ciniawsky.github.io/postcss-load-plugins/logo.svg">
  </div>
  <h1>Babel-Plugin-NornJ-in-jsx</h1>
  <p>一个可支持自由扩展的JSX语法增强插件 :wink:</p>
</div>

[![NPM Version][npm-image]][npm-url]
[![Coverage Status](https://coveralls.io/repos/github/joe-sky/nornj/badge.svg?branch=master)](https://coveralls.io/github/joe-sky/nornj?branch=master)
[![NPM Downloads][downloads-image]][npm-url]

`Babel-Plugin-NornJ-in-jsx`是一个能为JSX带来更多丰富语法的Babel插件，比如条件及循环语句：

```js
const Button = () => {
  return (
    <div>
      <for i={0} to={10}>
        <if condition={i < 5}>
          <i>less than 5</i>
          <else>
            <i>greater than 5</i>
          </else>
        </if>
      </for>
    </div>
  )
}
```

以及类似Vue、Angular的指令：

```js
const Button = (props) => {
  return (
    <div>
      <input type="button" n-show={props.showBtn} />
    </div>
  )
}
```

还有过滤器：

```js
const Button = (props) => {
  return (
    <div>
      {n`${props.name} | capitalize`}
    </div>
  )
}
```

更重要的是，除了以上这些预置的语法，还支持像Vue、Angular那样自由扩展新的语法：

```js
import nj from 'nornj';
import cn from 'classnames';
nj.registerExtension('class', opts => cn(opts.result()));

const Button = (props) => {
  return (
    <div>
      <input type="button" n-class={{
        className1: true,
        className2: props.hasClassName2
      }} />
    </div>
  )
}
```

## 为什么创建这个插件？

在`React`项目开发中，原生的`JSX`语法并没有提供类似`Vue`的`v-if`、`v-for`、`v-show`等模板语法糖。当然，社区为`JSX`贡献了不少相关的插件，比如[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)。

而`Babel-Plugin-NornJ-in-jsx`的设计灵感就来源于上述的`jsx-control-statements`。只不过，它比前者的功能要更加丰富得多；且可以支持扩展 :wink:。

## 目录

* [安装](安装)
* [它是如何工作的](#它是如何工作的)
* [标签](#标签)
  * [if](#if)
  * [each](#each)
  * [switch](#switch)
  * [for](#for)
  * [with](#with)
  * [fn](#fn)
  * [开发新的标签](#开发新的标签)
* [指令](#指令)
  * [n-show](#n-show)
  * [n-style](#n-style)
  * [n-mobx-bind](#n-mobx-bind)
  * [n-mst-bind](#n-mst-bind)
  * [开发新的指令](#开发新的指令)
* [表达式](#表达式)
  * [过滤器](#过滤器)
    * [capitalize](#capitalize)
    * [int](#int)
    * [float](#float)
    * [bool](#bool)
  * [运算符](#运算符)
    * [a.b\['c'\] (安全的属性访问器)](#安全的属性访问器)
    * [a .. b (范围运算符)](#范围运算符)
    * [a <=> b (飞船运算符)](#飞船运算符)
  * [开发新的表达式](#开发新的表达式)

## 安装

```sh
npm i babel-plugin-nornj-in-jsx
```

`.babelrc`配置：

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

## 标签

### if

可在JSX中使用`NornJ`的`if、elseif、else`等标签。NornJ中的[if标签文档请见这里](https://joe-sky.github.io/nornj-guide/templateSyntax/built-inExtensionTag.html#if)。

```js
//转换前：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <if condition={a.b == 1}>
          <i>ifBlock</i>
          <else>
            <i>elseBlock</i>
          </else>
        </if>
      </div>
    );
  }
}

//转换后：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        {nj`
          <#if ${a.b == 1}>
            ${<i>ifBlock</i>}
            <#else>
              ${<i>elseBlock</i>}
            </#else>
          </#if>
        `()}
      </div>
    );
  }
}
```

更复杂的例子：

```js
class TestComponent extends Component {
  render() {
    const a = { b: 1, c: 'abc' };

    return (
      <div>
        <if condition={`${a}.b.trim() == 1`}>
          ddddd
          <i>aaaaa</i>
          <elseif condition={a.b == 2}>
            <i>ffffff</i>
            <div className="las2">
              <i>888888</i>
            </div>
          </elseif>
          <elseif condition={`${a}.b == 2`}>
            <i>gggggg</i>
          </elseif>

          <else>
            ccccc
            <if condition={!true}>
              <i>bbbbb</i>
              <elseif condition={`${a}.c.substr(${1}) == 'bc'`}>
                <i>ffffff</i>
              </elseif>
              <else>
                <i>eeeee</i>
              </else>
            </if>
          </else>

        </if>
      </div>
    );
  }
}

/* 输出：
<div>
  ccccc<i>ffffff</i>
</div>
*/
```

在`condition`参数中可以使用模板字符串，并在其中可以使用`NornJ`模板中特有的[各种过滤器与表达式](https://joe-sky.github.io/nornj-guide/templateSyntax/filter.html)。如上例中的：

```js
const a = { b: 1, c: 'abc' };
...

<if condition={`${a}.b.trim() == ${1}`}>
...
</if>
```

这里的`a.b.trim()`表达式，如直接使用js原生表达式，则会因为b变量没有trim方法而报错：

```js
<if condition={a.b.trim() == 1}>
...
</if>
```

但是使用`NornJ`的表达式则不会报错，而是会顺延流转到下面的`elseif`判断中，这是因为`NornJ`的链式取值语法对`null`值进行了过滤，[具体请见这里](https://joe-sky.github.io/nornj-guide/templateSyntax/variable.html)。

### each

可在JSX中使用`NornJ`的`each`标签。NornJ中的[each标签文档请见这里](https://joe-sky.github.io/nornj-guide/templateSyntax/built-inExtensionTag.html#each)。

```js
//转换前：
class TestComponent extends Component {
  render() {
    return (
      <div>
        <each of={[1, 2, 3]} item="item" index="index">
          <i>{item}</i>
          <i>{index}</i>
        </each>
      </div>
    );
  }
}

//转换后：
class TestComponent extends Component {
  render() {
    return (
      <div>
        {nj`
          <#each ${[1, 2, 3]}>
            #${({ item: item, index: index }) => {
              return [
                <i key={0}>{item}</i>
                <i key={1}>{index}</i>
              ];
            }}
          </#each>
        `()}
      </div>
    );
  }
}
```

如上，of参数为要遍历的数组，参数格式和上面if的condition是一样的。item、index参数都可以不写，默认值就是例子中的那几个。

* of参数支持写模板字符串，并在其中使用`NornJ`的过滤器与表达式：

```js
class TestComponent extends Component {
  render() {
    return (
      <div>
        <each of={`1 .. 3`} item="item" index="index">
          <i>{item}</i>
          <i>{index}</i>
        </each>
      </div>
    );
  }
}
```

### switch

可在JSX中使用`NornJ`的`switch`标签。NornJ中的[switch标签文档请见这里](https://joe-sky.github.io/nornj-guide/templateSyntax/built-inExtensionTag.html#switch)。

```js
//转换前：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <switch value={a.b}>
          <case value={1}>
            <i>1</i>
          </case>
          <case value={2}>
            <i>2</i>
          </case>
          <default>
            <i>3</i>
          </default>
        </switch>
      </div>
    );
  }
}

//转换后：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        {nj`
          <#switch {{${a.b}}}>
            <#case {{${1}}}>
              ${<i>1</i>}
            </#case>
            <#case {{${2}}}>
              ${<i>2</i>}
            </#case>
            <#default>
              ${<i>3</i>}
            </#default>
          </#switch>
        `()}
      </div>
    );
  }
}
```

如上，value参数的格式和上面if的condition是一样的。

* value参数支持写模板字符串，并在其中使用`NornJ`的过滤器与表达式：

```js
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <switch value={`${a}.b`}>
          <case value={`${' 1 '}.trim()`}>
            <i>1</i>
          </case>
          <case value={`'02'.substr(1) | int`}>
            <i>2</i>
          </case>
          <default>
            <i>3</i>
          </default>
        </switch>
      </div>
    );
  }
}
```

## 指令

### n-show

使用`n-show`可以在JSX中很方便地切换标签的`style.display`属性，当值为`false`时不显示，效果和`Vue`的`v-show`类似：

```js
class TestComponent extends Component {
  render() {
    return <input n-show={this.props.show} />;
  }
}

ReactDOM.render(<TestComponent show={false} />);
/*
 渲染结果：<input style="display:none" />
*/
```

### n-style

使用`n-style`可以在JSX中使用与html语法一致的css写法：

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

### n-mobx-bind

类似于`Vue`的`v-model`指令，可以使用`n-mobx-bind`配合`Mobx`在`<input>`及`<textarea>`等表单元素上创建`双向数据绑定`，它会根据控件类型自动选取正确的方法来更新元素。

* 基本使用方法

```js
import { Component } from 'react';
import { observable } from 'mobx';

class TestComponent extends Component {
  @observable inputValue = '';

  render() {
    return <input n-mobx-bind="inputValue" />;
  }
}
```

如上所示，无需编写`<input>`标签的`onChange`事件，`inputValue`变量已自动和`<input>`标签建立了`双向数据绑定`的关系。

* 实质上，`n-mobx-bind`的实现原理和`v-model`很类似，上述示例其实就是下面的语法糖形式：

```js
class TestComponent extends Component {
  @observable inputValue = '';
  @autobind
  onChange(e) {
    this.inputValue = e.target.value;
  }

  render() {
    return <input value={this.inputValue} onChange={this.onChange} />;
  }
}
```

* `onChange`事件

由于`n-mobx-bind`默认自动设置了组件的`onChange`事件，但有些情况下我们可能还是需要在`onChange`中做一些其他的操作：

```js
class TestComponent extends Component {
  @observable inputValue = '1';

  @autobind
  onChange(e) {
    console.log(e.target.value);
  }

  render() {
    return <input n-mobx-bind="inputValue" onChange={this.onChange} />;
  }
}
```

如上所示，`onChange`事件的行为和标签原生的`onChange`完全相同，它会在文本框的值变化后执行。

* 使用`action`更新变量

在`mobx`开发中如果启动严格模式或者使用`mobx-state-tree`时，则须要使用`action`来更新变量。可按下面方式配置使用`action`：

```js
import { observable, action, configure } from 'mobx';

// don't allow state modifications outside actions
configure({enforceActions: true});

class TestComponent extends Component {
  @observable inputValue = '1';

  @action.bound
  setInputValue(v) {
    this.inputValue = v;
  }

  render() {
    return <input n-mobx-bind_action="inputValue" />;
  }
}
```

当有`action`修饰符时，`n-mobx-bind`会默认执行camel命名法(`set + 变量名`)定义的`action`，上例中为`setInputValue`。

### n-mst-bind

`n-mst-bind`即为`n-mobx-bind`的默认使用`action`来更新值的版本，用来配合`mobx-state-tree`的变量使用：

store：

```js
import { types } from "mobx-state-tree";

const TestStore = types.model("TestStore",
  {  
    inputValue: '1'
  })
  .actions(self => ({
    setInputValue(v) {
      self.inputValue = v;
    }
  }));
```

component：

```js
@inject('rootStore')
@observer
class TestComponent extends Component {
  render() {
    return <input n-mst-bind={`${this}.props.rootStore.testStore`} />;
  }
}
```

如上，`n-mst-bind`会默认执行camel命名法(`set + 变量名`)定义的`action`来更新值，上例中为`setInputValue`。除此外`n-mst-bind`的其他特性与上述的`n-mobx-bind`完全相同。

`n-mobx-bind`和`n-mst-bind`的更多详细文档请[查看这里](https://joe-sky.github.io/nornj-guide/templateSyntax/inlineExtensionTag.html#mobx-bind)。

## 表达式

使用`nj.expression`可以在JSX中以标签模板字符串的方式使用`NornJ`的过滤器和表达式：

```js
import nj, { expression as n } from 'nornj';

class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <if condition={a.b == 1}>
          <i>{n`(${a}.b | float).toFixed(2)`}</i>
        </if>
      </div>
    );
  }
}
```

`nj.expression`的文档请[查看这里](https://joe-sky.github.io/nornj-guide/templateSyntax/templateString.html#njexpression)。

## License

MIT

[npm-image]: http://img.shields.io/npm/v/babel-plugin-nornj-in-jsx.svg
[downloads-image]: http://img.shields.io/npm/dm/babel-plugin-nornj-in-jsx.svg
[npm-url]: https://www.npmjs.org/package/babel-plugin-nornj-in-jsx