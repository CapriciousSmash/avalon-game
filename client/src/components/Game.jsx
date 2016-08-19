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
    webSockets.gameInit(socket);

    $('.loading').removeClass('hidden');
    socket.emit('startGame', this.props.roomNumber, socket.id.slice(2));
    
    setTimeout(()=>{
      $('.loading').addClass('hidden'); 
    }, 10);

    webSockets.allListeners(socket);
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


