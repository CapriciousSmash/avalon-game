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
<<<<<<< 9161bb8d695120b061d882831c6192379baa3221
      $('.loading').addClass('hidden'); 
=======
      $('.loading').addClass('hidden');
      webSockets.startGame(socket, this.props.roomNumber);
>>>>>>> set up VR on client side. Pending additional refinement.
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


