# 模板结构

NornJ模板目前分为两种形式：
* [构建在js内的模板](https://github.com/joe-sky/nornj/blob/master/docs/模板结构(在js中).md)
* [构建在html内的模板](#构建在html内的模板)
 * [用途](#用途)

### 构建在html内的模板
* * *

结构例如:
```html
<nj:slider>
    'this the test slider {msg}.'
    <nj:sliderItem id='test' onsliderend={event} />
</nj:slider>
```

##### 用途

配合React框架使用，用于替代ReactDOM.render方法，使React开发的组件拥有html api直接嵌入到html中展示。
