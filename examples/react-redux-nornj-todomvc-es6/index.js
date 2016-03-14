import nj from '../../src/base.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, Link, hashHistory } from 'react-router';
import store from './store/configureStore';
import App from './containers/App';

nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent({
  Provider,
  Router,
  Route,
  Redirect,
  Link
});

//Set default data for first render NornJ html template.
nj.setInitTagData({
  store,
  hashHistory,
  App
});
