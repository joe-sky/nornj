---
title: 为什么要开发 NornJ
nav:
  title: 指南
---

# 关于JSX的思考

我们平时都编写`JSX`来创建React组件，`JSX`非常好用，能适应各种各样的场景。依现状不难列出和`JSX`有关的以下几个话题：

* 按目前`ecmascript`的语法特性来看，原生的`JSX`语法在编写各种React组件时都能很好的适配。只是一些特殊情况可能存在争议，如在编写逻辑判断时需要使用`ok ? <i>ok</i> : <i>no</i>`或`ok && <i>ok</i>`;

* 我们不时会拿`JSX`和`模板引擎`进行优劣对比：

  * `JSX`的主要优势：`更灵活适合编写复杂逻辑`、`完善的IDE代码静态检查`(如typescript的支持度)等;
  * `模板引擎`(例如Vue的模板)的主要优势：`更丰富的语法糖`、`组件逻辑与表现分离`(SFC)、`容易扩展更多的语法`(自定义过滤器、指令)等;


* `JSX`可以通过`babel`插件提供扩展，例如：

  * 属`css in js`技术的[styled-jsx](https://github.com/zeit/styled-jsx)：编译后有运行时代码，有`3kb gzip`的网络开销，但能提供不少`JSX`语法之外的辅助功能。
  * 提供`JSX`流程控制的[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)：编译后没有运行时代码，副作用小，但不可以支持扩展新的语法。

# 用babel插件让JSX吸收模板引擎的特性?

我们试想一下，`JSX`在如果在保持现有功能与特性的情况下，同时也拥有`模板引擎`的以下优点是不是会更好用？

* 更丰富的语法糖(指令、流程控制等)

* 容易扩展更多的语法糖

以上我们通过`babel`插件就可以实现。`NornJ`是我们创造的一个可扩展并可支持`React`的`模板引擎`; 而它提供的[配套babel插件](https://github.com/joe-sky/nornj/blob/master/packages/babel-plugin-nornj-in-jsx/README.md)则能够在用户并无感知的情况下，将`模板引擎`语法化整为零地插入到原生`JSX`中运行，如下：

```js
const test = props => (
  <if condition={props.isTest}>  //此行为模板
    <i>success</i>               //此行为原生JSX
    <else>                       //此行为模板
      <i>fail</i>                //此行为原生JSX
    </else>                      //此行为模板
  </if>                          //此行为模板
);
```

下面的是一个在线可运行实例：

* [在线Playground(codesandbox)](https://codesandbox.io/s/z2nj54r3wx)

<!-- # NornJ有哪些主要的语法糖

# 这些语法糖是如何工作的

# 扩展新的语法糖

# NornJ其实是个完整的模板引擎 -->