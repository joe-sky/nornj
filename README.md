# NornJ
一款轻量级且多用途的javascript模板引擎

这款js模板的构建方式不是使用传统的字符串，而是使用javascript原生的数组与对象构成，就像这样：
```js
var tmpl =
['div',
    'this the test demo {msg}.',
    ['<input onclick={click} />', { id: 'test' }],
'/div'];

var html = NornJ.compile(tmpl, 'tmpl1')({
    msg: 'Hello world!',
    click: "alert('test')"
});
```

### 用途

* 它可以作为Backbone.js等传统MVC框架的模板引擎，职责是接受数据输出html字符串;
* 它也可以支持React.js，作为JSX的替代模板语言，并且使用它开发的React程序无需编译转换也可运行在浏览器环境中;
* 由于它可以输出html字符串，所以也可以作为node.js服务器框架Express.js的模板引擎。

### 浏览器支持

* 输出html字符串功能可支持所有现代浏览器以及Internet Explorer 6+。
* 配合React作为JSX替代模板语言时可支持所有现代浏览器以及Internet Explorer 8+。

### 技术文档

* [模板结构](https://github.com/joe-sky/nornj/blob/master/docs/模板结构.md)
* [编译模板并输出html](https://github.com/joe-sky/nornj/blob/master/docs/编译模板并输出html.md)
