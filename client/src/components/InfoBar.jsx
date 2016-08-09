import React from 'react';

// The InfoBar allows for navigation within the game info page
class InfoBar extends React.Component {
  changeSection(newSection) {
  	console.log('change section');
  	this.props.onGotoSection(newSection);
  } 

  render() {
  	return (
      <div>
      	<div onClick={() => {this.changeSection('GETTING STARTED')}}>Getting Started</div>
      	<div onClick={() => {this.changeSection('RULES')}}>Game Rules</div>
      	<div onClick={() => {this.changeSection('CHARACTERS')}}>Character Roles</div>
      </div>
  	);
  }
}

export default InfoBar;