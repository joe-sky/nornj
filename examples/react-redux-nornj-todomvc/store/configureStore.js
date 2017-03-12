import { combineReducers, applyMiddleware, createStore } from 'redux';
import { hashHistory } from 'react-router';
import { routeReducer, syncHistory } from 'react-router-redux';
import todoApp from '../reducers/reducers';

let reducer = combineReducers(Object.assign({}, todoApp, {
  routing: routeReducer
}));

let reduxRouterMiddleware = syncHistory(hashHistory);
let createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore);

let store = createStoreWithMiddleware(reducer);
reduxRouterMiddleware.listenForReplays(store);

export default store;