# babel-plugin-nornj-in-jsx

Make the NornJ template work gracefully in the JSX environment.

## 安装

```sh
npm i babel-plugin-nornj-in-jsx
```

`.babelrc`配置：

```js
{
  "plugins": [
    "nornj-in-jsx"
  ]
}
```

## 使用方法

在JSX中使用各种本babel插件提供的标签时，都需要在js中引入：

```js
import nj from 'nornj';
import 'nornj-react';
```

### if标签

可直接在JSX中使用`NornJ`的`if、elseif、else`等标签。NornJ中的[if标签文档请见这里](https://joe-sky.github.io/nornj-guide/templateSyntax/built-inExtensionTag.html#if)。

```js
//转换前：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <if condition={a.b == 1}>
          <i>ifBlock</i>
          <else>
            <i>elseBlock</i>
          </else>
        </if>
      </div>
    );
  }
}

//转换后：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        ${nj`
          <#if ${a.b == 1}>
            ${<i>ifBlock</i>}
            <#else>
              ${<i>elseBlock</i>}
            </#else>
          </#if>
        `()}
      </div>
    );
  }
}
```

更复杂的例子：

```js
class TestComponent extends Component {
  render() {
    const a = { b: 1, c: 'abc' };

    return (
      <div>
        <if condition={`${a}.b.trim() == 1`}>
          ddddd
          <i>aaaaa</i>
          <elseif condition={a.b == 2}>
            <i>ffffff</i>
            <div className="las2">
              <i>888888</i>
            </div>
          </elseif>
          <elseif condition={`${a}.b == 2`}>
            <i>gggggg</i>
          </elseif>

          <else>
            ccccc
            <if condition={!true}>
              <i>bbbbb</i>
              <elseif condition={`${a}.c.substr(${1}) == 'bc'`}>
                <i>ffffff</i>
              </elseif>
              <else>
                <i>eeeee</i>
              </else>
            </if>
          </else>

        </if>
      </div>
    );
  }
}

/* 输出：
<div>
  ccccc<i>ffffff</i>
</div>
*/
```

在`condition`参数中可以使用模板字符串，并在其中可以使用`NornJ`模板中特有的[各种过滤器与表达式](https://joe-sky.github.io/nornj-guide/templateSyntax/filter.html)。如上例中的：

```js
const a = { b: 1, c: 'abc' };
...

<if condition={`${a}.b.trim() == ${1}`}>
...
</if>
```

这里的`a.b.trim()`表达式，如直接使用js原生表达式，则会因为b变量没有trim方法而报错：

```js
<if condition={a.b.trim() == 1}>
...
</if>
```

但是使用`NornJ`的表达式则不会报错，而是会顺延流转到下面的`elseif`判断中，这是因为`NornJ`的链式取值语法对`null`值进行了过滤，[具体请见这里](https://joe-sky.github.io/nornj-guide/templateSyntax/variable.html)。

### each标签

```js
//转换前：
class TestComponent extends Component {
  render() {
    return (
      <div>
        <each of={[1, 2, 3]} item="item" index="index">
          <i>{item}</i>
          <i>{index}</i>
        </each>
      </div>
    );
  }
}

//转换后：
class TestComponent extends Component {
  render() {
    return (
      <div>
        {nj`
          <#each ${[1, 2, 3]}>
            #${({ item: item, index: index }) => {
              return [
                <i key={0}>{item}</i>
                <i key={1}>{index}</i>
              ];
            }}
          </#each>
        `()}
      </div>
    );
  }
}
```

如上，of参数为要遍历的数组，参数格式和上面if的condition是一样的。item、index参数都可以不写，默认值就是例子中的那几个。

* of参数支持写模板字符串，并在其中使用`NornJ`的过滤器与表达式：

```js
class TestComponent extends Component {
  render() {
    return (
      <div>
        <each of={`1 .. 3`} item="item" index="index">
          <i>{item}</i>
          <i>{index}</i>
        </each>
      </div>
    );
  }
}
```

### switch标签

```js
//转换前：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <switch value={a.b}>
          <case value={1}>
            <i>1</i>
          </case>
          <case value={2}>
            <i>2</i>
          </case>
          <default>
            <i>3</i>
          </default>
        </switch>
      </div>
    );
  }
}

//转换后：
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        {nj`
          <#switch {{${a.b}}}>
            <#case {{${1}}}>
              ${<i>1</i>}
            </#case>
            <#case {{${2}}}>
              ${<i>2</i>}
            </#case>
            <#default>
              ${<i>3</i>}
            </#default>
          </#switch>
        `()}
      </div>
    );
  }
}
```

如上，value参数的格式和上面if的condition是一样的。

* value参数支持写模板字符串，并在其中使用`NornJ`的过滤器与表达式：

```js
class TestComponent extends Component {
  render() {
    const a = { b: 1 };

    return (
      <div>
        <switch value={`${a}.b`}>
          <case value={`${' 1 '}.trim()`}>
            <i>1</i>
          </case>
          <case value={`'02'.substr(1) | int`}>
            <i>2</i>
          </case>
          <default>
            <i>3</i>
          </default>
        </switch>
      </div>
    );
  }
}
```