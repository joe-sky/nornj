# 编译模板并输出React组件

每个NornJ模板都可以编译为1个组件模板函数。传入数据并执行此模板函数则可以输出React虚拟dom组件对象，这样就可以配合React框架作为JSX的替代模板来开发React组件了。

### 使用NornJ替代JSX的优势
1. NornJ模板使用字符串或`dom`构建，无需预编译也可以直接使用。我们知道如果在一个非自动化构建的项目中，要使用React框架是比较麻烦的，因为JSX通常只有预编译后才可运行；不经编译直接运行JSX的方式又会有很大的性能损耗。而NornJ模板可以优雅地解决这个问题。
2. NornJ模板可以为React提供**组件结构与逻辑的解藕**。模板可以在独立的文件中定义，还可以任意组合。
3. NornJ模板还可以为React提供嵌入在html中的模板，可以替代ReactDOM.render方法，并使React组件具备**html API**。
4. 在JSX中必须使用js语句混合实现的语法，NornJ模板则相应地提供**完全声明式**的语法，如`if`或**循环语句**等。

### 将模板编译为组件模板函数

举例：
```js
//定义模板
const tmpl = nj`
<div id=test1>
  this the test demo{no}.
  <i>test{no}</i>
</div>`;

//编译为组件模板函数
const tmplFn = nj.compileComponent(tmpl, 'tmpl1');
```

1. 编译组件模板函数须使用nj.compileComponent方法。该方法第一个参数为NornJ模板对象；
2. 第二个参数为模板名称，该参数是可选的。如果设置了模板名称(模板名称应为全局唯一)，则下一次编译名称相同的模板时会直接从缓存中获取，这样就会提升很多性能。通常情况下推荐编译时设置该名称参数。

### 执行组件模板函数并输出React组件

es5环境下示例：
```js
var React = require("react"),
  ReactDOMServer = require("react-dom/server");

//定义模板
var tmpl =
'<div id=test1>\
  this the test demo{no}.\
  <i>test{no}</i>\
</div>';

//注册NornJ模板组件
nj.registerComponent('TestComponent', React.createClass({
  //编译为组件模板函数
  template: nj.compileComponent(tmpl, 'tmpl1'),
  render: function() {
    return this.template({
      no: this.props.no
    });
  }
}));

//输出React组件
var comp = nj.compileComponent(
 nj('<TestComponent no=100 />'),
 'tmpl2'
)();

//使用renderToStaticMarkup方法输出html
var html = ReactDOMServer.renderToStaticMarkup(comp);
```

es6+环境下示例：
```js
import nj from 'nornj';
import { compileComponent, registerComponent } from 'nornj';
import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

//定义模板
const tmpl = nj`
<div id=test1>
  this the test demo{no}.
  <i>test{no}</i>
</div>`;

//编译为组件模板函数
const template = compileComponent(tmpl, 'tmpl1');

//定义组件
class TestComponent extends Component {
  render() {
    return template({
      no: this.props.no
    });
  }
}

//注册NornJ模板组件
registerComponent('TestComponent', TestComponent);

//输出React组件
let comp = compileComponent(
 nj`<TestComponent no=100 />`,
 'tmpl2'
)();

//使用renderToStaticMarkup方法输出html
let html = renderToStaticMarkup(comp);
```

输出html：
```js
console.log(html);
/*
<div id="test1">
  this the test demo100.
  <i>test100</i>
</div>
*/
```

1. 模板函数一般只传入一个参数，值为json格式的数据。模板中和传入数据中对应的值会自动进行相应替换，最后输出结果为替换后的React组件。
2. 模板函数的参数也可以传入1个任意长度的json数组(或传入多个json参数，效果和传入一个json数组相同)，如下所示：
```js
//定义模板
const tmpl = nj`
<div id=test1>
  this the test demo{no}.
  <i>test{no2}</i>
</div>`;

//编译为模板函数
const tmplFn = nj.compileComponent(tmpl, 'tmpl1');

//渲染
let comp = tmplFn([{
  no: 100
}, {
  no: 200,  //相同的值优先采用顺序靠前的参数中的(1)
  no2: 300  //如果数组第一个参数没有no2属性，就会尝试从后面的参数中获取(2)
}]);
let html = renderToStaticMarkup(comp);

console.log(html);
/*输出html:
<div id="test1">
  this the test demo100.
  <i>test300</i>
</div>
```
以数组形式传入多个参数后，NornJ模板在编译时会按顺序检测每个数据对象是否有和模板中对应的值。如果检测到前面的参数有对应值，那么就会停止继续检测后面的参数是否有该对应值，如例中(1)处所示；如果靠前面的参数中没有对应值，那么就按顺序寻找后面的参数中是否存在，如例中(2)处所示。

### 链式API
NornJ模板还支持类似`jQuery`的链式调用方式。

#### renderComponent方法
执行`renderComponent`方法就和执行使用`compileComponent`方法编译出来的模板函数的效果相同，如下所示：

```js
let comp = nj`<span>test{no}</span>`.renderComponent({ no: 1 });
let html = renderToStaticMarkup(comp);

console.log(html);
/*输出html:
<span>test1</span>
*/
```

这种渲染方式比使用模板函数性能稍差，一般可以在单元测试中多使用这种渲染方式。
