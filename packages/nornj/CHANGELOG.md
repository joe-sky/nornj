# CHANGELOG

## [v5.0.0-rc.42] 2019.09.12

* ♻️ Refactoring code using typescript.

## [v5.0.0-rc.24] 2019.09.12

* 🐞 Fixed rendering spaces with text mode.

## [v5.0.0-rc.23] 2019.09.06

* 🐞 Fixed the key prop name of each tag.

## [v5.0.0-rc.20] 2019.08.20

* 🌟 Added `nornj/lib/filter/lodash`.

## [v5.0.0-rc.19] 2019.07.24

* 🌟 Added sub tag `then` for `if` tag.

## [v5.0.0-rc.15] 2019.06.17

* 🌟 Added `rawStart` and `rawEnd` parameters for delimiters config.

## [v5.0.0-rc.14] 2019.06.14

* 🌟 The `switch` tag should be prefixed by default when it begin in lowercase.

## [v5.0.0-rc.10] 2019.05.20

* 🌟 Support spread props in extension tags.

## [v5.0.0-rc.8] 2019.05.08

* 🌟 Support `key` variable for `each` tag in jsx.

## [v5.0.0-rc.7] 2019.05.05

* 🌟 Changed the default template rule of tags from `<#extag>` to `<n-extag>`. If you need to adapt version 0.4, you can use `nj.config` to modify the rules.

## [v5.0.0-rc.5] 2019.04.14

* 🌟 Support nj`<Extag></Extag>` auto transform to nj`<n-extag></n-extag>`.

## [v5.0.0-rc.1] 2019.04.02

* 🌟 扩展函数中的`options.result`改为`options.children`或`options.value`。

## [v5.0.0-beta.3] 2019.03.13

* 🌟 增加`nj.copyComponentConfig`方法。

## [v0.4.18] 2019.01.25

* 🌟 存储`nj.componentConfig`的类型改为使用`Map`。
* 🐞 修复指令在`react-native`中打包release版时的bug。

## [v0.4.17] 2018.12.20

* 🐞 修复`#show`指令可在`react-native`中支持组件的`style`参数为数组的情况。

## [v0.4.16] 2018.12.14

* 🐞 `tools/metroTransformer`适配`react-native v0.56+`。

## [v0.4.15] 2018.12.12

* 🌟 新增`nj.buildRender`和`nj.buildRenderH`方法，用于预编译各`tagged template literal`功能时使用。
* 🐞 修复runtime包缺少`nj.getComponentConfig`方法。

## [v0.4.14] 2018.12.05

* 🐞 修复`for`标签bug。

## [v0.4.13] 2018.10.17

* 🌟 改进`for`标签语法。
* 🌟 改进扩展标签配置信息。

## [v0.4.12] 2018.09.05

* 🌟 扩展标签函数的`options`参数中增加`attrs`参数。
* 🌟 改进`precompile`方法，更好地配合`babel-plugin-nornj-in-jsx`做预编译。

## [v0.4.11] 2018.08.17

* 🐞 修复渲染`<br style="color: #fff">`时的bug。[#17](https://github.com/joe-sky/nornj/issues/17)

## [v0.4.10] 2018.08.15

* 🐞 改进`nj.registerComponent`将同一组件注册多次时的策略。

## [v0.4.9] 2018.08.10

* 🌟 扩展标签函数的`options`参数中增加`tagName`参数。
* 🌟 `nj.registerComponent`支持传入组件配置属性。
* 🌟 新增API`nj.getComponentConfig`和`nj.expression`。
* 🐞 修复 `<input #mobx-model={value}>` bug。
* 🐞 修复扩展属性不能添加多个的bug。

## [v0.4.8] 2018.07.22

* 🌟 支持配合`webpack`使用时，直接在模板中使用`require`方法引入图片等资源。[查看文档](https://joe-sky.github.io/nornj-guide/api/webpack.html#%E5%9C%A8%E5%8D%95%E6%96%87%E4%BB%B6%E6%A8%A1%E6%9D%BF%E4%B8%AD%E5%BC%95%E5%85%A5%E5%9B%BE%E7%89%87%E7%AD%89%E8%B5%84%E6%BA%90)

## [v0.4.7] 2018.05.27

* 🌟 增加新API `nj.css`。[查看文档](https://joe-sky.github.io/nornj-guide/templateSyntax/templateString.html#njcss)
* 🌟 `<#with>`标签新增创建变量语法。[查看文档](https://joe-sky.github.io/nornj-guide/templateSyntax/built-inExtensionTag.html#with)

## [v0.4.6] 2018.05.25

* 🐞 修复 `nj.mustache` bug。

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