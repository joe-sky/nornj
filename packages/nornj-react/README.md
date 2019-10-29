# NornJ-React

React bindings for NornJ template engine.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![](https://img.shields.io/bundlephobia/minzip/nornj-react@next.svg?style=flat)](https://bundlephobia.com/result?p=nornj-react@next)

### Install

```sh
npm install nornj-react
```

### bindTemplate

You can use `bindTemplate` to register React components to `NornJ` template engine.

* Class components

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import nj from 'nornj';
import { bindTemplate } from 'nornj-react';

@bindTemplate
class TestComponent extends Component {
  render() {
    return <i>{this.props.children}</i>;
  }
}

ReactDOM.render(nj`<TestComponent>test</TestComponent>`(), document.body);
```

In addition, `bindTemplate` also support a `name` parameter:

```js
...
import { bindTemplate } from 'nornj-react';

@bindTemplate('test-Component')
class TestComponent extends Component {
  render() {
    return <i>{this.props.children}</i>;
  }
}

ReactDOM.render(nj`<test-Component>test</test-Component>`(), document.body);
```

* Function components

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import nj from 'nornj';
import { bindTemplate } from 'nornj-react';

const TestComponent = bindTemplate('test-Component')(props => (
  <i>{props.children}</i>
));

ReactDOM.render(nj`<test-Component>test</test-Component>`(), document.body);
```

### License

MIT

[npm-image]: http://img.shields.io/npm/v/nornj-react.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj-react.svg
[npm-url]: https://www.npmjs.org/package/nornj-react