# CHANGELOG

## [v0.4.2-rc.33] 2018.03.05

* 🌟 增加表达式语法错误提示。
* 🌟 在React开发中支持插值变量的`{}`与`{{}}`语法共存。[相关文档](https://joe-sky.github.io/nornj-guide/templateSyntax/variable.html)

## [v0.4.2-rc.31] 2018.02.27

* 🌟 表达式支持在嵌套对象字面量，如`{{ { a: { b: 1 } }.a.b }}`。
* 🌟 插值变量中任何形式的链式语法如其中有`undefined`也不会出现错误，而是返回一个空值。如`{{ a.b['c'].d }}`，a、b、c各为null时都不会报错。

## [v0.4.2-rc.28] 2018.02.13

* 🌟 为减小代码体积，使用`rollup`重新构建`dist`目录下各文件。