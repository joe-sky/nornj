---
title: 文档
order: 2
nav:
  title: MobxFormData
  order: 3
toc: menu
---

# MobxFormData

基于`Mobx`的轻量级响应式`React`表单数据管理方案

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]

## 特征

- ✨ 简洁的 JSX API
- ⭐ 基于 [async-validator](https://github.com/yiminghe/async-validator) 的轻量级封装
- 💫 完整的 `Mobx` 可观察类型数据驱动表单
- 🌟 完美支持 [Ant Design](https://ant.design/) 表单控件（v3 或 v4）
- ⚡ 支持局部渲染 `Form.Item` 组件
- 🔥 可脱离 `Form` 组件独立运作
- 🚀 易于处理跨组件表单数据通信场景

## 对比其他表单数据管理方案

|                        |   Ant-Design v3   |   Ant-Design v4   |  Formily（UForm）  |             MobxFormData              |
| :--------------------- | :---------------: | :---------------: | :----------------: | :-----------------------------------: |
| 底层验证框架           | `async-validator` | `async-validator` | @formily/validator |           `async-validator`           |
| API 上手难度           |       一般        |       容易        |        较难        |                 容易                  |
| 组件外管理表单数据     |        ✖️         | ⭕（官方不推荐）  |         ⭕         |                  ⭕                   |
| 跨组件表单数据联动     |       较难        |       容易        |        一般        |                 容易                  |
| 更新只渲染表单控件自身 |        ✖️         |        ⭕         |         ⭕         |                  ⭕                   |
| 自定义表单控件逻辑     |       一般        |       一般        |        一般        |     容易（不必创建新的表单组件）      |
| Mobx 数据适配性        |       一般        |       一般        |        一般        | 好（直接读写可观察值、无需手工 toJS） |
| 多重验证规则           |        ⭕         |        ⭕         |         ⭕         |                  ⭕                   |
| 自动滚动至验证出错处   |        ⭕         |        ⭕         |         ⭕         |                  ✖️                   |
| 完整表单生命周期       |        ✖️         |        ✖️         |         ⭕         |                  ✖️                   |
| json 配置化生成        |        ✖️         |        ✖️         |         ⭕         |                  ✖️                   |
| 适配多个组件库         |        ✖️         |        ✖️         |         ⭕         |           ⭕（未来可实现）            |

## 快速开始

### 安装与配置 babel

```bash
npm install babel-plugin-nornj-in-jsx babel-plugin-import babel-plugin-module-resolver
```

配置`.babelrc`:

```js
{
  "plugins": [
    [
      'module-resolver',
      {
        alias: {
          '^antd$': 'nornj-react/antd',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs'],
      },
    ],
    [
      "import",
      {
        libraryName: "nornj-react/antd",
        style: false,
      }
    ],
    "nornj-in-jsx"
  ]
}
```

### 引入 JSX 类型定义

`MobxFormData` 标签的 JSX 类型定义需在全局引入一次，例如在 APP.jsx：

```js
import 'nornj-react';
```

### 使用 JSX 标签定义表单域

创建 `MobxFormData` 和 `MobxFieldData` 标签描述表单域各参数：

```js
<MobxFormData observable>
  <MobxFieldData name="userName" value="joe_sky" type="string" trigger="onChange" required />
  <MobxFieldData name="age" value="33" type="number" />
</MobxFormData>
```

### 绑定到 Form.Item 组件

使用 `n-mobxField` 指令绑定到 `Form.Item` 组件，即完成了一个最简单的响应式表单：

```js
const TestForm = observer(props => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" trigger="onChange" required />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ));

  const onSubmit = async e => {
    const values = await formData.validate();
    console.log(values);
  };

  return (
    <>
      <Form.Item n-mobxField={formData.userName} label="User Name">
        <Input />
      </Form.Item>
      User Name: {formData.userName}
      <Form.Item n-mobxField={formData.age} label="Age">
        <Input />
      </Form.Item>
      Age: {formData.age}
      <Button onClick={e => formData.age++}>增加Age</Button>
      <Button onClick={e => formData.reset()}>重置</Button>
      <Button onClick={onSubmit}>提交</Button>
    </>
  );
});
```

### 表单响应式更新

当我们手工修改 `formData` 实例上的表单值；或者在文本框内更改值的时候，表单都会自动触发相应的值更新及校验，非常棒的操作体验 :relaxed: ！

## 它是如何工作的

`MobxFormData` 是一个基于 `Babel Plugin` 的表单数据管理方案，即会将一些语法糖转换为实际运行的代码：

- MobxFormData & MobxFieldData

转换前：

```js
const { formData } = (
  <MobxFormData observable>
    <MobxFieldData name="userName" value="joe_sky" type="string" trigger="onChange" required />
    <MobxFieldData name="age" value="33" type="number" />
  </MobxFormData>
);
```

转换后：

```js
const { formData } = createFormData({ observable: true }, [
  {
    name: 'userName',
    value: 'joe_sky',
    type: 'string',
    trigger: 'onChange',
    required: true
  },
  {
    name: 'age',
    value: '33',
    type: 'number'
  }
]);
```

- n-mobxField

转换前：

```js
<>
  <Form.Item n-mobxField={formData.userName} label="User Name">
    <Input />
  </Form.Item>
  <Form.Item n-mobxField={formData.age} label="Age">
    <Input />
  </Form.Item>
</>
```

转换后：

```js
<>
  <MobxObserver>
    <Form.Item n-mobxField={formData.userName} label="User Name">
      <Input n-mobxBind={formData.userName} />
    </Form.Item>
  </MobxObserver>
  <MobxObserver>
    <Form.Item n-mobxField={formData.age} label="Age">
      <Input n-mobxBind={formData.age} />
    </Form.Item>
  </MobxObserver>
</>
```

## 使用方法

### MobxFormData & MobxFieldData

使用 `MobxFormData` 和 `MobxFieldData` 标签（参数请参考 [MobxFormDataProps](#mobxformdataprops) 和 [MobxFieldDataProps](#mobxfielddataprops)）来描述表单数据，它的返回值是 `formData` 实例（[MobxFormDataInstance](#mobxformdatainstance)）：

```js
const { formData } = (
  <MobxFormData observable>
    <MobxFieldData name="userName" value="joe_sky" type="string" />
    <MobxFieldData name="age" value="33" type="number" />
  </MobxFormData>
);
```

我们可以使用该实例对表单执行各种操作：

```js
//重新设置值
formData.name = 'joe';
formData.setValue({ userName: 'joe', age: 34 });

//校验
formData.validate('userName');
formData.validate(['userName', 'age']);
formData.validate();
```

- 多重验证规则

可以在 `MobxFieldData` 标签的 `rules` 属性上设置多个验证规则（类型为 [RuleItem](#ruleitem)），它们会依次进行验证并输出各自的错误信息：

```js
const { formData } = (
  <MobxFormData observable>
    <MobxFieldData
      name="userName"
      value="joe_sky"
      rules={[
        { type: 'string', required: true, message: '不能为空' },
        { type: 'string', min: 3, message: '至少输入3个字符' }
      ]}
      trigger="onChange"
    />
  </MobxFormData>
);
```

### n-mobxField

使用 `n-mobxField` 指令将 `formData` 实例绑定到 `Form.Item` 组件，将指令的值设置为 `formData#fieldName` 即可：

```js
<>
  <Form.Item n-mobxField={formData.userName} label="User Name">
    <Input />
  </Form.Item>
  <Form.Item n-mobxField={formData.age} label="Age">
    <Input />
  </Form.Item>
</>
```

> 此种方式可解决绝大多数表单数据校验场景，它实际上自动为 `Form.Item` 下层的表单元素组件设置了 [n-mobxBind](./directives.md#n-mobxbind) 指令。

如果 `n-mobxField` 有不满足需求的场景，我们还可以自行编写表单元素组件的各种参数与逻辑，增加 `noBind` 参数即可：

```js
const TestForm = observer(props => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ));

  return (
    <>
      <Form.Item n-mobxField-noBind={formData.userName} label="User Name">
        <Input n-mobxBind={formData.userName} />
        <Input value={'Age：' + formData.age} />
      </Form.Item>
      <Form.Item n-mobxField-noBind={formData.age} label="Age">
        <Input value={(formData.age + '').trim()} onChange={e => (formData.age = e.target.value)} />
      </Form.Item>
    </>
  );
});
```

另外 `n-mobxField` 也支持使用 `n-mobxBind` 的参数和修饰符：

```js
<>
  <Form.Item n-mobxField-debounce$200={formData.userName} label="User Name">
    <Input onChange={e => console.log(formData.userName)} />
  </Form.Item>
</>
```

- 绑定动态数据

`n-mobxField` 也可以支持绑定动态数据，语法稍有不同：

```js
<Each of={users}>
  <Form.Item n-mobxField={`formData[item.userName]`} label={item.userName}>
    <Input />
  </Form.Item>
</Each>
```

### React hooks

使用 `mobx-react` 包提供的 [useLocalStore](https://mobx-react.js.org/state-local) 即可，在它的参数中传入 `MobxFormData` 标签：

```js
const TestForm = observer(props => {
  const { formData: formDataUser } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ));

  return (
    <>
      <Form.Item n-mobxField={formDataUser.userName} label="User Name">
        <Input />
      </Form.Item>
      <Form.Item n-mobxField={formDataUser.age} label="Age">
        <Input />
      </Form.Item>
    </>
  );
};
```

- 更新表单值

例如在 hooks 场景从后台接口初次更新表单值，通常可以在 `useEffect` 中操作：

```js
const TestForm = observer(props => {
  const { formData: formDataUser } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ));

  useEffect(() => {
    api.getUserInfo().then(values => {
      formDataUser.setValue(values);
    });
  }, []);

  ...
};
```

### React class 组件

在 class 组件中，我们可以直接使用 `MobxFormData` 标签创建 `formData` 实例：

```js
@observer
class TestForm extends React.Component {
  @observable formDataUser = (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ).formData;

  render() {
    return (
      <>
        <Form.Item n-mobxField={this.formDataUser.userName} label="User Name">
          <Input />
        </Form.Item>
        <Form.Item n-mobxField={this.formDataUser.age} label="Age">
          <Input />
        </Form.Item>
      </>
    );
  }
}
```

- 更新表单值

例如在 class 组件场景从后台接口初次更新表单值，通常可以在 `componentDidMount` 中操作：

```js
@observer
class TestForm extends React.Component {
  @observable formDataUser = (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ).formData;

  componentDidMount() {
    api.getUserInfo().then(values => {
      this.formDataUser.setValue(values);
    });
  }

  ...
}
```

### 在 Mobx Store 中定义

`MobxFormData` 在组件外管理表单数据是非常容易的，因为它可以支持在 `Store` 内定义：

```js
class TestStore {
  @observable userList = [];
  @observable formDataUser = (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ).formData;

  async getData(params) {
    const res = await api.getModData(params);
    this.formDataUser.userName = res.data.userName;
    this.formDataUser.age = res.data.age;
  }
}
```

然后在组件中绑定到 `Form.Item` 就可以了：

```js
@observer
class TestForm extends React.Component {
  render() {
    const { formDataUser } = this.props.store.testStore;

    return (
      <>
        <Form.Item n-mobxField={formDataUser.userName} label="User Name">
          <Input />
        </Form.Item>
        <Form.Item n-mobxField={formDataUser.age} label="Age">
          <Input />
        </Form.Item>
      </>
    );
  }
}
```

## API

### 设置值

通常我们直接对 `formData` 实例上的表单值进行写操作即可，与 `Mobx` 可观察类型行为完全一致：

```js
formData.name = 'joe';
```

也可以一次设置多个值：

```js
formData.setValue({ userName: 'joe', age: 34 });
```

> 另外，即使是在 `Mobx` 严格模式下，直接进行写操作也不会出现错误，因为内部使用了 `action` 进行赋值。

### 验证

调用 `formData` 实例上的 `validate` 方法可进行手工验证操作：

```js
//验证单个域
formData.validate('userName');

//验证多个域
formData.validate(['userName', 'age']);

//验证全部域
formData.validate();
```

返回值为 `Promise`：

```js
formData
  .validate()
  .then(values => {
    console.log(values);
    /*
    {
      userName: 'joe',
      age: 33
    }
  */
  })
  .catch(errorInfo => {
    console.log(errorInfo);
    /*
    {
      values: {
        userName: 'joe',
        age: 33
      },
      errors: [ { message: 'age is not a number', field: 'age' } ]
    }
  */
  });
```

### 重置

重置会使表单域恢复到初始值，并且清除错误状态：

```js
//重置单个域
formData.reset('userName');

//重置多个域
formData.reset(['userName', 'age']);

//重置全部域
formData.reset();
```

各表单域初始值即为在 `MobxFieldData` 标签上设置的 `value` 参数：

```js
<MobxFieldData name="userName" value="joe_sky" />
```

### 清除状态

清除表单域的错误状态：

```js
//清除单个域
formData.clear('userName');

//清除多个域
formData.clear(['userName', 'age']);

//清除全部域
formData.clear();
```

### 设置错误状态

可以手工设置表单域为错误状态及自定义错误信息：

```js
formData.error('userName', '用户名已存在');
```

### 自定义验证

在 `MobxFieldData` 标签的 `validator` 参数的函数内部编写逻辑即可实现自定义验证：

```js
<MobxFieldData
  name="userName"
  value="joe_sky"
  type="string"
  required
  validator={(rule, value) => {
    if (value == 'joe') {
      return new Error('用户名已存在');
    }
    return true;
  }}
/>
```

具体可参考 [async-validator](https://github.com/yiminghe/async-validator#validator)。

### 异步自定义验证

在 `MobxFieldData` 标签的 `asyncValidator` 参数的函数内部编写逻辑即可实现异步自定义验证：

```js
<MobxFieldData
  name="userName"
  value="joe_sky"
  type="string"
  required
  asyncValidator={(rule, value, callback) => {
    api.getUserName().then(userName => {
      if (userName == 'joe') {
        callback(new Error('用户名已存在'));
      } else {
        callback();
      }
    });
  }}
/>
```

具体可参考 [async-validator](https://github.com/yiminghe/async-validator#asyncvalidator)。

### 触发验证时机

使用 `MobxFieldData` 标签的 `trigger` 参数可设置触发表单域验证的时机，默认值为 `valueChange`，即在 `formData` 实例上的表单域值改变时触发。

我们也可以将 `trigger` 设置为表单控件的事件名称来改变触发验证时机，如 `onBlur` ：

```js
<MobxFieldData name="userName" value="joe_sky" type="string" required trigger="onBlur" />
```

如果想完全手工控制触发验证，则可以设置为 `none`：

```js
<MobxFieldData name="userName" value="joe_sky" type="string" required trigger="none" />
```

### 动态创建/删除

有时候我们需要动态生成 `MobxFormData` 标签，可以这样做：

```js
class TestStore {
  @observable userList = ['joe', 'sky'];
  formDataUser;

  constructor() {
    this.formDataUser = (
      <MobxFormData observable>
        <each of={this.userList}>
          <MobxFieldData name={`user${index}`} value={item} type="string" />
        </each>
      </MobxFormData>
    ).formData;
  }
}
```

已生成好的 `formData` 实例，也可以使用 `add` 或 `delete` 方法添加/删除 `MobxFieldData` 标签：

```js
class TestStore {
  @observable userList = ['joe', 'sky'];
  @observable formDataUser = (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
      <MobxFieldData name="age" value="33" type="number" />
    </MobxFormData>
  ).formData;

  add() {
    this.formDataUser.add(<MobxFieldData name="worked" value={true} type="boolean" />);
  }

  delete() {
    this.formDataUser.delete('age');
  }
}
```

### 查找/遍历

`formData` 实例中有一个名为 `fieldDatas` 的 Map 类型成员，它里面保存了所有 `MobxFieldData` 标签生成的 `fieldData` 实例（类型为 [MobxFieldDataInstance](#mobxfielddatainstance)）。

我们可以这样找某个表单域实例：

```js
formData.fieldDatas.get('userName');
formData.fieldDatas.has('age');
```

还可以这样遍历表单域实例生成 `Form.Item` 组件：

```js
@observer
class TestForm extends React.Component {
  render() {
    const { formDataUser } = this.props.store.testStore;

    return (
      <each of={[...formDataUser.fieldDatas.keys()]}>
        <Form.Item n-mobxField={`formDataUser[item]`} label={item}>
          <Input />
        </Form.Item>
      </each>
    );
  }
}
```

如果遍历生成的 `Form.Item` 组件的子节点中存在逻辑判断，则需要使用 `n-mobxBind` 手工绑定表单控件：

```js
<each of={[...formDataUser.fieldDatas.keys()]}>
  <Form.Item n-mobxField-noBind={`formDataUser[item]`} label={item}>
    <if condition={item == 'userName'}>
      <Input n-mobxBind={`formDataUser[item]`} />
      <else>
        <Input.TextArea n-mobxBind={`formDataUser[item]`} />
      </else>
    </if>
  </Form.Item>
</each>
```

## Types

### RuleType

`RuleType` 包含所有的验证类型，由 [async-validator](https://github.com/yiminghe/async-validator/blob/master/src/index.d.ts#L23) 提供。

```js
type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'any';
```

### RuleItem

`RuleItem` 包含 `MobxFieldData` 标签上所有由 [async-validator](https://github.com/yiminghe/async-validator/blob/master/src/index.d.ts#L40) 提供的参数。

```js
interface RuleItem {
  type?: RuleType; // default type is 'string'
  required?: boolean;
  pattern?: RegExp | string;
  min?: number; // Range of type 'string' and 'array'
  max?: number; // Range of type 'string' and 'array'
  len?: number; // Length of type 'string' and 'array'
  enum?: Array<string | number | boolean | null | undefined>; // possible values of type 'enum'
  whitespace?: boolean;
  fields?: Rules; // ignore when without required
  options?: ValidateOption;
  defaultField?: { type: RuleType }; // 'object' or 'array' containing validation rules
  transform?: (value: any) => any;
  message?: string;
  asyncValidator?: (
    rule: Rules,
    value: any,
    callback: (error: string | string[] | void) => void,
    source: ValidateSource,
    options: ValidateOption
  ) => void | Promise<void>;
  validator?: (
    rule: Rules,
    value: any,
    callback: (error: string | string[] | void) => void,
    source: ValidateSource,
    options: ValidateOption
  ) => void;
}
```

### MobxFieldDataProps

```js
interface MobxFieldDataProps extends RuleItem {
  name: string;
  value?: any;
  trigger?: string;
  rules?: RuleItem[];
  [key: string]: any;
}
```

### MobxFieldData

```js
interface MobxFieldData {
  (props: MobxFieldDataProps): JSX.Element;
}
```

### MobxFieldDataInstance

```js
interface MobxFieldDataInstance extends MobxFieldDataProps, IObservableObject {
  validatorSchema?: schema;
  reset?: Function;
  validateStatus?: string;
  help?: string;
}
```

### MobxFormDataProps

```js
interface MobxFormDataProps {
  observable?: boolean; //为true则默认生成Mobx可观察类型，否则只返回原生对象
}
```

### MobxFormData

```js
interface MobxFormData {
  (props: MobxFormDataProps): JSX.Element;
}
```

### MobxFormDataInstance

```js
interface MobxFormDataInstance extends IObservableObject {
  fieldDatas: Map<string, MobxFieldDataInstance>;
  validate(name: string | string[]): Promise<any>;
  error(name: string, help: string): void;
  clear(name: string | string[]): void;
  reset(name: string | string[]): void;
  add(fieldData: MobxFieldDataProps | JSX.Element): void;
  delete(name: string): void;
  setValue(name: string | object, value?: any): void;
  [key: string]: any;
}
```

[npm-image]: http://img.shields.io/npm/v/nornj-react.svg
[downloads-image]: http://img.shields.io/npm/dm/nornj-react.svg
[npm-url]: https://www.npmjs.org/package/nornj-react
