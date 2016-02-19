(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactRouterRedux"] = factory();
	else
		root["ReactRouterRedux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.routeReducer = routeReducer;
	exports.syncHistory = syncHistory;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// Constants

	var TRANSITION = exports.TRANSITION = '@@router/TRANSITION';
	var UPDATE_LOCATION = exports.UPDATE_LOCATION = '@@router/UPDATE_LOCATION';

	var SELECT_LOCATION = function SELECT_LOCATION(state) {
	  return state.routing.location;
	};

	function transition(method) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return {
	      type: TRANSITION,
	      payload: { method: method, args: args }
	    };
	  };
	}

	var push = exports.push = transition('push');
	var replace = exports.replace = transition('replace');
	var go = exports.go = transition('go');
	var goBack = exports.goBack = transition('goBack');
	var goForward = exports.goForward = transition('goForward');

	var routeActions = exports.routeActions = { push: push, replace: replace, go: go, goBack: goBack, goForward: goForward };

	function updateLocation(location) {
	  return {
	    type: UPDATE_LOCATION,
	    payload: location
	  };
	}

	// Reducer

	var initialState = {
	  location: undefined
	};

	function routeReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var _ref = arguments[1];
	  var type = _ref.type;
	  var location = _ref.payload;

	  if (type !== UPDATE_LOCATION) {
	    return state;
	  }

	  return _extends({}, state, { location: location });
	}

	// Syncing

	function syncHistory(history) {
	  var unsubscribeHistory = undefined,
	      currentKey = undefined,
	      unsubscribeStore = undefined;
	  var connected = false,
	      syncing = false;

	  history.listen(function (location) {
	    initialState.location = location;
	  })();

	  function middleware(store) {
	    unsubscribeHistory = history.listen(function (location) {
	      currentKey = location.key;
	      if (syncing) {
	        // Don't dispatch a new action if we're replaying location.
	        return;
	      }

	      store.dispatch(updateLocation(location));
	    });

	    connected = true;

	    return function (next) {
	      return function (action) {
	        if (action.type !== TRANSITION || !connected) {
	          return next(action);
	        }

	        var _action$payload = action.payload;
	        var method = _action$payload.method;
	        var args = _action$payload.args;

	        history[method].apply(history, _toConsumableArray(args));
	      };
	    };
	  }

	  middleware.listenForReplays = function (store) {
	    var selectLocationState = arguments.length <= 1 || arguments[1] === undefined ? SELECT_LOCATION : arguments[1];

	    var getLocationState = function getLocationState() {
	      return selectLocationState(store.getState());
	    };
	    var initialLocation = getLocationState();

	    unsubscribeStore = store.subscribe(function () {
	      var location = getLocationState();

	      // If we're resetting to the beginning, use the saved initial value. We
	      // need to dispatch a new action at this point to populate the store
	      // appropriately.
	      if (location.key === initialLocation.key) {
	        history.replace(initialLocation);
	        return;
	      }

	      // Otherwise, if we need to update the history location, do so without
	      // dispatching a new action, as we're just bringing history in sync
	      // with the store.
	      if (location.key !== currentKey) {
	        syncing = true;
	        history.transitionTo(location);
	        syncing = false;
	      }
	    });
	  };

	  middleware.unsubscribe = function () {
	    unsubscribeHistory();
	    if (unsubscribeStore) {
	      unsubscribeStore();
	    }

	    connected = false;
	  };

	  return middleware;
	}

/***/ }
/******/ ])
});
;