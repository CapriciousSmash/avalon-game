import React from 'react';

export default class GameSetting extends React.Component {
  constructor() {
    super()
  }

  clickOnUserSide(value) {
    var io = this.props.socket;
    io.emit('sendCheckBox', 'firstCheckbox');
  }

  render() {
    return (
      <div>
        <label>
          <input type='checkbox' id='' value='firstCheckbox' onClick={this.clickOnUserSide}></input>
          This is the first checkbox
        </label>
        <label> 
          <input type='checkbox' id='' value='secondCheckbox' onClick={this.clickOnUserSide}></input>
          This is the second checkbox
        </label>
      </div>
    )
  }
}