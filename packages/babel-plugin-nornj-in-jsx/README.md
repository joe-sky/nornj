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
  <p>Make the NornJ template work gracefully in the JSX environment</p>
</div>

[![NPM Version][npm-image]][npm-url]
[![Coverage Status](https://coveralls.io/repos/github/joe-sky/nornj/badge.svg?branch=master)](https://coveralls.io/github/joe-sky/nornj?branch=master)
[![NPM Downloads][downloads-image]][npm-url]

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

## 为什么开发这个插件

在`React`项目开发中，原生的`JSX`语法并没有提供类似`Vue`的`v-if`、`v-for`、`v-show`等模板语法糖。当然，社区为`JSX`贡献了不少相关的插件，比如[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)。

而`nornj-in-jsx`也是类似于`jsx-control-statements`的插件，它也能为`JSX`提供更加优雅的`分支条件`、`循环`等等语法，并且还可以自由扩展出更多的功能。这些功能大致分为几类：

* [扩展标签](#扩展标签)
* [扩展属性](#扩展属性)
* [扩展表达式](#扩展表达式)

## 扩展标签

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

## 扩展属性

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

### n-mobx-model

使用`n-mobx-model`可以在JSX中实现基于`Mobx`的双向数据绑定功能：

```js
import { Component } from 'react';
import { observable } from 'mobx';
import nj from 'nornj';

class TestComponent extends Component {
  @observable inputValue = '';

  render() {
    return <input n-mobx-model="inputValue" />;
  }
}
```

`n-mobx-model`的详细文档请[查看这里](https://joe-sky.github.io/nornj-guide/templateSyntax/inlineExtensionTag.html#mobx-model)。

### n-mst-model

`n-mst-model`即为`n-mobx-model`的`mobx-state-tree`版本：

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
    return <input n-mst-model={`${this}.props.rootStore.testStore.inputValue`} />;
  }
}
```

`n-mst-model`的详细文档请[查看这里](https://joe-sky.github.io/nornj-guide/templateSyntax/inlineExtensionTag.html#mst-model)。

## 扩展表达式

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