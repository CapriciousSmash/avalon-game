var identifyMerlin = require('./identifyMerlin').identifyMerlin;

// Functions that take place on the game is over
module.exports.gameEnd = function(memcache, socket) {
  // Information needed from memcache
  // - Game winner (knights or minions)
  var winners = '<-- FROM MEMCACHE -->';
  // - Identify of the minions
  var minions = '<-- FROM MEMCACHE -->';

  // TODO: Change current game phase to 'GAME END' in memcache

  // TODO: Inform the players of the winners of the game based on
  // the rounds and inform of the identify of the minions

  socket.emit('gameEnd', {
  	gameId: 5318008,
  	winners,
  	minions
  });

  // TODO: If special character for merlin and assassin were included in the 
  // game, and the knights were winners, allow the assassin to identify merlin:
  if (winners === 'knights' && merlinId) {
  	// TODO: Set timer for identifyMerlin
  	setTimeout(function() {
  	  identifyMerlin(memcache, socket);
  	}, 5000000);
  } else {
  	// TODO: Set timer for gameOver
  	setTimeout(function() {
  	  gameOver(memcache, socket);
  	}, 5000000);
  }
};

// TODO: Import commands to access persistent database to update points

// Final game results: 
var gameOver = function(memcache, socket) {
  // Information needed from memcache
  // - Game winning side

  // TODO: Change current game phase to 'GAME OVER'

  // TODO: Signal to players the final winners 

  // if (/* Game winners are knights === true */) {
  // 	// TODO: Update knights' points in persistent database
  // } else /* Game winners are minions */ {
  // 	// TODO Update minion's points in persistent database
  // }

  // TODO: Update game count of all players
};

module.exports.gameOver = gameOver;






