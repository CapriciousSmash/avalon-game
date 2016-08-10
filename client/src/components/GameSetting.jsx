import React from 'react';

export default class GameSetting extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var socket = this.props.socket;
    socket.on('receiveCheckBox', function(value) {
      console.log('What boolean am I retrieving', value);
      document.getElementById('first').checked = value;
      document.getElementById('first').disabled = true;
    });
    socket.on('sendUpdate', function(value) {
      document.getElementById('first').checked = value;
    });
  }

  componentDidMount() {
    var socket = this.props.socket;
    socket.emit('update', 'firstCheck');
  }

  clickOnUserSide(value) {
    var socket = this.props.socket;
    console.log(value)
    socket.emit('sendCheckBox', 'firstCheckbox');
  }

  render() {
    return (
      <div>
        <label>
          <input type='checkbox' id='first' value='firstCheckbox' onClick={this.clickOnUserSide.bind(this)}></input>
          Merlin
        </label>
        <label> 
          <input type='checkbox' id='second' value='secondCheckbox' onClick={this.clickOnUserSide.bind(this)}></input>
          Assassin
        </label>
      </div>
    )
  }
}