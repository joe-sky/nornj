---
title: 标签
order: 1
nav:
  title: JSX 语法扩展
  order: 2
toc: menu
---

# 标签

`NornJ`提供了一种语法同 React 类似、并且可扩展的特殊组件语法，称为`标签`。这种语法最常见的使用场景就是流程控制语句：

```js
const Test = props => (
  <if condition={props.isTest}>
    <i>success</i>
    <else>
      <i>fail</i>
    </else>
  </if>
);
```

上例中的`<if>`、`<else>`等都是标签语法。

## 标签与 React 组件的区别

`NornJ`标签有以下几种与常规 React 组件不同的特性：

- [支持小写开头](#支持小写开头)
- [延迟渲染子节点](#延迟渲染子节点)
- [生成子节点可用的新变量](#生成子节点可用的新变量)

### 支持小写开头

`NornJ`标签默认使用小写开头，与 React 中的`div`、`span`等标签定位类似。标签不用像组件那样需引入，它可以直接使用：

```js
//这里的 if 标签和 i 是一样的，无需引入可直接使用
const Test = props => (
  <if condition={props.isTest}>
    <i>success</i>
  </if>
);
```

### 延迟渲染子节点

从上面`<if>`的例子我们不难想到，其实用 React 的组件语法不是也是可以实现么？确实可以实现，比如[react-if](https://github.com/romac/react-if)：

```js
import { If, Then, Else } from 'react-if';

const Foo = ({ data }) => (
  <div>
    <If condition={false}>
      <Then>{() => renderData(data)}</Then>
      <Else>Nothing to see here</Else>
    </If>
  </div>
);
```

上例可以看出，`react-if`需要一个额外的`<Then>`标签；而且文档中也注明了，如果不在`<Then>`或`<Else>`中写一个返回子节点的函数是会存在性能消耗的。因为在并不确定`condition`的值之前，所有的分支节点都没必要进行提前渲染。

然而`NornJ`的`<if>`标签则不存在上述问题，因为它的本质并不是 React 组件而是一组`渲染函数`，由配套的 babel 插件进行了转换。如下例：

```js
<if condition={isTest}>
  <i>success</i>
  <else>
    <i>fail</i>
  </else>
</if>
```

babel 转换后为：

```js
nj.renderH({
  //此函数返回<i>fail</i>
  fn1: function(g,c,p) {
    return g.d('_njParam1');
  },
  //此函数返回<i>success</i>
  fn2: function(g,c,p) {
    return g.d('_njParam2');
  },
  //将if、else标签解析为渲染函数
  main: function(g,c,p) {
    var _params0 = {
      condition: c.d('isTest')
    };

    g.x['else'].apply(c, [{ tagProps: _params0, children: g.r(g, c, g.fn1) }]);

    return _exg.x['if']0.apply(c, [{ props: _params0, children: g.r(g, c, g.fn2) }]);
  }
}, {
  isTest: isTest,
  _njParam1: () => <i>success</i>,
  _njParam2: () => <i>fail</i>
});
```

从上面可以看出，`<i>success</i>`等其实是包在函数内并没立即执行的。

### 生成子节点可用的新变量

例如`<each>`循环：

```js
const Test = props => (
  <div>
    <each of={[1, 2, 3]}>
      <i>{item}</i>
    </each>
  </div>
);
```

上例中使用`NornJ`的`each`标签实现了循环数组`[1, 2, 3]`，然后在子节点中使用新生成的`item`变量渲染循环中每一项的值。而使用常规`JSX`写法的组件则必须使用函数才能实现，比如[react-loops](https://github.com/leebyron/react-loops)：

```js
import { For } from 'react-loops';

const Test = props => (
  <div>
    <For of={[1, 2, 3]}>{item => <li>{item}</li>}</For>
  </div>
);
```

上述虽然是`JSX`的常规写法，但是标签子节点中插入的`额外花括号`、`函数体`等，或多或少还是增加了少量代码，代码层级多时可能会影响一点标签嵌套的可读性。

---

下面是`NornJ`已有内置的标签：

## if

示例：

```js
const Test = props => (
  <div>
    This is a if tag demo.
    <if condition={props.type}>
      test if tag
      <span>test1</span>
    </if>
  </div>
);
```

如上，如果`if`标签的`condition`参数计算结果为 true，则会渲染`if`标签内的子节点；如为 false 则不会渲染`if`标签内的任何东西。

- if 标签的参数列表：

| 参数名称  | 类型    | 作用                    |
| :-------- | :------ | :---------------------- |
| condition | Boolean | if 标签子节点的渲染条件 |

`if`标签还包含`else`、`elseif`等子标签。

### else

示例：

```js
const Test = props => (
  <div>
    This is a if tag demo.
    <if condition={props.type}>
      test if tag
      <span>test1</span>
      <else>
        <span>test2</span>
      </else>
    </if>
  </div>
);
```

上例中如果`if`标签的`condition`参数值为 false，则会渲染`else`标签内的子节点；否则会渲染`if`标签内除了`else`标签外的其他内容：

```js
ReactDOM.render(<Test type={false} />, document.body);

/* 以上渲染内容为：
<div>
  This is a if tag demo.
  <span>test2</span>
</div>
*/
```

### elseif

`elseif`标签可以实现多分支流程：

```js
const Test = props => (
  <div>
    <if condition={props.num > 100}>
      100
      <elseif condition={props.num > 50}>
        50
      </elseif>
      <elseif condition={props.num > 20}>
        20
      </elseif>
      <else>
        0
      </else>
    </if>
  <div>
);

ReactDOM.render(<Test num={30} />, document.body);

/* 以上渲染内容为：
<div>20</div>
*/
```

- elseif 标签的参数列表：

| 参数名称  | 类型    | 作用                        |
| :-------- | :------ | :-------------------------- |
| condition | Boolean | elseif 标签子节点的渲染条件 |

## each

`each`标签可以实现循环：

```js
<each of={numbers}>
  <i>num: {item}</i> //item表示使用数组项
  <i>no: {index}</i> //index表示使用数组项索引值
</each>
```

在循环中内嵌`if`标签：

```js
<each of={numbers}>
  <if condition={first}>
    show first
    <br />
  </if>{' '}
  //first表示数组第一项
  <if condition={last}>show last</if> //last表示数组最后一项
</each>
```

如要循环的数组为空，则可以渲染`empty`标签的内容：

```js
<each of={numbers}>
  <span>test {item.no}</span>
  <empty>
    <span>no data</span>
  </empty>
</each>
```

- `each`标签的参数列表：

| 参数名称 | 类型   | 作用                                   |
| :------- | :----- | :------------------------------------- |
| of       | 数组   | 要循环的数组                           |
| item     | String | 循环中生成的每项变量名，可以改变       |
| index    | String | 循环中生成的每项索引值变量名，可以改变 |
| first    | String | 循环中生成的第一项变量名，可以改变     |
| last     | String | 循环中生成的最后一项变量名，可以改变   |

### for

`for`标签是`each`标签的别名，用法是完全一样的：

```js
<for of={numbers}>
  <span>test {item.no}</span>
  <empty>
    <span>no data</span>
  </empty>
</for>
```

## switch

`switch`标签也可以实现多分支流程：

```js
const Test = props => (
  <div>
    <switch value={props.num}>
      <case value={50}>
        50
      </case>
      <case value={30}>
        30
      </case>
      <default>
        0
      </default>
    </switch>
  <div>
);

ReactDOM.render(<Test num={30} />, document.body);

/* 以上渲染内容为：
<div>30</div>
*/
```

- `switch`和`case`标签的参数列表：

| 参数名称 | 类型 | 作用                                                                                                                                             |
| :------- | :--- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| value    | Any  | 在 switch 标签的 value 参数传入要判断值；<br>然后其会和 case 标签中的 value 值进行`===`判断；<br>所有 case 都不匹配时则渲染 default 标签的子节点 |

## with

`with`标签主要用于在`JSX`中创建新的变量：

```js
<each of={[1, 2, 3]}>
  <with num={item} i={index}>
    <span>
      test-{num}-{i}
    </span>
  </with>
</each>
```

## mobxObserver

`mobxObserver`标签实际上就是[mobx-react-lite 库的 observer 组件](https://github.com/mobxjs/mobx-react-lite#observer)，只不过它在编写时无需在子节点写函数：

```js
import { Observer, useObservable } from 'mobx-react-lite';

function ObservePerson(props) {
  const person = useObservable({ name: 'John' });
  return (
    <div>
      {person.name}

      {/* 原生写法 */}
      <Observer>{() => <div>{person.name}</div>}</Observer>

      {/* MobxObserver标签 */}
      <mobxObserver>
        <div>{person.name}</div>
      </mobxObserver>

      <button onClick={() => (person.name = 'Mike')}>No! I am Mike</button>
    </div>
  );
}
```

## 开发新的标签

`NornJ`的标签都是支持可扩展的，也就是说与 React 组件一样可以自行封装各种新功能。

### 开发一个最简单的标签

例如实现一个`unless`标签，功能即为与`if`标签相反，它的`condition`属性为 false 时才渲染子节点：

```js
<unless condition={false}>
  <div>Test unless</div>
</unless>
```

上面的`unless`标签实际上是一个扩展函数，使用`nj.registerExtension`方法注册：

```js
import nj from 'nornj';

nj.registerExtension(
  'unless', //注意：标签名称需要使用小写开头的camel命名方式
  options => {
    const { props, children } = options;
    if (!props.condition) {
      return children(); //输出标签的子节点：Test unless
    }
  }
);
```

然后还需要配置一下`.babelrc`，因为这样配套的 babel 插件才知道需要对`unless`标签进行转换：

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

这样我们就成功开发了一个`unless`标签，与普通 React 组件不同的是，它可以获得`NornJ`标签的[延迟渲染子节点](#延迟渲染子节点)特性。

#### 标签扩展函数的 options 参数

| 参数名称 | 类型     | 作用                                                                      |
| :------- | :------- | :------------------------------------------------------------------------ |
| children | Function | 执行后返回需要渲染的标签子节点，与 React 的 props.children 不同，它是函数 |
| props    | Object   | 当前标签的属性值(即`<tag a=1 b=2>`中的`a`和`b`，这里与 React 组件一致)    |

### 更复杂的标签

上面的例子我们介绍了如何开发一个最简单的标签`unless`，它只需在扩展函数内按照一定条件判断是否返回子节点就可以了；也无需配置更多的`extensionConfig`配置参数，填写`true`即可。

接下来我们实现一个循环标签`simpleFor`，用法如下：

```js
<simpleFor of={[1, 2, 3]}>
  <if condition={!loopFirst}>
    <div key={loopIndex}>Test for: {loopItem}</div>
  </if>
</simpleFor>
```

我们还注意到上面循环体中的`loopIndex`与`loopItem`是该标签生成出来的新变量，也就是获得了`NornJ`标签的[生成子节点可用的新变量](#生成子节点可用的新变量)特性。这就需要配置`extensionConfig`的`newContext`参数：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "simpleFor": {
            "newContext": {
              "data": {
                "index": "loopIndex",
                "item": "loopItem",
                "first": "loopFirst"
              }
            }
          }
        }
      }
    ]
  ]
}
```

然后使用`nj.registerExtension`方法注册标签扩展函数：

```js
import nj from 'nornj';

nj.registerExtension('simpleFor', options => {
  const { props, children } = options;

  return props.of.map((item, index) =>
    children({
      data: [
        {
          //注意：data参数需要传入一个每项为对象的数组；对象个数不限
          loopIndex: index,
          loopItem: item,
          loopFirst: index == 0
        }
      ]
    })
  );
});
```

如需要改变循环体中的`loopItem`等参数名，在`simpleFor`标签的属性上修改在`extensionConfig.simpleFor.newContext.data`中设置的对象名即可，如`item`、`index`等：

```js
<simpleFor of={[1, 2, 3]} item="itemNum" index="itemIndex" first="itemFirst">
  <if condition={!itemFirst}>
    <div key={itemIndex}>Test for: {itemNum}</div>
  </if>
</simpleFor>
```

### 子标签

`NornJ`标签还可以在子节点中附带`子标签`，比如`<if>`标签内的`<else>`、`<elseif>`，`<each>`标签内的`<empty>`等。

> 配套 babel 插件在运作时会将子标签连同其主标签一起进行转换。目前`NornJ`的 babel 插件暂时只支持转换 1 级子标签，这在大多数情况下足够用了。

比如我们需要给上面开发的`unless`标签增加一个名为`otherwise`的`子标签`，功能为在`condition`条件为 true 时渲染它的子节点。用法如下：

```js
<unless condition={false}>
  <div>Test unless</div>
  <otherwise>
    <div>Test otherwise</div>
  </otherwise>
</unless>
```

编写`otherwise`标签扩展函数：

```js
import nj from 'nornj';

nj.registerExtension(
  'otherwise', //注意：标签名称需要使用小写开头的camel命名方式
  options => {
    const {
      props,
      children,
      tagProps //tagProps是主标签(unless)的props对象
    } = options;

    //把otherwise的子节点函数添加在unless标签的props对象上面。注意，不必在这里执行它
    tagProps.otherwise = children;
  }
);
```

接着修改`unless`标签的扩展函数：

```js
import nj from 'nornj';

nj.registerExtension('unless', options => {
  const { props, children } = options;
  if (!props.condition) {
    return children(); //输出unless标签的子节点：Test unless
  } else if (props.otherwise != null) {
    return props.otherwise(); //输出otherwise标签的子节点：Test otherwise
  }
});
```

最后在`.babelrc`配置一下`otherwise`的标签信息，需要设置`isSubTag`参数为`true`：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "extensionConfig": {
          "unless": true,
          "otherwise": {
            "isSubTag": true
          }
        }
      }
    ]
  ]
}
```
