import nj from '../../src/base.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, Link } from 'react-router';

nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent({
  Provider,
  Router,
  Route,
  Redirect,
  Linkto: Link
});