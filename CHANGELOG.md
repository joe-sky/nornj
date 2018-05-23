# CHANGELOG

## [v0.4.5] 2018.05.23

* 🌟 增加新API `nj.mustache`。[查看文档](https://joe-sky.github.io/nornj-guide/templateSyntax/templateString.html#njmustache)

## [v0.4.4] 2018.05.07

* 🌟 表达式支持`{{!a.b.c}}`。
* 🌟 表达式支持放在最前面的括号，如`{{(a.b.c)}}`。
* 🌟 新增`?:`和`%%`过滤器，未来逐步替代`?`和`//`。

## [v0.4.3] 2018.04.28

* 🌟 `<#each>`标签增加`@item`参数。
* 🌟 增加新API `nj.template`。[查看文档](https://joe-sky.github.io/nornj-guide/templateSyntax/templateString.html#njtemplate)

## [v0.4.2] 2018.04.11

* 🌟 增加`<nj-noWs>`标签，用于输出无多余空白的html字符串。
* 🌟 错误提示信息优化。

## [v0.4.2-rc.38] 2018.03.29

* 🌟 扩展标签函数的`options`参数中增加`name`和`parentName`参数。
* 🌟 支持赋值语法，如`{{ set a.c = c }}`。
* 🐞 修复在标签的属性名和字符串类型值完全相等时，编译时会认为只传了属性名的问题，如`<input name="name" />`。

## [v0.4.2-rc.36] 2018.03.21

* 🌟 支持`<div :#show="1 < 2">`语法。
* 🌟 支持在`nj`标签模板字符串语法中写`<#include>`标签。
* 🌟 `nj.createTaggedTmpl`方法支持传入`fileName`参数。

## [v0.4.2-rc.35] 2018.03.19

* 🌟 支持构建`es module`包。
* 🌟 增加`@root`和`@context`插值变量。
* 🌟 `once`扩展标签增加`name`属性。

## [v0.4.2-rc.34] 2018.03.12

* 🌟 支持构建`runtime`包。

## [v0.4.2-rc.33] 2018.03.05

* 🌟 增加表达式语法错误提示。
* 🌟 在React开发中支持插值变量的`{}`与`{{}}`语法共存。[相关文档](https://joe-sky.github.io/nornj-guide/templateSyntax/variable.html)

## [v0.4.2-rc.31] 2018.02.27

* 🌟 表达式支持编写嵌套对象字面量，如`{{ { a: { b: 1 } }.a.b }}`。
* 🌟 插值变量中任何形式的链式语法如其中有`undefined`也不会出现错误，而是返回一个空值。如`{{ a.b['c'].d }}`，a、b、c各为null时都不会报错。

## [v0.4.2-rc.28] 2018.02.13

* 🌟 为减小代码体积，使用`rollup`重新构建`dist`目录下各文件。