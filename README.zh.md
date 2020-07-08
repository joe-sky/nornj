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

`NornJ`(读音[ˌnɔ:nˈdʒeɪ]，简称`nj`)是一个基于 Babel 的 React JSX 新增语法扩展方案。

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

`React`的`JSX`几乎可以使用`javascript`的全部语法且非常灵活，可配合`babel`适应各种复杂的使用场景。但是，使用`NornJ`配合`React`开发还能做得更好，因为它能给 JSX 带来新特性：

- 支持流程控制语法：

```js
<each of={[1, 2, 3]}>
  <i>{item}</i>
</each>
```

- 支持指令语法：

```js
<img n-show={false} />
```

- 支持过滤器语法：

```js
<button>{n`foo | upperFirst`}</button>
```

- 支持自定义运算符：

```js
<input value={n`(1 .. 100).join('-')`} />
```

`NornJ`不仅有预置的上述几类可增强`JSX`的语法，并且还实现了**支持用户扩展更多的语法**。

<!-- `NornJ`还同时提供了`JSX`和`tagged templates`两套几乎相同的语法 API，以适应不同用户的口味 :wink: -->

## 基本示例

- 直接在 JSX 中使用(结合[styled-jsx](https://github.com/zeit/styled-jsx))：

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

如上例，配合`NornJ`提供的[配套 babel 插件](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)，便可以在`JSX`中编写各种新的增强语法。

<!-- - 使用`tagged templates`语法(结合[styled-components](https://github.com/styled-components/styled-components))：

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

上例中使用了`NornJ`的`tagged templates API`创建了一个模板函数，它可以做到与`React`组件的逻辑代码分离，并且还能支持比`JSX API`更加简练的写法。 -->

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
