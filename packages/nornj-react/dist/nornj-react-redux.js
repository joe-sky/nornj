/*!
 * NornJ-React-Redux v5.2.0-beta.5
 * (c) 2016-2020 Joe_Sky
 * Released under the MIT License.
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var _nornj = require("nornj");

  var _reactRedux = require("react-redux");

  (0, _nornj.registerComponent)({
    Provider: _reactRedux.Provider
  });

})));
