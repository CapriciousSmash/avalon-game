import React from 'react';

export default class GameSetting extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    var socket = this.props.socket;
    socket.on('updateCharacter', function(person, value) {
      document.getElementById(person).checked = value;
    });
    socket.on('updateParty', function(value) {
      document.getElementById('capacity').selectedIndex = value - 5;
    });
  }

  componentDidMount() {
    var socket = this.props.socket;
    socket.emit('updateOnCharacter', 'merlin');
    socket.emit('updateOnCharacter', 'assassin');
    socket.emit('updateOnParty', this.props.roomNumber);
    if (this.props.gm !== this.props.currentUser) {
      document.getElementById('merlin').disabled = true;
      document.getElementById('assassin').disabled = true;
      document.getElementById('capacity').disabled = true;
    }
  }

  pickSpecialCharacter(e) {
    var socket = this.props.socket;
    socket.emit('sendCheckBox', e.target.id);
  }

  pickPartyMembers(e) {
    var socket = this.props.socket;
    socket.emit('capacity', this.props.roomNumber, e.target.selectedIndex + 5);
  }

  render() {
    return (
      <div className="container settingsContainer">
        <div className="settingBox">
          <select id='capacity' onChange={this.pickPartyMembers.bind(this)}>
            {[5, 6, 7, 8, 9, 10].map(value =>
              <option key={value} value={value}>{value}</option>
            )}
          </select> 
          <span className="settingLabel">Party Member</span>
        </div>
        <div className="settingBox">
          <input type='checkbox' id='merlin' onClick={this.pickSpecialCharacter.bind(this)}></input>
          <span className="settingLabel">Merlin</span>
        </div>
        <div className="settingBox">
          <input type='checkbox' id='assassin' onClick={this.pickSpecialCharacter.bind(this)}></input>
          <span className="settingLabel">Assassin</span>
        </div>
      </div>
    );
  }
}