import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import setGameState from '../actions/setGameState';
import * as Actions from '../actions';

import webSockets from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
    this.backToLobby = this.backToLobby.bind(this);
  }
  componentDidMount() {
    var socket = this.props.socket;
    webSockets.gameInit(socket);

    //Disable audio for testing purposes
    var webrtc = new SimpleWebRTC({
      localVideoEl: '',
      remoteVideosEl: '',
      autoRequestMedia: true,
      enableDataChannels: false,
      media: {
        audio: true,
        video: false
      },
      receiveMedia: { // FIXME: remove old chrome <= 37 constraints format
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 0
      }
    });
    webrtc.on('readyToCall', ()=> {
      webrtc.joinRoom(this.props.roomNumber);
      //webrtc.joinRoom('hahaha');
    });

    $('#loading-animation').removeClass('hidden');
    $('#gameContainer').addClass('hidden');
    socket.emit('startGame', this.props.roomNumber, socket.id.slice(2));
    
    setTimeout(()=>{
      $('#gameContainer').removeClass('hidden');
      //$('#loading-animation').fadeOut(2500, function() { $(this).addClass('hidden'); });
    }, 2000);

    webSockets.allListeners(socket, this.props.roomNumber);
  }
  componentWillUnmount() { 
    console.log('game is unmounting');
  }
  backToLobby(e) {
    console.log('this.props.roomNumber', this.props.roomNumber);
    this.props.socket.emit('leaveRoom', this.props.roomNumber);
    $('canvas').remove();
    $('#gameUserInfoContainer .role').text('');
    $('#gameUserInfoContainer .userName').text('');
    this.props.actions.setGameRoom('');
    this.props.setGameState();
  }
  render() {
    return ( 
      <div>
        <div id="loading-animation" className='hidden'>
          <div className='loading'>
            <div className='loading-row'>
              <div className='bar one-inv'></div>
              <div className='bar two-inv'></div>
              <div className='bar three-inv'></div>
              <div className='bar four-inv'></div>
              <div className='bar five-inv'></div>  
              <div className='bar six-inv'></div>    
              <div className='bar seven-inv'></div>   
              <div className='bar eight-inv'></div>   
            </div>    
            <div className='loading-title'>L o a d i n g . . . </div>
            <div className='loading-row'>
              <div className='bar one'></div>
              <div className='bar two'></div>
              <div className='bar three'></div>
              <div className='bar four'></div>
              <div className='bar five'></div>  
              <div className='bar six'></div>    
              <div className='bar seven'></div>   
              <div className='bar eight'></div>   
            </div>
          </div>
        </div>

        <div id="gameContainer">
        </div>

        <div id="gameUserInfoContainer">
          <span className="userName"></span>
          <span className="role"></span>
        </div>

        <button id="gameReturnButton" className="btn" onClick={ this.backToLobby }>Back to Lobby</button>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Game);


