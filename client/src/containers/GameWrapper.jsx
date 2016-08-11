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
  }
  render() {
    return (
      <div> 
        <h1>GAME HI!</h1>
        {this.props.playing ? <Game socket={this.socket}/> : <Lobby socket={this.socket}/>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    playing: state.gameState,
    currentUser: state.currentUser
  };
}
function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(login, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameWrapper);


