import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import setGameState from '../actions/setGameState';
import * as Actions from '../actions';

import GameSetting from './GameSetting';

const Room = React.createClass ({
  getInitialState: function() {
    return {
      gm: '',
      players: [],
      ready: false
    };
  },
  componentWillMount: function() {
    console.log("mounting room!");
    //Todo: error with set state when mounting again after first time
    //Connect to server
    var socket = this.props.socket;

    // Tell server that player entered the room
    socket.emit('joinRoom', this.props.roomNumber, this.props.uid, this.props.username);
    socket.on('roomInfo', function(roomInfo) {
      this.setState({
        gm: roomInfo.gm,
        players: roomInfo.players
      });
    }.bind(this));

    socket.on('leaveRoomGoToGamePage', () => {
      this.props.setGameState();
    });
  },
  readyHandler: function(e) {
    this.setState({
      ready: !this.state.ready
    });
    this.props.socket.emit('ready', 
      {
        roomId: this.props.roomNumber,
        state: !this.state.ready
      }
    );
  },
  backToLobby: function(e) {
    console.log('tryna go back to lobby');
    this.props.socket.emit('leaveRoom', this.props.roomNumber);
    this.props.actions.setGameRoom('');
  },
  render: function() {
    return (
      <div className="inner cover"> 
        <h1 className="sectionTitle">[ Waiting Room ]
          <button id="roomReturnButton" className="btn" onClick={ this.backToLobby }>Back to Lobby</button>
        </h1>
        
        <div className='container playerListContainer'>
          {
            (this.props.currentUser.socketID) === this.state.gm.uid ?
            <div className="gameMasterBox" key={ this.props.currentUser }>
              <span className="playerLabel gameMasterLabel currentUser">{ this.props.username }</span>
              <button className="btn" onClick={ this.readyHandler }>
                { this.state.ready ? 'Ready' : 'Not Ready' }
              </button>
            </div> 
            : 
            <div className="gameMasterBox" key={ this.state.gm.username }>
              <span className="playerLabel gameMasterLabel">{ this.state.gm.username }</span>
              <span className="readyState">{ this.state.gm.ready ? 'Ready' : 'Not Ready' }</span>
            </div>
          }  
          
          {
            this.state.players.map(player => {
              if (player.uid === (this.props.currentUser.socketID)) {
                return (
                  <div className="playerBox" key={ this.props.username }>
                    <span className="playerLabel currentUser">{ this.props.username }</span>
                    <button className="btn" onClick={ this.readyHandler }>{ this.state.ready ? 'Ready' : 'Not Ready' }
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="playerBox" key={ player.uid }>
                    <span className="playerLabel">{ player.username }</span>
                    <span className="readyState">{ player.ready ? 'Ready' : 'Not Ready' }</span>
                  </div>
                );
              }
            })
          }
        </div>
        {/*GAME SETTINGS ONLY FOR GAME MASTER*/}
        {this.state.gm.uid 
          ? 
          <GameSetting 
            socket={this.props.socket}
            gm={this.state.gm.uid} 
            currentUser={this.props.currentUser.socketID} 
            roomNumber={this.props.roomNumber} >
          </GameSetting> 
          : 
          <div></div>
        }
      </div>
    );
  }
});

function mapStateToProps(state) {
  console.log('state = ', state);
  return {
    username: state.auth.settings.username,
    uid: state.auth.uid,
    currentUser: state.socketID,
    roomNumber: state.room.roomNumber,
    vrSetting: state.vrSetting.vrSetting
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setGameState: bindActionCreators(setGameState, dispatch),
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);

