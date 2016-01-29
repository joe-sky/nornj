# 模板组成结构

NornJ模板目前分为两种形式：

* 构建在js内的模板,结构例如:
```js
['slider',
    'this the test slider {msg}.',
    ['<sliderItem onsliderend={event} />', { id: 'test' }],
'/slider'];
```
* 构建在html内的模板,结构例如:
```html
<div>
    
</div>
```
