import React from 'react';
import InfoText from './InfoText';

const GameObjective = (props) => {
  return (
  	<div className="GameObjective">
  	  <h3>Objective:</h3>
  	  <p>{InfoText.rulesObjectivePart1}</p>
  	  <p>{InfoText.rulesObjectivePart2}</p>
      <h3>Game Play:</h3>
      <p>{InfoText.rulesGamePlayPart1}</p>
      <p>{InfoText.rulesGamePlayPart2}</p>
      <h3>Team Building:</h3>
      <p>{InfoText.rulesTeamBuildPart1}</p>
      <h3>Team Vote:</h3>
      <p>{InfoText.rulesTeamVotePart1}</p>
      <h3>Questing:</h3>
      <p>{InfoText.rulesQuestPart1}</p>
      <h3>Game End:</h3>
      <p>{InfoText.rulesEndPart1}</p>
      <p>{InfoText.rulesEndPart2}</p>
  	</div>
  );
}

const GameCardsNTokens = (props) => {
  return (
  	<div></div>
  );
}


const GameRules = (props) => {
  return (
  	<div>
  	  <h1 className="sectionTitle">Game Rules</h1>
  	  <GameObjective />
  	</div>
  );
}

export default GameRules;