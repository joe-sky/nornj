/*!
* NornJ-React-Router v5.0.0-rc.45
* (c) 2016-2019 Joe_Sky
* Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('nornj'), require('react-router-dom')) :
  typeof define === 'function' && define.amd ? define(['nornj', 'react-router-dom'], factory) :
  (global = global || self, factory(global.NornJ, global.ReactRouterDOM));
}(this, (function (nornj, reactRouterDom) { 'use strict';

  nornj.registerComponent({
    BrowserRouter: reactRouterDom.BrowserRouter,
    HashRouter: reactRouterDom.HashRouter,
    'router-Link': reactRouterDom.Link,
    MemoryRouter: reactRouterDom.MemoryRouter,
    'router-NavLink': reactRouterDom.NavLink,
    'router-Prompt': reactRouterDom.Prompt,
    Redirect: reactRouterDom.Redirect,
    Route: reactRouterDom.Route,
    Router: reactRouterDom.Router,
    StaticRouter: reactRouterDom.StaticRouter,
    'router-Switch': reactRouterDom.Switch
  });

})));
