<p align="center">
  <a href="https://joe-sky.github.io/nornj-guide/" target="_blank" rel="noopener noreferrer"><img width="240" src="./public/images/nornj.png" alt="NornJ"></a>
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

`NornJ`(pronounced [ˌnɔ:nˈdʒeɪ]，abbreviated as `nj`) is a template engine that can works with React, JSX enhancement or alternative tools.

## Documents

- [NornJ Guide(v5)](https://joe-sky.github.io/nornj-guide/zh)
- [NornJ Guide(v0.4)](https://joe-sky.github.io/nornj-guide-v0.4)

## Introduction

In `React` development, the `JSX` can use almost all the syntax of javascript and it's very flexible. But if we use `NornJ` with `React` and `JSX`, we can do better, because it can gives JSX `template engine` features:

- Support control statements：

```js
<Each of={[1, 2, 3]}>
  <i>{item}</i>
</Each>
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

For above example, combining with the [Babel plugin provided by NornJ](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx), it is possible to write various new enhancement syntaxs in JSX.

- Use NornJ tagged templates syntaxs(with [styled-components](https://github.com/styled-components/styled-components))：

```js
const template = html`
  <Container>
    <ul>
      <each of="{todos}">
        <if {@index>
          5}>
          <li>{@item * 2}</li>
          <elseif {@index>
            10}>
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

### Use it in JSX

- [NornJ playground(codesandbox)](https://codesandbox.io/s/z2nj54r3wx)

### Use tagged templates

- [NornJ playground(codepen)](https://codepen.io/joe_sky/pen/ooPNbj)

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

<!-- ## Boilerplate projects

* NornJ + React + Redux + React-Router + Webpack: [react-redux-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc)
* NornJ + React + Redux + React-Router(no need webpack): [react-redux-nornj-todomvc-es5](https://github.com/joe-sky/nornj/blob/master/examples/react-redux-nornj-todomvc-es5)
* NornJ + Backbone + Marionette(render html string): [backbone-marionette-nornj-todomvc](https://github.com/joe-sky/nornj/blob/master/examples/backbone-marionette-nornj-todomvc)
* NornJ + React-Native + Styled-Components: [nornj-react-native-counter](https://github.com/joe-sky/nornj-react-native-counter)
* NornJ + React + Mobx + React-Router: [nornj-react-mst-boilerplate](https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst)

## Tools

* [nornj-react(React bindings)](https://github.com/joe-sky/nornj-react)
* [nornj-loader(Webpack loader)](https://github.com/joe-sky/nornj-loader)
* [babel-plugin-nornj-in-jsx(Babel plugin provided by NornJ)](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)
* [babel-plugin-nornj-loader(nornj-loader's Babel plugin ver)](https://github.com/yuhongda/babel-plugin-nornj-loader)
* [react-native transformer(nornj-loader's RN ver)](https://github.com/joe-sky/nornj/blob/master/tools/metroTransformer.js)
* [express-nornj(NornJ's Express view engine)](https://github.com/joe-sky/nornj/blob/master/tools/expressEngine.js) -->
<!--* [koa-nornj(NornJ's Koa middleware)](https://github.com/qingqinxl1/koa-nornj)-->

## Syntax highlight

- [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)
  <!--* [language-nornj(atom)](https://github.com/zyj1022/language-nornj)-->

<!-- ## Browser support

* Supports all modern browsers and Internet Explorer 9+. -->

## License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj.svg
[npm-url]: https://www.npmjs.org/package/nornj
