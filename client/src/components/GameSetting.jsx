import React from 'react';

export default class GameSetting extends React.Component {
  constructor() {
    super()
  }



  render() {
    return (
      <div>
        <label>
          <input type="checkbox" id="cbox1" value="first_checkbox"> This is the first checkbox</input>
        </label>
        <label> 
          <input type="checkbox" id="cbox2" value="second_checkbox">This is the second checkbox</input>
        </label>
      </div>
    )
  }
}