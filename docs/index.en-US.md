---
title: NornJ - More exciting JS(X) based on Babel
hero:
  title: NornJ
  desc: 🌠 More exciting JS(X) based on Babel
  actions:
    - text: Getting Started
      link: /guide/getting-started
features:
  - icon: https://gw.alipayobjects.com/os/q/cms/images/k9ziitmp/13668549-b393-42a2-97c3-a6365ba87ac2_w96_h96.png
    title: Easy to use
    desc: By simply configuring Babel, you can have JSX extension syntax such as if, for, switch, and support complete IDE code intelligence.
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: Powerful Extensiblity
    desc: Fully Extensible design, developers can use simple API to create richer component reuse ideas for React JSX.
  - icon: https://gw.alipayobjects.com/os/q/cms/images/k9zij2bh/67f75d56-0d62-47d6-a8a5-dbd0cb79a401_w96_h96.png
    title: Typescript
    desc: Written in Typescript, provides the complete type definition files.
footer: Open-source MIT Licensed | Copyright © 2016-present<br />Powered by [Joe_Sky](https://github.com/joe-sky)
---

## Quick Start

### 1. Installing

```bash
npm install babel-plugin-nornj-in-jsx
```

### 2. Configure Babel

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

### 3. Getting Started

```js
const App = props => (
  <if condition={props.success}>
    <i>success</i>
    <else>
      <i>fail</i>
    </else>
  </if>
);

ReactDOM.render(<App success={false} />, document.querySelector('#app'));

//Render result：<i>fail</i>
```

## Create-React-App Example

[nornj-antd-v4-demo](https://github.com/joe-sky/nornj-antd-v4-demo)

## Playground

[nornj-antd-v4-demo(Codesandbox)](https://codesandbox.io/s/nostalgic-driscoll-t8kty)
