import ReactDOM from 'react-dom';
import './njConfig';
import { hashHistory } from 'react-router';
import store from './store/configureStore';
import App from './containers/App';
import tmpls from './template.nj.html';

//Set default data for first render NornJ html template.
ReactDOM.render(tmpls.index({
  store,
  hashHistory,
  App
}), document.getElementById('app'));