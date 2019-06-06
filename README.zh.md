<a href="https://joe-sky.github.io/nornj-guide/" target="_blank" rel="noopener noreferrer"><img width="187" src="./docs/logo.png" alt="NornJ logo"></a>
-------

```
  ____        __   
/\  __ \     /\ \  
\ \ \/\ \   _\_\ \ `<html>
 \ \_\ \_\ /\_____\   Hello World!
  \/_/\/_/ \/_____/ </html>`();

```

`NornJ`(读音[ˌnɔ:nˈdʒeɪ]，简称`nj`)是一个可以同React一起工作的模板引擎，**JSX的增强或替代工具**。

[![NPM Version][npm-image]][npm-url]
<a href="https://www.npmjs.com/package/nornj"><img src="https://img.shields.io/npm/l/nornj.svg" alt="License"></a>
<a href="https://travis-ci.org/joe-sky/nornj"><img src="https://travis-ci.org/joe-sky/nornj.svg?branch=master" alt="Travis CI Status"/></a>
<a href="https://codecov.io/gh/joe-sky/nornj"><img src="https://codecov.io/gh/joe-sky/nornj/branch/master/graph/badge.svg" alt="Codecov" /></a>
[![NPM Downloads][downloads-image]][npm-url]
[![](https://img.shields.io/bundlephobia/minzip/nornj@next.svg?style=flat)](https://bundlephobia.com/result?p=nornj@next)

[English](https://github.com/joe-sky/nornj/blob/master/README.md) | 简体中文

> 通知：NornJ的最新版`5.0.0`即将发布，旧版`0.4.x`将不再更新。

## 文档

* [NornJ指南(v5)](https://joe-sky.gitbooks.io/nornj-guide/zh/)
* [NornJ指南(v0.4)](https://joe-sky.github.io/nornj-guide)

## 概述

`React`的`JSX`几乎可以使用`javascript`的全部语法且非常灵活，可配合`babel`适应各种复杂的使用场景。但是，使用`NornJ`配合`React`开发还能做得更好，因为它能给JSX带来`模板引擎`的特性：

* 支持流程控制语法：

```js
<Each of={[1, 2, 3]}><i>{item}</i></Each>
```

* 支持指令语法：

```js
<img n-show={false} />
```

* 支持过滤器语法：

```js
<button>{n`${foo} | capitalize`}</button>
```

* 支持自定义运算符：

```js
<input value={n`(1 .. 100).join('-')`} />
```

`NornJ`不仅有预置的上述几类可增强`JSX`的语法，并且还实现了**支持用户扩展更多的语法**。`NornJ`还同时提供了`JSX`和`tagged templates`两套几乎相同的语法API，以适应不同用户的口味 :wink:

## 基本示例

* 直接在JSX中使用(结合[styled-jsx](https://github.com/zeit/styled-jsx))：

```js
class App extends Component {
  addTodo = e => {
    const { todos = [] } = this.state;
    this.setState({ todos: todos.concat(`Item ${todos.length}`) });
  };

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
          <Each of={todos} item="todo">
            <If condition={index > 5}>
              <li>{todo * 2}</li>
              <Elseif condition={index > 10}>
                <li>{todo * 3}</li>
              </Elseif>
            </If>
          </Each>
        </ul>
        <button n-show={todos.length > 0} onClick={this.addTodo}>Add Todo</button>
      </div>
    );
  }
}
```

如上例，配合`NornJ`提供的[配套babel插件](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)，便可以在`JSX`中编写各种新的增强语法。

* 使用`tagged templates`语法(结合[styled-components](https://github.com/styled-components/styled-components))：

```js
const template = html`
  <Container>
    <ul>
      <each of={todos}>
        <if {@index > 5}>
          <li>{@item * 2}</li>
          <elseif {@index > 10}>
            <li>{@item * 3}</li>
          </elseif>
        </if>
      </each>
    </ul>
    <button n-show="{todos.length > 0}" :onClick="addTodo">Add Todo</button>
  </Container>
`;

const Container = styled.div`
  padding: 20px;
  font-size: .75rem;
`;

class App extends Component {
  addTodo = e => {
    const { todos = [] } = this.state;
    this.setState({ todos: todos.concat(`Item ${todos.length}`) });
  };

  render() {
    return template({ components: { Container } }, this.state, this);
  }
}
```

上例中使用了`NornJ`的`tagged templates API`创建了一个模板函数，它可以做到与`React`组件的逻辑代码分离，并且还能支持比`JSX API`更加简练的写法。

## 在线演示地址

### 使用JSX

* [在线Playground(codesandbox)](https://codesandbox.io/s/z2nj54r3wx)

### 使用tagged templates

* [在线Playground(codepen)](https://codepen.io/joe_sky/pen/ooPNbj)

## 安装

```sh
npm install babel-plugin-nornj-in-jsx@next  #or yarn add babel-plugin-nornj-in-jsx@next
```

然后配置`.babelrc`:

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

## 示例项目

* NornJ + React + Redux + React-Router + Webpack: [react-redux-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc)
* NornJ + React + Redux + React-Router(无需webpack打包): [react-redux-nornj-todomvc-es5](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc-es5)
* NornJ + Backbone + Marionette(渲染html字符串): [backbone-marionette-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/backbone-marionette-nornj-todomvc)
* NornJ + React-Native + Styled-Components: [nornj-react-native-counter](https://github.com/joe-sky/nornj-react-native-counter)
* NornJ + React + Mobx + React-Router: [nornj-react-mst-boilerplate](https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst)

## 相关项目及工具

* [nornj-react(React适配库)](https://github.com/joe-sky/nornj-react)
* [nornj-loader(Webpack loader)](https://github.com/joe-sky/nornj-loader)
* [babel-plugin-nornj-in-jsx(支持在JSX中写NornJ语法的Babel插件)](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)
* [babel-plugin-nornj-loader(nornj-loader的Babel插件版)](https://github.com/yuhongda/babel-plugin-nornj-loader)
* [react-native transformer(nornj-loader的RN版)](https://github.com/joe-sky/nornj/blob/master/tools/metroTransformer.js)
* [express-nornj(NornJ适配Express的视图引擎)](https://github.com/joe-sky/nornj/blob/master/tools/expressEngine.js)
<!-- * [koa-nornj(NornJ适配Koa的中间件)](https://github.com/qingqinxl1/koa-nornj) -->

## 语法高亮插件

* [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)
<!-- * [language-nornj(atom)](https://github.com/zyj1022/language-nornj) -->

## 浏览器支持

* 可支持所有现代浏览器以及Internet Explorer 9+。

## License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj.svg
[npm-url]: https://www.npmjs.org/package/nornj