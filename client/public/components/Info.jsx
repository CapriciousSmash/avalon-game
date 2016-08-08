import React from 'react';

import InfoBar from './InfoBar';
import GettingStarted from './GettingStarted';
import GameRules from './GameRules';
import CharactersInfo from './CharactersInfo';

// The info component is in charge of organizing and rendering
// the components related to game information to teach players the
// rules. 
const Info = (props) => {
  return (
    <div>
      <InfoBar onGotoSection={() => this.props.actions.newInfoSection()} />
      {
        // Function redirects to proper component:
        function(activeSection) {
          switch (activeSection) {
            case: 'GETTING STARTED':
              return <GettingStarted />
            case: 'RULES':
              return <GameRules />
            case: 'CHARACTERS': 
              return <CharactersInfo />
          }
        }(props.activeSection)
      }
    </div>
  );
}

export default Info;