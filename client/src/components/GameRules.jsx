import React from 'react';

const GameObjective = (props) => {
  return (
  	<div className="GameObjective">
  	  <h3>Objective:</h3>
  	  <p>Avalon is a game of hidden loyalties. Players are either Loyal Servants
  	  of Arthur fighting for Goodness and honor or aligned with the evil ways of
  	  Mordred. Good wins the game by successfully completing three Quests. Evil 
  	  wins if three Quests end in failure. Evil can also win by assassinating Merlin
  	  at the game's end or if a Quest cannot be undertaken.</p>
  	  <p>Players may make any claims during the game, at any point in the game. 
  	  Discussion, deception, accusation, and logical deducation are all equally
  	  important in order for Good to prevail or Evil to rule the day. </p>
  	</div>
  );
}

const GameCardsNTokens = (props) => {
  return (
  	
  );
}


const GameRules = (props) => {
  return (
  	<div>
  	  <h1>Game Rules</h1>
  	  <GameObjective />
  	</div>
  );
}

export default GameRules;