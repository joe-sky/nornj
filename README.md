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

* [NornJ中文指南](https://joe-sky.gitbooks.io/nornj-guide/)

## 特色

传统js模板引擎如`Handlebars`、`EJS`等通常只支持渲染html字符串，`NornJ`与它们相比，相同点和不同点都有：

* 支持渲染`React`的`virtual dom`对象，作为`JSX`的替代模板语言。
* 支持渲染html字符串，故它也可以像传统js模板引擎一样支持`Backbone`或`Express`等。
* 它的语法注重表现与逻辑的隔离性，和`Handlebars`更类似一些，但也有很多独特的地方。
* 语法拥有非常强大的可扩展性，例如模板中的每个`运算符`及`语句`都是可以扩展的。
* 它有多种使用方式适应不同场景，可用单独的模板文件定义；可以写在html中；还可以支持直接在js文件中编写。
* 可支持模板预编译，也可以直接在浏览器中运行。

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

## 示例项目

* [react-redux-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc)
* [react-redux-nornj-todomvc-es5](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc-es5)
* [backbone-marionette-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/backbone-marionette-nornj-todomvc)
* [nornj-react-native-counter](https://github.com/joe-sky/nornj-react-native-counter)

## 浏览器支持

* 可支持所有现代浏览器以及Internet Explorer 9+。

## 更多详细文档

* [模板语法](https://github.com/joe-sky/nornj/blob/master/docs/模板语法.md)
* [编译模板并输出html字符串](https://github.com/joe-sky/nornj/blob/master/docs/编译模板并输出html字符串.md)
* [编译模板并输出React组件](https://github.com/joe-sky/nornj/blob/master/docs/编译模板并输出React组件.md)
* [在独立模板文件中分模块构建](https://github.com/joe-sky/nornj/blob/master/docs/在独立模板文件中分模块构建.md)
* [在html dom中渲染React组件](https://github.com/joe-sky/nornj/blob/master/docs/在html%20dom中渲染React组件.md)
* [模板全局配置](https://github.com/joe-sky/nornj/blob/master/docs/模板全局配置.md)

## License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj.svg
[npm-url]: https://www.npmjs.org/package/nornj