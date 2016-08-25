import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import setGameState from '../actions/setGameState';

import GameSetting from './GameSetting';

const Lobby = React.createClass ({
  getInitialState: function() {
    return {
      gm: '',
      players: [],
      ready: false
    };
  },
  componentWillMount: function() {
    console.log('ROOM component will mount ');
    //Connect to server
    var socket = this.props.socket;

    // Tell server that player entered the room
    socket.emit('joinRoom', this.props.roomNumber);
    socket.on('roomInfo', function(roomInfo) {
      this.setState({
        gm: roomInfo.gm,
        players: roomInfo.players
      });
    }.bind(this));

    socket.on('leaveRoomGoToGamePage', () => {
      this.props.setGameState();
    });
  },
  componentWillUnmount() {
    console.log('LEAVING THE GAME UNMOUNTING');
  },
  readyHandler: function(e) {
    this.setState({
      ready: !this.state.ready
    });
    this.props.socket.emit('ready', 
      {
        roomId: this.props.roomNumber,
        state: !this.state.ready
      }
    );
  },
  render: function() {
    return (
      <div className="inner cover"> 
        <h1 className="sectionTitle">[ Waiting Room ]</h1>
        <div className='loading hidden'>
          <div className='row'>
            <div className='bar one-inv'></div>
            <div className='bar two-inv'></div>
            <div className='bar three-inv'></div>
            <div className='bar four-inv'></div>
            <div className='bar five-inv'></div>  
            <div className='bar six-inv'></div>    
            <div className='bar seven-inv'></div>   
          </div>    
          <div className='loading-title'>L o a d i n g . . . </div>
          <div className='row'>
            <div className='bar one'></div>
            <div className='bar two'></div>
            <div className='bar three'></div>
            <div className='bar four'></div>
            <div className='bar five'></div>  
            <div className='bar six'></div>    
            <div className='bar seven'></div>   
          </div>
        </div>
        <div className='container playerListContainer'>
          {
            (this.props.currentUser.uid) === this.state.gm.uid ?
            <div className="gameMasterBox" key={ this.state.gm.uid }>
              <span className="playerLabel gameMasterLabel currentUser">{ this.state.gm.uid }</span>
              <button className="btn" onClick={ this.readyHandler }>
                { this.state.ready ? 'Ready' : 'Not Ready' }
              </button>
            </div> 
            : 
            <div className="gameMasterBox" key={ this.state.gm.uid }>
              <span className="playerLabel gameMasterLabel">{ this.state.gm.uid }</span>
              <span className="readyState">{ this.state.gm.ready ? 'Ready' : 'Not Ready' }</span>
            </div>
          }  
          
          {
            this.state.players.map(player => {
              if (player.uid === (this.props.currentUser.uid)) {
                return (
                  <div className="playerBox" key={ player.uid }>
                    <span className="playerLabel currentUser">{ player.uid }</span>
                    <button className="btn" onClick={ this.readyHandler }>{ this.state.ready ? 'Ready' : 'Not Ready' }
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="playerBox" key={ player.uid }>
                    <span className="playerLabel">{ player.uid }</span>
                    <span className="readyState">{ player.ready ? 'Ready' : 'Not Ready' }</span>
                  </div>
                );
              }
            })
          }
        </div>
        {/*GAME SETTINGS ONLY FOR GAME MASTER*/}
        {this.state.gm.uid 
          ? 
          <GameSetting 
            socket={this.props.socket}
            gm={this.state.gm.uid} 
            currentUser={this.props.currentUser.uid} 
            roomNumber={this.props.roomNumber} >
          </GameSetting> 
          : 
          <div></div>
        }
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    roomNumber: state.room.roomNumber,
    vrSetting: state.vrSetting.vrSetting
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setGameState: bindActionCreators(setGameState, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

