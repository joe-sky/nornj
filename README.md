# NornJ

```
  ____        __   
/\  __ \     /\ \  
\ \ \/\ \   _\_\ \ `<div>
 \ \_\ \_\ /\_____\   Hello World!
  \/_/\/_/ \/_____/ </div>`();

```

`NornJ`是一个渲染效率高，语法可读性好，可扩展性超强，适用场景丰富的javascript模板引擎。

[![NPM Version][npm-image]][npm-url]
<a href="https://travis-ci.org/joe-sky/nornj">
<img src="https://travis-ci.org/joe-sky/nornj.svg?branch=master" alt="Travis CI Status"/>
</a>
<a href="https://codecov.io/gh/joe-sky/nornj">
  <img src="https://codecov.io/gh/joe-sky/nornj/branch/master/graph/badge.svg" alt="Codecov" />
</a>
[![NPM Downloads][downloads-image]][npm-url]

## 概述

`NornJ`是一款同时支持渲染`html(或xml)字符串`和`HyperScript`的模板引擎。

> 什么是`HyperScript`?

[`HyperScript`](https://github.com/hyperhype/hyperscript)可以说是一种创建用户界面元素的语法规范，即：`h (tag, attrs, [text?, Elements?,...])`语法。各大前端框架中对于它的应用，最著名的当属`React`。`React`的`createElement`方法即为`HyperScript`的一种实现，`React`使用它来创建`virtual dom`对象。

而`NornJ`可将同样语法规范的模板，转换为多种方式渲染：

```
                  +-----------------+
                  ¦ template string ¦
                  +-----------------+
                           |
                           |
           +-------------------------------+
           |                               |
           |                               |
 +------------------+      +--------------------------------+
 ¦ html(xml) string ¦      ¦ HyperScript(React virtual dom) ¦
 +------------------+      +--------------------------------+
```

故`NornJ`不但可以作为`Express`服务器的界面模板引擎，还可以替代`JSX`作为`React`的界面模板引擎。它的语法和`JSX`并不互相排斥，可共存一起运行。

## 模板基本示例

```html
<template name="partial">
  <#if {{i > 0 || (i <= -10)}}>
    <input id=test onclick={{click}} />
  </#if>
</template>

<template>
  <div>
    <#each {{msgs}}>
      this the test demo Hello {{msg | format}}
    </#each>
    <#include name="partial" />
  </div>
</template>
```

如上例，`NornJ`的语法在可以展现一定逻辑性的同时结构与html几乎一致，而且`if`、`each`、`>`、`<=`等都是支持自定义扩展的模板语法！^_^

## 在线演示地址

* [在线Playground(jsfiddle)](https://jsfiddle.net/joe_sky/n5n9tutj/)
* [在线Playground(codepen)](https://codepen.io/joe_sky/pen/ooPNbj)

## 在线文档

* [NornJ中文指南(github pages)](https://joe-sky.github.io/nornj-guide)
* [NornJ中文指南(gitbook)](https://joe-sky.gitbooks.io/nornj-guide)

## 特色

传统js模板引擎如`Handlebars`、`EJS`、`Nunjucks`等通常只支持渲染字符串，`NornJ`与它们相比，相同点和不同点都有：

* 支持渲染`React`的`virtual dom`对象，作为`JSX`的替代模板语言。
* 支持渲染字符串，故它也可以像传统js模板引擎一样支持`Backbone`或`Express`等渲染html；也支持为各类文本文件提供模板渲染。
* 模板语法简单且丰富，在参考自`Handlebars`、`Nunjucks`、`Vue`等著名项目的模板语法基础上，也有很多自己独特的语法。
* 语法拥有非常强大的可扩展性，例如模板中的每个`运算符`及`语句`都是可以扩展的。
* 它有多种使用方式适应不同场景：
  * 可用单独的模板文件定义，并用`Webpack loader`编译；
  * 也可以用`script`标签写在html中；
  * 还可以支持用`ES6模板字符串`语法直接在js文件中编写。
* 渲染效率出色，不逊于`Handlebars`、`JSX`等主流模板。
* 它不仅可以直接在浏览器中运行，也可以支持`模板预编译`，且去除编译器的runtime版仅`4kb(gzip)`大小。

## 与React配合示例

NornJ可以替代JSX输出React组件，用它可以将React组件的表现与逻辑更优雅地实现解藕：

```js
import { Component } from 'react';
import { render } from 'react-dom';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';

@registerTmpl({
  name: 'TestComponent',
  template: `
    <div id=test1>
      this the test demo{no}.
      <#for {1} {no}>
        <i>test{@index}</i>
      </#for>
    </div>
  `
})
class TestComponent extends Component {
  render() {
    return this.template(this.props);
  }
}

render(nj`<TestComponent no=100 />`(), document.body);

/* output:
<div id="test1">
  this the test demo100.
  <i>test0</i>
  <i>test1</i>
  <i>test2</i>
  ...
  <i>test99</i>
</div>
*/
```

还可以替代ReactDOM.render来在html内渲染React组件：

```html
...
<body>
  <script type="text/nornj" autoRender>
    <TestComponent no="100" />
  </script>
</body>
```

## 在ES5环境下使用

除了使用ES6模板字符串外，`NornJ`也可以支持在es5环境下使用普通的字符串：

```html
<script id="template" type="text/nornj">
  <div>
    this the test demo Hello {{msg}}
    <input id="test" onclick="{{click}}" />
  </div>
</script>
<script type="text/javascript">
  var tmpl = document.querySelector('#template').innerHTML;
</script>
```

然后可以这样渲染html字符串：

```js
let html = nj.render(tmpl, {
  msg: 'Hello world!',
  click: "alert('test')"
});

console.log(html);
/*输出：
<div>
  this the test demo Hello world!
  <input id='test' onclick="alert('test')" />
</div>
*/
```

## 安装

使用npm安装:

```sh
npm install nornj
```

## 相关项目

* [nornj-react(React适配库)](https://github.com/joe-sky/nornj-react)
* [nornj-loader(Webpack loader)](https://github.com/joe-sky/nornj-loader)
* [nornj-cli(脚手架工具)](https://github.com/joe-sky/nornj-cli)

## 语法高亮插件

* [nornj-highlight(vscode语法高亮插件)](https://github.com/joe-sky/nornj-highlight)

## 示例项目

* [react-redux-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc)
* [react-redux-nornj-todomvc-es5](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc-es5)
* [backbone-marionette-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/backbone-marionette-nornj-todomvc)
* [nornj-react-native-counter](https://github.com/joe-sky/nornj-react-native-counter)

## 浏览器支持

* 可支持所有现代浏览器以及Internet Explorer 9+。

## License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj.svg
[npm-url]: https://www.npmjs.org/package/nornj