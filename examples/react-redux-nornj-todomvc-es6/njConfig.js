import nj from '../../src/base.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, Link } from 'react-router';
import { VisibilityFilters } from './actions/actions';
const { SHOW_ACTIVE, SHOW_COMPLETED, SHOW_ALL } = VisibilityFilters;

nj.setComponentEngine('react', React, ReactDOM);
nj.registerComponent({
  Provider,
  Router,
  Route,
  Redirect,
  Linkto: Link
});

nj.registerFilter({
  isCurrent: function (obj) {
    return obj === this.parent.data.currentFilter;
  },
  todoState: (obj) => {
    switch (obj) {
      case SHOW_ACTIVE:
        return 'active';
      case SHOW_COMPLETED:
        return 'completed';
      case SHOW_ALL:
      default:
        return 'all';
    }
  },
  textDecoration: (obj) => {
    return obj ? 'line-through' : 'none';
  },
  cursor: (obj) => {
    return obj ? 'default' : 'pointer';
  }
});