import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

import login from '../actions/login';

import Game from '../components/Game';
import Lobby from '../components/Lobby';

class GameWrapper extends React.Component {
  constructor() {
    super();
    this.socket = io();
  }
  componentWillMount() {
    //refactor this!
    var login = this.props.login;
    var socket = this.socket;
    
    //Connect to server

    socket.on('connect', function() {
      login(this.socket.id);
      
      const peer = new Peer (this.socket.id, {host: 'ancient-caverns-19863.herokuapp.com', port: '', secure: 'true'});
      
      //Connection for audio
      peer.on('open', function(id) {
      });
    }.bind(this));
  },
  onClick(e) {
    console.log(e);
    this.props.actions.setLobbyRoom(1);
  },
  render() {
    var lobbyOrGame = 
      (
        <div className='buttons'>
          <button className='button1' onClick={this.onClick} value='1'>Lobby Room 1</button>
          <button className='button2' onClick={this.onClick} value='2'>Lobby Room 2</button>   
          <button className='button3' onClick={this.onClick} value='3'>Lobby Room 3</button>   
          <button className='button4' onClick={this.onClick} value='4'>Lobby Room 4</button>   
        </div>
      );
    lobbyOrGame = this.props.lobbyNumber ? (this.props.playing ? <Game socket={this.socket}/> : <Lobby socket={this.socket} />) : lobbyOrGame;
    return (
      <div className='text-center'>
        {lobbyOrGame} 
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    playing: state.gameState,
    currentUser: state.currentUser,
    lobbyNumber: state.lobbyRoom.lobbyNumber
  };
}
function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(login, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameWrapper);


