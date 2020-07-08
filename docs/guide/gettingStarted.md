---
title: 快速上手
order: 2
nav:
  title: 指南
  order: 1
---

## 安装

```bash
npm install babel-plugin-nornj-in-jsx
```

如果要使用 antd 的相关功能(mobxBind 指令等)，那么可以不装上面的 Babel 插件，改为安装这个 preset：

```bash
npm install babel-preset-nornj-with-antd
```

## 配置 Babel

<Alert>
提示：Babel 版本需要在 v7 以上。
</Alert>

如果安装的是 nornj-in-jsx 插件：

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

如果安装的是 nornj-with-antd preset：

```js
{
  "presets": [
    ...,
    "nornj-with-antd"  //通常放在所有 preset 的最后面
  ]
}
```

## 引入 TS 类型定义

引入下面代码，IDE 中就有语法提示了：

```js
import 'nornj-react';
```

通常情况下，类型定义代码在全局引入一次就够了，例如在项目入口 App.js/App.ts 中。

但有些特殊情况，全局引入后 IDE 可能不会将类型定义映射到每个文件。这时在每个使用 NornJ 语法的文件都引入一次 nornj-react 即可。

## 开始使用

配置好 Babel 后，在任意 js/jsx/ts/tsx 文件内即可使用 NornJ 语法：

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

更详细的文档请看[JSX 语法扩展](../jsx-extension)。

## 配置 Eslint

由于 NornJ 的有些语法会用到未使用或未定义的变量，例如下例中的 item 就是未定义的变量：

```js
ReactDOM.render(
  <>
    <for of={[1, 2, 3]}>
      <i>{item}</i>
    </for>
  </>,
  document.body
);
```

解决这个场景只要这样配置下 Eslint：

```js
{
  "rules": {
    "no-undef": [
      0,
      "never"
    ],
    "react/jsx-no-undef": 0
  }
}
```

## 语法高亮插件

NornJ 提供了一个 vscode 语法高亮插件, 对应它支持的少量需要高亮的功能：

- [nornj-highlight(vscode)](https://github.com/joe-sky/nornj-highlight)

## 使用 Create-React-App

通常可以在使用 Create-React-App 创建项目后，执行 eject 命令弹出配置，按照前面的方式在 package.json 中配置下 Babel 及 Eslint 即可。

这里有个使用 cra 的示例项目：

### cra 示例项目

[nornj-antd-v4-demo](https://github.com/joe-sky/nornj-antd-v4-demo)

### Playground

[nornj-antd-v4-demo(Codesandbox)](https://codesandbox.io/s/nostalgic-driscoll-t8kty)

但有时候我们不希望使用 eject 弹出配置，这时可以用[react-app-rewired](https://github.com/timarney/react-app-rewired)方案解决，具体改配置的方法请看它的文档。
