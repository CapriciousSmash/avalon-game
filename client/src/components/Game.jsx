import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

import login from '../actions/login';

import game from '../scripts/game.js';


class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
    socket.close();
  }
  componentDidMount(){
    game.init();
    function randomHexColor(){
      var hred = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hgreen = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hblue = (Math.floor(Math.random() * 180) + 20).toString(16);

      return Number('0x'+(hred+hgreen+hblue).toUpperCase());
    }

    //refactor this!
    var login = this.props.login;


    //Connect to server
    var socket = io();
    var userColor = randomHexColor();
    socket.on('connect', function(){
      console.log("CONNECTING", socket.id);
    })
    socket.emit('userColor', userColor);
    console.log('socket.id', socket.id);
    game.addPlayer(socket.id, userColor);
    login(socket.id);
    
    console.log('socket.id', socket.id);
    const peer = new Peer (socket.id, {host:'ancient-caverns-19863.herokuapp.com', port:'', secure:'true'});
    
    //Connection for audio
    peer.on('open', function(id) {
      console.log("PEER", id);
    });

    //Add peers who were already in the game
    socket.on('oldPeers', function(players){
      console.log('oldpeers', players);
      for(var x = 0; x < players.length; x++){
        game.addPlayer(players[x].uid, players[x].color);
      }
    });
    //Add in new peer to the game
    socket.on('newPeer', function(player){
      game.addPlayer(player.uid, player.color);
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
    socket.on('peerLeft', function(uid){
      game.removePlayer(uid);
    });
  }
  render() {
    return (
      <div> 
        <h1>THREE GAME</h1>
        <div id="gameContainer"></div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
function mapDispatchToProps(dispatch){
  return {
    login: bindActionCreators(login, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
//export default Game;


