import React from 'react';

export default class GameSetting extends React.Component {
  constructor() {
    super()
  }

  componentWillMount() {
    var socket = this.props.socket;
    socket.on('receiveCheckBox', function(person, value) {
      console.log(person)
      console.log(value)
      document.getElementById(person).checked = value;
      document.getElementById(person).disabled = true;
    });
    socket.on('sendUpdate', function(person, value) {
      document.getElementById(person).checked = value;
    });
  }

  componentDidMount() {
    var socket = this.props.socket;
    socket.emit('update', 'merlin');
    socket.emit('update', 'assassin');
  }

  clickOnUserSide(e) {
    var socket = this.props.socket;
    socket.emit('sendCheckBox', e.target.id);
  }

  render() {
    return (
      <div>
        <label>
          <input type='checkbox' id='merlin' onClick={this.clickOnUserSide.bind(this)}></input>
          Merlin
        </label>
        <label> 
          <input type='checkbox' id='assassin' onClick={this.clickOnUserSide.bind(this)}></input>
          Assassin
        </label>
      </div>
    )
  }
}