import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// Component Imports
import App from './containers/App';
import InfoWrapper from './containers/InfoWrapper';
import GameWrapper from './containers/GameWrapper';
import Landing from './components/Landing';
import Main from './components/Main';
import Stats from './containers/Stats';
import Login from './containers/Login';
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
        <IndexRoute component={Landing}/>
        <Route path='play' component={Main}/>
        <Route path='gameinfo' component={InfoWrapper}></Route>
        <Route path='signin' component={Login}></Route>
        <Route path='signup' component={SignUp}></Route>
        <Route path='game' component={GameWrapper}></Route>
        <Route path='profile' component={Stats}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);