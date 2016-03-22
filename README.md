# NornJ
一款轻量级且多用途的javascript模板引擎

这款js模板的通常构建方式不是使用传统的字符串，而是使用javascript原生的数组与对象构成，就像这样：
```js
var tmpl =
['div',
    'this the test demo {msg}',
    ['input onclick={click} /', { id: 'test' }],
'/div'];
```
除了这种方式外，模板还可以使用es6(es2015)提供的模板字符串来构建：
```js
var tmpl = nj`
<div>
    this the test demo Hello {msg}
    <input id=test onclick={click} />
</div>`;
```
当然，也可以支持在es5环境下使用普通的字符串：
```html
<script id="template" type="text/nornj">
    <div>
        this the test demo Hello {msg}
        <input id=test onclick={click} />
    </div>
</script>
<script type="text/javascript">
    var tmpl = document.querySelector('#template').innerHTML;
</script>
```
然后可以这样编译后输出html字符串：
```js
var html = nj.compile(tmpl)({
    msg: 'Hello world!',
    click: "alert('test')"
});

console.log(html);
/*输出：
<div>
    this the test demo Hello world!
    <input id='test' onclick="alert('test')" />
</div>
*/
```

也可以替代JSX输出React组件：
```js
import nj, {
  compileComponent,
  registerComponent
} from 'nornj';
import { Component } from 'react';
import { render } from 'react-dom';

const template = compileComponent(nj`
<div id=test1>
    this the test demo{no}.
    <i>test{no}</i>
</div>`);

class TestComponent extends Component {
    render() {
        return template(this.props);
    }
}

registerComponent({ TestComponent });

render(compileComponent(
   nj`<TestComponent no=100 />`
)(), document.body);

/* output:
<div id="test1">
    this the test demo100.
    <i>test100</i>
</div>
*/
```

还可以替代ReactDOM.render来在html内渲染React组件：
```html
...
<body>
    <nj-TestComponent class="nj-component" no="100" />
</body>
```

### 用途

* 它可以作为Backbone.js等传统MVC框架的模板引擎，职责是接受数据输出html字符串;
* 它也可以支持React.js，作为JSX的替代模板语言，并且使用它开发的React程序无需编译转换也可运行在浏览器环境中;
* 由于它可以输出html字符串，所以也可以作为node.js服务器框架Express.js的模板引擎。

### 安装

使用npm安装:

```sh
npm install --save nornj
```

### 浏览器支持

* 输出html字符串功能可支持所有现代浏览器以及Internet Explorer 6+。
* 配合React作为JSX替代模板语言时以及使用es6模板字符串构建的模板可支持所有现代浏览器以及Internet Explorer 8+。

### 技术文档

* [模板结构](https://github.com/joe-sky/nornj/blob/master/docs/模板结构(在js中).md)
* [编译模板并输出html](https://github.com/joe-sky/nornj/blob/master/docs/编译模板并输出html.md)
