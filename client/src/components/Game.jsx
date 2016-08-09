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
    game.play();

    //refactor this!
    var login = this.props.login;

    //Connect to server
    const socket = io();
    const peer = new Peer (socket.id, {host:'ancient-caverns-19863.herokuapp.com', port:'', secure:'true'});
    
    //Connection for audio
    peer.on('open', function(id) {
      game.addPlayer(id);
      login(id);
    });

    //Add peers who were already in the game
    socket.on('oldPeers', function(pids){
      console.log('oldpeers', pids);
      for(var x = 0; x < pids.length; x++){
        game.addPlayer(pids[x]);
      }
    });
    //Add in new peer to the game
    socket.on('newPeer', function(pid){
      game.addPlayer(pid);
      // Later connect new peer's audio
      // var conn = peer.connect(pid);

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
    socket.on('peerLeft', function(pid){
      game.removePlayer(pid);
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


