# nornj
a javascript template engine
## 这是 H2

# react-no-jsx

[![Build Status](https://travis-ci.org/jussi-kalliokoski/react-no-jsx.svg?branch=master)](https://travis-ci.org/jussi-kalliokoski/react-no-jsx)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/react-no-jsx.svg)](https://coveralls.io/r/jussi-kalliokoski/react-no-jsx)

react-no-jsx is a pure JS DSL to be used instead of JSX. It allows you to define your virtual DOM trees using a square bracket based syntax. See the Motivation section for more information on why.

## Installation

You can install `react-no-jsx` via npm:

```sh
npm install --save react-no-jsx
```

## Usage

react-no-jsx provides a mixin that converts your `renderTree` method into a proper React render method. For example:

```js
var React = require("react");
var noJsxMixin = require("react-no-jsx/mixin");

var items = [{
    id: "foo",
    name: "Very nice item",
}, {
    id: "bar",
    name: "Another nice item",
}];

var ListItem = React.createClass({
    displayName: "ListItem",
    mixins: [noJsxMixin],

    renderTree: function () {
        return ["li", { className: "ListItem" },
            ["a", { href: "/items/" + this.props.item.id },
                this.props.item.name,
            ],
        ];
    },
});

var List = React.createClass({
    displayName: "List",
    mixins: [noJsxMixin],

    renderList: function () {
        return this.props.items.map(function (item) {
            return [ListItem, { item: item, key: item.id }];
        });
    },

    renderTree: function () {
        return ["ul", { className: "List" },
            this.renderList(),
        ];
    },
});

React.render(document.body, React.createElement(List, { items: items }));
```
