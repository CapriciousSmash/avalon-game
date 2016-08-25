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
    }, 10);

    webSockets.allListeners(socket, this.props.roomNumber);
  }
  componentWillUnmount() {
    //Leave game for Lobby aka set the current room number
    //to nothing and reset game set
  }
  render() {
    return ( 
      <div>
        <div id="gameContainer">
        </div>
        <div id="gameUserInfoContainer">
          <span className="userName"></span>
          <span className="role"></span>
        </div>
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
    //login: bindActionCreators(login, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


