import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

import login from '../actions/login';

import Game from '../components/Game';

class GameWrapper extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){
    //refactor this!
    var login = this.props.login;


    //Connect to server
    this.props.socket = io();
    this.props.socket.on('connect', function(){
      login(this.props.socket.id);
      
      const peer = new Peer (this.props.socket.id, {host:'ancient-caverns-19863.herokuapp.com', port:'', secure:'true'});
      
      //Connection for audio
      peer.on('open', function(id) {
      });
    })
  }
  render() {
    return (
      <div> 
        <h1>GAME</h1>
        {this.props.playing ? <Game /> : <Lobby socket={this.props.socket}/>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    playing: state.playing,
    currentUser: state.currentUser
  }
}
function mapDispatchToProps(dispatch){
  return {
    login: bindActionCreators(login, dispatch),
    setGameState: bindActionCreators(setGameState, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
//export default Game;


