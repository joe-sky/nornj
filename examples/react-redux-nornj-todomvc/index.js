import njr from 'nornj-react';
import './njConfig';
import { hashHistory } from 'react-router';
import store from './store/configureStore';
import App from './containers/App';

//Set default data for first render NornJ html template.
njr.setInitialData({
  store,
  hashHistory,
  App
});