import React from 'react';

// Containers import
import 

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionsCreators } from 'redux';
import * as Actions from '../actions';

class LobbyRoom extends React.Component {
  render() {

  }
}

function mapStateToProps(state) {
  // return {
  // }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionsCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyRoom);