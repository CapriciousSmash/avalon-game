import React from 'react';
import { Router, Route, Link } from 'react-router';

// Containers/component imports
import NavBar from './NavBar';
import GameInfo from '../components/Info';
import Main from '../components/Main';
import Stats from '../components/Stats'
import Login from '../components/Login';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

// CSS-related import
//import '../styles/stylesheet.css';

// The app class acts as the main container to store the entirety
// of what the user will see as the web application
class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
      </div>
    )
  }
}

// Passes data to the container from the store. Makes the result of
// reducers available to the containers as props
function mapStateToProps(state) {
  return {
    activeSection: state.info.activeSection
  };
}

// Passes data from container to the store. Provides ability for 
// container to tell the store that it needs to change. Adds action 
// creators to container as props
function mapDispatchToProps(dispatch) {
  return {
  	actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);