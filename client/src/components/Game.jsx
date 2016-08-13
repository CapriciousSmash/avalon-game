import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import game from '../scripts/game.js';

import webSockets from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    webSockets.userInit(this.props.socket);
  }
  componentDidMount() {
    var socket = this.props.socket;
    webSockets.gameInit(socket);
    webSockets.allListeners(socket);
    webSockets.startGame(socket);
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
//export default Game;


