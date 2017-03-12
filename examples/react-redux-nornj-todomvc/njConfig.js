import nj from 'nornj';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, Link } from 'react-router';

nj.registerComponent({
  Provider,
  Router,
  Route,
  Redirect,
  'router-Link': Link
});

nj.registerFilter({
  textDecoration: val => {
    return val ? 'line-through' : 'none';
  },
  cursor: val => {
    return val ? 'default' : 'pointer';
  }
});