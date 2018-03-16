import { combineReducers, applyMiddleware, createStore } from 'redux';
import createHistory from 'history/createHashHistory';
import { routerMiddleware, routerReducer as routing } from 'react-router-redux';
import todoApp from '../reducers/reducers';

export const history = createHistory();
const middleware = routerMiddleware(history);

export default createStore(
  combineReducers(Object.assign({}, todoApp, {
    routing
  })),
  applyMiddleware(middleware)
);