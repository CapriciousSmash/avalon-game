import React from 'react';
import { Router, Route, Link } from 'react-router';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

// The NavBar class holds and handles the main point of navigation on
// the page and exists inside of the App container. 
class NavBar extends React.Component {
  isAuthenticated() {
    if(this.props.auth) {
      return (
        <ul>
          <li>
            <Link to='main'>Stats</Link>
          </li>
          <li>
            <Link to='gameinfo'>Game Info</Link>
          </li>
          <li>
            <div>Placeholder for username</div>
          </li>
        </ul>
      )
    } else {
      return (
        <ul>
          <li>
            <Link to='main'>Stats</Link>
          </li>
          <li>
            <Link to='gameinfo'>Game Info</Link>
          </li>
          <li>
            <Link to='signin'>Sign In</Link>
          </li>
        </ul>
      )
    }
  }

  render() {
    return (
      <nav>
        <div>
          {this.isAuthenticated()}
        </div>
      </nav>
    )
  }
  
}

// Passes data to the container from the store. Makes the result of
// reducers available to the containers as props
function mapStateToProps(state) {
  return {
    auth: false,
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