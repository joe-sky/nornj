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
  <If condition={props.isTest}>
    <i>success</i>
    <Else>
      <i>fail</i>
    </Else>
  </If>
);
```

上例中的`<If>`、`<Else>`等都是标签语法。

## 与 React 组件的区别

简单地说，`NornJ`标签可以实现以下几种普通`React`组件无法实现的功能：

- [延迟渲染子节点](#lazy-render-children)
- [生成子节点可用的新变量](#generate-new-variable)

下面我们用实例分别解释下这些特性。

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

但是可以看出，`react-if`需要一个额外的`<Then>`标签；而且文档中也注明了，如果不在`<Then>`或`<Else>`中写一个返回子节点的函数是会存在性能消耗的。因为在并不确定`condition`的值之前，所有的分支节点都没必要进行提前渲染。

然而`NornJ`的`<If>`标签则不存在上述问题，因为它的本质并不是 React 组件而是一个`模板函数`，由配套的 babel 插件进行了转换：

```js
const test = props => (
  nj.renderH(`
    <if condition={_njParam0}>
      {#_njParam1}
      <else>
        {#_njParam2}
      </else>
    </if>
  `, {
    _njParam0: props.isTest,
    _njParam1: () => <i>success</i>,
    _njParam2: () => <i>fail</i>
  });
);
```

从上面可以看出，`<i>success</i>`等其实是包在函数内并没立即执行的。

> 另外，这并不是`NornJ`标签最终的运行时代码，`NornJ`配套的 babel 插件还会做进一步的模板预编译以提高性能。

### 生成子节点可用的新变量

例如`<Each>`循环：

```js
const Test = props => (
  <div>
    <Each of={[1, 2, 3]}>
      <i>{item}</i>
    </Each>
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

上述虽然是`JSX`的常规写法，但是标签子节点中插入的`额外花括号`、`函数体`等，可能或多或少还是增加了少量代码，以及影响了一点点标签嵌套的可读性。

---

下面是`NornJ`已有内置的标签：

## If

示例：

```js
const Test = props => (
  <div>
    This is a if tag demo.
    <If condition={props.type}>
      test if tag
      <span>test1</span>
    </If>
  </div>
);
```

如上，如果`if`标签的`condition`参数计算结果为 true，则会渲染`if`标签内的子节点；如为 false 则不会渲染`if`标签内的任何东西。

- if 标签的参数列表：

| 参数名称  | 类型    | 作用                    |
| :-------- | :------ | :---------------------- |
| condition | Boolean | if 标签子节点的渲染条件 |

`if`标签还包含`else`、`elseif`等子标签。

### Else

示例：

```js
const Test = props => (
  <div>
    This is a if tag demo.
    <If condition={props.type}>
      test if tag
      <span>test1</span>
      <Else>
        <span>test2</span>
      </Else>
    </If>
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

### Elseif

`elseif`标签可以实现多分支流程：

```js
const Test = props => (
  <div>
    <If condition={props.num > 100}>
      100
      <Elseif condition={props.num > 50}>
        50
      </Elseif>
      <Elseif condition={props.num > 20}>
        20
      </Elseif>
      <Else>
        0
      </Else>
    </If>
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

## Each

`each`标签可以实现循环：

```js
<Each of={numbers}>
  {' '}
  //要循环的数组
  <i>num: {item}</i> //item表示使用数组项
  <i>no: {index}</i> //index表示使用数组项索引值
</Each>
```

在循环中内嵌`if`标签：

```js
<Each of={numbers}>
  <If condition={first}>
    show first
    <br />
  </If>{' '}
  //first表示数组第一项
  <If condition={last}>show last</If> //last表示数组最后一项
</Each>
```

如要循环的数组为空，则可以渲染`empty`标签的内容：

```js
<Each of={numbers}>
  <span>test {item.no}</span>
  <empty>
    <span>no data</span>
  </empty>
</Each>
```

- `each`标签的参数列表：

| 参数名称 | 类型   | 作用                                   |
| :------- | :----- | :------------------------------------- |
| of       | 数组   | 要循环的数组                           |
| item     | String | 循环中生成的每项变量名，可以改变       |
| index    | String | 循环中生成的每项索引值变量名，可以改变 |
| first    | String | 循环中生成的第一项变量名，可以改变     |
| last     | String | 循环中生成的最后一项变量名，可以改变   |

### For

`for`标签是`each`标签的别名，用法是完全一样的：

```js
<For of={numbers}>
  <span>test {item.no}</span>
  <empty>
    <span>no data</span>
  </empty>
</For>
```

## Switch

`switch`标签也可以实现多分支流程：

```js
const Test = props => (
  <div>
    <Switch value={props.num}>
      <Case value={50}>
        50
      </Case>
      <Case value={30}>
        30
      </Case>
      <Default>
        0
      </Default>
    </Switch>
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

## With

`with`标签主要用于在`JSX`中创建新的变量：

```js
<Each of={[1, 2, 3]}>
  <With num={item} i={index}>
    <span>
      test-{num}-{i}
    </span>
  </With>
</Each>
```

## MobxObserver

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
      <MobxObserver>
        <div>{person.name}</div>
      </MobxObserver>

      <button onClick={() => (person.name = 'Mike')}>No! I am Mike</button>
    </div>
  );
}
```

## 开发新的标签

`NornJ`的标签都是支持可扩展的，也就是说与 React 组件一样可以自行封装各种新功能。

### 开发一个最简单的标签

例如实现一个`Unless`标签，功能即为与`If`标签相反，它的`condition`属性为 false 时才渲染子节点：

```js
<Unless condition={false}>
  <div>Test unless</div>
</Unless>
```

上面的`Unless`标签实际上是一个扩展函数，使用`nj.registerExtension`方法注册：

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

然后还需要配置一下`.babelrc`，因为这样配套的 babel 插件才知道需要对`Unless`标签进行转换：

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

这样我们就成功开发了一个`Unless`标签，与普通 React 组件不同的是，它可以获得`NornJ`标签的[延迟渲染子节点](#lazy-render-children)特性。

#### 标签扩展函数的 options 参数

| 参数名称 | 类型     | 作用                                                                      |
| :------- | :------- | :------------------------------------------------------------------------ |
| children | Function | 执行后返回需要渲染的标签子节点，与 React 的 props.children 不同，它是函数 |
| props    | Object   | 当前标签的属性值(即`<tag a=1 b=2>`中的`a`和`b`，这里与 React 组件一致)    |

### 更复杂的标签

上面的例子我们介绍了如何开发一个最简单的标签`Unless`，它只需在扩展函数内按照一定条件判断是否返回子节点就可以了；也无需配置更多的`extensionConfig`配置参数，填写`true`即可。

接下来我们实现一个循环标签`SimpleFor`，用法如下：

```js
<SimpleFor of={[1, 2, 3]}>
  <If condition={!loopFirst}>
    <div key={loopIndex}>Test for: {loopItem}</div>
  </If>
</SimpleFor>
```

我们还注意到上面循环体中的`loopIndex`与`loopItem`是该标签生成出来的新变量，也就是获得了`NornJ`标签的[生成子节点可用的新变量](#generate-new-variable)特性。这就需要配置`extensionConfig`的`newContext`参数：

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

如需要改变循环体中的`loopItem`等参数名，在`SimpleFor`标签的属性上修改在`extensionConfig.simpleFor.newContext.data`中设置的对象名即可，如`item`、`index`等：

```js
<SimpleFor of={[1, 2, 3]} item="itemNum" index="itemIndex" first="itemFirst">
  <If condition={!itemFirst}>
    <div key={itemIndex}>Test for: {itemNum}</div>
  </If>
</SimpleFor>
```

### 子标签

`NornJ`标签还可以在子节点中附带`子标签`，比如`<If>`标签内的`<Else>`、`<Elseif>`，`<Each>`标签内的`<Empty>`等。

> 配套 babel 插件在运作时会将子标签连同其主标签一起进行转换。目前`NornJ`的 babel 插件暂时只支持转换 1 级子标签，这在大多数情况下足够用了。

比如我们需要给上面开发的`Unless`标签增加一个名为`Otherwise`的`子标签`，功能为在`condition`条件为 true 时渲染它的子节点。用法如下：

```js
<Unless condition={false}>
  <div>Test unless</div>
  <Otherwise>
    <div>Test otherwise</div>
  </Otherwise>
</Unless>
```

编写`Otherwise`标签扩展函数：

```js
import nj from 'nornj';

nj.registerExtension(
  'otherwise', //注意：标签名称需要使用小写开头的camel命名方式
  options => {
    const {
      props,
      children,
      tagProps //tagProps是主标签(Unless)的props对象
    } = options;

    //把Otherwise的子节点函数添加在Unless标签的props对象上面。注意，不必在这里执行它
    tagProps.otherwise = children;
  }
);
```

接着修改`Unless`标签的扩展函数：

```js
import nj from 'nornj';

nj.registerExtension('unless', options => {
  const { props, children } = options;
  if (!props.condition) {
    return children(); //输出Unless标签的子节点：Test unless
  } else if (props.otherwise != null) {
    return props.otherwise(); //输出Otherwise标签的子节点：Test otherwise
  }
});
```

最后在`.babelrc`配置一下`Otherwise`的标签信息，需要设置`isSubTag`参数为`true`：

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
