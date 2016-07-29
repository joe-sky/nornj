NornJ模板可以使用字符串或html dom构建：
* [使用字符串构建模板](https://github.com/joe-sky/nornj/blob/master/docs/使用字符串构建模板.md)
* [使用dom构建模板](#使用dom构建模板)
 * [用途](#用途)

# 使用dom构建模板

结构例如:
```html
<nj:slider>
    'this the test slider {msg}.'
    <nj:sliderItem id='test' onsliderend={event} />
</nj:slider>
```

#### 用途

配合React框架使用，用于替代ReactDOM.render方法，使React开发的组件可以以直接嵌入到html中的形式来渲染。与ReactDOM.render对比它的优势如下：
* NornJ html模板可以嵌入在常规的html标签内使用。
* NornJ html模板可使用服务器端页面脚本技术(如JSP、ASP.NET)来动态构建。
* NornJ html模板开发的React UI组件库可以对外提供html api，使用者甚至可以在不了解React技术的情况下正常使用这些控件。
