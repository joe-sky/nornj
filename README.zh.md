<p align="center">
  <a href="https://joe-sky.github.io/nornj/" target="_blank" rel="noopener noreferrer"><img width="240" src="public/images/nornj.png" alt="NornJ"></a>
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/nornj"><img src="https://img.shields.io/npm/v/nornj.svg" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/nornj"><img src="https://img.shields.io/npm/l/nornj.svg" alt="License"></a>
  <a href="https://travis-ci.org/joe-sky/nornj"><img src="https://travis-ci.org/joe-sky/nornj.svg?branch=master" alt="Travis CI Status"></a>
  <a href="https://codecov.io/gh/joe-sky/nornj"><img src="https://codecov.io/gh/joe-sky/nornj/branch/master/graph/badge.svg" alt="Codecov"></a>
  <a href="https://www.npmjs.org/package/nornj"><img src="https://img.shields.io/npm/dm/nornj.svg" alt="NPM Downloads"></a>
  <a href="https://bundlephobia.com/result?p=nornj"><img src="https://img.shields.io/bundlephobia/minzip/nornj@next.svg?style=flat" alt="Minzipped Size"></a>
</p>

[English](https://github.com/joe-sky/nornj/blob/master/README.md) | 简体中文

## 简介

`NornJ`(读音[ˌnɔ:nˈdʒeɪ]，简称`nj`)是一个基于模板引擎的 JS(X) 语法扩展方案。

## 概述

> 目前 `v5.x` 文档中暂时只有 JSX API，作者正在整理最新版 NornJ 模板引擎文档，近期放出。

`NornJ` 基于 Babel 为 JS/JSX/TS/TSX 环境带来了一些新语法体验，最常用的使用场景就是配合 React 来使用它。这些新语法有如下这几类：

- 流程控制

```js
<each of={[1, 2, 3]}>
  <i>{item}</i>
</each>
```

- 指令

```js
<img n-show={false} />
```

- 过滤器

```js
<button>{n`foo | upperFirst`}</button>
```

- 自定义运算符

```js
<input value={n`(1 .. 100).join('-')`} />
```

这些语法都是可扩展的，也就是说我们可以使用 `NornJ` 的特性，来亲自创造更多的新语法思路 :wink:

## 特征

- ✨ 内置 if/for/switch 等基本 JSX 标签扩展(可对比：[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements))
- ⭐ 内置 show/style/debounce 等基本 JSX 指令扩展(可对比：[babel-plugin-react-directives](https://github.com/peakchen90/babel-plugin-react-directives))
- 🌟 内置原生 JS 没有的 `..`、`<=>` 等自定义运算符
- 💫 以上几种 JS/JSX 扩展语法，都可以支持用户自行扩展出新的
- 🔥 扩展语法能够突破 JSX/TSX 现有的能力
- ⚡ 性能好，含运行时但体积小
- 🚀 上手超快，直接配置 Babel 即可使用

## 文档

- [NornJ 文档(github.io)](https://joe-sky.github.io/nornj)
- [NornJ 文档(gitee.io)](https://joe-sky.gitee.io/nornj)

## Packages

| Package                                                                                                            | Badges                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [nornj](https://github.com/joe-sky/nornj/tree/master/packages/nornj)                                               | <a href="https://www.npmjs.org/package/nornj"><img src="https://img.shields.io/npm/v/nornj.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/nornj"><img src="https://img.shields.io/npm/dm/nornj.svg" alt="NPM Downloads"></a> <a href="https://bundlephobia.com/result?p=nornj"><img src="https://img.shields.io/bundlephobia/minzip/nornj.svg?style=flat" alt="Minzipped Size"></a>                                     |
| [nornj-react](https://github.com/joe-sky/nornj/tree/master/packages/nornj-react)                                   | <a href="https://www.npmjs.org/package/nornj-react"><img src="https://img.shields.io/npm/v/nornj-react.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/nornj-react"><img src="https://img.shields.io/npm/dm/nornj-react.svg" alt="NPM Downloads"></a> <a href="https://bundlephobia.com/result?p=nornj-react"><img src="https://img.shields.io/bundlephobia/minzip/nornj-react.svg?style=flat" alt="Minzipped Size"></a> |
| [babel-plugin-nornj-in-jsx](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)       | <a href="https://www.npmjs.org/package/babel-plugin-nornj-in-jsx"><img src="https://img.shields.io/npm/v/babel-plugin-nornj-in-jsx.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/babel-plugin-nornj-in-jsx"><img src="https://img.shields.io/npm/dm/babel-plugin-nornj-in-jsx.svg" alt="NPM Downloads"></a>                                                                                                            |
| [babel-preset-nornj-with-antd](https://github.com/joe-sky/nornj/tree/master/packages/babel-preset-nornj-with-antd) | <a href="https://www.npmjs.org/package/babel-preset-nornj-with-antd"><img src="https://img.shields.io/npm/v/babel-preset-nornj-with-antd.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/babel-preset-nornj-with-antd"><img src="https://img.shields.io/npm/dm/babel-preset-nornj-with-antd.svg" alt="NPM Downloads"></a>                                                                                                |

## React 示例

- 本例结合了[styled-jsx](https://github.com/zeit/styled-jsx)来演示在 JSX 中使用：

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
          <each of={todos} item="todo">
            <if condition={index > 5}>
              <li>{todo * 2}</li>
              <elseif condition={index > 10}>
                <li>{todo * 3}</li>
              </elseif>
            </if>
          </each>
        </ul>
        <button n-show={todos.length > 0} onClick={this.addTodo}>Add Todo</button>
      </div>
    );
  }
}
```

- 本例结合了[styled-components](https://github.com/styled-components/styled-components)来演示在 Tagged Templates 中使用 NornJ 的模板引擎语法（详细文档正在整理，近期放出）：

```js
const template = html`
  <Container>
    <ul>
      <each of="{todos}">
        <if condition="{@index > 5}">
          <li>{@item * 2}</li>
          <elseif condition="{@index > 10}">
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
  font-size: 0.75rem;
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

## 在线演示

- [nornj-antd-v4-demo(Codesandbox)](https://codesandbox.io/s/nostalgic-driscoll-t8kty)
- [nornj-antd-v4-demo(源码)](https://github.com/joe-sky/nornj-antd-v4-demo)

## 快速开始

### 1. 安装

```sh
npm install babel-plugin-nornj-in-jsx  #or yarn add babel-plugin-nornj-in-jsx
```

### 2. 配置 Babel

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

### 3. 开始使用

```js
import 'nornj-react';

const App = props => (
  <if condition={props.success}>
    <i>success</i>
    <else>
      <i>fail</i>
    </else>
  </if>
);

ReactDOM.render(<App success={false} />, document.querySelector('#app'));

//渲染结果：<i>fail</i>
```

更多语法请看[详细文档](https://joe-sky.gitee.io/nornj/jsx-extension/tags)。

## 它的工作原理

与大多数 Babel 插件的不同点是，`NornJ` 的语法扩展需要配合一些运行时代码。这些代码在 nornj 和 nornj-react 两个包里，Babel 插件在转换 js/ts 文件时，会依当前使用 `NornJ` 语法的情况，自动进行这两个包的导入工作。

我们来看一个具体例子，比如这段 JSX：

```js
ReactDOM.render(
  <div>
    <if condition={isTest}>
      <i>success</i>
      <else>
        <i>fail</i>
      </else>
    </if>
  </div>,
  document.body
);
```

会被 Babel 转换为：

```js
import nj from 'nornj';
import 'nornj-react';

ReactDOM.render(
  <div>
    {nj.renderH(
      {
        fn1: function(g, c, p) {
          return g.d('_njParam1');
        },
        fn2: function(g, c, p) {
          return g.d('_njParam2');
        },
        main: function(g, c, p) {
          var _params0 = {
            condition: c.d('isTest')
          };

          g.x['else'].apply(c, [{ tagProps: _params0, children: g.r(g, c, g.fn1) }]);

          return g.x['if'].apply(c, [{ props: _params0, children: g.r(g, c, g.fn2) }]);
        }
      },
      {
        isTest: isTest,
        _njParam1: () => <i>success</i>,
        _njParam2: () => <i>fail</i>
      }
    )}
  </div>,
  document.body
);
```

`NornJ` 的 Babel 插件会从 JS/JSX 代码中提取特殊信息，然后按需把它们转换为 nj.renderH 方法，再和那些常规的 JS/JSX 代码进行嵌套运行。

<!-- ## 它为什么这样工作 -->

## 语法高亮插件

NornJ 提供了一个 vscode 语法高亮插件, 对应它支持的少量需要高亮的功能：

- [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)

## License

MIT
