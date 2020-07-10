---
title: 表达式
order: 3
nav:
  title: JS(X) 语法扩展
  order: 2
toc: menu
---

# 表达式

`NornJ`提供了一种在`tagged templates`语法中写表达式的功能，称为`NornJ 表达式`。主要用作`增强现有的JS表达式`，并实现`过滤器`等内建的新语法。使用方式很简单，即标签名为`n`的`tagged templates`：

```js
ReactDOM.render(
  <>
    <input value={n`'Jack' | lowerFirst`} />
    <input value={n`(1 .. 5).join('-')`} />
  </>
);
/*
  渲染结果：<input value="jack" /><input value="1-2-3-4-5" />
*/
```

## 与常规 JS 表达式的区别

`NornJ`表达式中内建了一些常规 JS 语法不支持的特性：

### 支持过滤器

> 过滤器是什么？是一种在模板引擎(或含有模板引擎的框架，如 Vue)中常见的功能，主要用于过滤展示数据。可参考 Nunjucks 的文档：https://mozilla.github.io/nunjucks/templating.html#filters。

`NornJ`过滤器的基本用法：

```js
<i>{n`1234.567 | currency(2.05 | toInteger) | isString`}</i>
/*
  例中先执行currency过滤器返回"$1234.57"，然后再执行isString过滤器判断是否字符串。
  渲染结果：<i>true</i>
*/
```

如上，过滤器的语法的常规模板引擎一致使用`|`符号作为分隔符，并且还支持`为过滤器传参数`和`嵌套过滤器`。更重要的是，还可以扩展出新的过滤器。

### 支持自定义运算符

`NornJ`表达式中除了支持常规运算符外，还可以支持一些在常规 JS 语法中不支持的运算符，比如范围运算符`..`：

```js
<i>{n`(1 .. 5).join('-')`}</i>
/*
  例中"1 .. 5"的运算结果是一个含1-5的数组(即"[1, 2, 3, 4, 5]")，然后再执行数组的join方法用"-"连接每项。
  渲染结果：<i>1-2-3-4-5</i>
*/
```

如上，此类自定义运算符是可以在`NornJ`表达式中同常规的 JS 语法一起运作。同过滤器一样，运算符也可以支持扩展出新的。

## 适配常规 JS 表达式

`NornJ`表达式对于常规的 JS 语法有非常好的适配性，例如下面列举的这些常用场景都可以支持：

```js
const Test = () => (
  <>
    <i>{n`1 + 2 * 3 - 4 / 5`}</i>
    <i>{n`1 < (2 + 1) && !(5 > 4)`}</i>
    <i>{n`'abc'.trim() + 'def'.substr(1).length`}</i>
  </>
);
```

### 使用变量

借助于`Babel 插件`的转换能力，`NornJ`表达式内可以直接使用当前作用域内可用的变量：

```js
const Test = props => {
  const str = 'abc';
  const str2 = 'def';

  return (
    <>
      <i>{n`props.a > (2 + 1) && !props.b < 4`}</i>
      <i>{n`str.trim() + str2.substr(1).length`}</i>
    </>
  );
};
```

除了上述使用方法外，变量也可以通过`tagged templates`参数方式传入，效果是一样的：

```js
const Test = props => {
  const str = 'abc';
  const str2 = 'def';

  return (
    <>
      <i>{n`${props.a} > (2 + 1) && ${props}.b < 4`}</i>
      <i>{n`${str}.trim() + ${str2}.substr(1).length`}</i>
    </>
  );
};
```

每个`NornJ`表达式计算后都会返回正确的类型，所以也可以和外部 JS 语法混合：

```js
const Test = props => (
  <>
    <i>{n`${props.a} > (2 + 1)` && n`${props}.b < 4`}</i>
  </>
);
```

### 插入过滤器等自定义语法

`NornJ`表达式内可以同时使用`常规 JS 语法`和`过滤器等自定义语法`，这正是它的特色：

```js
const Test = () => {
  const str = 'abc';

  return (
    <>
      <i>{n`str.trim() | upperFirst`}</i>
      <i>{n`12345678 | currency`}</i>
      <i>{n`(1 .. 100).length * 100`}</i>
    </>
  );
};
```

### 表达式内目前不支持的语法

