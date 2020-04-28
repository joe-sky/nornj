---
title: 快速起步
nav:
  title: 指南
---

# 在JSX中使用增强React开发体验

`NornJ`语法通过配套的[babel插件](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)可直接在JSX中编写，例如：

<code src="./demo/Demo1.tsx" />

下面的是一个在线可运行实例：

* [在线Playground(codesandbox)](https://codesandbox.io/s/z2nj54r3wx)

## 安装

```bash
npm install babel-plugin-nornj-in-jsx  #or yarn add babel-plugin-nornj-in-jsx
```

然后配置`.babelrc`:

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```
<!--
## 在js文件中使用NornJ模板

每个React组件都须要在render返回组件的标签代码，如在`HelloWorld`组件中渲染一个下拉框，用`JSX`和`NornJ`的语法分别实现：

* JSX

```js
export default class HelloWorld extends Component {
  render() {
    return (
      <div className="hello" style={{ width: 300, height: 200 }}>
        <input type="text" />
        <select>
          {[1, 2, 3].map((item, i) => i > 1
            ? <option>{item + 1}</option>
            : <option>{item}</option>
          )}
        </select>
      </div>
    );
  }
}
```

* NornJ

```js
import nj, { template as t } from 'nornj';
import 'nornj-react';

export default class HelloWorld extends Component {
  render() {
    return t`
      <div class="hello" style="width:300px;height:200px;">
        <input type="text">
        <select>
          <#each {[1, 2, 3]}>
            <#if {@index > 1}>
              <option>{@item + 1}</option>
              <#else><option>{@item}</option></#else>
            </#if>
          </#each>
        </select>
      </div>
    `;
  }
}
```

如上例，`NornJ`可使用`ES6+`的`tagged template literals`语法在js文件中描述模板，模板语法也直接支持处理各种逻辑，并且更贴近于html规范。

> 更多关于在js文件中编写`NornJ`模板的语法细节[请参考这里](../templateSyntax/templateString.md)。

## NornJ和JSX相互嵌套使用

如果您不想完全使用`NornJ`替代`JSX`，那么`NornJ`也可以成为`JSX`的一个很好的辅助工具，例如可以使用`NornJ`的`if`及`each`等语法替代`JSX`中的`三目运算符`与`map`。

* 使用`if`替代`三目运算符`：

```js
import nj, { template as t } from 'nornj';
import 'nornj-react';

export default class HelloWorld extends Component {
  render() {
    return (
      <div>{t`
        <#if ${this.props.isButton}>
          ${<button>click me</button>}
          <#else>${<input type="text" />}</#else>
        </#if>
      `}</div>
    );
  }
}
```

* 使用`each`替代`map`：

```js
import nj, { template as t } from 'nornj';
import 'nornj-react';

export default class HelloWorld extends Component {
  render() {
    return (
      <div className="hello" style={{ width: 300, height: 200 }}>
        <input type="text" />
        <select>{t`
          <#each {1 .. 10}>
            <#if {@index > 1}>
              #${({ item, index }) => <option>{item + 1}</option>}
              <#else>#${({ item, index }) => <option>{index}</option>}</#else>
            </#if>
          </#each>
        `}</select>
      </div>
    );
  }
}
```

如上所示，`NornJ`与`JSX`的语法并不会发生冲突，可共存一起运行。这样即使无需修改您已有的代码，也可使用`NornJ`模板带来的各种语法糖。

> 如果在嵌套时`JSX`需要获取`NornJ`模板内产生的变量，如上例的`#each`中，这时可以使用`NornJ`提供的访问器属性语法获取，[具体参考这里](../templateSyntax/accessor.md)。

## 在单独的文件中编写NornJ模板

`NornJ`模板除了可以在js文件中编写之外，还可以编写在单独的模板文件中，用来做组件(或页面)展现层与结构层的分离([具体文档请参考这里](../api/webpack.md))。例如编写一个`helloWorld.t.html`文件：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <select>
      <#each {[1, 2, 3]}>
        <#if {@index > 1}>
          <option>{@item + 1}</option>
          <#else><option>{@item}</option></#else>
        </#if>
      </#each>
    </select>
  </div>
</template>
```

然后可以在js文件中引入后使用：

```js
import tmpls from './helloWorld.t.html';

export default class HelloWorld extends Component {
  render() {
    return tmpls.helloWorld();  //执行模板函数生成标签
  }
}
```

如上，每个`*.t.html`文件内都可以定义一个或多个`template`标签。

这些`template`标签会在引用它的js文件中通过[nornj-loader](https://github.com/joe-sky/nornj-loader)进行解析，生成一个以`template`标签的`name`属性为key的模板函数集合对象，在各个组件的render中调用它们就会生成相应的标签。

## 直接在JSX中使用

`NornJ`也提供了一个可以直接在JSX中编写的`babel`插件，写法如下：

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
```-->

具体请见[babel-plugin-nornj-in-jsx](https://github.com/joe-sky/nornj/blob/master/packages/babel-plugin-nornj-in-jsx/README.md)。

## 与各种React已有生态结合

`NornJ`可直接支持所有`React`现有生态，包括`Redux`、`React-Router`、`Mobx`、`Ant Design`等等，它可以和任何已有的`React`生态共存。