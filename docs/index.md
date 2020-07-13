---
title: NornJ - 基于模板引擎，更精彩的 JS(X)
hero:
  title: NornJ
  desc: 🌠 基于模板引擎，更精彩的 JS(X)
  actions:
    - text: 快速上手
      link: /guide/getting-started
features:
  - icon: https://gw.alipayobjects.com/os/q/cms/images/k9ziitmp/13668549-b393-42a2-97c3-a6365ba87ac2_w96_h96.png
    title: 简单易用
    desc: 简单配置 babel，就能拥有 if、for、switch 等常用 JSX 扩展语法，并支持完备的 IDE 代码提示体验。
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: 强大的扩展能力
    desc: 完整的可扩展设计，开发者使用简洁的 API，即可为 React JSX 创造出更丰富的组件复用思路。
  - icon: https://gw.alipayobjects.com/os/q/cms/images/k9zij2bh/67f75d56-0d62-47d6-a8a5-dbd0cb79a401_w96_h96.png
    title: Typescript
    desc: 使用 TypeScript 开发，提供完整的类型定义文件。
footer: Open-source MIT Licensed | Copyright © 2016-present<br />Powered by [Joe_Sky](https://github.com/joe-sky)
---

## 轻松上手

### 1. 安装

```bash
npm install babel-plugin-nornj-in-jsx
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

## Create-React-App 示例

[nornj-antd-v4-demo](https://github.com/joe-sky/nornj-antd-v4-demo)

## Playground

[nornj-antd-v4-demo(Codesandbox)](https://codesandbox.io/s/nostalgic-driscoll-t8kty)