`NornJ`表达式虽然适配性很强，但当前还是有一些不支持的语法，如下：

```js
//注意，以下为一些目前不支持的语法
const Test = props => (
  <>
    <i>{n`!!12345`}</i> {/* 只有1个!是支持的；多个!暂不支持 */}
    <i>{n`12345++`}</i> {/* 暂不支持自增等运算 */}
    <i>{n`+12345`}</i> {/* 暂不支持一元运算(!除外) */}
    <i>{n`'12345'.map((item, i) => item)`}</i> {/* 暂不支持定义函数体 */}
  </>
);

//上面不支持的语法可以用原生JS语法弥补，这样改写：
const Test2 = props => (
  <>
    <i>{!n`!12345`}</i>
    <i>{n`12345`++}</i>
    <i>{+n`12345`}</i>
    <i>{n`'12345'.map(${(item, i) => item})`}</i>
  </>
);
```

不过，日后不排除`NornJ`会支持上述语法的可能性，已支持的语法已足够支撑常规开发使用。

> 另外，`NornJ`表达式的目标定位是为现有 JS 语法做增强，故它的内部或许并不需要实现全部的 JS 表达式。

## 过滤器

`NornJ`过滤器提供了一些常用内置功能，且完全可以支持用户扩展。

### 过滤器的管道与函数形式

`NornJ`的过滤器除了支持`管道形式`写法外，还可以支持用`函数形式`写法，效果是一样的：

```js
const Test = () => {
  const str = 'abc';

  return (
    <>
      {/* 管道形式 */}
      <i>{n`str.trim() | upperFirst`}</i>
      <i>{n`12345678 | currency`}</i>

      {/* 函数形式 */}
      <i>{n`upperFirst(str.trim())`}</i>
      <i>{n`currency(12345678)`}</i>
    </>
  );
};
```

> 我们不妨对比一下过滤器的`管道形式`与`函数形式`写法，可发现`管道形式`的主要优势在于对于数据过滤看起来更为直观。

下面是`NornJ`的内置过滤器：

> 注意，内置过滤器只包含一些基础功能，例如很大一部分是 NornJ 底层必要使用的工具函数。NornJ 的定位并不是一个类似 Lodash 的工具函数库，它的目标只是为常规 JS 开发提供过滤器这种新的扩展方式而已。

### upperFirst

`upperFirst`可以实现首字母大写：

```js
const Test = () => (
  <>
    <i>{n`'jack' | upperFirst`}</i>
  </>
);

//输出：<i>Jack</i>
```

### lowerFirst

`lowerFirst`可以实现首字母小写：

```js
const Test = () => (
  <>
    <i>{n`'Jack' | lowerFirst`}</i>
  </>
);

//输出：<i>jack</i>
```

### camelCase

`camelCase`可以将`kebab-case`字符串转换为`camel-case`：

```js
const Test = () => (
  <>
    <i>{n`'margin-left' | camelCase`}</i>
  </>
);

//输出：<i>marginLeft</i>
```

### isObject

`isObject`用于检查类型是否为对象：

```js
const Test = ({ children }) => (
  <>
    <i>{n`children | isObject`}</i>
  </>
);

//输出：<i>true</i>
```

### isNumber

`isNumber`用于检查类型是否为数字：

```js
const Test = ({ children }) => (
  <>
    <i>{n`children.length | isNumber`}</i>
  </>
);

//输出：<i>true</i>
```

### isString

`isString`用于检查类型是否为字符串：

```js
const Test = ({ children }) => (
  <>
    <i>{n`children.length | isString`}</i>
  </>
);

//输出：<i>false</i>
```

### isArrayLike

`isArrayLike`用于检查类型是否为类数组：

```js
const Test = ({ children }) => (
  <>
    <i>{n`children | isArrayLike`}</i>
  </>
);

//输出：<i>true</i>
```

### currency

`currency`可以将数字转换货币形式：

```js
const Test = () => (
  <>
    <i>{n`98765 | currency`}</i> {/* '$98,765.00' */}
    <i>{n`98765.32132 | currency(2)`}</i> {/* '$98,765.32' */}
    <i>{n`98765.321 | currency(0, '￥')`}</i> {/* '￥98,765' */}
    <i>{n`'abc' | currency(2, '$', '-')`}</i> {/* '-' */}
  </>
);
```

