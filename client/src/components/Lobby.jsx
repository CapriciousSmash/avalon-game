import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import setGameState from '../actions/setGameState';

//import GameSetting from './GameSetting';

const Lobby = React.createClass ({
  getInitialState: function() {
    return {
      gm: '',
      players: [],
      ready: false
    };
  },
  componentDidMount: function() {
    //Connect to server
    var socket = this.props.socket;
    
    //Tell server that player is in lobby, request lobby info
    socket.emit('lobby', 0);
    socket.on('lobbyInfo', function(lobbyInfo) {
      this.setState({
        gm: lobbyInfo.gm,
        players: lobbyInfo.players
      });
    }.bind(this));

    socket.on('startGame', function() {
      //Refactor to loading page
      setTimeout(this.props.setGameState, 3000);
    }.bind(this));
  },
  readyHandler: function(e) {
    this.setState({
      ready: !this.state.ready
    });
    this.props.socket.emit('ready', !this.state.ready);
  },
  render: function() {
    return (
      <div> 
        <h1>LOBBY</h1>
        <div id="playerList">
          {
            ('/#' + this.props.currentUser.uid) === this.state.gm.uid ?
            <div><h1>GM(me):{ this.state.gm.uid }<button onClick={ this.readyHandler }>{ this.state.ready ? 'Ready' : 'Not Ready' }</button></h1></div> : 
            <div><h2>GM:{ this.state.gm.uid }</h2><p>{ this.state.gm.ready ? 'Ready' : 'Not Ready' }</p></div>
          }  
          {
            this.state.players.map(player => {
              if (player.uid === ('/#' + this.props.currentUser.uid)) {
                return (
                  <div>
                    <h2>-(me){ player.uid }<button onClick={ this.readyHandler }>{ this.state.ready ? 'Ready' : 'Not Ready' }</button></h2>
                  </div>
                );
              } else {
                return (
                  <div>
                    <h3>-{ player.uid }<p>{ player.ready ? 'Ready' : 'Not Ready' }</p></h3>
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
});

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

