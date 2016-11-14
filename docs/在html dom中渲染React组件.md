NornJ模板可以直接构建在html dom中来渲染React组件。

## 为什么要在html dom中构建模板

使用`React`框架来渲染组件到dom的通常形式为使用`ReactDOM.render`方法，而nj模板可提供类似像`Vue`或`Angular`那样直接将模板嵌入到html dom中，这样很多情况下能少写一些js代码，也能使这个渲染过程显得更加声明式。

## 在html中渲染模板的格式

简单示例：

```js
<body>
  <script type="text/nornj" autoRender>
    <TestComponent no="100" {...props} />
  </script>
</body>
```

如上例，模板需要写在type为`text/nornj`的script标签内，模板语法则和使用普通字符串构建基本完全一致。

* 该script标签的父级标签即为要渲染到的容器，上例中则为body标签。
* 如script标签设置了autoRender标签，则会自动在文档准备完毕后渲染所有标记为autoRender的nj模板。
