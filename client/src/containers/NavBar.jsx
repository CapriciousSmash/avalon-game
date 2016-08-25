import React from 'react';
import { Router, Route, Link } from 'react-router';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

// The NavBar class holds and handles the main point of navigation on
// the page and exists inside of the App container. 
class NavBar extends React.Component {
<<<<<<< 046b22bdc5827231de7e1822e6e9fbff74a3ccdb
  render() {
=======

  render() {
    console.log('this.props.auth = ', this.props.auth);
>>>>>>> Sort out loading certain nav elements based on session
    var showAuth = !this.props.auth ? {display: 'none'} : {};
    var showNotAuth = this.props.auth ? {display: 'none'} : {};

    return (
      <div className="masthead clearfix">
        <div className="inner">
          <h3 className="masthead-brand"><Link to='/'>Avalon</Link></h3>
          <nav>
            <div>
              <ul className="nav masthead-nav">
                <li>
                  <Link style={showAuth} to='play'>Play</Link>
                </li>
                <li>
                  <Link to='gameinfo'>Game Info</Link>
                </li>
                <li>
                  <Link style={showAuth} to='stats'>Profile</Link>
                </li>
                <li>
                  <a style={showAuth} href="/logout">Logout</a>
                </li>
                <li>
                  <Link style={showNotAuth} to='signin'>Sign In</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }
  
}

// Passes data to the container from the store. Makes the result of
// reducers available to the containers as props
function mapStateToProps(state) {
  console.log('state', state);
  return {
<<<<<<< 046b22bdc5827231de7e1822e6e9fbff74a3ccdb
    auth: state.auth.authenticated
=======
    auth: state.authenticated.authenticated
>>>>>>> Sort out loading certain nav elements based on session
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);