import React from 'react';
import { Router, Route, Link } from 'react-router';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

// The NavBar class holds and handles the main point of navigation on
// the page and exists inside of the App container. 
class NavBar extends React.Component {
  render() {
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
                  <Link style={showAuth} to='profile'>Profile</Link>
                </li>
                <li>
                  <a style={showAuth} onClick={this.props.actions.logout} href="/logout">Logout</a>
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
    auth: state.auth.authenticated
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