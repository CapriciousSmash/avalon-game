import React from 'react';

export default class GameSetting extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var socket = this.props.socket;
    socket.on('receiveCheckBox', function(value) {
      console.log('What boolean am I retrieving', value);
      document.getElementById('first').checked =  value;
    });
    socket.on('sendUpdate', function(value) {
      document.getElementById('first').checked =  value;
    })
  }

  componentDidMount() {
    var socket = this.props.socket;
    socket.emit('update', 'firstCheck');
  }

  clickOnUserSide(value) {
    var socket = this.props.socket;
    socket.emit('sendCheckBox', 'firstCheckbox');
  }

  render() {
    return (
      <div>
        <label>
          <input type='checkbox' id='first' value='firstCheckbox' onClick={this.clickOnUserSide.bind(this)}></input>
          This is the first checkbox
        </label>
        <label> 
          <input type='checkbox' id='second' value='secondCheckbox' onClick={this.clickOnUserSide.bind(this)}></input>
          This is the second checkbox
        </label>
      </div>
    )
  }
}