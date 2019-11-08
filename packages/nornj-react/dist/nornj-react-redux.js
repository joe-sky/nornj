/*!
* NornJ-React-Redux v5.0.0-rc.43
* (c) 2016-2019 Joe_Sky
* Released under the MIT License.
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('nornj'), require('react-redux')) :
	typeof define === 'function' && define.amd ? define(['nornj', 'react-redux'], factory) :
	(global = global || self, factory(global.NornJ, global.ReactRedux));
}(this, (function (nornj, reactRedux) { 'use strict';

	nornj.registerComponent({
	  Provider: reactRedux.Provider
	});

})));
