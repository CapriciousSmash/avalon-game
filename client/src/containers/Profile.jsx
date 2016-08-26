import React from 'react';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

class Profile extends React.Component {
  render() {
    return (
      <div className="container">
        <h3 className="sectionTitle">{this.props.username}</h3>
        <div className="form-group">
          <div className="control-label">Games Won:</div>
          <div>{this.props.score}</div>
          <br />
          <div className="control-label">Games Played:</div>
          <div>{this.props.games}</div>
        </div>
      </div>
    )
  }
}

// Passes data to the container from the store. Makes the result of
// reducers available to the containers as props
function mapStateToProps(state) {
  return {  
    username: state.currentUser.settings.username,
    score: state.currentUser.settings.score,
    games: state.currentUser.settings.games
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);