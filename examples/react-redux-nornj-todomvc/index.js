import 'core-js/es6/map';
import 'core-js/es6/set';
import ReactDOM from 'react-dom';
import './nj.config';
import store, { history } from './store/configureStore';
import App from './containers/App';

//Set default data for first render NornJ html template.
ReactDOM.render(t`
  <Provider store=${store}>
    <ConnectedRouter history=${history}>
      <Route path="/" component=${App}>
        <Route path="/all" />
        <Route path="/active" />
        <Route path="/completed" />
        <Redirect from="/" to="/all" />
      </Route>
    </ConnectedRouter>
  </Provider>
`, document.getElementById('app'));