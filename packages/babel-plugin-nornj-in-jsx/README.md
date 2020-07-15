<div align="center">
  <a href="https://joe-sky.github.io/nornj/">
    <img width="100" src="../../public/images/logo.png">
  </a>
  <a href="https://babeljs.io/">
    <img width="245" src="https://raw.githubusercontent.com/babel/logo/master/babel.png">
  </a>
  <div>
    <img width="100" height="100" title="Babel Plugin" src="https://michael-ciniawsky.github.io/postcss-load-plugins/logo.svg">
  </div>
  <h1>Babel-Plugin-NornJ-in-jsx</h1>
  <p>一个可支持自由扩展的JSX语法增强插件 :wink:</p>
</div>

[![NPM Version][npm-image]][npm-url]
[![Coverage Status](https://coveralls.io/repos/github/joe-sky/nornj/badge.svg?branch=master)](https://coveralls.io/github/joe-sky/nornj?branch=master)
[![NPM Downloads][downloads-image]][npm-url]

`Babel-Plugin-NornJ-in-jsx`是一个能为 JSX 带来更多丰富语法的 Babel 插件，比如条件及循环语句：

```js
const Button = () => {
  return (
    <div>
      <for i={0} to={10}>
        <if condition={i < 5}>
          <i>less than 5</i>
          <else>
            <i>greater than 5</i>
          </else>
        </if>
      </for>
    </div>
  );
};
```

以及类似 Vue、Angular 的指令：

```js
const Button = props => {
  return (
    <div>
      <input type="button" n-show={props.showBtn} />
    </div>
  );
};
```

还有过滤器：

```js
const Button = props => {
  return <div>{n`${props.name} | upperFirst`}</div>;
};
```

更重要的是，除了以上这些预置的语法，还支持像 Vue、Angular 那样自由扩展新的语法：

```js
import nj from 'nornj';
import cn from 'classnames';
nj.registerExtension('class', opts => cn(opts.value()));

const Button = props => {
  return (
    <div>
      <input
        type="button"
        n-class={{
          className1: true,
          className2: props.hasClassName2
        }}
      />
    </div>
  );
};
```

## 为什么创建这个插件？

在`React`项目开发中，原生的`JSX`语法并没有提供类似`Vue`的`v-if`、`v-for`、`v-show`等模板语法糖。当然，社区为`JSX`贡献了不少相关的插件，比如[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)。

而`Babel-Plugin-NornJ-in-jsx`的设计灵感就来源于上述的`jsx-control-statements`。只不过，它比前者的功能要更加丰富得多；且可以支持扩展 :wink:。

## License

MIT

[npm-image]: http://img.shields.io/npm/v/babel-plugin-nornj-in-jsx.svg
[downloads-image]: http://img.shields.io/npm/dm/babel-plugin-nornj-in-jsx.svg
[npm-url]: https://www.npmjs.org/package/babel-plugin-nornj-in-jsx
