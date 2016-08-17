import React from 'react';
import ReactDOM from 'react-dom';

// Containers import
import GameWrapper from './GameWrapper';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

const LobbyRoom = React.createClass ({
  onClick: function(e) {
    console.log(e);
    this.props.actions.setLobbyRoom(1);
  },

  render: function() {
    var lobbyOrGame = 
      (
        <div className='buttons'>
          <button className='button1' onClick={this.onClick} value='1'>Lobby Room 1</button>
          <button className='button2' onClick={this.onClick} value='2'>Lobby Room 2</button>   
          <button className='button3' onClick={this.onClick} value='3'>Lobby Room 3</button>   
          <button className='button4' onClick={this.onClick} value='4'>Lobby Room 4</button>   
        </div>
      );
    if (this.props.lobbyNumber) {
      lobbyOrGame = (
        <GameWrapper lobbyNumber={this.props.lobbyNumber} />
      );
    }
    return (
      <div id='lobby'>
        {lobbyOrGame}
      </div>
    )
  }
});

function mapStateToProps(state) {
  return {
    lobbyNumber: state.lobbyRoom.lobbyNumber
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyRoom);