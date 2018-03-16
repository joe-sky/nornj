import 'core-js/es6/map';
import 'core-js/es6/set';
import ReactDOM from 'react-dom';
import './njConfig';
import store, { history } from './store/configureStore';
import App from './containers/App';
import tmpls from './template.nj.html';

//Set default data for first render NornJ html template.
ReactDOM.render(tmpls.index({
  store,
  history,
  App
}), document.getElementById('app'));