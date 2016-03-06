# 编译模板并输出React组件

每个NornJ模板都可以编译为1个组件模板函数。传入数据并执行此模板函数则可以输出React虚拟dom组件对象，这样就可以配合React框架作为JSX的替代模板来开发React组件了。

### 使用NornJ替代JSX的优势
1. NornJ模板能够以一种较低性能消耗的方式来在es5环境下创建React组件，并保持组件结构的可读性且不需要编译。我们知道，如果在一个非自动化构建的项目中，要使用React框架是比较麻烦的，因为JSX通常只有编译后才可运行；不经编译直接运行JSX的方式又会有很大的性能损耗。而NornJ模板可以优雅地解决这个问题。
2. NornJ模板可以为React提供组件结构与逻辑的解藕。
3. NornJ模板还可以为React提供嵌入在html中的模板，可以替代ReactDOM.render方法，并使React组件具备html api。
4. NornJ模板还提供一些JSX无法实现或不易实现的功能：如更好地实现if语句结构以及可惰性渲染的子模板等。

### 将模板编译为组件模板函数

举例：
```js
//定义模板
var tmpl =
['div id=test1',
    'this the test demo{no}.'
    ['<i>', 'test{no}'],
'/div'];

//编译为组件模板函数
var tmplFn = nj.compileComponent(tmpl, 'tmpl1');
```

1. 编译组件模板函数须使用nj.compileComponent方法。该方法第一个参数为NornJ模板对象；
2. 第二个参数为模板名称，该参数是可选的。如果设置了模板名称(模板名称应为全局唯一)，则下一次编译名称相同的模板时会直接从缓存中获取，这样就会提升很多性能。通常情况下推荐编译时设置该名称参数。

### 执行组件模板函数并输出React组件

举例(es5)：
```js
var React = require("react"),
    ReactDOM = require("react-dom"),
    ReactDOMServer = require("react-dom/server");

//定义模板
var tmpl =
['div id=test1',
    'this the test demo{no}.'
    ['<i>', 'test{no}'],
'/div'];

//定义组件
var TestComponent = React.createClass({
    //编译为组件模板函数
    template: nj.compileComponent(tmpl, 'tmpl1'),
    render: function() {
        return this.template({
            no: this.props.no
        });
    }
});

//在NornJ全局注册组件
nj.registerComponent('TestComponent', TestComponent);

//使用renderToStaticMarkup方法输出html
var html = ReactDOMServer.renderToStaticMarkup(
    nj.compileComponent(
        ['TestComponent no=100 /'],
        'tmpl2'
    )()
);

console.log(html);
/*输出html:
<div id="test1">
    this the test demo100.
    <i>test100</i>
</div>
*/
```

1. 模板函数只有一个参数，值为json格式的数据。模板中和传入数据中对应的值会自动进行相应替换，最后输出结果为替换后的React组件。
2. 模板函数的参数也可以传入1个任意长度的数组，如下所示：
```js
//定义模板
var tmpl =
['div id=test1',
    'this the test demo{no}.'
    ['<i>', 'test{no2}'],
'/div'];

//编译为模板函数
var tmplFn = nj.compile(tmpl, 'tmpl1');

//输出html
var html = tmplFn([{
    no: 100
}, {
    no: 200,  //相同的值优先采用顺序靠前的参数中的(1)
    no2: 300  //如果数组第一个参数没有no2属性，就会尝试从后面的参数中获取(2)
}]);

console.log(html);
/*输出html:
<div id="test1">
    this the test demo100.
    <i>test300</i>
</div>
```
以数组形式传入多个参数后，NornJ模板在编译时会按顺序检测每个数据对象是否有和模板中对应的值。如果检测到前面的参数有对应值，那么就会停止继续检测后面的参数是否有该对应值，如例中(1)处所示；如果靠前面的参数中没有对应值，那么就按顺序寻找后面的参数中是否存在，如例中(2)处所示。