| 参数        | 用法                                                     | 类型   | 默认值 | 作用                       |
| :---------- | :------------------------------------------------------- | :----- | :----- | :------------------------- |
| decimals    | <code>98765 &#124; currency(decimals)</code>             | Int    | 2      | 小数位                     |
| symbol      | <code>98765 &#124; currency(2, symbol)</code>            | String | '\$'   | 钱币符号                   |
| placeholder | <code>98765 &#124; currency(2, '￥', placeholder)</code> | String | ''     | 如传入非数字，则输出占位符 |

另外，`symbol`和`placeholder`还可以进行全局配置：

```js
import nj from 'nornj';

nj.filterConfig.currency.symbol = '￥';
nj.filterConfig.currency.placeholder = '-';
```

### 使用 Lodash

`NornJ`的过滤器可以使用`Lodash`库的全部工具函数。它是一个过滤器的扩展，需要先这样全局引入一次：

```js
import 'nornj/lib/filter/lodash';
```

然后就可以在`NornJ`表达式中使用了：

```js
const Test = () => (
  <>
    <i>{n`'-abc-' | repeat(3)`}</i> {/* '-abc--abc--abc-' */}
    <i>{n`'-abc-' | endsWith('bc-')`}</i> {/* true */}
    <i>{n`'Foo Bar' | snakeCase`}</i> {/* 'foo_bar' */}
  </>
);
```

