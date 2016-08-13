import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import game from '../scripts/game.js';

import socketListeners from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    var socket = this.props.socket;
    socketListeners.AllListeners(socket);
  }
  componentDidMount() {
    function randomHexColor() {
      var hred = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hgreen = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hblue = (Math.floor(Math.random() * 180) + 20).toString(16);

      return Number('0x' + (hred + hgreen + hblue).toUpperCase());
    }

    //Connect to server
    var socket = this.props.socket;
    var userColor = randomHexColor();
    socket.emit('userColor', userColor);
      
    //Peer presence
    socket.on('newPeer', function(player) {
      // Later connect new peer's audio
      // var conn = peer.connect(uid);

      // conn.on('open', function(){
      //   conn.send('hey newbie');
      //   conn.on('data', function(data){
      //     console.log('(old)Received some greetings:', data);
      //   });
      // });
    });
    // peer.on('connection', function(conn){
    //   conn.on('data', function(data){
    //     console.log('(new)Received some greetings:', data);
    //   });
    //   conn.send('Hey gramps!');
    // });
    socket.on('peerLeft', function(uid) {
      game.removePlayer(uid);
    });

    //Start the game
    socket.on('startGame', function(players) {
      game.init();
      for (let p in players) {
        game.addPlayer(players[p].uid, players[p].color);
      }
    });
  }
  render() {
    return (
      <div> 
        <div id="gameContainer"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    //currentUser: state.currentUser
  };
}
function mapDispatchToProps(dispatch) {
  return {
    //login: bindActionCreators(login, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


