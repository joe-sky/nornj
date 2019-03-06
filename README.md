<a href="https://joe-sky.github.io/nornj-guide/" target="_blank" rel="noopener noreferrer"><img width="187" src="./docs/logo.png" alt="NornJ logo"></a>
-------

```
  ____        __   
/\  __ \     /\ \  
\ \ \/\ \   _\_\ \ `<html>
 \ \_\ \_\ /\_____\   Hello World!
  \/_/\/_/ \/_____/ </html>`();

```

`NornJ`(读音[nɔ:n dʒeɪ]，简称`nj`)是一个可以同React一起工作的模板引擎，**JSX的增强或替代工具**。

[![NPM Version][npm-image]][npm-url]
<a href="https://www.npmjs.com/package/nornj"><img src="https://img.shields.io/npm/l/nornj.svg" alt="License"></a>
<a href="https://travis-ci.org/joe-sky/nornj"><img src="https://travis-ci.org/joe-sky/nornj.svg?branch=master" alt="Travis CI Status"/></a>
<a href="https://codecov.io/gh/joe-sky/nornj"><img src="https://codecov.io/gh/joe-sky/nornj/branch/master/graph/badge.svg" alt="Codecov" /></a>
[![NPM Downloads][downloads-image]][npm-url]

## 文档

* [NornJ指南(github pages版)](https://joe-sky.github.io/nornj-guide)
* [NornJ指南(gitbook版)](https://joe-sky.gitbooks.io/nornj-guide)

## 概述

`React`的`JSX`几乎可以使用`javascript`的全部语法且非常灵活，可配合`babel`适应各种复杂的使用场景。但是，使用`NornJ`配合`React`开发还能做得更好：

* 支持指令语法：```<img n-show={false} />```；
* 支持流程控制语法：```<each of={[1, 2, 3]}>{item}</each>```；
* 支持过滤器语法：```<button>{n`${'abc'} | capitalize`}</button>```；
* 支持自定义运算符：```<input value={n`(1 .. 100).join('-')`} />```；
* 还有更多...

上述这些可增强`JSX`的语法，`NornJ`模板引擎中还有很多，并且还可支持自由扩展。`NornJ`还同时提供了`JSX`和`tagged templates`两套几乎相同的语法API，以适应不同用户的口味 :wink:

## 基本示例

* 直接在JSX中使用(结合[styled-jsx](https://github.com/zeit/styled-jsx))：

```js
class App extends Component {
  addTodo() {
    const { todos = [] } = this.state;
    this.setState({ todos: todos.concat(`Item ${todos.length}`) });
  }
  render({ page }, { todos = [] }) {
    return (
      <div className="app">
        <style jsx>`
          .app {
            padding: 20px;
            font-size: .75rem;
          }
        `</style>
        <ul>
          <each of={todos} item="todo">
            <if condition={index > 5}>
              <li>{todo * 2}</li>
              <elseif condition={index > 10}>
                <li>{todo * 3}</li>
              </elseif>
            </if>
          </each>
        </ul>
        <button n-show={todos.length > 0} onClick={() => this.addTodo()}>Add Todo</button>
      </div>
    );
  }
}
```

如上例，配合`NornJ`提供的[配套babel插件](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)，便可以在`JSX`中编写各种新的增强语法。

* 使用`tagged templates`语法(结合[styled-components](https://github.com/styled-components/styled-components))：

```js
const template = nj`
  <Container>
    <ul>
      <#each of={todos}>
        <#if {@index > 5}>
          <li>{@item * 2}</li>
          <#elseif {@index > 10}>
            <li>{@item * 3}</li>
          </#elseif>
        </#if>
      </#each>
    </ul>
    <button n-show={todos.length > 0} onClick={() => addTodo()}>Add Todo</button>
  </Container>
`;

const Container = styled.div`
  padding: 20px;
  font-size: .75rem;
`;

class App extends Component {
  addTodo() {
    const { todos = [] } = this.state;
    this.setState({ todos: todos.concat(`Item ${todos.length}`) });
  }
  render() {
    return template({ components: { Container } }, this.state, this);
  }
}
```

上例中使用了`NornJ`的`tagged templates API`创建了一个模板函数，它可以做到与`React`组件的逻辑代码分离，并且还能支持比`JSX API`更加简练的写法。

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
* [babel-plugin-nornj-in-jsx(支持在JSX中写NornJ语法的Babel插件)](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)
* [babel-plugin-nornj-loader(nornj-loader的Babel插件版)](https://github.com/yuhongda/babel-plugin-nornj-loader)
* [react-native transformer(nornj-loader的RN版)](https://github.com/joe-sky/nornj/blob/master/tools/metroTransformer.js)
* [koa-nornj(NornJ适配Koa的中间件)](https://github.com/qingqinxl1/koa-nornj)
* [express-nornj(NornJ适配Express的视图引擎)](https://github.com/joe-sky/nornj/blob/master/tools/expressEngine.js)

## 语法高亮插件

* [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)
* [language-nornj(atom)](https://github.com/zyj1022/language-nornj)

## 浏览器支持

* 可支持所有现代浏览器以及Internet Explorer 9+。

## License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj.svg
[npm-url]: https://www.npmjs.org/package/nornj