import React from 'react';

export default class GameSetting extends React.Component {
  constructor() {
    super()
  }

  componentWillMount() {
    var socket = this.props.socket;
    socket.on('updateCharacter', function(person, value) {
      document.getElementById(person).checked = value;
    });
    socket.on('updateParty', function(value) {
      document.getElementById('capacity').innerHTML = value;
    });
  }

  componentDidMount() {
    var socket = this.props.socket;
    socket.emit('updateOnCharacter', 'merlin');
    socket.emit('updateOnCharacter', 'assassin');
    socket.emit('updateOnParty', 'capacity');
    if (this.props.gm !== this.props.currentUser) {
      document.getElementById('merlin').disabled = true;
      document.getElementById('assassin').disabled = true;
    }
  }

  pickSpecialCharacter(e) {
    var socket = this.props.socket;
    socket.emit('sendCheckBox', e.target.id);
  }

  pickPartyMembers(e) {
    var socket = this.props.socket;
    socket.emit('capacity', this.props.roomNumber, e.target.value)
  }

  click
  render() {
    return (
      <div>
        <label>
          <input type='checkbox' id='merlin' onClick={this.pickSpecialCharacter.bind(this)}></input>
          Merlin
        </label>
        <label> 
          <input type='checkbox' id='assassin' onClick={this.pickSpecialCharacter.bind(this)}></input>
          Assassin
        </label>
        <div className='dropdown'>
          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
            Party Members
            <span className="caret"></span>
          </button>
          <ul className='dropdown-menu'>
            {[5,6,7,8,9,10].map(value =>
              <li key={value} value={value} onClick={this.pickPartyMembers.bind(this)}>{value}</li>
            )}
          </ul>
          <div id='capacity'></div>  
        </div>
      </div>
    )
  }
}