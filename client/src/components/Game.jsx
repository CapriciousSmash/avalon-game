import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import game from '../scripts/game.js';

import webSockets from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    var socket = this.props.socket;
    webSockets.gameInit(socket);

    //Disable audio for testing purposes
    // var webrtc = new SimpleWebRTC({
    //   localVideoEl: '',
    //   remoteVideosEl: '',
    //   autoRequestMedia: true,
    //   enableDataChannels: false,
    //   media: {
    //     audio: true,
    //     video: false
    //   },
    //   receiveMedia: { // FIXME: remove old chrome <= 37 constraints format
    //       offerToReceiveAudio: 1,
    //       offerToReceiveVideo: 0
    //   }
    // });
    // webrtc.on('readyToCall', ()=> {
    //   webrtc.joinRoom(this.props.roomNumber);
    //   //webrtc.joinRoom('hahaha');
    // });

    $('.loading').removeClass('hidden');
    socket.emit('startGame', this.props.roomNumber, socket.id.slice(2));
    
    setTimeout(()=>{
      $('.loading').addClass('hidden'); 
    }, 1000);

    webSockets.allListeners(socket, this.props.roomNumber);
  }
  backToLobby(e) {
    this.props.socket.emit('leaveRoom', this.props.roomNumber);
    this.props.actions.setGameRoom('');
  }
  render() {
    return ( 
      <div>
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

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


