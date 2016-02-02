# 编译模板并输出html

每个NornJ模板都可以编译为1个模板函数。传入数据并执行此模板函数则可以输出html字符串，这样就可以配合Backbone.js等mvc框架作为视图的模板引擎了。

### 将模板编译为模板函数

举例：
```js
var tmpl =
['div id=test1',
    'this the test demo{no}.'
    ['<i>', 'test{no}'],
'/div'];
```
