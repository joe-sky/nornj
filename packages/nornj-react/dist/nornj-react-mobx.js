/*!
 * NornJ-React-Mobx v5.2.0
 * (c) 2016-2020 Joe_Sky
 * Released under the MIT License.
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var _nornj = require("nornj");

  var _mobx = require("mobx");

  var _mobxReact = require("mobx-react");

  require("./mobxBind");

  require("./mobxObserver");

  (0, _nornj.registerComponent)('mobx-Provider', _mobxReact.Provider);
  (0, _nornj.registerFilter)('toJS', function (v) {
    return (0, _mobx.toJS)(v);
  });

})));
