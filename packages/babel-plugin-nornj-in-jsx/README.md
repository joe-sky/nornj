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