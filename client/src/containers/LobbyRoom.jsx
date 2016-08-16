import React from 'react';
import ReactDOM from 'react-dom';

// Containers import
import GameWrapper from './GameWrapper';

// Redux-related imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

class LobbyRoom extends React.Component {
  onClick(e) {
    console.log(this);
    $('.buttons').css('display', 'none');
    ReactDOM.render(<GameWrapper />, document.getElementById('lobby') );
  }

  render() {
    return (
      <div id='lobby'>
        <div className='buttons'>
          <button className='button' onClick={this.onClick} value='1'>Lobby Room 1</button>
          <button className='button' onClick={this.onClick} value='2'>Lobby Room 2</button>   
          <button className='button' onClick={this.onClick} value='3'>Lobby Room 3</button>   
          <button className='button' onClick={this.onClick} value='4'>Lobby Room 4</button>   
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyRoom);