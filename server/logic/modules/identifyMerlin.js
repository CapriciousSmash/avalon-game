var gameOver = require('./gameOver').gameOver;

// Gives minions chance for redemption in game if the Assassin correctly identifies
// which player is Merlin
module.exports.identifyMerlin = function(memcache, socket) {
  // Information needed from memcache
  // - Identify of Assassin
  var assassinId = '<-- FROM MEMCACHE -->';

  // TODO: Set current game phase in memcache to 'ID MERLIN'

  // TODO: Signal to players that the Assassin must make a decision to 
  // identify Merlin
  socket.emit('stabMerlin', {
  	gameId: 5318008,
  	assassinId
  });

  // TODO: Set timer for resolveIdMerlin
  setTimeout(function() {
  	resolveIdMerlin();
  }, 5000);
};

var resolveIdMerlin = function(memcache, socket) {
  // TODO: If the current game phase is not 'ID MERLIN', fizzle
  var gamePhase = '<-- FROM MEMCACHE -->';
  if (gamePhase !== 'ID MERLIN') {
  	return;
  }

  // Information needed from memcache
  // - The identify of merlin
  var merlinId = '<-- FROM MEMCACHE -->';
  // - The choice of Assassin for the identify of merlin
  var assassinChoice = '<-- FROM MEMCACHE -->';

  // TODO: If identify of merlin === Assassin's choice, then reverse
  // winner in memcache to the minions

  if (merlinId === assassinChoice) {
  	// TODO: Signal to players that Assassins' choice was correct
  	socket.emit('resolveMerlin', {
  	  correctChoice: true
  	});

  	// TODO: Set memcache winning side to minions
  } else /* Assassin choice ID !== Merlin ID */ {
  	// TODO: Signal to the players that the Assassin's choice was
  	// incorrect and reveal the identity of Merlin
  	socket.emit('resolveMerlin', {
  	  correctChoice: false
  	});
  }

  // TODO: Set timer for gameOver
  setTimeout(function() {
  	gameOver(memcache, socket);
  }, 5000);
};

module.exports.resolveIdMerlin = resolveIdMerlin;