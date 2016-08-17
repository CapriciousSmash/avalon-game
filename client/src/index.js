import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// Component Imports
import App from './containers/App';
import InfoWrapper from './containers/InfoWrapper';
import GameWrapper from './containers/GameWrapper';
import Main from './components/Main';
import Stats from './components/Stats';
import Login from './components/Login';
import SignUp from './components/Signup';

// Redux Related Imports
import { Provider } from 'react-redux';
import configureStore from './store/configStore';

const store = configureStore();

// Implementing React Router
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='main' component={Main}></Route>
        <Route path='gameinfo' component={InfoWrapper}></Route>
        <Route path='signin' component={Login}></Route>
        <Route path='signup' component={SignUp}></Route>
        <Route path='game' component={GameWrapper}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);