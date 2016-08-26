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
    <div style={{height: '500px', width: '800px', overflow: 'auto'}}>
      <div className="span3" style={{position: 'fixed'}}>
        <InfoBar onGotoSection={props.onGotoSection} />
      </div>
      {
        // Function redirects to proper component:
        function(activeSection) {
          switch (activeSection) {
            case 'GETTING STARTED':
              return <GettingStarted className="span9"/>
            case 'RULES':
              return <GameRules className="span9"/>
            case 'CHARACTERS': 
              return <CharactersInfo className="span9"/>
          }
        }(renderSection)
      }
    </div>
  );
}

export default Info;