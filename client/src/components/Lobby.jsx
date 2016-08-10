import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import setGameState from '../actions/setGameState';

//import GameSetting from './GameSetting';

class Lobby extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
  }
  componentWillUnmount() {
  }
  componentDidMount() {
    //Connect to server
    var socket = this.props.socket;
    
    //Tell server that player is in lobby, request lobby info
    socket.emit('lobby', 0);
    socket.on('lobbyInfo', function(lobbyInfo) {
      this.setState({
        gm: lobbyInfo.gm,
        players: lobbyInfo.players
      });
    });

    //Testing change from lobby to game play
    setTimeout(this.props.setGameState, 3000);
  }
  render() {
    return (
      <div> 
        <h1>LOBBY</h1>
        <div id="playerList">
          {
            player.uid === this.state.gm.uid ? <h1>{this.state.gm.uid}</h1> : <h2>{this.state.gm.uid}</h2>
          }  
          {
            this.state.players.map(player => {
              if (player.uid === this.props.currentUser.uid) {
                return (
                  <div>
                    <h2>{player.uid}</h2>
                  </div>
                );
              } else {
                return (
                  <div>
                    <h3>{player.uid}</h3>
                  </div>
                );
              }
            }
          )
        }
        </div>
        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setGameState: bindActionCreators(setGameState, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

