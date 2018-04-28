# NornJ

```
  ____        __   
/\  __ \     /\ \  
\ \ \/\ \   _\_\ \ `<div>
 \ \_\ \_\ /\_____\   Hello World!
  \/_/\/_/ \/_____/ </div>`();

```

`NornJ`是一个**渲染高效**，**可读性好**，**扩展容易**，**适用性广**的javascript模板引擎。

[![NPM Version][npm-image]][npm-url]
<a href="https://www.npmjs.com/package/nornj"><img src="https://img.shields.io/npm/l/nornj.svg" alt="License"></a>
<a href="https://travis-ci.org/joe-sky/nornj"><img src="https://travis-ci.org/joe-sky/nornj.svg?branch=master" alt="Travis CI Status"/></a>
<a href="https://codecov.io/gh/joe-sky/nornj"><img src="https://codecov.io/gh/joe-sky/nornj/branch/master/graph/badge.svg" alt="Codecov" /></a>
[![NPM Downloads][downloads-image]][npm-url]

## 在线文档

* [NornJ中文指南(github pages)](https://joe-sky.github.io/nornj-guide)
* [NornJ中文指南(gitbook)](https://joe-sky.gitbooks.io/nornj-guide)

## 概述

`NornJ`(读音[nɔ:n dʒeɪ]，简称`nj`)是一款同时支持渲染`纯字符串(html)`和`HyperScript(React vdom)`的模板引擎。

> 什么是`HyperScript`?

[`HyperScript`](https://github.com/hyperhype/hyperscript)可以说是一种创建用户界面元素的语法规范，即：`h (tag, attrs, [text?, Elements?,...])`语法。各大前端框架中对于它的应用，最著名的当属`React`。`React`的`createElement`方法即为`HyperScript`的一种实现，`React`使用它来创建`virtual dom`对象。

而`NornJ`可将同样语法规范的模板，转换为多种方式渲染：

```
                +---------------------+
                ¦ <Template string /> ¦
                +---------------------+
                           |
                           |
           +-------------------------------+
           |           render to           |
           |                               |
 +-------------------+     +--------------------------------+
 ¦ pure string(html) ¦     ¦ HyperScript(React virtual dom) ¦
 +-------------------+     +--------------------------------+
```

因此，`NornJ`不但可以作为`Express`及`Koa`服务器的界面模板引擎，还可以作为`React`开发中`JSX`的替代品，解决`JSX`在表现流程控制语句等一些方面的不足。它的语法和`JSX`并不互相排斥，可共存一起运行。

## 模板基本示例

* 在单独的模板文件中编写

```html
<template name="partial">
  <#if {{i > 0 || (i <= -10)}}>
    <input id=test onclick={{click}}>
  </#if>
</template>

<template>
  <div>
    <#each {{1 .. 20}}>
      this the test demo Hello {{@index ** 2 | int}}
    </#each>
    <#include name="partial" />
  </div>
</template>
```

如上，`NornJ`的语法结构在尽量与html保持一致的同时，更有丰富的扩展语法去实现各种逻辑；且拥有`..`、`**`等js原生不支持的运算符，而且还可以自由扩展出更多的新语句与运算符!

* 在js文件中像JSX那样编写

```js
const props = { id: 'test', name: 'test' };

const partial = nj`
  <#if {{i > 0 || (i <= -10)}}>
    <input onclick={{click}} ...${props}>
  </#if>
`;

const template = nj`
  <div>
    <#each {{1 .. 20}}>
      this the test demo Hello {{@index ** 2 | int}}
    </#each>
    #${partial}
  </div>
`;
```

`NornJ`也同时支持像`JSX`那样在js文件中自由地编写，它使用`ES2015+`提供的`tagged template literals`语法；并且几乎所有JSX支持的特性，它也都是支持的!

## 在线演示地址

### 渲染html字符串

* [在线Playground(jsfiddle)](https://jsfiddle.net/joe_sky/byjdkaf1/)
* [在线Playground(codepen)](https://codepen.io/joe_sky/pen/BrGvVG)

### 渲染React组件

* [在线Playground(jsfiddle)](https://jsfiddle.net/joe_sky/n5n9tutj/)
* [在线Playground(codepen)](https://codepen.io/joe_sky/pen/ooPNbj)

## 安装

```sh
npm install nornj
npm install nornj-react   # React开发请一起安装此包
npm install nornj-loader  # webpack环境请一起安装此包
```

## 项目脚手架

* [nornj-cli](https://github.com/joe-sky/nornj-cli)

该脚手架的使用方法类似于`vue-cli`，目前可创建完整的基于`react + mobx`的项目模板，并有[快速上手文档](https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/overview.md)。

## 示例项目

* [todomvc[react + redux + react-router + nornj + webpack4]](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc)
* [todomvc(无需webpack打包)[react + redux + react-router + nornj]](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc-es5)
* [todomvc[backbone + marionette + nornj]](https://github.com/joe-sky/nornj/blob/master/examples/backbone-marionette-nornj-todomvc)
* [计数器示例[react-native + styled-components + nornj]](https://github.com/joe-sky/nornj-react-native-counter)
* [项目脚手架[react + mobx + react-router + nornj]](https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst)

## 特色

传统js模板引擎如`Handlebars`、`EJS`、`Nunjucks`等通常只支持渲染字符串，`NornJ`与它们相比，相同点和不同点都有：

* 支持渲染`React`的`virtual dom`对象，可替代或辅助`JSX`运行。
* 支持渲染字符串，就像传统的js模板引擎一样支持`Express`或`Koa`等渲染html；也支持为`各类文本文件`提供模板渲染。
* 模板语法简单且丰富，在参考自`Handlebars`、`Nunjucks`、`Vue`等著名项目的基础上，也有很多自己独特的语法。
* 语法的可扩展性强大且开发扩展容易，模板中的每个`运算符`及`语句`都是可以扩展的。
* 它有多种使用方式适应不同场景：
  * 可用单独的模板文件定义，并用`Webpack loader`编译；
  * 也可以用`script`标签写在html中；
  * 还可以支持用`ES2015+的模板字符串`语法直接在js文件中编写。
* 高效渲染，几乎不逊于`Handlebars`、`JSX`等主流模板。
* 它不仅可以直接在浏览器中运行，也支持`模板预编译`；去除编译器的runtime版仅`不到5kb(gzip)`大小。

## 与React配合示例

`NornJ`可以替代JSX输出React组件，与JSX相比，它的语法更像html：

JSX：

```js
class TestComponent extends Component {
  render() {
    const { no } = this.props;

    return (
      <div id=test1 className="test1" style={{ color: 'purple', height: 200 }}>
        this the test demo{no}.<input type="text" />
        {Object.keys(Array.from({ length: no })).map((value, index) => {
          return <i>test{index}</i>;
        })}
      </div>
    );
  }
}
```

上例使用`NornJ`实现：

```js
import { Component } from 'react';
import { render } from 'react-dom';
import nj, { template as t } from 'nornj';
import { registerTmpl } from 'nornj-react';

@registerTmpl('TestComponent')
class TestComponent extends Component {
  render() {
    return nj`
      <div id=test1 class="test1" style="color:purple;height:200px;">
        this the test demo{no}.<input type="text">
        <#for {1} {no}>
          <i>test{@index}</i>
        </#for>
      </div>
    `(this.props);
  }
}

render(t`<TestComponent no={100} />`, document.body);

/* output:
<div id="test1" class="test1" style="color:purple;height:200px;">
  this the test demo100.<input type="text" />
  <i>test0</i>
  <i>test1</i>
  <i>test2</i>
  ...
  <i>test99</i>
</div>
*/
```

还支持将模板抽离到单独的文件中编写：

test.nj.html：

```html
<div id=test1 class="test1" style="color:purple;height:200px;">
  this the test demo{no}.<input type="text">
  <#for {1} {no}>
    <i>test{@index}</i>
  </#for>
</div>
```

```js
import template from './test.nj.html';

@registerTmpl('TestComponent')
class TestComponent extends Component {
  render() {
    return template(this.props);
  }
}
```

## 更多使用场景

`NornJ`模板也可以支持放在script标签中等传统的方式编写：

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

`NornJ`在支持渲染`React`组件的同时，还支持渲染普通的html字符串：

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

## 相关项目及工具

* [nornj-react(React适配库)](https://github.com/joe-sky/nornj-react)
* [nornj-loader(Webpack loader)](https://github.com/joe-sky/nornj-loader)
* [babel-plugin-nornj-loader(babel插件)](https://github.com/yuhongda/babel-plugin-nornj-loader)
* [koa-nornj(koa适配库)](https://github.com/qingqinxl1/koa-nornj)
* [express适配器](https://github.com/joe-sky/nornj/blob/master/tools/expressEngine.js)
* [react-native transformer](https://github.com/joe-sky/nornj/blob/master/tools/metroTransformer.js)

## 语法高亮插件

* [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)
* [language-nornj(atom)](https://github.com/zyj1022/language-nornj)

## 浏览器支持

* 可支持所有现代浏览器以及Internet Explorer 9+。

## 谁在使用

![who use](https://joe-sky.github.io/nornj-guide/images/y-dept.jpg?raw=true)

## License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj.svg
[npm-url]: https://www.npmjs.org/package/nornj