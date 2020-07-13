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

English | [简体中文](https://github.com/joe-sky/nornj/blob/master/README.zh.md)

## Introduction

`NornJ`(pronounced [ˌnɔ:nˈdʒeɪ]，abbreviated as `nj`) is a JS(X) extension solution based on Template Engine.

## Documents

- [NornJ Guide(github.io)](https://joe-sky.github.io/nornj)
- [NornJ Guide(gitee.io)](https://joe-sky.gitee.io/nornj)

## Packages

| Package                                                                                                            | Badges                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [nornj](https://github.com/joe-sky/nornj/tree/master/packages/nornj)                                               | <a href="https://www.npmjs.org/package/nornj"><img src="https://img.shields.io/npm/v/nornj.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/nornj"><img src="https://img.shields.io/npm/dm/nornj.svg" alt="NPM Downloads"></a> <a href="https://bundlephobia.com/result?p=nornj"><img src="https://img.shields.io/bundlephobia/minzip/nornj.svg?style=flat" alt="Minzipped Size"></a>                                     |
| [nornj-react](https://github.com/joe-sky/nornj/tree/master/packages/nornj-react)                                   | <a href="https://www.npmjs.org/package/nornj-react"><img src="https://img.shields.io/npm/v/nornj-react.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/nornj-react"><img src="https://img.shields.io/npm/dm/nornj-react.svg" alt="NPM Downloads"></a> <a href="https://bundlephobia.com/result?p=nornj-react"><img src="https://img.shields.io/bundlephobia/minzip/nornj-react.svg?style=flat" alt="Minzipped Size"></a> |
| [babel-plugin-nornj-in-jsx](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)       | <a href="https://www.npmjs.org/package/babel-plugin-nornj-in-jsx"><img src="https://img.shields.io/npm/v/babel-plugin-nornj-in-jsx.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/babel-plugin-nornj-in-jsx"><img src="https://img.shields.io/npm/dm/babel-plugin-nornj-in-jsx.svg" alt="NPM Downloads"></a>                                                                                                            |
| [babel-preset-nornj-with-antd](https://github.com/joe-sky/nornj/tree/master/packages/babel-preset-nornj-with-antd) | <a href="https://www.npmjs.org/package/babel-preset-nornj-with-antd"><img src="https://img.shields.io/npm/v/babel-preset-nornj-with-antd.svg" alt="NPM Version"></a> <a href="https://www.npmjs.org/package/babel-preset-nornj-with-antd"><img src="https://img.shields.io/npm/dm/babel-preset-nornj-with-antd.svg" alt="NPM Downloads"></a>                                                                                                |

## Introduction

In `React` development, the `JSX` can use almost all the syntax of javascript and it's very flexible. But if we use `NornJ` with `React` and `JSX`, we can do better, because it can gives JSX new features:

- Support control statements：

```js
<each of={[1, 2, 3]}>
  <i>{item}</i>
</each>
```

- Support directives：

```js
<img n-show={false} />
```

- Support filters：

```js
<button>{n`foo | upperFirst`}</button>
```

- Support custom operators：

```js
<input value={n`(1 .. 100).join('-')`} />
```

`NornJ` presets the above `JSX` enhancement syntaxs, and also **supports custom extensions of more syntaxs**. It provides two kinds of similar API: `JSX` and `Tagged templates`, can adapt to the preferences of different users :wink:.

## Basic

- Use NornJ syntaxs in JSX(with [styled-jsx](https://github.com/zeit/styled-jsx))：

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

For above example, combining with the [Babel plugin provided by NornJ](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx), it is possible to write various new enhancement syntaxs in JSX.

- Use NornJ tagged templates syntaxs(with [styled-components](https://github.com/styled-components/styled-components))：

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

In the above example, a template function was created using `tagged templates API of NornJ`. In this way, the template can be separated from the component logic code, and it also supports more concise writing than `NornJ JSX API`.

## Playground

- [nornj-antd-v4-demo(Codesandbox)](https://codesandbox.io/s/nostalgic-driscoll-t8kty)

## Install

```sh
npm install babel-plugin-nornj-in-jsx  #or yarn add babel-plugin-nornj-in-jsx
```

Next, add `nornj-in-jsx` to plugins in your babel configuration:

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

## Boilerplate projects

- [nornj-antd-v4-demo](https://github.com/joe-sky/nornj-antd-v4-demo)

## Syntax highlight

- [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)

## License

MIT
