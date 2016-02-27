# 模板结构

NornJ模板目前分为两种形式：
* [构建在js内的模板](#构建在js内的模板)
 * [用途](#用途)
 * [构成原理](#构成原理)
 * [模板替换参数](#模板替换参数)
 * [过滤器](#过滤器)
 * [流程控制块](#流程控制块)
 * [使用es6模板字符串语法糖](#使用es6模板字符串语法糖)
* [构建在html内的模板](https://github.com/joe-sky/nornj/blob/master/docs/模板结构(在html中).md)

### 构建在js内的模板
---

结构例如:
```js
['slider',
    'this the test slider {msg}.',
    ['<sliderItem onsliderend={event} />', { id: 'test' }],
'/slider'];
```

##### 用途

用于在js中创建模板，可以使用js的数组api等进行任意组合，并可以作为js对象以commonjs等方式对外输出。

##### 构成原理
例如构建一个元素节点slider：

```js
['slider name=test',  //"slider"为开始标签(1)
    { id: 'test' },  //节点参数(2)
    /*子节点开始(3)*/
    'this the test slider {msg}.',  //文本节点(4)
    ['<sliderItem onsliderend={event} />'],  //元素节点(5)
    /*子节点结束*/
'/slider'];  //"/slider"为结束标签(6)
```
* 元素节点

1. 每个元素节点使用一个js数组表示。数组第一项为一个字符串，格式为节点名称(也可以包含在尖括号中)。在名称后也可添加参数，如例中(1)处所示；
2. 元素节点数组的第二项可以是一个js对象，以键值对的方式表示该节点的参数，如例中(2)处所示；
3. 元素节点数组的最后一项可以是一个结束标签，格式为“/” + 节点名称(也可以包含在尖括号中)，如例中(6)处所示。结束标签也可以省略不写，但是有一些限制。如以下3种形式的写法都是合规的：
```js
['div', 'test', '/div']  //如果开始标签不写为尖括号的形式，则结束标签"/div"不可省略
['<div>', 'test', '</div>']
['<div>', 'test']  //开始标签写为尖括号的形式，则可以省略结束标签
```

* 文本节点

文本节点使用一个字符串表示，如例中(4)处所示。

* 子节点

1. 每个元素节点数组的开始标签(如第2个元素为对象则为节点参数)和结束标签之间的所有元素都会被视为子节点元素。如例中(3)处所示，(4)和(5)都为slider标签的子节点。
2. 也可以将多个子元素节点放在1个数组中，如下所示：
```js
['div',
    'test1',
    [  //将多个节点放入1个数组中作为子节点
        'test2',
        ['<span id=span1>'],
        ['<span id=span1>']
    ],
'/div']
```

##### 模板替换参数

在模板内可以定义替换参数，语法为"{参数名}"。替换参数的作用是在模板编译后，输出html字符串或组件时，可用数据替换定义好的参数。

* 在元素节点参数中定义替换参数

```js
['<div id={id}>', { name: '{name}' }]
```

* 在文本节点中定义替换参数

```js
['div',
    '{content}',
'/div']
```

* 使用1个花括号形式的参数，在生成html数据时是会自动进行字符转义的，这样的目的是为了防止xss攻击等。但是也可以设置不进行转义，就须要用两个花括号的形式定义替换参数，如下所示：

```js
['div',
    '{{content}}',
'/div']
```

##### 过滤器

* 在替换参数中可以定义过滤器，来对数据进行一些定制化操作。语法为"{替换参数:过滤器1:过滤器2...}"，如使用多个过滤器则会按顺序依次执行，如下所示：
```js
nj.registerFilter("format", function(obj) {
    return obj + 1;
});

['div',
    '{list:count}',        //获取总数
    '{list:count:format}', //先获取总数,然后格式化
'/div']
```

* 也可以一次定义多个过滤器：
```js
nj.registerFilter([
{
    name: "format",
    filter: function(obj) {
        return obj.trim();
    }
}, {
    name: "replace",
    filter: function(obj) {
        return obj.replace(/id/g, "test1");
    }
}
]);
```

* 过滤器也可以添加参数，语法为"{替换参数:过滤器1(参数1,参数2...):过滤器2(参数1,参数2...)...}"。在过滤器方法中第一个参数是当前传入的数据；从第二个参数开始依次为这些模板中传入的参数，如下所示：
```js
nj.registerFilter("test", function(obj, p1, p2) {
    console.log(obj);  //输出test
    console.log(p1);   //输出1
    console.log(p2);   //输出2
    return obj;
});

nj.compile(['div',
    '{data:test(1, 2)}',
'/div'])({
    data: 'test'
});
```

* 在过滤器方法内，可以通过this.x的方式获取一些参数，如下所示：
```js
nj.registerFilter("test", function(obj) {
    console.log(this.data);    //输出1
    console.log(this.parent);  //输出{ list: [1] }
    console.log(this.index);   //输出0
    return obj;
});

nj.compile(['each {list}',
    '{#:test}',
'/each'])({
    list: [1]
});
```


* 内置过滤器

| 名称           | 作用            | 示例                    |
|:---------------|:----------------|:------------------------|
| prop           | 获取对象属性值  | {content:prop(foo.bar)} |
| count          | 获取集合总数    | {content:count}         |
| item           | 获取集合项值    | {content:item(0)}       |

##### 流程控制块

NornJ模板中可用的流程控制块有if、else、each等。

* if块

举例：
```js
['div',
    'this is the if block demo.',
    ['$if {type}',  //if块开始标签(1)
        'test if block',
        ['<span>', 'test1'],
    '/$if'],  //if块结束标签,此处可省略(2)
'/div']
```

1. 流程控制块使用一个数组来声明。数组第一项为开始标签，格式为"$ + 控制块名"；最后一项为结束标签，格式为"/$ + 控制块名"，具体如例中(1)、(2)处所示。另外，控制块的结束标签也可以省略不写。
2. 流程控制块内须要添加参数，参数格式为"{参数名}"。如例中(1)处所示，"type"即为参数。
3. 在执行模板函数时，如if块的参数计算结果为true，则会执行if块内的模板；如为false则不会执行if块内的模板。
4. 流程控制块参数内也可以添加过滤器，这样就可以实现更复杂的逻辑，例如：
```js
['$if {type:filter1}',
    'test if block',
'/$if']
```

* else块

举例：
```js
['div',
    'this is the if block demo.',
    ['$if {type}',
        'test if block',
        ['<span>', 'test1'],
    '$else',  //else标签(1)
        ['<span>', 'test2']  //type参数计算结果为false时执行此处的模板(2)
    ],
'/div']
```

1. else标签须定义在if块内，格式为"$else"。如例中(1)处所示。
2. 在执行模板函数时，如if块的参数计算结果为false，则会执行排在if块内的else标签之后的模板，如例中(2)处所示。

* each块

举例：
```js
var tmpl = ['div',
    'this is the if block demo{no}.',
    ['$each {items}',  //each块开始标签(1)
        'test if block{no}',  //items数组每项的no属性(2)
        ['<span>', 'test{../no}'],  //与items数组同一层的no属性(3)
    '$else',
        ['<span>', 'test else{no}'],  //排在else标签后的模板(4)
    '/$each'],  //each块结束标签,此处可省略(5)
    ['$each {numbers}',
        'num:{.},',  //点号表示使用数组项渲染(6)
        'no:{#} '   //#号表示使用数组项索引值渲染(7)
    ]
'/div'];

var tmplFn = nj.compile(tmpl, "tmpl1");
var html = tmplFn({
    no: 100,
    items: [
        { no: 200 },
        { no: 300 }
    ],
    numbers: [10, 20, 30]
});

console.log(html);
/*输出html:
<div>
    this is the if block demo100.
    test if block200
    <span>test100</span>
    test if block300
    <span>test100</span>
    num:10,no:0 num:20,no:1 num:30,no:2
</div>
*/

var html2 = tmplFn({
    no: 100,
    items: null,
    numbers: null
});

console.log(html2);
/*输出html:
<div>
    this is the if block demo100.
    <span>test else100</span>
</div>
*/
```

1. each块接受一个js数组格式的参数，如例中(1)处的"{items}"参数。
2. each块会遍历参数数组中的数据，将数组中的每一项数据都执行渲染。在遍历每个数组项时，会使用每项的数据作为当前节点的数据，相当于生成了一个上下文。如例中(2)处所示，"{no}"参数为items数组内各项的no值。
3. 在遍历每个数组项时也可以使用父级上下文的数据，如例中(3)处所示，"{../no}"表示获取和items参数同一级的no值。和一般的目录描述方法类似，"../"可以写多次，每次代表向上退一级上下文。
4. 在each块中也可以使用else标签，如"{items}"参数为null或false时，则会执行排在else标签后面的模板。如例中(4)处所示，在else标签后面的模板并不会产生上下文，"{no}"参数为items参数同一级的no值。
5. each块内可以使用点号"{.}"设置替换参数，表示使用数组项渲染，如例中(6)处所示。
6. each块内还可以使用#号"{#}"设置替换参数，表示使用数组项索引值渲染，如例中(7)处所示。

##### 使用es6模板字符串语法糖

NornJ模板还有一种使用es6(es2015)提供的模板字符串来描述模板的功能，结构就像这样：
```js
nj`
<slider>
    this the test slider {msg}.
    <sliderItem id=test onsliderend={event} />
</slider>`
```

但使用es6模板字符串形式构建的模板，实际上是普通模板的语法糖形式，如下所示：
```js
nj`
<div>
    <slider />
</div>`

//以上模板完全等价于：

['div',
    ['slider /'],
'/div']
```
