import React from 'react';

import GettingStarted from './GettingStarted';
import GameRules from './GameRules';
import CharactersInfo from './CharactersInfo';

// The info component is in charge of organizing and rendering
// the components related to game information to teach players the
// rules. 
const Info = (props) => {
  switch (props.activeSection) {
  	case 'GETTING STARTED':
  	  return (
  	  	<div>
  	  	  <InfoBar />
  	  	  <GettingStarted />
  	  	</div>
  	  );
  	case 'RULES':
  	  return (
  	  	<div>
  	  	  <InfoBar />
  	  	  <GameRules />
  	  	</div>
  	  );
  	case 'CHARACTERS':
  	  return (
  	  	<div>
  	  	  <InfoBar />
  	  	  <CharactersInfo />
  	  	</div>
  	  );
  }
}

export default Info;