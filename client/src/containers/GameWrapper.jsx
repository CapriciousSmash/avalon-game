import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

import setGameState from '../actions/setGameState';
import * as Actions from '../actions';

import Game from '../components/Game';
import Room from '../components/Room';

class GameWrapper extends React.Component {
  constructor() {
    super();
    this.socket = io();
    this.state = {
      1: {
        id: '',
        status: 'Waiting...',
        max: 5,
        count: 0
      },
      2: {
        id: '',
        status: 'Waiting...',
        max: 5,
        count: 0
      },
      3: {
        id: '',
        status: 'Waiting...',
        max: 5,
        count: 0
      },
      4: {
        id: '',
        status: 'Waiting...',
        max: 5,
        count: 0
      }
    };
  }

  componentWillMount() {

    //refactor this!
    var login = this.props.actions.login;
    var socket = this.socket;

    //Connect to server
    socket.on('connect', function() {
      login(this.socket.id);
    }.bind(this));



    socket.on('lobbyInfo', function(lobbyState, players) {
      console.log('got lobby infor');
      var currentState = {};
      var roomNumber = 1;
      for (var key in lobbyState) {
        currentState[roomNumber] = {
          id: key,
          status: lobbyState[key].status,
          max: lobbyState[key].max,
          count: players[key].length
        };

        roomNumber++;
      }

      //Renders the page with current lobby status
      this.setState(currentState);
    }.bind(this));

    socket.on('lobbyStatus', function(lobbyState, players) {
      var currentState = {};
      var roomNumber = 1;
      for ( var key in lobbyState) {
        currentState[roomNumber] = {
          id: key,
          status: lobbyState[key].status,
          max: lobbyState[key].max,
          count: players[key].length
        };

        roomNumber++;
      }

      // Re-renders page when any changes to the lobby is made. 
      this.setState(currentState);
    }.bind(this));
  }

  componentWillUnmount() {
    this.socket.emit('leaveRoom', this.props.roomNumber);
    this.props.actions.setGameRoom('');
    if (this.props.playing) {
      console.log('removing playing game state');
      this.props.setGameState();
    }
  }

  setGameRoom(e) {
    this.props.actions.setGameRoom(this.state[e.target.value].id);
  }

  render() {
    var matchMaking = this.props.playing ? 
      <Game socket={this.socket} />
      :
      this.props.roomNumber ?  
        <Room socket={this.socket} />
        : 
        (<div className='container lobbyRoomContainer'>
          {[1, 2, 3, 4].map(roomNumber => 
            <div className='lobbyRoom' key={roomNumber} >
              <span className='lobbyRoomLabel'>Room {roomNumber}</span>
              <span id={roomNumber} className='lobbyRoomStatus'>
                {
                  this.state[roomNumber].status === 'Playing' 
                  ?
                  this.state[roomNumber].status 
                  :
                  this.state[roomNumber].count + '/' + this.state[roomNumber].max + ' ' + this.state[roomNumber].status
                }
              </span>
              <button 
                className='btn' 
                key={roomNumber} 
                onClick={this.setGameRoom.bind(this)} 
                value={roomNumber} 
                disabled={this.state[roomNumber].status !== 'Waiting...' ? true : false}>
                Join
              </button>
            </div>
          )}
          </div>
        );
    var vrSetting = (
      <div>
        <button onClick={ (e) => this.props.actions.vrSetting('IS_VR', e.target.value)} value={true}>VR</button>
        <button onClick={ (e) => this.props.actions.vrSetting('IS_3D', e.target.value)} value={false}>3D</button>
      </div>
    );

    return (
      <div className='text-center'>
        {this.props.vrSetting === undefined ? matchMaking : vrSetting} 
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    playing: state.gameState,
    currentUser: state.currentUser,
    roomNumber: state.room.roomNumber,
    vrSetting: state.vrSetting.vrSetting
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setGameState: bindActionCreators(setGameState, dispatch),
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameWrapper);


