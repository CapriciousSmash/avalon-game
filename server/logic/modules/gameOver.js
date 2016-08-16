var identifyMerlin = require('./identifyMerlin').identifyMerlin;
var increasePoints = require('../../db/controller/index.js').increaseScore;
var increaseGames = require('../../db/controller/index.js').increaseGames;
// Functions that take place on the game is over
module.exports.gameEnd = function(memcache, socket) {
  console.log('game is ending');
  // Information needed from memcache
  // - Game winner (knights or minions)
  var winners, minions; 
  // - Identify of the minions
  memcache.getWinner()
  .then(function(winner) {
    winners = winner;
  })
  .then(function() {
    return memcache.getMinions();
  })
  .then(function(mins) {
    minions = mins;

    // TODO: Change current game phase to 'GAME END' in memcache
    memcache.setTurnPhase('GAME END');

    // TODO: Inform the players of the winners of the game based on
    // the rounds and inform of the identify of the minions d

    socket.emit('gameEnd', {
      gameId: 5318008,
      winners,
      minions
    });

    // TODO: If special character for merlin and assassin were included in the 
    // game, and the knights were winners, allow the assassin to identify merlin:
    if (winners === true && merlinId) {
    	// TODO: Set timer for identifyMerlin
    	setTimeout(function() {
    	  identifyMerlin(memcache, socket);
    	}, 5000000);
    } else {
    	// TODO: Set timer for gameOver
    	setTimeout(function() {
    	  gameOver(memcache, socket);
    	}, 5000);
    }
  });
};

// TODO: Import commands to access persistent database to update points

// Final game results: 
var gameOver = function(memcache, socket) {
  console.log('game is over');
  // Information needed from memcache
  // - Game winning side
  memcache.getWinner()
  .then( function (winner) {

    // TODO: Change current game phase to 'GAME OVER'
    memcache.setTurnPhase('GAME OVER');

    // TODO: Signal to players the final winners 
    socket.emit('gameOver', {
      gameId: 5318008,
      winners
    });

    if (winners === true) {
      console.log('GAME OVER KNIGHTS WIN');
      // TODO: Update knights' points in persistent database
      memcache.getKnights()
      .then(function(knights) {
        for (var i = 0; i < knights.length; i++) {
          // increasePoints(knights[i]);
        }
      })
    } else /* Game winners are minions */ {
      console.log('GAME OVER MINIONS WIN');
      // TODO Update minion's points in persistent database
      memcache.getMinions()
      .then(function(minions) {
        for (var i = 0; i < minions.length; i++) {
          // increasePoints(minions[i]);
        }
      })
    }

    // TODO: Update game count of all players
    memcache.getPids()
    .then(function(pids) {
      for (var i = 0; i < pids.length; i++) {
        // increaseGames(pids[i]);
      }
    })
    .then(function() {
      setTimeout(function() {
        memcache.quit();
      }, 120000)

    })
  });
};

module.exports.gameOver = gameOver;






