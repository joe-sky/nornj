/*!
 * NornJ-React-Router v5.2.0-beta.3
 * (c) 2016-2020 Joe_Sky
 * Released under the MIT License.
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var _nornj = require("nornj");

  var _reactRouterDom = require("react-router-dom");

  (0, _nornj.registerComponent)({
    BrowserRouter: _reactRouterDom.BrowserRouter,
    HashRouter: _reactRouterDom.HashRouter,
    'router-Link': _reactRouterDom.Link,
    MemoryRouter: _reactRouterDom.MemoryRouter,
    'router-NavLink': _reactRouterDom.NavLink,
    'router-Prompt': _reactRouterDom.Prompt,
    Redirect: _reactRouterDom.Redirect,
    Route: _reactRouterDom.Route,
    Router: _reactRouterDom.Router,
    StaticRouter: _reactRouterDom.StaticRouter,
    'router-Switch': _reactRouterDom.Switch
  });

})));
