# CHANGELOG

## [v5.3.2] 2021.02.07

- 🌟 Add `onlyLowercaseExName` option for `nornj-in-jsx`.

## [v5.2.8] 2020.09.16

- 🌟 ES module adaptation.

## [v5.2.0] 2020.07.08

- 🌟 `mobxFormData` tag official released.

## [v5.1.0] 2020.01.10

- 🌟 Support new ways to compile `n-bind` directive.

## [v5.0.3] 2019.12.07

- :bug: Fix the babel config sometimes fail to read.

## [v5.0.0] 2019.12.03

- 🚩 Support complete typescript type definition.

## [v5.0.0-rc.35] 2019.09.14

- 🌟 Optimizing auto import the NornJ package.

## [v5.0.0-rc.32] 2019.08.22

- 🌟 Support syntax such as:

```js
const foo = 100,
  bar = 100;

const tag = <input n-show={`foo === bar`} />;
```

## [v5.0.0-rc.12] 2019.05.07

- 🐞 Fixed error on auto add key for children elements with spread attributes.

## [v5.0.0-rc.7] 2019.04.14

- 🌟 Support tagged template tag `html`.

## [v0.4.15] 2018.12.29

- 🌟 支持在`react-native`中自动引入`nornj-react/mobx/native`包。

## [v0.4.14] 2018.12.14

- 🐞 修复指令无法在`react-native`中使用的问题。

## [v0.4.13] 2018.12.14

- 🌟 为适配`react-native`增加`rn`参数。

## [v0.4.12] 2018.12.12

- 🌟 `NornJ`的所有`Tagged template literal`功能均支持模板预编译。
- 🌟 增加`imports`参数，用于修复`babel-plugin-import`在某些使用场景的局限。

## [v0.4.10] 2018.10.17

- 🌟 支持`with`，`for`，`fn`标签。
- 🌟 支持可自由扩展新的标签。
- 🐞 修复`babel 7`中使用指令的 bug。

## [v0.4.8] 2018.09.21

- 🐞 修复`babel 7`中`each`标签的 bug。

## [v0.4.7] 2018.09.05

- 🌟 表达式支持预编译模板。

## [v0.4.6] 2018.08.22

- 🐞 修复`webpack 4`中构建时`nj`变量重复定义的 bug。

## [v0.4.5] 2018.08.10

- 🌟 增加`n-mobx-model`、`n-mst-model`指令。

## [v0.4.4] 2018.08.02

- 🐞 修复与`styled-jsx`共存时的 bug。

## [v0.4.3] 2018.08.01

- 🌟 增加`n-show`，`n-style`指令。
- 🌟 支持预编译模板，可使用体积最小的`runtime`版本`NornJ`包。

## [v0.4.2] 2018.05.24

- 🌟 支持`if`，`each`，`switch`标签。
