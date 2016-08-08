<<<<<<< HEAD
import React from 'react'
=======
>>>>>>> Add in game component setup and remove unused file
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import game from '../scripts/game.js';

/////////////////////////////////////////////////////////////
import io from 'socket.io-client';
const socket = io();
/////////////////////////////////////////////////////////////

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
    var peer = new Peer ({host:'ancient-caverns-19863.herokuapp.com', port:'', secure:'true'});
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      socket.emit('peer', id);
    });
    socket.on('newPeer', function(pid){
      console.log('new peer with id:', pid);
      var conn = peer.connect(pid);

      conn.on('open', function(){
        console.log('OPENING CONNECTION');
        game.addPlayer(pid);
        conn.send('hey newbie');
        conn.on('data', function(data){
          console.log('(old)Received some greetings:', data);
        });
      });
    });
    peer.on('connection', function(conn){
      console.log('someone connected to me');
      conn.on('data', function(data){
        console.log('(new)Received some greetings:', data);
      });
      conn.send('Hey gramps!');
    });
    game.init();
    game.play();
    game.addPlayer(100);
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
  }
}
function mapDispatchToProps(dispatch){
  return {
  }
}

//export default connect(mapStateToProps, mapDispatchToProps)(Game);
export default Game;