更多`Lodash`过滤器的使用方法请查看[Lodash 文档](https://www.lodashjs.com/docs/latest)。

## 开发新的过滤器

`NornJ`的过滤器都是支持可扩展的，可以自行封装各种新功能。

- 每个过滤器实际上是一个扩展函数，使用`nj.registerFilter`方法注册：

```js
import nj from 'nornj';

nj.registerFilter('2x', num => num * 2);

//支持一次注册过个过滤器
nj.registerFilter({
  '3x': num => num * 3,
  '4x': num => num * 4
});

console.log(n`100 | 2x | 3x | 4x`);
//输出：2400
```

- 过滤器可以支持参数：

```js
import nj from 'nornj';

//从扩展函数的第二个参数开始定义过滤器的每个参数
nj.registerFilter('times', (num, times) => num * times);

console.log(n`100 | times(10)`);
//输出：1000
```

- 过滤器还可以支持嵌套：

```js
console.log(n`100 | times((10 * 2) | 3x)`);
//输出：6000
```

上例中`(10 * 2) | 3x`的乘法运算需要加括号，是因为过滤器的运算优先级是最高的，并从左到右按顺序执行。

## 自定义运算符

`NornJ`表达式中除了可以使用常规 JS 运算符外，还内置支持一些自定义的运算符，如`%%`、`..`等，并且还支持扩展出新的运算符。

### 可选链

`NornJ`表达式中的链式调用语法，默认全部都是`可选链`：

```js
const Test = props => (
  <>
    <i>{n`props.abc.length > 1`}</i> {/* 不会报错 */}
    <i>{props.abc.length > 1}</i> {/* 报 props.abc 为 undefined 错误 */}
    <i>{props?.abc?.length > 1}</i> {/* 不会报错(使用 Babel 转换可选链语法) */}
  </>
);
```

`NornJ`的可选链运算符在以下各种场景都可以正常使用，不会报错：

```js
const Test = props => (
  <>
    <i>{n`props[abc].length > 1`}</i>
    <i>{n`props.abc.substr(1) > 1`}</i>
    <i>{n`props[abc]().length > 1`}</i>
  </>
);
```

- 与 ES 原生可选链语法(`?.`)相比，`NornJ`的可选链运算符由于不须要写`?`，所以可读性会有优势。

- 但由于`NornJ`表达式内部目前不能支持定义函数体，所以有函数的场景可以这样使用：

```js
const Test = props => (
  <>
    {/* 将函数体作为外部参数传入 NornJ 表达式 */}
    {n`props.data.map(${(item, i) => {
      return <i>{item}</i>;
    }})`}
  </>
);
```

### 范围运算符

`范围运算符`可以快速生成数组：

```js
const Test = () => {
  const a = 10,
    b = 20;

  return (
    <>
      <i>{n`1 .. 10`}</i> {/* [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] */}
      <i>{n`(1 .. 10).length`}</i> {/* 10 */}
      <i>{n`(a .. b).length | includes(15)`}</i> {/* true */}
    </>
  );
};
```

### 半闭区间范围运算符

`..`是闭区间的，`NornJ`还提供了它的半闭区间版本：

```js
const Test = () => {
  const a = 10,
    b = 20;

  return (
    <>
      <i>{n`1 ..< 10`}</i> {/* [1, 2, 3, 4, 5, 6, 7, 8, 9] */}
      <i>{n`(1 ..< 10).length`}</i> {/* 9 */}
      <i>{n`(a ..< b).length | includes(20)`}</i> {/* false */}
    </>
  );
};
```

### 飞船运算符

`飞船运算符`是一种比较运算，它按照`大于`、`小于`、`等于`三种结果，分别返回`1`、`0`、`-1`三种值：

```js
const a = 10;
const b = 20;

const Test = () => (
  <switch value={n`a <=> b`}>
    <case value={1}>Greater</case>
    <case value={0}>Equal</case>
    <case value={-1}>Less</case>
  </switch>
);
```

### 向下取整运算符

`NornJ`内置了一种可实现向下取整的除法运算符，它的底层实现是`Math.floor(value1 / value2)`：

```js
const Test = () => (
  <>
    <i>{n`100 %% 30`}</i> {/* 3 */}
    <i>{n`56.78 %% 5`}</i> {/* 11 */}
    <i>{n`-56.78 %% 5`}</i> {/* -12 */}
  </>
);
```

## 开发新的运算符

`NornJ`的运算符也都是支持可扩展的，可以自行封装各种新功能。

> NornJ 中的运算符本质上其实是过滤器的一种语法糖形式，目前可以做到自定义扩展出各种`二元运算符`。

- 每个运算符实际上是一个扩展函数，和过滤器一样使用`nj.registerFilter`方法注册：

```js
import nj from 'nornj';

//注册***运算符，功能为先进行乘法运算后，再乘上3倍
nj.registerFilter('***', (num, times) => num * times * 3);

//支持一次注册过个运算符，功能和***类似
nj.registerFilter({
  '****': (num, times) => num * times * 4,
  '*****': (num, times) => num * times * 5
});
```

然后需要配置一下`.babelrc`：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "filterConfig": {
          "***": {
            isOperator: true
          },
          "****": {
            isOperator: true
          },
          "*****": {
            isOperator: true
          }
        }
      }
    ]
  ]
}
```

接着就可以在`NornJ`表达式中使用了：

```js
console.log(n`100***10`); //输出：100 * 10 * 3 = 3000
console.log(n`100***10****10`); //输出：100 * 10 * 3 * 10 * 4 = 120000
console.log(n`100***10****10*****10`); //输出：100 * 10 * 3 * 10 * 4 * 10 * 5 = 6000000
```

- 运算符的命名目前是有限制的，如包含下列字符则需要做特殊处理：

```js
['_', '#', '.', '>', '<', '|'];
```

如运算符名称中包名含上述字符，则需要这样注册：

```js
import nj from 'nornj';

nj.registerFilter('*.*', (num, times) => num * times * 3, {
  alias: '3x' //添加别名
});

nj.registerFilter({
  '*..*': {
    filter: (num, times) => num * times * 4,
    options: {
      alias: '4x'
    }
  },
  '*...*': {
    filter: (num, times) => num * times * 5,
    options: {
      alias: '5x'
    }
  }
});
```

然后需要配置一下`.babelrc`：

```js
{
  ...
  "plugins": [
    [
      "nornj-in-jsx",
      {
        "filterConfig": {
          "*.*": {
            isOperator: true,
            alias: '3x'
          },
          "*..*": {
            isOperator: true,
            alias: '4x'
          },
          "*...*": {
            isOperator: true,
            alias: '5x'
          }
        }
      }
    ]
  ]
}
```

接着就可以在`NornJ`表达式中使用了：

```js
console.log(n`100*.*10`); //输出：100 * 10 * 3 = 3000
console.log(n`100*.*10*..*10`); //输出：100 * 10 * 3 * 10 * 4 = 120000
console.log(n`100*.*10*..*10*...*10`); //输出：100 * 10 * 3 * 10 * 4 * 10 * 5 = 6000000
```
