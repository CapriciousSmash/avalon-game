import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import setGameState from '../actions/setGameState';

//import GameSetting from './GameSetting';

class Lobby extends React.Component {
  constructor() {
    super();
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){
    //Connect to server
    var socket = this.props.socket;
      
    //Add peers who were already in the game
    socket.on('allPeers', function(players){
      for (let p in players){
      }
    });
    //Add in new peer to the game
    socket.on('newPeer', function(player){
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
    });
  }
  render() {
    return (
      <div> 
        <h1>LOBBY</h1>
        <div id="playerList">
        </div>
        
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
    setGameState: bindActionCreators(setGameState, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

