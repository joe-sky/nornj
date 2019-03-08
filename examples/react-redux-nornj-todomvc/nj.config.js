import nj from 'nornj';
import 'nornj-react/redux';
import 'nornj-react/router';
import { ConnectedRouter } from 'react-router-redux';

nj.registerComponent({
  ConnectedRouter
});

nj.registerFilter({
  textDecoration: val => {
    return val ? 'line-through' : 'none';
  },
  cursor: val => {
    return val ? 'default' : 'pointer';
  }
});