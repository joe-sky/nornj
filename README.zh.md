<p align="center">
  <a href="https://joe-sky.gitee.io/nornj/" target="_blank" rel="noopener noreferrer"><img width="240" src="https://joe-sky.gitee.io/nornj/images/nornj.png" alt="NornJ"></a>
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

`NornJ`(读音[ˌnɔ:nˈdʒeɪ]，简称`nj`)是一个基于 Babel 的 JS(X) 新语法扩展方案。

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

## 概述

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

- ✨ 内置 if/for/switch 等基本 JSX 标签扩展(可参考：[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements))
- ⭐ 内置 show/style/debounce 等基本 JSX 指令扩展(可参考：[babel-plugin-react-directives](https://github.com/peakchen90/babel-plugin-react-directives))
- 🌟 内置原生 JS 没有的 `..`、`<=>` 等自定义运算符
- 💫 以上几种 JS(X) 扩展语法，都可以支持用户自行扩展出新的
- 🔥 扩展语法能够突破 JSX/TSX 现有的能力
- ⚡ 性能好，含运行时但体积小
- 🚀 上手超快，直接配置 Babel 即可使用

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

## 在线演示地址

- [nornj-antd-v4-demo(Codesandbox)](https://codesandbox.io/s/nostalgic-driscoll-t8kty)

## 安装

```sh
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

## 示例项目

- [nornj-antd-v4-demo](https://github.com/joe-sky/nornj-antd-v4-demo)

## 语法高亮插件

- [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)

## License

MIT
