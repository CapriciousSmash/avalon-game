// Functions that take place on the game is over
module.exports.gameEnd = function(memcache, socket) {
  // Information needed from memcache
  // - Game winner (knights or minions)

  // TODO: Change current game phase to 'GAME END' in memcache

  // TODO: Inform the players of the winners of the game based on
  // the rounds

  // TODO: Signal to players the identity of the minions

  // TODO: If special character for merlin and assassin were included in the 
  // game, and the knights were winners, allow the assassin to identify merlin:
  if (/* knights are winners && merlin exists */) {
  	// TODO: Set timer for identifyMerlin
  } else {
  	// TODO: Set timer for gameOver
  }
};

// TODO: Import commands to access persistent database to update points

// Final game results: 
module.exports.gameOver = function(memcache, socket) {
  // Information needed from memcache
  // - Game winning side

  // TODO: Change current game phase to 'GAME OVER'

  // TODO: Signal to players the final winners 

  if (/* Game winners are knights === true */) {
  	// TODO: Update knights' points in persistent database
  } else /* Game winners are minions */ {
  	// TODO Update minion's points in persistent database
  }

  // TODO: Update game count of all players
};








