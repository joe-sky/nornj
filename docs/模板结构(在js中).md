# 模板结构(在js中)

NornJ模板可以在js或html中构建，分别有不同的用途：
* [构建在js中的模板](#构建在js中的模板)
 * [数组模板](#数组模板)
   * [用途](#用途)
    * [构成原理](#构成原理)
    * [模板替换参数](#模板替换参数)
    * [过滤器](#过滤器)
    * [表达式块](#表达式块)
 * [使用es6模板字符串语法糖](#使用es6模板字符串语法糖)
   * [模板字符串语法糖模板结构](#模板字符串语法糖模板结构)
    * [模板字符串语法糖与数组模板的不同点](#模板字符串语法糖与数组模板的不同点)
    * [模板字符串语法糖与数组模板相互嵌套](#模板字符串语法糖与数组模板相互嵌套)
    * [模板字符串语法糖的es5兼容写法](#模板字符串语法糖的es5兼容写法)
* [构建在html中的模板](https://github.com/joe-sky/nornj/blob/master/docs/模板结构(在html中).md)

### 构建在js中的模板
---

#### 数组模板
NornJ模板最通常的形式为使用js嵌套数组构建，我们可以称其为数组模板，结构例如:
```js
['slider',
    'this the test slider {msg}.',
    ['<sliderItem id=test onsliderend={event} />'],
'/slider'];
```

##### 用途

用于在js中构建模板，与常用的基于字符串的js模板引擎(如handlebars)相比，它有如下优势：

* 在es5环境下，由于用js创建多行字符串相对比较麻烦，而它能够以一种较优雅的方式在js中构建多行嵌套模板
* 由于数组可以很方便地任意嵌套，所以这种模板很易于组合，并可以使用js的各种数组api等来构建模板
* 它可以一定程度上简化xml(html)的构建方式

##### 构成原理
例如构建一个元素节点slider：

```js
['slider name=test',  //"slider"为开始标签(1)
    /*子节点开始(2)*/
    'this the test slider {msg}.',  //文本节点(3)
    ['<sliderItem onsliderend={event} />'],  //元素节点(4)
    /*子节点结束*/
'/slider'];  //"/slider"为结束标签(5)
```
* 元素节点

1. 每个元素节点使用一个js数组表示。数组第一项为一个字符串，格式为节点名称(也可以包含在尖括号中)。在名称后也可添加参数，如例中(1)处所示；
2. 元素节点数组的最后一项可以是一个结束标签，格式为“/” + 节点名称(也可以包含在尖括号中)，如例中(5)处所示。结束标签也可以省略不写，但是有一些限制。如以下几种形式的写法都是合规的：
```js
['div', 'test', '/div']  //如果开始标签不写为尖括号的形式，则结束标签"/div"不可省略
['<div>', 'test', '</div>']
['<div>', 'test']  //开始标签写为尖括号的形式，则可以省略结束标签
['<slider />']  //自闭合标签
['slider /']  //自闭合标签可省略尖括号
```

* 文本节点

文本节点使用一个字符串表示，如例中(3)处所示。

* 子节点

1. 每个元素节点数组的开始标签和结束标签之间的所有元素都会被视为子节点元素。如例中(2)处所示，(3)和(4)都为slider标签的子节点。
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
['<div id={id} name={name}>'}]
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

* 元素节点名称也可以设置为替换参数，如下所示：
```js
['{element}',
    'this is content',
'/{element}']
```
元素节点名称作为替换参数时，不支持使用2个花括号形式的字符转义，但是会自动进行转义。生成html字符串时，这样替换时则一定会执行转义；生成React组件时，这样替换则不会进行转义，因为React会替我们进行转义。

* 替换参数内可放入字符串：
```js
['div',
    '{{"content"}}',
'/div']
```
放入字符串语法为使用引号包裹，例中执行模板函数时会直接输出"content"。

* 替换参数内也可放入多个值：
```js
['div',
    '{{content "content"}}',
'/div']

var data = {
  content: 'test'
};
```
例如执行模板函数时会输出："testcontent"。

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
nj.registerFilter({
    format: function(obj) {
        return obj.trim();
    },
    replace: function(obj) {
        return obj.replace(/id/g, "test1");
    }
});
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
    console.log(this.parent.data);  //输出{ list: [1] }
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
| equal          | 是否等于某个值  | {content:equal(foo)}    |

##### 表达式块

NornJ模板中可使用内置表达式块来进行if、unless、each等流程控制；也可以支持自定义表达式块。

* 表达式块语法

在模板中表达式块使用封闭的节点元素形式定义，节点名称为`$`+`表达式块名称`。在表达式块节点开始标签内可以定义一个替换参数，不用加属性名。另外，表达式块的结束标签也可以省略不写。格式例如：
```js
['$each {refer}',
  ...
'/$each']  //此处的"/each"可省略
```
例中的refer参数也可以传入多个值，如`{foo 'and' bar}`。

表达式块内每个参数也都可以添加过滤器，这样就可以实现更复杂的逻辑，例如：
```js
['$if {type:filter1 type2:filter2}',
    'test if block',
'/$if']
```
* if块

举例：
```js
['div',
    'this is the if block demo.',
    ['$if {type}',
        'test if block',
        ['<span>', 'test1'],
    '/$if'],
'/div']
```
在执行模板函数时，如if块的参数计算结果为true，则会执行if块内的模板；如为false则不会执行if块内的模板。

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

---
#### 使用es6模板字符串语法糖

NornJ模板还有一种使用es6(es2015)提供的模板字符串来描述模板的功能，可以使用类似xml标签嵌套的方式来构建模板，结构就像这样：
```js
nj`   <!--模板字符串前须要加nj标签函数-->
<slider>
    this the test slider {msg}.
    <sliderItem id=test onsliderend={event} />
</slider>`
```

##### 模板字符串语法糖模板结构

这种es6模板字符串构建的模板，实际上是数组模板的语法糖形式，如下所示：
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

模板字符串语法糖也可以嵌套使用，语法即为es6模板字符串提供的"${}"占位符：
```js
var tmpl1 = nj`
<div>
    <slider />
</div>`;

var tmpl2 = nj`
<section>
    ${tmpl1}
</section>`;

//嵌套多个元素：
var tmpl3 = nj`
<span>
    <slider />
</span>`;

var tmpl4 = nj`
<section>
    ${[tmpl2, tmpl3]}
</section>`;
```
##### 模板字符串语法糖与数组模板的不同点

模板字符串语法糖与数组模板的语法几乎完全一样，如替换参数、过滤器的定义方式等等。但也有一些细微差别，如下所示：

* 表达式块

表达式块的构建形式与普通模板略有不同，如下所示：
```js
//数组模板结构：
['$if {refer}',
...
'/$if']

['$each {refer}',
...
'$else',
...
'/$each']

//模板字符串语法糖结构：
nj`
<$if {refer}>  <!--if块须要写成一对xml标签-->
...
</$if>`

nj`
<$each {refer}>  <!--each块须要写成一对xml标签-->
...
<$else />  <!--else块须要写成一个自闭合xml标签-->
...
</$each>`
```

##### 模板字符串语法糖与数组模板相互嵌套

举例：
```js
var tmpl1 =
['<div>',
    ['<slider />'],
'</div>'];

var tmpl2 = nj`
<section>
    ${tmpl1}
</section>`;

//嵌套多个元素：
var tmpl3 =
['<span>',
    ['<slider />'],
    tmpl2,
'</span>'];

var tmpl4 = nj`
<section>
    ${[tmpl1, tmpl3]}
</section>`;
```

##### 模板字符串语法糖的es5兼容写法

es6模板字符串语法糖可以使用es5兼容写法。如果模板需要嵌套，则须要使用${x}的方式来定义替换参数，x为从0开始的整数。如下所示：
```html
<script id="tmpl1" type="text/nornj">
    <div>
        <slider />
    </div>
</script>

<script id="tmpl2" type="text/nornj">
    <span>
        <slider />
    </span>
</script>

<script id="tmpl3" type="text/nornj">
    <section>
        ${0}
        <br />
        ${1}
        ${2}
    </section>
</script>
```
```js
var tmplStr1 = document.getElementById('tmpl1').innerHTML,
    tmplStr2 = document.getElementById('tmpl2').innerHTML,
    tmplStr3 = document.getElementById('tmpl3').innerHTML,
    tmpl4 = ['<input type=button />'];

var tmpl = nj(     //须使用nj函数处理字符串
    tmplStr3,      //第一个参数为html字符串，其中可以用${x}的方式来定义任意个替换参数
    nj(tmplStr1),  //从第二个参数开始为填充模板中的"${x}"占位符，可以使用nj函数返回的模板对象
    tmplStr2,      //占位符替换参数也可以直接传入字符串
    tmpl4          //占位符替换参数也可以传入数组模板对象
);

//编译并执行模板
var html = nj.compile(tmpl)();

console.log(html);
/* 输出html:
<section>
    <div>
        <slider />
    </div>
    <br />
    <span>
        <slider />
    </span>
    <input type=button />
</section>
*/
```
