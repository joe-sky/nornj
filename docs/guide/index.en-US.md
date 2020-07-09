---
title: Introduction
order: 1
nav:
  title: Guide
  order: 1
---

## 什么是 NornJ

`NornJ`，我们可以把它读作 `[ˌnɔ:nˈdʒeɪ]` 或简称 `nj`，它是一个基于 Babel 的 React JSX 新增语法扩展方案。**它的目标是创造出更简单、易读、实用的 JSX 写法，以及通过 JSX 语法扩展继续丰富 React 现有的组件复用思路。**

## 它能做什么

与其他的 Babel JSX 扩展（如[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)）类似， `NornJ` 内置了一些常用的 JSX 扩展如流程控制：

```js
ReactDOM.render(
  <>
    <if condition={isOk}>
      success
      <else>fail</else>
    </if>

    <for of={[1, 2, 3]}>
      <i>{item}</i>
    </for>
  </>,
  document.body
);
```

以及一些常用指令：

```js
ReactDOM.render(
  <>
    <img n-show={isShow} />

    <input n-debounce={200} onChange={e => console.log(e.target.value)} />
  </>,
  document.body
);
```

还包括 Babel 配合 Tagged Templates 语法实现的过滤器语法等：

```js
const num = 100;

ReactDOM.render(
  <>
    <i>{n`num | random(5000) | currency`}</i>
  </>,
  document.body
);
```

另外，和大多数 Babel 扩展不太一样的地方，它是一个可以支持扩展的方案。

## 它的可扩展能力

`NornJ` 从早期版本的设计开始就是可扩展的。

```js
<if condition={isOk}>
  success
  <else>fail</else>
</if>

<for of={[1, 2, 3]}>
  <i>{item}</i>
</for>
```

像预置的 if 和 for 标签，实际上也都是被扩展出来的。例如可以下面这样扩展 unless 标签(功能为 if 的反向条件)，写一个扩展函数：

```js
import nj from 'nornj';

nj.registerExtension('unless', options => {
  const { props, children } = options;
  if (!props.condition) {
    return children();
  }
});
```

然后配置一下 Babel：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "unless": true
        }
      }
    ]
  ]
}
```

就可以在 JSX 中使用了：

```js
<unless condition={false}>
  <div>Test unless</div>
</unless>
```

除了 if 这样的标签外，所有的指令和过滤器也都同样支持扩展，具体请看[JSX 语法扩展](../jsx-extension)。

## 它的运作原理

另一个与大多数 Babel 插件的不同点是，`NornJ` JSX 语法的需要配合一些运行时代码。这些代码在 nornj 和 nornj-react 两个包里，Babel 插件在转换 js/ts 文件时，会依当前使用 `NornJ` 语法的情况，自动进行这两个包的导入工作。

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

同理，`NornJ` 提供的所有 JSX 语法扩展都会这样被 Babel 转换为 nj.renderH 方法，再和常规的 JSX 进行嵌套运行。

## 它的运行时体积多大

`nornj`(gzipped)：<a href="https://bundlephobia.com/result?p=nornj"><img src="https://img.shields.io/bundlephobia/minzip/nornj.svg?style=flat" alt="Minzipped Size"></a>
<br>
`nornj-react`(gzipped)：<a href="https://bundlephobia.com/result?p=nornj-react"><img src="https://img.shields.io/bundlephobia/minzip/nornj-react.svg?style=flat" alt="Minzipped Size"></a>

## 它的性能

提到性能时，先明确一个点，就是 `NornJ` 不是一个追求 JSX 极限加载速度和极限渲染效率的方案；而是在尽可能保持体积小和渲染高效的前提下，提供完整的可扩展型 JSX 增强语法。

具体的渲染效率测试代码，作者做过。目前的效率虽然肯定不及原生 JSX，但性能差距也不太明显(作者的例子中，平均值在 1 - 1.2 倍之内)。具体测试代码作者之后会整理放出来。

在意 JSX 极限加载速度和极限渲染效率者，其实也可以尝试使用这个项目，只要在少数最可能消耗性能的地方(如循环 1000 条数据)，改用原生 JSX 即可。

## 它的命名

`NornJ` 这个名字出自作者在 2015 年很喜欢的一部 Gundam OVA -《独角兽高达》，里面的机体 `Banshee Norn` 名字中的 `Norn`，再加上作者名字 [`Joe-Sky`](https://github.com/joe-sky) 的首字母 `J`组成。

<img src="../assets/banshee-norn.jpg">
