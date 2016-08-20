import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

import * as Actions from '../actions';

import Game from '../components/Game';
import Room from '../components/Room';

class GameWrapper extends React.Component {
  constructor() {
    super();
    this.socket = io();
  }
  componentWillMount() {
    //refactor this!
    var login = this.props.actions.login;
    var socket = this.socket;

    //Connect to server
    socket.on('connect', function() {
      login(this.socket.id);
    }.bind(this));

    socket.on('lobbyInfo', function(lobbyState) {
      this.setState({});
      var roomNumber = 1;
      for (var key in lobbyState) {
        this.state[roomNumber] = {
          id: key,
          status: lobbyState[key].status
        };
        roomNumber++;
      }
    }.bind(this));
  }

  onClick(e) {
    this.props.actions.setGameRoom(this.state[e.target.value].id);
  }

  render() {
    var matchMaking = this.props.playing ? 
      <Game socket={this.socket} />
      :
      this.props.roomNumber ?  
        <Room socket={this.socket} />
        : 
        (<div className='buttons'>
            <button className='button' onClick={this.onClick.bind(this)} value='1'>Lobby Room 1</button>
            <button className='button' onClick={this.onClick.bind(this)} value='2'>Lobby Room 2</button>   
            <button className='button' onClick={this.onClick.bind(this)} value='3'>Lobby Room 3</button>   
            <button className='button' onClick={this.onClick.bind(this)} value='4'>Lobby Room 4</button>   
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
        <video height="300" id="localVideo"></video>
        <div id="remotesVideos"></div>
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
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameWrapper);


