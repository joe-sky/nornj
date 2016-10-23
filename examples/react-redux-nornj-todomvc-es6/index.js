import nj from '../../src/base.js';
import './njConfig';
import { hashHistory } from 'react-router';
import store from './store/configureStore';
import App from './containers/App';

//Set default data for first render NornJ html template.
nj.setInitRenderData({
  store,
  hashHistory,
  App
});