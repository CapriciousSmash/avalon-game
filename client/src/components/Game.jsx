import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import game from '../scripts/game.js';

import webSockets from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
  }
  /*Disabled because everyone starts with same color aside from user
  componentWillMount() {
    webSockets.userInit(this.props.socket);
  }*/
  componentDidMount() {
    var socket = this.props.socket;
    console.log('THIS ROOM IS', this.props.roomNumber);

    $('.loading').removeClass('hidden');
    setTimeout(()=>{
      $('.loading').addClass('hidden');        
      socket.emit('startGame', this.props.roomNumber);
    }, 10);

    webSockets.gameInit(socket);
    webSockets.allListeners(socket);
    webSockets.startGame(socket);
  }
  render() {
    return ( 
      <div id="gameContainer"></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomNumber: state.room.roomNumber
  };
}
function mapDispatchToProps(dispatch) {
  return {
    //login: bindActionCreators(login, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


