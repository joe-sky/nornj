---
title: Mobx 扩展
order: 1
nav:
  title: Mobx 扩展
  order: 3
toc: menu
---

# Mobx 扩展

NornJ 内置提供了不少与 Mobx 相关的扩展功能，在此章节单独描述。

<Alert>Mobx 扩展并不是使用 NornJ 时必须安装的，Babel 插件在检查到有的 JS/JSX 语法使用了某个 Mobx 扩展时，会自动引入额外的代码文件。</Alert>

```js
//如下检查到 mobxBind 语法时，才自动引入相关的代码包
<input mobxBind={this.inputValue} />
```

## mobxObserver

`mobxObserver`标签实际上就是[mobx-react-lite 或 mobx-react(v6+) 的 observer 组件](https://github.com/mobxjs/mobx-react-lite#observer)，只不过它在编写时无需在子节点写函数：

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

## mobxBind

使用`mobxBind`指令可以配合`Mobx`的可观察变量在`<input>`及`<textarea>`等表单元素上创建`双向数据绑定`，它会根据控件类型自动选取正确的方法来更新值。

> 为什么 NornJ 中只内置实现了支持 Mobx 的数据绑定指令？主要是因为 Mobx 可观察变量的特性与操作方式，更适合此种指令方案的语法结构等各方面，可以更好地呈现双向数据绑定的优势而提高开发效率。

- 基本使用方法

```js
import { Component } from 'react';
import { observable } from 'mobx';

class TestComponent extends Component {
  @observable inputValue = 'test';

  render() {
    return <input mobxBind={this.inputValue} />;
  }
}
```

如上所示，无需编写`<input>`标签的`onChange`事件，`inputValue`变量已自动和`<input>`标签建立了`双向数据绑定`的关系。

- 实质上，`mobxBind`的实现原理其实就是下面的语法糖形式：

```js
class TestComponent extends Component {
  @observable inputValue = 'test';

  onChange = e => {
    this.inputValue = e.target.value;
  };

  render() {
    return <input value={this.inputValue} onChange={this.onChange} />;
  }
}
```

- `onChange`事件

由于`mobxBind`默认自动设置了组件的`onChange`事件，但有些情况下我们可能还是需要在`onChange`中做一些其他的操作：

```js
class TestComponent extends Component {
  @observable inputValue = 'test';

  onChange = e => {
    console.log(e.target.value);
  };

  render() {
    return <input mobxBind={this.inputValue} onChange={this.onChange} />;
  }
}
```

如上所示，`onChange`事件的行为和标签原生的`onChange`完全相同，它会在文本框的值变化后执行。

- 增加防抖效果

可以使用`debounce`参数为`mobxBind`提供防抖效果：

```js
import { Component } from 'react';
import { observable } from 'mobx';

class TestComponent extends Component {
  @observable inputValue = '';

  onChange = e => {
    console.log(e.target.value);
  };

  render() {
    return (
      <>
        <input mobxBind-debounce={this.inputValue} onChange={this.onChange} />
        <input mobxBind-debounce$200={this.inputValue} onChange={this.onChange} />
      </>
    );
  }
}
```

上例中的`debounce`参数默认值为`100毫秒`。也支持自定义设置，如例中为`debounce`加修饰符即可。

- 使用 action 更新变量

在`Mobx`开发中如果启动严格模式或者使用`mobx-state-tree`时，则须要使用 action 来更新变量。可按下面方式配置使用 action：

```js
import { observable, action, configure } from 'mobx';

// don't allow state modifications outside actions
configure({ enforceActions: true });

class TestComponent extends Component {
  @observable inputValue = 'test';

  @action.bound
  setInputValue(value, args) {
    this.inputValue = value; //value是用户输入的新值
    console.log(args); //args为控件onChange事件的全部参数，类型为数组
  }

  render() {
    return <input mobxBind={this.inputValue} />;
  }
}
```

如存在 camel 命名法(`set + 首字母大写的observable变量名`)定义的`action`时，`mobxBind`会默认执行它来更新数据。上例中为`setInputValue`。

接下来我们来按控件分类列举下`mobxBind`指令可支持的场景：

### 绑定原生表单控件

原生表单控件包含`文本框`、`复选框`、`单选按钮`、`选择框`等，以上都可以直接使用`mobxBind`指令，会自动监听相应控件的`onChange`事件并正确地更新值。

### 文本框

单行文本框：

```js
class TestComponent extends Component {
  @observable inputValue = 'test';

  render() {
    return (
      <>
        <input mobxBind={this.inputValue} />
        <p>Message is: {this.inputValue}</p>
      </>
    );
  }
}
```

多行文本框：

```js
class TestComponent extends Component {
  @observable inputValue = 'test';

  render() {
    return (
      <>
        <textarea mobxBind={this.inputValue}></textarea>
        <p>Message is: {this.inputValue}</p>
      </>
    );
  }
}
```

### 复选框

单个复选框，绑定到布尔值：

```js
class TestComponent extends Component {
  @observable checked = false;

  render() {
    return (
      <>
        <input type="checkbox" id="checkbox" mobxBind={this.checked} />
        <label for="checkbox">{this.checked}</label>
      </>
    );
  }
}
```

多个复选框，绑定到同一个数组：

```js
class TestComponent extends Component {
  @observable checkedNames = ['Jack', 'Mike'];

  render() {
    return (
      <>
        <input type="checkbox" id="jack" value="Jack" mobxBind={this.checkedNames} />
        <label for="jack">Jack</label>
        <input type="checkbox" id="john" value="John" mobxBind={this.checkedNames} />
        <label for="john">John</label>
        <input type="checkbox" id="mike" value="Mike" mobxBind={this.checkedNames} />
        <label for="mike">Mike</label>
        <br />
        <span>Checked names: {this.checkedNames}</span>
      </>
    );
  }
}
```

### 单选按钮

```js
class TestComponent extends Component {
  @observable picked = '';

  render() {
    return (
      <>
        <input type="radio" id="one" value="One" mobxBind={this.picked}>
        <label for="one">One</label>
        <br />
        <input type="radio" id="two" value="Two" mobxBind={this.picked}>
        <label for="two">Two</label>
        <br />
        <span>Picked: {this.picked}</span>
      </>
    );
  }
}
```

### 选择框

单选时：

```js
class TestComponent extends Component {
  @observable selected = '';

  render() {
    return (
      <>
        <select mobxBind={this.selected}>
          <option disabled value="">
            请选择
          </option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
        <span>Selected: {this.selected}</span>
      </>
    );
  }
}
```

多选时，绑定到一个数组：

```js
class TestComponent extends Component {
  @observable selected = [];

  render() {
    return (
      <>
        <select mobxBind={this.selected} multiple n-style="width: 50px;">
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
        <br />
        <span>Selected: {this.selected}</span>
      </>
    );
  }
}
```

用`<each>`渲染的动态选项：

```js
class TestComponent extends Component {
  @observable selected = 'A';
  options = [
    { text: 'One', value: 'A' },
    { text: 'Two', value: 'B' },
    { text: 'Three', value: 'C' }
  ];

  render() {
    return (
      <>
        <select mobxBind={this.selected}>
          <each of={this.options}>
            <option value={item.value}>{item.text}</option>
          <each/>
        </select>
        <span>Selected: {this.selected}</span>
      </>
    );
  }
}
```

### 绑定组件

除了上述的原生表单控件外，`mobxBind`指令也可以绑定到任意 React 组件上。当然，前提是该组件可能需要使用`nj.registerComponent`进行注册，并且设置一些必要的参数。

例如我们注册一个使用[ant-design 的 Input 组件](https://ant.design/components/input/)的例子，首先是注册组件：

```js
import nj from 'nornj';
import { Input } from 'antd';

nj.registerComponent(
  'ant-Input', //组件名(全局唯一)，类型为字符串
  Input, //组件对象
  {
    //组件配置参数对象
    hasEventObject: true //为true时使用e.target.value获取值
  }
);
```

上述代码在全局统一注册一次就可以了。然后便可以正常地使用`mobxBind`指令进行绑定：

```js
import { Component } from 'react';
import { observable } from 'mobx';
import { Input } from 'antd';

class TestComponent extends Component {
  @observable inputValue = 'test';

  render() {
    return <Input mobxBind={this.inputValue} />;
  }
}
```

#### 注册组件

在注册很多组件时按各参数的默认值就可以了，也就是说其实可以不写`nj.registerComponent`的第三个参数的。但是也有组件需要配置一些参数，例如：

```js
import nj from 'nornj';
import { Cascader } from 'antd';

nj.registerComponent(
  'ant-Cascader', //组件名(全局唯一)，类型为字符串
  Cascader, //组件对象
  {
    //组件配置参数对象，如果下表中的默认配置都满足要求也可以省略
    needToJS: true //值被更新到该组件前，需要执行一次Mobx.toJS
  }
);
```

所有组件参数列表：

| 参数名          | 类型    | 默认值     | 作用                                                                                                                                                                                                                                                                                                                                                                                               |
| :-------------- | :------ | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hasEventObject  | Boolean | false      | 为 true 时，更新事件中使用`<input onChange={e => e.target.value} />`取值。 <br> 为 false 时，更新事件中使用`<input onChange={value => value} />`取值。                                                                                                                                                                                                                                             |
| targetPropName  | String  | 'value'    | 如果 hasEventObject 参数为 true，则更新事件中使用`<input onChange={e => e.target[targetPropName]} />`取值。 <br> 不填时默认值是`value`，也就是使用`e.target.value`取值。                                                                                                                                                                                                                           |
| valuePropName   | String  | 'value'    | 被绑定控件的值属性名，即`<input value={...} />`中的 value 属性名称。比如可以依不同组件特性修改为`textValue`、`checked`等等。                                                                                                                                                                                                                                                                       |
| changeEventName | String  | 'onChange' | 被绑定控件的更新事件属性名，即`<input onChange={...} />`中的 onChange 属性名称。比如可以依不同组件特性修改为`onInput`、`onTextChange`等等。                                                                                                                                                                                                                                                        |
| needToJS        | Boolean | false      | 输入的新值在被更新到组件时，是否需要执行一次`Mobx.toJS`。例如一些需要绑定到数组值的组件可能需要设置 needToJS 为`true`，否则无法正确地更新值到相应的组件中，比如[ant-design 的 Cascader 组件](https://ant.design/components/cascader/)。 <br> 需要进行这一步操作，是由[Mobx 可观察变量的特性](https://mobx.js.org/refguide/tojson.html)与该组件的内部实现是否有冲突来决定的，这个有时候也无法避免。 |

#### 已预置注册的组件

目前[ant-design 组件库](https://ant.design/docs/react/introduce)已在[nornj-react](https://github.com/joe-sky/nornj-react/tree/master/antd)包中预置注册了全部组件。也就是说对于`ant-design组件库`无需再手工注册了，按下面方式直接引入就可以使用`mobxBind`指令。

首先需要安装[babel-preset-nornj-with-antd](https://github.com/joe-sky/nornj/tree/master/packages/babel-preset-nornj-with-antd)，并在`.babelrc`增加以下配置：

```js
{
  "presets": [
    "nornj-with-antd"
  ]
}
```

然后这样引入使用各`ant-design组件`并使用即可：

```js
import {
  Table,
  Input,
  Button,
  Pagination,
  Tabs,
  Tree,
  Select,
  Checkbox,
  Modal,
  message,
  Row,
  Col,
  Form,
  DatePicker,
  Icon,
  Steps,
  Divider
} from 'antd';

...
class TestComponent extends Component {
  @observable inputValue = 'test';

  render() {
    return <Input mobxBind={this.inputValue} />;
  }
}
```

<!-- # mstBind

`mstBind`即为`mobxBind`的默认使用action来更新值的版本，用来配合`mobx-state-tree`的变量使用：

store：

```js
import { types } from "mobx-state-tree";

const TestStore = types.model("TestStore",
  {
    inputValue: 'test'
  })
  .actions(self => ({
    setInputValue(value, args) {
      self.inputValue = value;  //value是用户输入的新值
      console.log(args);        //args为控件onChange事件的全部参数，类型为数组
    }
  }));
```

component：

```js
@inject('rootStore')
@observer
class TestComponent extends Component {
  render() {
    return <input mstBind={this.props.rootStore.testStore} />;
  }
}
```

如上，`mstBind`会默认执行camel命名法(`set + 变量名`)定义的`action`来更新值，上例中为`setInputValue`。除此外`mstBind`的其他特性与上述的`mobxBind`完全相同。 -->

## toJS

`toJS`即为将 Mobx 的`toJS`方法封装在 NornJ 过滤器中使用：

```js
const Test = () => {
  const view = useLocalStore(() => ({
    texts: ['abc', 'def']
  }));

  return (
    <>
      <i>{JSON.stringify(n`view | toJS`)}</i>
    </>
  );
};
```
