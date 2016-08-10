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

    socket.on('startGame', ()=>{
      //Refactor to loading page
      $('.loading').removeClass('hidden');
      setTimeout(this.props.setGameState, 3000);
    });
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
        <div class='loading hidden'>
          <div class='row'>
            <div class='bar one-inv'></div>
            <div class='bar two-inv'></div>
            <div class='bar three-inv'></div>
            <div class='bar four-inv'></div>
            <div class='bar five-inv'></div>  
            <div class='bar six-inv'></div>    
            <div class='bar seven-inv'></div>   
          </div>    
          <div class='row'>
            <div class='bar one'></div>
            <div class='bar two'></div>
            <div class='bar three'></div>
            <div class='bar four'></div>
            <div class='bar five'></div>  
            <div class='bar six'></div>    
            <div class='bar seven'></div>   
          </div>
          <div class='loading-title'>L o a d i n g . . .</div>
        </div>
        <div id="playerList">
          {
            ('/#' + this.props.currentUser.uid) === this.state.gm.uid ?
            <div key={ this.state.gm.uid }><h1>GM(me):{ this.state.gm.uid }<button onClick={ this.readyHandler }>{ this.state.ready ? 'Ready' : 'Not Ready' }</button></h1></div> 
            : 
            <div key={ this.state.gm.uid }><h2>GM:{ this.state.gm.uid }</h2><p>{ this.state.gm.ready ? 'Ready' : 'Not Ready' }</p></div>
          }  
          {
            this.state.players.map(player => {
              if (player.uid === ('/#' + this.props.currentUser.uid)) {
                return (
                  <div key={ player.uid }>
                    <h2>-(me){ player.uid }<button onClick={ this.readyHandler }>{ this.state.ready ? 'Ready' : 'Not Ready' }</button></h2>
                  </div>
                );
              } else {
                return (
                  <div key={ player.uid }>
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

