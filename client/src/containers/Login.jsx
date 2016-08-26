import React from 'react';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

class SignIn extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="container loginSignupContainer">
        <h3 className="sectionTitle">L O G I N</h3>
        <form className="form-horizontal" action="/signin" method="post">
            <div className="form-group">
              <label for="username1" className="col-sm-2 col-sm-offset-1 control-label">Username</label>
              <div className="col-sm-7">
                <input name="username" id="username1" type="text" className="form-control" placeholder="Username"/>
              </div>
            </div>
            <div className="form-group">
              <label for="password2" className="col-sm-2 col-sm-offset-1 control-label">Password</label>
              <div className="col-sm-7">
                <input name="password" type="password" className="form-control" id="password2" placeholder="Password"/>
              </div>
            </div>
            <button className="btn" type="submit" value="Submit">S u b m i t</button>
        </form>
        <br />
        <h3 className="sectionTitle">S I G N U P</h3>
        <form className="form-horizontal" action="/signup" method="post">
            <div className="form-group">
              <label for="username1" className="col-sm-2 col-sm-offset-1 control-label">Username</label>
              <div className="col-sm-7">
                <input name="username" id="username1" type="text" className="form-control" placeholder="Username"/>
              </div>
            </div>
            <div className="form-group">
              <label for="password2" className="col-sm-2 col-sm-offset-1 control-label">Password</label>
              <div className="col-sm-7">
                <input name="password" type="password" className="form-control" id="password2" placeholder="Password"/>
              </div>
            </div>
            <button className="btn" type="submit" value="Submit">S u b m i t</button>
        </form>
      </div>
    );
  }
}

// Passes data to the container from the store. Makes the result of
// reducers available to the containers as props
function mapStateToProps(state) {
  return {  
    activePlayer: state.info.active_player
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);