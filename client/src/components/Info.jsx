import React from 'react';

import InfoBar from './InfoBar';
import GettingStarted from './GettingStarted';
import GameRules from './GameRules';
import CharactersInfo from './CharactersInfo';

// The info component is in charge of organizing and rendering
// the components related to game information to teach players the
// rules. 
const Info = (props) => {
  console.log(props.activeSection);
  const renderSection = props.activeSection || 'GETTING STARTED';
  return (
    <div style={{overflow: 'scroll'}}>
      <div className="span3" style={{position: 'fixed'}}>
        <InfoBar className="span9" onGotoSection={props.onGotoSection} />
      </div>
      {
        // Function redirects to proper component:
        function(activeSection) {
          switch (activeSection) {
            case 'GETTING STARTED':
              return <GettingStarted />
            case 'RULES':
              return <GameRules />
            case 'CHARACTERS': 
              return <CharactersInfo />
          }
        }(renderSection)
      }
    </div>
  );
}

export default Info;